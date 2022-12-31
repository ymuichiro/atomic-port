import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
export class BaseHTLCService {
  public readonly web3: Web3;
  protected readonly contract: Contract;

  protected constructor(providerEndpoint: string, contractAddress: string, abi: AbiItem) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerEndpoint));
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
  }

  /**
   * Obtain contract information for the current instance
   */
  public getContractInfo(contractId: string) {
    return this.contract.methods.getContract(contractId).call();
  }

  /**
   * Called by the sender if there was no withdraw AND the time lock has
   * expired. This will refund the contract amount.
   */
  public refund(contractId: string, senderAddress: string, gasLimit?: number) {
    const gas = gasLimit ?? 1000000;
    return this.contract.methods.refund(contractId)
    .send({ from: senderAddress, gas: gas.toString() });
  }
}
