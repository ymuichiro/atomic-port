import BaseEvmService from "./BaseEvmService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherErc721HtlcService extends BaseEvmService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractAddress = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider?: string, contractAddress?: string);
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, tokenAddress: string, tokenId: number, gasLimit: number): Promise<object>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(contractId: string, senderAddress: string, secret: string, gasLimit: number): Promise<string>;
}
export default _EtherErc721HtlcService;
