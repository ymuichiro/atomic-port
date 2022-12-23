import BaseErc20HtlcService from "./BaseErc20HtlcService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherRinkebyErc20HtlcService extends BaseErc20HtlcService {
    static readonly provider = "https://rpc.ankr.com/eth_rinkeby";
    static readonly contractAddress = "0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac";
    constructor(provider?: string, contractAddress?: string);
}
export default _EtherRinkebyErc20HtlcService;
