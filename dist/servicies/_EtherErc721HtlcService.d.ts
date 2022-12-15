import BaseEvmService from "./BaseEvmService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class _EtherErc721HtlcService extends BaseEvmService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractId = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider?: string, contractId?: string);
}
export default _EtherErc721HtlcService;
