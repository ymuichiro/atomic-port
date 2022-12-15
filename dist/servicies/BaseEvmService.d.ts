import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { HashPair } from "../models/CryptoModel";
/**
 * Base class for HTLC operations on each EVM
 */
declare class BaseEvmService {
    readonly web3: Web3;
    private readonly contract;
    private readonly contractId;
    protected constructor(abi: AbiItem, provider: string, contractAddress: string);
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(): any;
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, amount: number, gasLimit: number): Promise<[string, HashPair]>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(senderAddress: string, secret: string, gasLimit: number): Promise<string>;
}
export default BaseEvmService;
