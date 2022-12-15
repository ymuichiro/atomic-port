import BaseEvmService from "./BaseEvmService";
import HashedTimelockERC20 from "../abis/HashedTimelockERC20.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc20HtlcService extends BaseEvmService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractId =
    "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockERC20 as any,
      provider ?? _EtherErc20HtlcService.provider,
      contractId ?? _EtherErc20HtlcService.contractId
    );
  }
}

export default _EtherErc20HtlcService;
