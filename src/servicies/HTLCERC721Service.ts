import { AbiItem } from 'web3-utils';
import HashedTimelockERC721 from '../abis/HashedTimelockERC721.json';
import ERC721Abi from '../abis/ERC721.json';
import { MintOptions } from '../models/core';
import { BaseHTLCService } from './BaseHTLCService';
import { createHashPairForEvm } from '../cores/HashPair';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
export class HTLCERC721Service extends BaseHTLCService {
  private readonly contractAddress: string;

  constructor(providerEndpoint: string, contractAddress: string) {
    super(providerEndpoint, contractAddress, HashedTimelockERC721.abi as unknown as AbiItem);
    this.contractAddress = contractAddress;
  }

  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async mint(
    recipientAddress: string,
    senderAddress: string,
    tokenId: number,
    tokenAddress: string,
    options?: MintOptions
  ) {
    // Pre-register before issuing a transaction
    const erc721TokenContract = new this.web3.eth.Contract(ERC721Abi.abi as any, tokenAddress);
    const gas = options?.gasLimit ?? 1000000;
    await erc721TokenContract.methods
      .approve(this.contractAddress, tokenId)
      .send({ from: senderAddress, gas: gas.toString() });
    // Issue lock transaction
    const lockPeriod = Math.floor(Date.now() / 1000) + (options?.lockSeconds ?? 3600);
    const hashPair = createHashPairForEvm();
    const res = await this.contract.methods
      .newContract(recipientAddress, hashPair.proof, lockPeriod, tokenAddress, tokenId)
      .send({ from: senderAddress, gas: gas.toString() });
    return { contractId: res.events.HTLCERC721New.returnValues.contractId, hashPair };
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(contractId: string, senderAddress: string, secret: string, gasLimit?: number): Promise<string> {
    const gas = gasLimit ?? 1000000;
    const res = await this.contract.methods
      .withdraw(contractId, secret)
      .send({ from: senderAddress, gas: gas.toString() });
    return res.events.HTLCERC721Withdraw;
  }
}
