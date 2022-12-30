import { AbiItem } from 'web3-utils';
import HashedTimelockAbi from '../abis/HashedTimelock.json';
import { HashPair } from '../cores/HashPair';
import { MintOptions } from '../models/evm';
import { BaseHTLCService } from './BaseHTLCService';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
export class HTLCService extends BaseHTLCService {
  constructor(providerEndpoint: string, contractAddress: string) {
    super(providerEndpoint, contractAddress, HashedTimelockAbi.abi as unknown as AbiItem);
  }

  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async mint(
    recipientAddress: string,
    senderAddress: string,
    hashPair: HashPair,
    amount: number,
    options?: MintOptions
  ): Promise<string> {
    const value = this.web3.utils.toWei(this.web3.utils.toBN(amount), 'finney');
    const lockPeriod = Math.floor(Date.now() / 1000) + (options?.lockSeconds ?? 3600);
    const gas = options?.gasLimit ?? 1000000;
    const res = await this.contract.methods
      .newContract(recipientAddress, hashPair.proofForEvm, lockPeriod)
      .send({ from: senderAddress, gas: gas.toString(), value });
    return res.events.LogHTLCNew.returnValues.contractId;
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(contractId: string, senderAddress: string, secret: string, gasLimit?: number): Promise<string> {
    const gas = gasLimit ?? 1000000;
    const res = await this.contract.methods
      .withdraw(contractId, secret)
      .send({ from: senderAddress, gas: gas.toString() });
    return res.events.LogHTLCWithdraw;
  }
}
