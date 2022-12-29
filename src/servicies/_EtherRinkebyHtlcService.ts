import BaseHtlcService from './BaseHtlcService';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherRinkebyHtlcService extends BaseHtlcService {
  public static readonly provider = 'https://rpc.ankr.com/eth_rinkeby';
  public static readonly contractAddress = '0x97ED40C207bf3B6dE4DB27E37E1989f3756E71f4';

  constructor(provider?: string, contractAddress?: string) {
    super(provider ?? _EtherRinkebyHtlcService.provider, contractAddress ?? _EtherRinkebyHtlcService.contractAddress);
  }
}

export default _EtherRinkebyHtlcService;
