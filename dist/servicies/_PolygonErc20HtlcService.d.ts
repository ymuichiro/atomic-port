import { HashPair } from "../models/CryptoModel";
import BaseEvmService from "./BaseEvmService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _PolygonErc20HtlcService extends BaseEvmService {
    static readonly provider = "https://rpc-mumbai.maticvigil.com";
    static readonly contractAddress = "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";
    constructor(provider?: string, contractAddress?: string);
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, tokenAddress: string, amount: number, gasLimit: number): Promise<[string, HashPair]>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(contractId: string, senderAddress: string, secret: string, gasLimit: number): Promise<string>;
}
export default _PolygonErc20HtlcService;
