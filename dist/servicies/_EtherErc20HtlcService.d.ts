import BaseErc20HtlcService from "./BaseErc20HtlcService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherErc20HtlcService extends BaseErc20HtlcService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractAddress = "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";
    constructor(provider?: string, contractAddress?: string);
}
export default _EtherErc20HtlcService;
