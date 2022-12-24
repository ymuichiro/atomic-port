import BaseErc721HtlcService from "./BaseErc721HtlcService";

/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc721HtlcService extends BaseErc721HtlcService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractAddress =
    "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";

  constructor(provider?: string, contractAddress?: string) {
    super(
      provider ?? _EtherErc721HtlcService.provider,
      contractAddress ?? _EtherErc721HtlcService.contractAddress
    );
  }
}

export default _EtherErc721HtlcService;
