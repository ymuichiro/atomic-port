import Web3 from "web3";
import { HashPair } from "../models/CryptoModel";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherErc20HtlcServiceTest {
    readonly web3: Web3;
    private readonly contract;
    constructor();
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId: string): any;
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, tokenContract: string, amount: number, gasLimit: number): Promise<[string, HashPair]>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(contractId: string, senderAddress: string, secret: string, gasLimit: number): Promise<string>;
}
export default _EtherErc20HtlcServiceTest;
