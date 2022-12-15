import BaseEvmService from "./BaseEvmService";
import HashedTimelockERC20 from "../abis/HashedTimelockERC20.json";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc20HtlcService extends BaseEvmService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractId =
    "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockERC20 as any,
      provider ?? _EtherErc20HtlcService.provider,
      contractId ?? _EtherErc20HtlcService.contractId
    );
  }
}

export default _EtherErc20HtlcService;
