import BaseEvmService from "./BaseEvmService";
import HashedTimelockAbi from "../abis/HashedTimelock.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherHtlcService extends BaseEvmService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractId =
    "0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockAbi as any,
      provider ?? _EtherHtlcService.provider,
      contractId ?? _EtherHtlcService.contractId
    );
  }
}

export default _EtherHtlcService;
