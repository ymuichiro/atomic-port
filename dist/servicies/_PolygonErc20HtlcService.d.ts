import BaseEvmService from "./BaseEvmService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class _EtherErc20HtlcService extends BaseEvmService {
    static readonly provider = "https://rpc-mumbai.maticvigil.com";
    static readonly contractId = "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";
    constructor(provider?: string, contractId?: string);
}
export default _EtherErc20HtlcService;
