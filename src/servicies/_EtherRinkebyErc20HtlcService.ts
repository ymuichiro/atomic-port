import BaseErc20HtlcService from "./BaseErc20HtlcService";

/**
 * Base class for HTLC operations on each EVM
 */
class _EtherRinkebyErc20HtlcService extends BaseErc20HtlcService {
  public static readonly provider = "https://rpc.ankr.com/eth_rinkeby";
  public static readonly contractAddress =
    "0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac";

  constructor(provider?: string, contractAddress?: string) {
    super(
      provider ?? _EtherRinkebyErc20HtlcService.provider,
      contractAddress ?? _EtherRinkebyErc20HtlcService.contractAddress
    );
  }
}

export default _EtherRinkebyErc20HtlcService;
