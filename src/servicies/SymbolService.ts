import { calcCompositeHash, newSecretHashPair } from "../cores/CryptoService";
import { SymbolFacade } from "symbol-sdk/src/facade/SymbolFacade";
import { KeyPair } from "symbol-sdk/src/symbol/KeyPair";
import { NetworkTimestamp } from "symbol-sdk/src/symbol/NetworkTimestamp";
import { Amount } from "symbol-sdk/src/symbol/models";
import { converter } from "symbol-sdk/src/utils/converter";
import { PrivateKey } from "symbol-sdk/src/CryptoTypes";
import { Network, Address } from "symbol-sdk/src/symbol/Network";

class SymbolService {
  private readonly facade: SymbolFacade;
  private readonly node: string;

  constructor(network: Network, node: string) {
    this.facade = SymbolFacade(network);
    this.node = node;
  }

  public async secretLockTransaction(
    senderPrivateKey: string,
    recipientAddress: string,
    mosaicId: bigint,
    amount: bigint,
    duration: bigint
  ) {
    this.facade;
    const privateKey = new PrivateKey(senderPrivateKey);
    const keyPair = new KeyPair(privateKey);
    const hashPair = newSecretHashPair();
    const deadline = new NetworkTimestamp(
      this.facade.network.fromDatetime(Date.now())
    ).addHours(2).timestamp;
    const secret = hashPair.hash.toUpperCase().replace("0X", "");
    const secretLockTransaction = this.facade.transactionFactory.create({
      type: "secret_lock_transaction_v1",
      mosaic: { mosaicId, amount },
      signerPublicKey: keyPair.publicKey,
      duration,
      recipientAddress,
      secret,
      hashAlgorithm: "hash_256",
      deadline,
    });

    const compositeHash = converter.uint8ToHex(
      this.compositeHash(
        converter.hexToUint8(secret),
        new Address(recipientAddress).bytes
      )
    );
    secretLockTransaction.fee = new Amount(
      BigInt(secretLockTransaction.size * 100)
    );
    const signature = this.facade.signTransaction(
      keyPair,
      secretLockTransaction
    );
    const jsonPayload =
      this.facade.transactionFactory.constructor.attachSignature(
        secretLockTransaction,
        signature
      );
    const res = await fetch(this.node + "/transactions", {
      method: "put",
      body: jsonPayload,
      headers: { "Content-Type": "application/json" },
    });
    return {
      message: await res.json(),
      hashPair,
      compositeHash,
    };
  }

  private async getLockTransaction(compositeHash: number[]): Promise<Response> {
    return await fetch(this.node + "/lock/secret/" + compositeHash, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
  }

  private compositeHash = (secret: string, address: string): number[] => {
    return calcCompositeHash(secret, address);
  };
}

export default SymbolService;
