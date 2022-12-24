import BaseHtlcService from "./BaseHtlcService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class _EtherHtlcService extends BaseHtlcService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractAddress = "0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7";
    constructor(provider?: string, contractAddress?: string);
}
export default _EtherHtlcService;
