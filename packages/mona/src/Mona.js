import axios from 'axios';
import { crypto, Psbt, script } from 'bitcoinjs-lib';
import { createHash, randomBytes } from 'crypto';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import varuint from 'varuint-bitcoin';
export default class Mona {
    network;
    baseUrl;
    constructor(network) {
        this.network = network;
        this.baseUrl = 'https://testnet.mpchain.info';
    }
    createHashPair() {
        const s = randomBytes(32);
        const p1 = createHash('sha256').update(s).digest();
        const p2 = createHash('sha256').update(p1).digest();
        return {
            proof: s.toString('hex'),
            secret: p2.toString('hex'),
        };
    }
    async getCurrentBlockHeight() {
        const endpoint = `${this.baseUrl}/api/network`;
        return new Promise(function (resolve, reject) {
            axios
                .get(endpoint)
                .then((res) => {
                resolve(res.data.network_info.testnet.block_height);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    async postTransaction(txhex) {
        const endpoint = `${this.baseUrl}/api/send_tx`;
        return new Promise((resolve, reject) => {
            axios
                .post(endpoint, { tx_hex: txhex })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    async getInputData(txid, contractAddress) {
        const endpoint = `${this.baseUrl}/api/cb/`;
        const params = {
            id: 0,
            jsonrpc: '2.0',
            method: 'proxy_to_counterpartyd',
            params: {
                method: 'getrawtransaction',
                params: {
                    tx_hash: txid,
                    verbose: true,
                },
            },
        };
        return new Promise(function (resolve, reject) {
            axios
                .post(endpoint, params)
                .then((res) => {
                let value = 0;
                let index = 0;
                for (let i = 0; i < res.data.result.vout.length; i++) {
                    if (res.data.result.vout[i].scriptPubKey.addresses[0] == contractAddress) {
                        value = res.data.result.vout[i].value * 100000000;
                        index = res.data.result.vout[i].n;
                    }
                }
                resolve({ value, index });
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    async getUtxos(address) {
        const endpoint = `${this.baseUrl}/api/cb/`;
        const params = {
            id: 0,
            jsonrpc: '2.0',
            method: 'proxy_to_counterpartyd',
            params: {
                method: 'get_unspent_txouts',
                params: {
                    address: address,
                    unconfirmed: true,
                },
            },
        };
        return new Promise(function (resolve, reject) {
            axios
                .post(endpoint, params)
                .then((res) => {
                const utxos = [];
                for (let i = 0; i < res.data.result.length; i++) {
                    const hash = res.data.result[i].txid;
                    const index = res.data.result[i].vout;
                    const value = res.data.result[i].value;
                    utxos.push({
                        hash,
                        index,
                        value,
                    });
                }
                resolve(utxos);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    buildAndSignTx(sender, address, recipient, sendingSat, feeSat, utxos) {
        // input元(utxo)のtxを追加:
        const psbt = new Psbt({ network: this.network });
        let total = 0;
        const pubKeyHash = crypto.hash160(sender.publicKey).toString('hex');
        for (let len = utxos.length, i = 0; i < len; i++) {
            const { hash, index, value } = utxos[i];
            psbt.addInput({
                hash,
                index,
                witnessUtxo: {
                    script: Buffer.from('0014' + pubKeyHash, 'hex'),
                    value,
                },
            });
            total += value;
        }
        psbt.addOutput({
            address: recipient,
            value: sendingSat,
        });
        const changeSat = total - sendingSat - feeSat;
        if (changeSat < 0) {
            throw new Error(`Balance is insufficient. Balance (UTXO Total): ${total} satoshi`);
        }
        psbt.addOutput({
            address: address,
            value: changeSat,
        });
        for (let len = utxos.length, i = 0; i < len; i++) {
            psbt.signInput(i, sender);
            psbt.validateSignaturesOfInput(i, (pubkey, msghash, signature) => {
                return ECPairFactory(ecc).fromPublicKey(pubkey).verify(msghash, signature);
            });
        }
        psbt.finalizeAllInputs();
        return psbt.extractTransaction().toHex();
    }
    witnessStackToScriptWitness(witness) {
        let buffer = Buffer.allocUnsafe(0);
        function writeSlice(slice) {
            buffer = Buffer.concat([buffer, Buffer.from(slice)]);
        }
        function writeVarInt(i) {
            const currentLen = buffer.length;
            const varintLen = varuint.encodingLength(i);
            buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
            varuint.encode(i, buffer, currentLen);
        }
        function writeVarSlice(slice) {
            writeVarInt(slice.length);
            writeSlice(slice);
        }
        function writeVector(vector) {
            writeVarInt(vector.length);
            vector.forEach(writeVarSlice);
        }
        writeVector(witness);
        return buffer;
    }
    /**
     * Generate HTLC Contract Script for Bitcoin
     */
    generateSwapWitnessScript(receiverPublicKey, userRefundPublicKey, paymentHash, timelock) {
        return script.fromASM(`
           OP_HASH256
           ${paymentHash}
           OP_EQUAL
           OP_IF
           ${receiverPublicKey.toString('hex')}
           OP_ELSE
           ${script.number.encode(timelock).toString('hex')}
           OP_CHECKLOCKTIMEVERIFY
           OP_DROP
           ${userRefundPublicKey.toString('hex')}
           OP_ENDIF
           OP_CHECKSIG
           `
            .trim()
            .replace(/\s+/g, ' '));
    }
}
