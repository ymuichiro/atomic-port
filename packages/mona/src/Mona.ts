import axios from 'axios';
import { crypto, networks, Psbt, script } from 'bitcoinjs-lib';
import { createHash, randomBytes } from 'crypto';
import ECPairFactory, { ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import varuint from 'varuint-bitcoin';
import { HashPair, Utxo } from './Core';

export default abstract class Mona {
  readonly network: networks.Network;
  readonly baseUrl: string;

  constructor(network: networks.Network) {
    this.network = network;
    this.baseUrl = 'https://testnet.mpchain.info';
  }

  public createHashPair(): HashPair {
    const s = randomBytes(32);
    const p1 = createHash('sha256').update(s).digest();
    const p2 = createHash('sha256').update(p1).digest();
    return {
      proof: s.toString('hex'),
      secret: p2.toString('hex'),
    };
  }

  protected async getCurrentBlockHeight(): Promise<number> {
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

  protected async postTransaction(txhex: string): Promise<any> {
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

  protected async getInputData(txid: string, contractAddress: string): Promise<{ value: number; index: number }> {
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

  protected async getUtxos(address: string): Promise<{ hash: string; index: number; value: number }[]> {
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
          const utxos: { hash: string; index: number; value: number }[] = [];
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

  protected buildAndSignTx(
    sender: ECPairInterface,
    address: string,
    recipient: string,
    sendingSat: number,
    feeSat: number,
    utxos: Utxo[]
  ) {
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

  protected witnessStackToScriptWitness(witness: any): Buffer {
    let buffer = Buffer.allocUnsafe(0);
    function writeSlice(slice: any) {
      buffer = Buffer.concat([buffer, Buffer.from(slice)]);
    }

    function writeVarInt(i: any) {
      const currentLen = buffer.length;
      const varintLen = varuint.encodingLength(i);

      buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
      varuint.encode(i, buffer, currentLen);
    }

    function writeVarSlice(slice: any) {
      writeVarInt(slice.length);
      writeSlice(slice);
    }

    function writeVector(vector: any) {
      writeVarInt(vector.length);
      vector.forEach(writeVarSlice);
    }

    writeVector(witness);

    return buffer;
  }

  /**
   * Generate HTLC Contract Script for Bitcoin
   */
  protected generateSwapWitnessScript(
    receiverPublicKey: Buffer,
    userRefundPublicKey: Buffer,
    paymentHash: string,
    timelock: number
  ): Buffer {
    return script.fromASM(
      `
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
        .replace(/\s+/g, ' ')
    );
  }
}
