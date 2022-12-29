import BaseErc721HtlcService from './BaseErc721HtlcService';

/**
 * Base class for HTLC operations on each EVM
 */
class _EtherRinkebyErc721HtlcService extends BaseErc721HtlcService {
  public static readonly provider = 'https://rpc.ankr.com/eth_rinkeby';
  public static readonly contractAddress = '0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd';

  constructor(provider?: string, contractAddress?: string) {
    super(
      provider ?? _EtherRinkebyErc721HtlcService.provider,
      contractAddress ?? _EtherRinkebyErc721HtlcService.contractAddress
    );
  }
}

export default _EtherRinkebyErc721HtlcService;
