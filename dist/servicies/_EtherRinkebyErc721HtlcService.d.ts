import BaseErc721HtlcService from "./BaseErc721HtlcService";
/**
 * Base class for HTLC operations on each EVM
 */
declare class _EtherRinkebyErc721HtlcService extends BaseErc721HtlcService {
    static readonly provider = "https://rpc.ankr.com/eth_rinkeby";
    static readonly contractAddress = "0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd";
    constructor(provider?: string, contractAddress?: string);
}
export default _EtherRinkebyErc721HtlcService;
