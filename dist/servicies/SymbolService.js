"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoService_1 = require("../cores/CryptoService");
const SymbolFacade_1 = require("symbol-sdk/src/facade/SymbolFacade");
const KeyPair_1 = require("symbol-sdk/src/symbol/KeyPair");
const NetworkTimestamp_1 = require("symbol-sdk/src/symbol/NetworkTimestamp");
const models_1 = require("symbol-sdk/src/symbol/models");
const converter_1 = require("symbol-sdk/src/utils/converter");
const CryptoTypes_1 = require("symbol-sdk/src/CryptoTypes");
const Network_1 = require("symbol-sdk/src/symbol/Network");
class SymbolService {
    facade;
    node;
    constructor(network, node) {
        this.facade = (0, SymbolFacade_1.SymbolFacade)(network);
        this.node = node;
    }
    async secretLockTransaction(senderPrivateKey, recipientAddress, mosaicId, amount, duration) {
        this.facade;
        const privateKey = new CryptoTypes_1.PrivateKey(senderPrivateKey);
        const keyPair = new KeyPair_1.KeyPair(privateKey);
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const deadline = new NetworkTimestamp_1.NetworkTimestamp(this.facade.network.fromDatetime(Date.now())).addHours(2).timestamp;
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
        const compositeHash = converter_1.converter.uint8ToHex(this.compositeHash(converter_1.converter.hexToUint8(secret), new Network_1.Address(recipientAddress).bytes));
        secretLockTransaction.fee = new models_1.Amount(BigInt(secretLockTransaction.size * 100));
        const signature = this.facade.signTransaction(keyPair, secretLockTransaction);
        const jsonPayload = this.facade.transactionFactory.constructor.attachSignature(secretLockTransaction, signature);
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
    async getLockTransaction(compositeHash) {
        return await fetch(this.node + "/lock/secret/" + compositeHash, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        });
    }
    compositeHash = (secret, address) => {
        return (0, CryptoService_1.calcCompositeHash)(secret, address);
    };
}
exports.default = SymbolService;
