import BaseHtlcService from "./BaseHtlcService";

/**
 * HTLC operations on the Polygon Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _PolygonHtlcService extends BaseHtlcService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractId =
    "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";

  constructor(provider?: string, contractId?: string) {
    super(
      provider ?? _PolygonHtlcService.provider,
      contractId ?? _PolygonHtlcService.contractId
    );
  }
}

export default _PolygonHtlcService;
