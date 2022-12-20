import BaseEvmService from "./BaseEvmService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherErc20HtlcService extends BaseEvmService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractAddress = "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";
    constructor(provider?: string, contractAddress?: string);
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, tokenAddress: string, amount: number, gasLimit: number): Promise<object>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(contractId: string, senderAddress: string, secret: string, gasLimit: number): Promise<string>;
}
export default _EtherErc20HtlcService;
