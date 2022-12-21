import BaseErc20HtlcService from "./BaseErc20HtlcService";

/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc20HtlcService extends BaseErc20HtlcService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractAddress =
    "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";

  constructor(provider?: string, contractAddress?: string) {
    super(
      provider ?? _EtherErc20HtlcService.provider,
      contractAddress ?? _EtherErc20HtlcService.contractAddress
    );
  }
}

export default _EtherErc20HtlcService;
