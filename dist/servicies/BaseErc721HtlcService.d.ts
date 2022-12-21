import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import IEvmService from "./IEvmService";
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
declare class BaseErc721HtlcService implements IEvmService {
    web3: Web3;
    protected readonly contract: Contract;
    protected readonly contractAddress: string;
    protected constructor(provider: string, contractAddress: string);
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    mint(recipientAddress: string, senderAddress: string, lockSeconds: number, tokenId: number, gasLimit: number, tokenAddress: string): Promise<object>;
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    withDraw(contractId: string, senderAddress: string, secret: string, gasLimit: number): Promise<string>;
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId: string): any;
}
export default BaseErc721HtlcService;
