"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoService_1 = require("../cores/CryptoService");
const symbol_sdk_1 = require("symbol-sdk");
const rxjs_1 = require("rxjs");
class SymbolService {
    node;
    networkType;
    generationHashSeed;
    currencyMosaicId;
    epochAdjustment;
    constructor(node, networkType, generationHashSeed, currencyMosaicId, epochAdjustment) {
        this.node = node;
        this.networkType = networkType;
        this.generationHashSeed = generationHashSeed;
        this.currencyMosaicId = currencyMosaicId;
        this.epochAdjustment = epochAdjustment;
    }
    async secretLockTransaction(senderPrivateKey, recipientAddress, mosaicId, amount, duration) {
        const repo = new symbol_sdk_1.RepositoryFactoryHttp(this.node);
        const txRepo = repo.createTransactionRepository();
        const deadline = symbol_sdk_1.Deadline.create(this.epochAdjustment);
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const secret = hashPair.hash.toUpperCase().replace("0X", "");
        const sender = symbol_sdk_1.Account.createFromPrivateKey(senderPrivateKey, this.networkType);
        const secretLockTransaction = symbol_sdk_1.SecretLockTransaction.create(deadline, new symbol_sdk_1.Mosaic(new symbol_sdk_1.MosaicId(mosaicId), symbol_sdk_1.UInt64.fromUint(amount)), symbol_sdk_1.UInt64.fromUint(duration), symbol_sdk_1.LockHashAlgorithm.Op_Hash_256, secret, symbol_sdk_1.Address.createFromRawAddress(recipientAddress), this.networkType).setMaxFee(100);
        const compositeHash = symbol_sdk_1.Convert.uint8ToHex(this.compositeHash(symbol_sdk_1.Convert.hexToUint8(secret), symbol_sdk_1.RawAddress.stringToAddress(recipientAddress)));
        const signedTransaction = sender.sign(secretLockTransaction, this.generationHashSeed);
        const res = await (0, rxjs_1.firstValueFrom)(txRepo.announce(signedTransaction));
        return {
            message: res,
            hashPair,
            compositeHash,
        };
    }
    async secretProofTransaction(senderPrivateKey, recipientAddress, proof, secret) {
        const repo = new symbol_sdk_1.RepositoryFactoryHttp(this.node);
        const txRepo = repo.createTransactionRepository();
        const deadline = symbol_sdk_1.Deadline.create(this.epochAdjustment);
        const sender = symbol_sdk_1.Account.createFromPrivateKey(senderPrivateKey, this.networkType);
        const secretProofTransaction = symbol_sdk_1.SecretProofTransaction.create(deadline, symbol_sdk_1.LockHashAlgorithm.Op_Hash_256, secret.replace("0x", ""), symbol_sdk_1.Address.createFromRawAddress(recipientAddress), proof.replace("0x", ""), this.networkType).setMaxFee(100);
        const signedTransaction = sender.sign(secretProofTransaction, this.generationHashSeed);
        const res = await (0, rxjs_1.firstValueFrom)(txRepo.announce(signedTransaction));
        return {
            message: await res,
            hashPair: {
                proof,
                secret,
            },
        };
    }
    async getLockTransaction(compositeHash) {
        const repo = new symbol_sdk_1.RepositoryFactoryHttp(this.node);
        const secretLockRepo = repo.createSecretLockRepository();
        return await (0, rxjs_1.firstValueFrom)(secretLockRepo.getSecretLock(compositeHash));
    }
    compositeHash = (secret, address) => {
        return (0, CryptoService_1.calcCompositeHash)(secret, address);
    };
}
exports.default = SymbolService;
