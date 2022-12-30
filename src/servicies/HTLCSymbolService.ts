// import { calcCompositeHash, newSecretHashPair } from '../cores/CryptoService';
import { firstValueFrom } from 'rxjs';
import { NetworkType } from 'symbol-sdk/dist/src/model/network/NetworkType';
import { RepositoryFactoryHttp } from 'symbol-sdk/dist/src/infrastructure/RepositoryFactoryHttp';
import { Deadline } from 'symbol-sdk/dist/src/model/transaction/Deadline';
import { Account } from 'symbol-sdk/dist/src/model/account/Account';
import { SecretLockTransaction } from 'symbol-sdk/dist/src/model/transaction/SecretLockTransaction';
import { Mosaic } from 'symbol-sdk/dist/src/model/mosaic/Mosaic';
import { MosaicId } from 'symbol-sdk/dist/src/model/mosaic/MosaicId';
import { UInt64 } from 'symbol-sdk/dist/src/model/UInt64';
import { LockHashAlgorithm } from 'symbol-sdk/dist/src/model/lock/LockHashAlgorithm';
import { Address } from 'symbol-sdk/dist/src/model/account/Address';
import { Convert } from 'symbol-sdk/dist/src/core/format/Convert';
import { SecretLockInfo } from 'symbol-sdk/dist/src/model/lock/SecretLockInfo';
import { SecretProofTransaction } from 'symbol-sdk/dist/src/model/transaction/SecretProofTransaction';
import { createHashPairForSymbol } from '../cores/HashPair';
import { sha3_256 as sha3 } from 'js-sha3';
import { RawAddress } from 'symbol-sdk/dist/src/core/format/RawAddress';
import { Transaction } from 'symbol-sdk/dist/src/model/transaction/Transaction';
import { SignedTransaction } from 'symbol-sdk/dist/src/model/transaction/SignedTransaction';
import { MintOptions } from '../models/core';

class HTLCSymbolService {
  private readonly node: string;
  private readonly networkType: NetworkType;
  private readonly generationHashSeed: string;
  private readonly epochAdjustment: number;

  constructor(node: string, networkType: NetworkType, generationHashSeed: string, epochAdjustment: number) {
    this.node = node;
    this.networkType = networkType;
    this.generationHashSeed = generationHashSeed;
    this.epochAdjustment = epochAdjustment;
  }

  /**
   * Issue a secret lock and return the results and key.
   */
  public mint(recipientAddress: string, mosaicId: string, amount: number, options?: MintOptions) {
    const hashPair = createHashPairForSymbol();
    const transaction = SecretLockTransaction.create(
      Deadline.create(this.epochAdjustment),
      new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount)),
      UInt64.fromUint(options?.lockSeconds ?? 5760),
      LockHashAlgorithm.Op_Hash_256,
      hashPair.secret,
      Address.createFromRawAddress(recipientAddress),
      this.networkType
    ).setMaxFee(options?.gasLimit ?? 100) as SecretLockTransaction;
    return { transaction, hashPair };
  }

  /**
   * Issue a transaction to receive a token using a pre-shared key
   */
  public withDraw(recipientAddress: string, proof: string, secret: string) {
    return SecretProofTransaction.create(
      Deadline.create(this.epochAdjustment),
      LockHashAlgorithm.Op_Hash_256,
      secret,
      Address.createFromRawAddress(recipientAddress),
      proof,
      this.networkType
    ).setMaxFee(100) as SecretProofTransaction;
  }

  /**
   * sign & accounce
   */
  public async sign(senderPrivateKey: string, tx: Transaction): Promise<SignedTransaction> {
    const senderAccount = Account.createFromPrivateKey(senderPrivateKey, this.networkType);
    const signedTransaction = senderAccount.sign(tx, this.generationHashSeed);
    const txRepo = new RepositoryFactoryHttp(this.node).createTransactionRepository();
    await firstValueFrom(txRepo.announce(signedTransaction));
    return signedTransaction;
  }

  /**
   * --
   */
  public getHash(hexSecret: string, recipientAddress: string): string {
    const uint8Address = RawAddress.stringToAddress(recipientAddress);
    const uint8Secret = Convert.hexToUint8(hexSecret);
    const uint8CompositHash = sha3.create().update(uint8Secret).update(uint8Address).digest();
    return Convert.uint8ToHex(uint8CompositHash);
  }

  public async getSecretLockTransaction(secret: string) {
    const repo = new RepositoryFactoryHttp(this.node);
    const secretLockRepo = repo.createSecretLockRepository();
    return await firstValueFrom(secretLockRepo.search({ secret }));
  }

  /**
   * --
   */
  public async getLockTransaction(compositeHash: string): Promise<SecretLockInfo> {
    const repo = new RepositoryFactoryHttp(this.node);
    const secretLockRepo = repo.createSecretLockRepository();
    return await firstValueFrom(secretLockRepo.getSecretLock(compositeHash));
  }
}

export default HTLCSymbolService;
