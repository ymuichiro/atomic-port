import BaseEvmService from "./BaseEvmService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class _PolygonHtlcService extends BaseEvmService {
    static readonly provider = "https://rpc-mumbai.maticvigil.com";
    static readonly contractId = "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";
    constructor(provider?: string, contractId?: string);
}
export default _PolygonHtlcService;
