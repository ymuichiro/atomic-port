import BaseEvmService from "./BaseEvmService";
import HashedTimelockAbi from "../abis/HashedTimelock.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _PolygonHtlcService extends BaseEvmService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractId =
    "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockAbi as any,
      provider ?? _PolygonHtlcService.provider,
      contractId ?? _PolygonHtlcService.contractId
    );
  }
}

export default _PolygonHtlcService;
