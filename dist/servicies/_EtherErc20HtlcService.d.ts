import BaseEvmService from "./BaseEvmService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class _EtherErc20HtlcService extends BaseEvmService {
    static readonly provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static readonly contractId = "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";
    constructor(provider?: string, contractId?: string);
}
export default _EtherErc20HtlcService;
