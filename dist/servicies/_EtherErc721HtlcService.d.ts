import BaseErc721HtlcService from "./BaseErc721HtlcService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherErc721HtlcService extends BaseErc721HtlcService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractAddress = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider?: string, contractAddress?: string);
}
export default _EtherErc721HtlcService;
