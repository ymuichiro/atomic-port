import { newSecretHashPair } from "../cores/CryptoService";
import { HashPair } from "../models/CryptoModel";
import ERC721Abi from "../abis/ERC721.json";
import HashedTimelockERC721 from "../abis/HashedTimelockERC721.json";
import BaseEvmService from "./BaseEvmService";

/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc721HtlcService extends BaseEvmService {
  public static readonly provider = "https://rpc-mumbai.maticvigil.com";
  public static readonly contractAddress =
    "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";

  constructor(provider?: string, contractAddress?: string) {
    super(
      HashedTimelockERC721.abi as any,
      provider ?? _PolygonErc721HtlcService.provider,
      contractAddress ?? _PolygonErc721HtlcService.contractAddress
    );
  }

  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async mint(
    recipientAddress: string,
    senderAddress: string,
    lockSeconds: number,
    tokenAddress: string,
    tokenId: number,
    gasLimit: number
  ): Promise<object> {
    const erc721TokenContract = new this.web3.eth.Contract(
      ERC721Abi.abi as any,
      tokenAddress
    );
    const approve = await erc721TokenContract.methods
      .approve(this.contractAddress, tokenId)
      .send({ from: senderAddress, gas: gasLimit.toString() });
    console.log(approve.events.Approval.returnValues);
    const hashPair: HashPair = newSecretHashPair();
    const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
    const res = await this.contract.methods
      .newContract(
        recipientAddress,
        hashPair.hash,
        lockPeriod,
        tokenAddress,
        tokenId
      )
      .send({ from: senderAddress, gas: gasLimit.toString() });

    return {
      contractId: res.events.HTLCERC721New.returnValues.contractId,
      hashPair,
    };
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(
    contractId: string,
    senderAddress: string,
    secret: string,
    gasLimit: number
  ): Promise<string> {
    const res = await this.contract.methods
      .withdraw(contractId, secret)
      .send({ from: senderAddress, gas: gasLimit.toString() });
    return res.events.HTLCERC721Withdraw;
  }
}

export default _PolygonErc721HtlcService;
