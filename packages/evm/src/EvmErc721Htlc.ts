import { AbiItem } from 'web3-utils';
import ERC721Abi from './abis/ERC721.json';
import HashedTimelockERC721 from './abis/HashedTimelockERC721.json';
import { BaseHTLCService } from './models/BaseHtlc';
import { HTLCERC721MintResult, HTLCERC721WithDrawResult } from './models/Contract';
import { LockOptions } from './models/Core';

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
export class EvmErc721Htlc extends BaseHTLCService {
  private readonly contractAddress: string;

  constructor(providerEndpoint: string, contractAddress: string) {
    super(providerEndpoint, contractAddress, HashedTimelockERC721.abi as unknown as AbiItem);
    this.contractAddress = contractAddress;
  }

  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async lock(
    recipientAddress: string,
    senderAddress: string,
    secret: string,
    tokenId: number,
    tokenAddress: string,
    options?: LockOptions
  ): Promise<HTLCERC721MintResult> {
    // Pre-register before issuing a transaction
    const erc721TokenContract = new this.web3.eth.Contract(ERC721Abi.abi as any, tokenAddress);
    const gas = options?.gasLimit ?? 1000000;
    await erc721TokenContract.methods
      .approve(this.contractAddress, tokenId)
      .send({ from: senderAddress, gas: gas.toString() });
    // Issue lock transaction
    const lockPeriod = Math.floor(Date.now() / 1000) + (options?.lockSeconds ?? 3600);
    return await this.contract.methods
      .newContract(recipientAddress, secret, lockPeriod, tokenAddress, tokenId)
      .send({ from: senderAddress, gas: gas.toString() });
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(contractId: string, senderAddress: string, proof: string, gasLimit?: number) {
    const gas = gasLimit ?? 1000000;
    const res = await this.contract.methods
      .withdraw(contractId, proof)
      .send({ from: senderAddress, gas: gas.toString() });
    return { result: res as HTLCERC721WithDrawResult };
  }

  /**
   * for development
   * create erc721 token
   */
  public async createToken(tokenAddress: string, senderAddress: string, tokenId: number) {
    const erc721TokenContract = new this.web3.eth.Contract(ERC721Abi.abi as any, tokenAddress);
    const res = await erc721TokenContract.methods
      .mint(senderAddress, tokenId)
      .send({ from: senderAddress, gas: (1000000).toString() });
    return {
      tokenId: res.events.Transfer.returnValues.tokenId as string,
    };
  }
}
