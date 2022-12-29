import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import HashedTimelockERC20 from '../abis/HashedTimelockERC20.json';
import ERC20Abi from '../abis/ERC20.json';
import { MintOptions } from '../models/evm';
import HashPair from '../cores/HashPair';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class BaseErc20HtlcService {
  public web3: Web3;
  protected readonly contract: Contract;
  protected readonly contractAddress: string;

  protected constructor(provider: string, contractAddress: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.contract = new this.web3.eth.Contract(HashedTimelockERC20.abi as any, contractAddress);
    this.contractAddress = contractAddress;
  }
  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async mint(
    recipientAddress: string,
    senderAddress: string,
    hashPair: HashPair,
    amount: number,
    tokenAddress: string,
    options?: MintOptions
  ): Promise<string> {
    const erc20TokenContract = new this.web3.eth.Contract(ERC20Abi.abi as any, tokenAddress);
    const gas = options?.gasLimit ?? 1000000;
    // ERC20 や ERC721はまず小切手のようにコントラクトアドレスが受け取るための宣言をapproveによって行います
    // approveの第２引数はAmount
    const value = this.web3.utils.toWei(this.web3.utils.toBN(amount), 'finney');
    const approve = await erc20TokenContract.methods
      .approve(this.contractAddress, value)
      .send({ from: senderAddress, gas: gas.toString() });
    console.log(approve.events.Approval.returnValues);
    const lockPeriod = Math.floor(Date.now() / 1000) + (options?.lockSeconds ?? 3600);
    const res = await this.contract.methods
      .newContract(recipientAddress, hashPair.proofForEvm, lockPeriod, tokenAddress, value)
      .send({ from: senderAddress, gas: gas.toString() });
    return res.events.HTLCERC20New.returnValues.contractId;
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(contractId: string, senderAddress: string, secret: string, gasLimit?: number): Promise<string> {
    const gas = gasLimit ?? 1000000;
    const res = await this.contract.methods
      .withdraw(contractId, secret)
      .send({ from: senderAddress, gas: gas.toString() });
    return res.events.HTLCERC20Withdraw;
  }

  /**
   * Obtain contract information for the current instance
   */
  public getContractInfo(contractId: string) {
    return this.contract.methods.getContract(contractId).call();
  }
}

export default BaseErc20HtlcService;
