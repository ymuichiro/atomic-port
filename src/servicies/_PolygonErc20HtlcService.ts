import BaseErc20HtlcService from './BaseErc20HtlcService';

/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc20HtlcService extends BaseErc20HtlcService {
  public static readonly provider = 'https://rpc-mumbai.maticvigil.com';
  public static readonly contractAddress = '0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC';

  constructor(provider?: string, contractAddress?: string) {
    super(provider ?? _PolygonErc20HtlcService.provider, contractAddress ?? _PolygonErc20HtlcService.contractAddress);
  }
}

export default _PolygonErc20HtlcService;
