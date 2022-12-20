"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
const HashedTimelock_json_1 = __importDefault(require("../abis/HashedTimelock.json"));
const CryptoService_1 = require("../cores/CryptoService");
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherHtlcService extends BaseEvmService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractId = "0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7";
    constructor(provider, contractId) {
        super(HashedTimelock_json_1.default.abi, provider ?? _EtherHtlcService.provider, contractId ?? _EtherHtlcService.contractId);
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, amount, gasLimit) {
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
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
    async withDraw(contractId, senderAddress, secret, gasLimit) {
        const res = await this.contract.methods
            .withdraw(contractId, secret)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return res.events.LogHTLCWithdraw;
    }
}
exports.default = _EtherHtlcService;
