import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
/**
 * Base class for HTLC operations on each EVM
 */
declare class BaseEvmService {
    web3: Web3;
    protected readonly contract: Contract;
    readonly contractAddress: string;
    protected constructor(abi: AbiItem, provider: string, contractAddress: string);
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId: string): any;
}
export default BaseEvmService;
