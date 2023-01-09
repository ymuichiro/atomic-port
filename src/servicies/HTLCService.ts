import { AbiItem } from 'web3-utils';
import HashedTimelockAbi from '../abis/HashedTimelock.json';
import { LockOptions } from '../models/core';
import { HTLCMintResult, HTLCWithDrawResult } from '../models/HTLC';
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
  public async lock(
    recipientAddress: string,
    senderAddress: string,
    secret: string,
    amount: number,
    options?: LockOptions
  ): Promise<HTLCMintResult> {
    const value = this.web3.utils.toWei(this.web3.utils.toBN(amount), 'finney');
    const lockPeriod = Math.floor(Date.now() / 1000) + (options?.lockSeconds ?? 3600);
    const gas = options?.gasLimit ?? 1000000;
    return await this.contract.methods
      .newContract(recipientAddress, secret, lockPeriod)
      .send({ from: senderAddress, gas: gas.toString(), value });
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(contractId: string, senderAddress: string, proof: string, gasLimit?: number) {
    const gas = gasLimit ?? 1000000;
    const result = await this.contract.methods
      .withdraw(contractId, proof)
      .send({ from: senderAddress, gas: gas.toString() });
    return { result: result as HTLCWithDrawResult };
  }
}
