import bip65 from 'bip65';
import Mona from './Mona';
import { crypto, payments, Psbt, script, opcodes } from 'bitcoinjs-lib';
/**
 * HTLC operations on the Bitcoin.
 */
export class MonaHtlc extends Mona {
    constructor(network) {
        super(network);
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async lock(sender, receiver, secret, amount, options) {
        // set option paramater
        const fee = options?.fee || 100000;
        const lockHeight = options?.lockHeight || 2;
        const blockHeight = await this.getCurrentBlockHeight();
        const timelock = bip65.encode({ blocks: blockHeight + lockHeight });
        // generate contract
        const witnessScript = this.generateSwapWitnessScript(receiver.publicKey, sender.publicKey, secret, timelock);
        const p2wsh = payments.p2wsh({
            redeem: { output: witnessScript, network: this.network },
            network: this.network,
        });
        // get addresses
        const senderAddress = payments.p2wpkh({ pubkey: sender.publicKey, network: this.network }).address;
        if (senderAddress == undefined || p2wsh.address == undefined) {
            throw new Error('senderAddress or contractAddress is undefined');
        }
        // get balance
        const utxos = await this.getUtxos(senderAddress);
        if (!utxos || utxos.length <= 0) {
            throw new Error(`There was no UTXO currently available at the specified address ${senderAddress}.`);
        }
        // create transaction & announce
        const txHex = this.buildAndSignTx(sender, senderAddress, p2wsh.address, amount, fee, utxos);
        const { tx_hash: hash } = await this.postTransaction(txHex);
        return {
            hash: hash,
            contractAddress: p2wsh.address,
            witnessScript: witnessScript.toString('hex'),
        };
    }
    async withdraw(hash, contractAddress, witnessScript, receiver, proof, option) {
        // set option paramater
        const fee = option?.fee || 100000;
        const witnessUtxoValue = await this.getInputData(hash, contractAddress);
        const p2wpkh = payments.p2wpkh({ pubkey: receiver.publicKey, network: this.network });
        if (p2wpkh.address === undefined)
            throw new Error(`recieverAddress is undefined`);
        // transaction process
        const transaction = new Psbt({ network: this.network })
            .addInput({
            hash,
            index: witnessUtxoValue.index,
            sequence: 0xfffffffe,
            witnessScript: Buffer.from(witnessScript, 'hex'),
            witnessUtxo: {
                script: Buffer.from('0020' + crypto.sha256(Buffer.from(witnessScript, 'hex')).toString('hex'), 'hex'),
                value: witnessUtxoValue.value,
            },
        })
            .addOutput({
            address: p2wpkh.address,
            value: witnessUtxoValue.value - fee,
        })
            .signInput(0, receiver)
            .finalizeInput(0, (inputIndex, input, tapLeafHashToFinalize) => {
            const decompiled = script.decompile(tapLeafHashToFinalize);
            if (!decompiled || decompiled[0] !== opcodes.OP_HASH256) {
                throw new Error(`Can not finalize input #${inputIndex}`);
            }
            const witnessStackClaimBranch = payments.p2wsh({
                redeem: {
                    input: script.compile([input.partialSig[0].signature, Buffer.from(proof, 'hex')]),
                    output: Buffer.from(witnessScript, 'hex'),
                },
            });
            return {
                finalScriptSig: undefined,
                finalScriptWitness: this.witnessStackToScriptWitness(witnessStackClaimBranch.witness),
            };
        })
            .extractTransaction();
        console.log(`transaction id: ${transaction.getId()}`);
        await new Promise((ok) => {
            setTimeout(() => {
                ok('');
            }, 10000);
        });
        return await this.postTransaction(transaction.toHex());
    }
    /**
     * Called by the sender if there was no withdraw AND the time lock has
     * expired. This will refund the contract amount.
     * @returns transaction hash
     */
    async refund(hash, contractAddress, witnessScript, sender, option) {
        // set option paramater
        const fee = option?.fee || 1800;
        const decompiled = script.decompile(Buffer.from(witnessScript, 'hex'));
        const witnessUtxoValue = await this.getInputData(hash, contractAddress);
        const p2wpkh = payments.p2wpkh({ pubkey: sender.publicKey, network: this.network });
        if (decompiled == null || decompiled[6] == null)
            throw new Error("script hasn't lock time");
        if (p2wpkh.address === undefined)
            throw new Error(`recieverAddress is undefined`);
        const timelock = bip65.encode({ blocks: script.number.decode(decompiled[6]) });
        // transaction process
        const transaction = new Psbt({ network: this.network })
            .setLocktime(timelock)
            .addInput({
            hash,
            index: witnessUtxoValue.index,
            sequence: 0xfffffffe,
            witnessScript: Buffer.from(witnessScript, 'hex'),
            witnessUtxo: {
                script: Buffer.from('0020' + crypto.sha256(Buffer.from(witnessScript, 'hex')).toString('hex'), 'hex'),
                value: witnessUtxoValue.value,
            },
        })
            .addOutput({
            address: p2wpkh.address,
            value: witnessUtxoValue.value - fee,
        })
            .signInput(0, sender)
            .finalizeInput(0, (inputIndex, input, tapLeafHashToFinalize) => {
            const decompiled = script.decompile(tapLeafHashToFinalize);
            if (!decompiled || decompiled[0] !== opcodes.OP_HASH256) {
                throw new Error(`Can not finalize input #${inputIndex}`);
            }
            const witnessStackRefundBranch = payments.p2wsh({
                redeem: {
                    input: script.compile([input.partialSig[0].signature, Buffer.from('', 'hex')]),
                    output: Buffer.from(witnessScript, 'hex'),
                },
            });
            return {
                finalScriptSig: undefined,
                finalScriptWitness: this.witnessStackToScriptWitness(witnessStackRefundBranch.witness),
            };
        })
            .extractTransaction();
        return await this.postTransaction(transaction.toHex());
    }
}
