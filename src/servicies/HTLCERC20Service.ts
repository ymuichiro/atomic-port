import { AbiItem } from 'web3-utils';
import ERC20Abi from '../abis/ERC20.json';
import HashedTimelockERC20 from '../abis/HashedTimelockERC20.json';
import { HashPair } from '../cores/HashPair';
import { MintOptions } from '../models/evm';
import { BaseHTLCService } from './BaseHTLCService';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
export class HTLCERC20Service extends BaseHTLCService {
  private readonly contractAddress: string;

  constructor(providerEndpoint: string, contractAddress: string) {
    super(providerEndpoint, contractAddress, HashedTimelockERC20.abi as unknown as AbiItem);
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
    // Pre-register before issuing a transaction
    const erc20TokenContract = new this.web3.eth.Contract(ERC20Abi.abi as any, tokenAddress);
    const gas = options?.gasLimit ?? 1000000;
    const value = this.web3.utils.toWei(this.web3.utils.toBN(amount), 'finney');
    await erc20TokenContract.methods
      .approve(this.contractAddress, value)
      .send({ from: senderAddress, gas: gas.toString() });
    // Issue lock transaction
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
}
