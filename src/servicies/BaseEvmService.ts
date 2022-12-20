import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

/**
 * Base class for HTLC operations on each EVM
 */
class BaseEvmService {
  public web3: Web3;
  protected readonly contract: Contract;
  public readonly contractAddress: string;

  protected constructor(
    abi: AbiItem,
    provider: string,
    contractAddress: string
  ) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
    this.contractAddress = contractAddress;
  }

  /**
   * Obtain contract information for the current instance
   */
  public getContractInfo(contractId: string) {
    return this.contract.methods.getContract(contractId).call();
  }
}

export default BaseEvmService;
