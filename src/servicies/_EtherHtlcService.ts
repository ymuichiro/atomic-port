import BaseEvmService from "./BaseEvmService";
import HashedTimelockAbi from "../abis/HashedTimelock.json";
import { newSecretHashPair } from "../cores/CryptoService";
import { HashPair } from "../models/CryptoModel";

/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherHtlcService extends BaseEvmService {
  public static readonly provider =
    "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
  public static readonly contractId =
    "0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7";

  constructor(provider?: string, contractId?: string) {
    super(
      HashedTimelockAbi.abi as any,
      provider ?? _EtherHtlcService.provider,
      contractId ?? _EtherHtlcService.contractId
    );
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
    return [res.events.LogHTLCNew.returnValues, hashPair];
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
    return res.events.LogHTLCWithdraw;
  }
}

export default _EtherHtlcService;
