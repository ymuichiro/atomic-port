import BaseEvmService from "./BaseEvmService";
import HashedTimelockERC721 from "../abis/HashedTimelockERC721.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc721HtlcService extends BaseEvmService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractId =
    "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockERC721 as any,
      provider ?? _EtherErc721HtlcService.provider,
      contractId ?? _EtherErc721HtlcService.contractId
    );
  }
}

export default _EtherErc721HtlcService;
