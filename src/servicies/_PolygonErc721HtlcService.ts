import BaseErc721HtlcService from "./BaseErc721HtlcService";

/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc721HtlcService extends BaseErc721HtlcService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractAddress =
    "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";

  constructor(provider?: string, contractAddress?: string) {
    super(
      provider ?? _PolygonErc721HtlcService.provider,
      contractAddress ?? _PolygonErc721HtlcService.contractAddress
    );
  }
}

export default _PolygonErc721HtlcService;
