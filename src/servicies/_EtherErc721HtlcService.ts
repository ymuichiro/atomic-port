import BaseEvmService from "./BaseEvmService";
import HashedTimelockERC721 from "../abis/HashedTimelockERC721.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc721HtlcService extends BaseEvmService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractId =
    "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockERC721 as any,
      provider ?? _EtherErc721HtlcService.provider,
      contractId ?? _EtherErc721HtlcService.contractId
    );
  }
}

export default _EtherErc721HtlcService;
