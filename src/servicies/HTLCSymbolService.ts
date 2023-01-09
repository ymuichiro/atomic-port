import crypto from 'crypto';
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
import { sha3_256 as sha3 } from 'js-sha3';
import { RawAddress } from 'symbol-sdk/dist/src/core/format/RawAddress';
import { Transaction } from 'symbol-sdk/dist/src/model/transaction/Transaction';
import { SignedTransaction } from 'symbol-sdk/dist/src/model/transaction/SignedTransaction';
import { LockOptions } from '../models/core';
import { HashPair } from '../models/core';

/**
 * Handles secret locks and secret proofs in Symbol
 * Create a key with `createHashPair` --> issue a lock transaction with `mint` --> unlock with `withDraw`.
 */
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
   * create a new hash pair
   * If you specify an existing secret or proof in the constructor, take over that value
   */
  public createHashPair(): HashPair {
    const s = crypto.randomBytes(32);
    const p1 = crypto.createHash('sha256').update(s).digest();
    const p2 = crypto.createHash('sha256').update(p1).digest();
    return {
      proof: s.toString('hex').toUpperCase(),
      secret: p2.toString('hex').toUpperCase(),
    };
  }

  /**
   * Issue a secret lock and return the results and key.
   */
  public lock(
    recipientAddress: string,
    mosaicId: string,
    secret: string,
    amount: number,
    options?: LockOptions
  ): SecretLockTransaction {
    return SecretLockTransaction.create(
      Deadline.create(this.epochAdjustment),
      new Mosaic(new MosaicId(mosaicId), UInt64.fromUint(amount)),
      UInt64.fromUint(options?.lockSeconds ?? 5760),
      LockHashAlgorithm.Op_Hash_256,
      secret,
      Address.createFromRawAddress(recipientAddress),
      this.networkType
    ).setMaxFee(options?.gasLimit ?? 100) as SecretLockTransaction;
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

  public async getLockTransaction(compositeHash: string): Promise<SecretLockInfo> {
    const repo = new RepositoryFactoryHttp(this.node);
    const secretLockRepo = repo.createSecretLockRepository();
    return await firstValueFrom(secretLockRepo.getSecretLock(compositeHash));
  }
}

export default HTLCSymbolService;
