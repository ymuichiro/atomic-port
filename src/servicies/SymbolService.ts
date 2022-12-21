import { calcCompositeHash, newSecretHashPair } from "../cores/CryptoService";
import {
  Address,
  Convert,
  Deadline,
  LockHashAlgorithm,
  Mosaic,
  MosaicId,
  NetworkType,
  RawAddress,
  SecretLockTransaction,
  UInt64,
  RepositoryFactoryHttp,
  Account,
  SecretLockInfo,
  SecretProofTransaction,
} from "symbol-sdk";
import { firstValueFrom } from "rxjs";

class SymbolService {
  private readonly node: string;
  private readonly networkType: NetworkType;
  private readonly generationHashSeed: string;
  private readonly currencyMosaicId: string;
  private readonly epochAdjustment: number;

  constructor(
    node: string,
    networkType: NetworkType,
    generationHashSeed: string,
    currencyMosaicId: string,
    epochAdjustment: number
  ) {
    this.node = node;
    this.networkType = networkType;
    this.generationHashSeed = generationHashSeed;
    this.currencyMosaicId = currencyMosaicId;
    this.epochAdjustment = epochAdjustment;
  }

  public async secretLockTransaction(
    senderPrivateKey: string,
    recipientAddress: string,
    mosaicId: string,
    amount: number,
    duration: number
  ): Promise<object> {
    const repo = new RepositoryFactoryHttp(this.node);
    const txRepo = repo.createTransactionRepository();
    const deadline = Deadline.create(this.epochAdjustment);
    const hashPair = newSecretHashPair();
    const secret = hashPair.hash.toUpperCase().replace("0X", "");

    const sender = Account.createFromPrivateKey(
      senderPrivateKey,
      this.networkType
    );
    const secretLockTransaction = SecretLockTransaction.create(
      deadline,
      new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount)),
      UInt64.fromUint(duration),
      LockHashAlgorithm.Op_Hash_256,
      secret,
      Address.createFromRawAddress(recipientAddress),
      this.networkType
    ).setMaxFee(100);

    const compositeHash = Convert.uint8ToHex(
      this.compositeHash(
        Convert.hexToUint8(secret),
        RawAddress.stringToAddress(recipientAddress)
      )
    );

    const signedTransaction = sender.sign(
      secretLockTransaction,
      this.generationHashSeed
    );

    const res = await firstValueFrom(txRepo.announce(signedTransaction));
    return {
      message: res,
      hashPair,
      compositeHash,
    };
  }

  public async secretProofTransaction(
    senderPrivateKey: string,
    recipientAddress: string,
    proof: string,
    secret: string
  ): Promise<object> {
    const repo = new RepositoryFactoryHttp(this.node);
    const txRepo = repo.createTransactionRepository();
    const deadline = Deadline.create(this.epochAdjustment);

    const sender = Account.createFromPrivateKey(
      senderPrivateKey,
      this.networkType
    );

    const secretProofTransaction = SecretProofTransaction.create(
      deadline,
      LockHashAlgorithm.Op_Hash_256,
      secret.replace("0x", ""),
      Address.createFromRawAddress(recipientAddress),
      proof.replace("0x", ""),
      this.networkType
    ).setMaxFee(100);

    const signedTransaction = sender.sign(
      secretProofTransaction,
      this.generationHashSeed
    );

    const res = await firstValueFrom(txRepo.announce(signedTransaction));

    return {
      message: res,
      hashPair: {
        proof,
        secret,
      },
    };
  }

  public async getLockTransaction(
    compositeHash: string
  ): Promise<SecretLockInfo> {
    const repo = new RepositoryFactoryHttp(this.node);
    const secretLockRepo = repo.createSecretLockRepository();
    return await firstValueFrom(secretLockRepo.getSecretLock(compositeHash));
  }

  private compositeHash = (
    secret: Uint8Array,
    address: Uint8Array
  ): number[] => {
    return calcCompositeHash(secret, address);
  };
}

export default SymbolService;
