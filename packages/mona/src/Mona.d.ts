/// <reference types="node" />
import { networks } from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import { HashPair, Utxo } from './Core';
export default abstract class Mona {
    readonly network: networks.Network;
    readonly baseUrl: string;
    constructor(network: networks.Network);
    createHashPair(): HashPair;
    protected getCurrentBlockHeight(): Promise<number>;
    protected postTransaction(txhex: string): Promise<any>;
    protected getInputData(txid: string, contractAddress: string): Promise<{
        value: number;
        index: number;
    }>;
    protected getUtxos(address: string): Promise<{
        hash: string;
        index: number;
        value: number;
    }[]>;
    protected buildAndSignTx(sender: ECPairInterface, address: string, recipient: string, sendingSat: number, feeSat: number, utxos: Utxo[]): string;
    protected witnessStackToScriptWitness(witness: any): Buffer;
    /**
     * Generate HTLC Contract Script for Bitcoin
     */
    protected generateSwapWitnessScript(receiverPublicKey: Buffer, userRefundPublicKey: Buffer, paymentHash: string, timelock: number): Buffer;
}
