import Mona from './Mona';
import { LockOptions } from './Core';
import { networks } from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
/**
 * HTLC operations on the Bitcoin.
 */
export declare class MonaHtlc extends Mona {
    constructor(network: networks.Network);
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    lock(sender: ECPairInterface, receiver: ECPairInterface, secret: string, amount: number, options?: LockOptions): Promise<{
        hash: string;
        contractAddress: string;
        witnessScript: string;
    }>;
    withdraw(hash: string, contractAddress: string, witnessScript: string, receiver: ECPairInterface, proof: string, option?: {
        fee?: number;
    }): Promise<string>;
    /**
     * Called by the sender if there was no withdraw AND the time lock has
     * expired. This will refund the contract amount.
     * @returns transaction hash
     */
    refund(hash: string, contractAddress: string, witnessScript: string, sender: ECPairInterface, option?: {
        fee?: number;
    }): Promise<string>;
}
