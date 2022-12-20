import { newSecretHashPair } from "../cores/CryptoService";
import { HashPair } from "../models/CryptoModel";
import ERC20Abi from "../abis/ERC20.json";
import HashedTimelockERC20 from "../abis/HashedTimelockERC20.json";
import BaseEvmService from "./BaseEvmService";

/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc20HtlcService extends BaseEvmService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractAddress =
    "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";

    constructor(provider?: string, contractAddress?: string) {
    super(
        HashedTimelockERC20.abi as any,
      provider ?? _EtherErc20HtlcService.provider,
      contractAddress ?? _EtherErc20HtlcService.contractAddress,
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
    amount: number,
    gasLimit: number
  ): Promise<object> {
    const erc20TokenContract = new this.web3.eth.Contract(ERC20Abi.abi as any, tokenAddress);
    // ERC20 や ERC721はまず小切手のようにコントラクトアドレスが受け取るための宣言をapproveによって行います
    // approveの第２引数はAmount
    const approve = await erc20TokenContract.methods.approve(this.contractAddress, amount).send({ from: senderAddress, gas: gasLimit.toString() });
    console.log(approve.events.Approval.returnValues);
    const hashPair: HashPair = newSecretHashPair();
    const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
    const res = await this.contract.methods
      .newContract(
        recipientAddress,
        hashPair.hash,
        lockPeriod,
        tokenAddress,
        amount
        )
      .send({ from: senderAddress, gas: gasLimit.toString() });
    return {
      "contractId": res.events.HTLCERC20New.returnValues.contractId,
      hashPair
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
    return res.events.HTLCERC20Withdraw;
  }
}

export default _EtherErc20HtlcService;
