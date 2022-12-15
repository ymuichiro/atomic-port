import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { newSecretHashPair } from "../cores/CryptoService";
import { HashPair } from "../models/CryptoModel";

/**
 * Base class for HTLC operations on each EVM
 */
class BaseEvmService {
  public readonly web3: Web3;
  private readonly contract: Contract;
  private readonly contractId: string;

  protected constructor(
    abi: AbiItem,
    provider: string,
    contractAddress: string
  ) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
    this.contractId = contractAddress;
  }

  /**
   * Obtain contract information for the current instance
   */
  public getContractInfo() {
    return this.contract.methods.getContract(this.contractId).call();
  }

  /**
   * Issue HTLC and obtain the key at the time of issue
   */
  public async mint(
    recipientAddress: string,
    senderAddress: string,
    lockSeconds: number,
    amount: number,
    gasLimit: number
  ): Promise<[string, HashPair]> {
    const hashPair: HashPair = newSecretHashPair();
    const value = this.web3.utils.toWei(this.web3.utils.toBN(amount), "finney");
    const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
    const res = await this.contract.methods
      .newContract(recipientAddress, hashPair.hash, lockPeriod)
      .send({ from: senderAddress, gas: gasLimit.toString(), value });
    return [res.event.LogHTLCNew.returnValues, hashPair];
  }

  /**
   * Receive tokens stored under the key at the time of HTLC generation
   */
  public async withDraw(
    senderAddress: string,
    secret: string,
    gasLimit: number
  ): Promise<string> {
    const res = await this.contract.methods
      .withdraw(this.contractId, secret)
      .send({ from: senderAddress, gas: gasLimit.toString() });
    return res.events.LogHTLCWithdraw;
  }
}

export default BaseEvmService;
