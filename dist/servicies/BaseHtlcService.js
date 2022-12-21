"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const HashedTimelock_json_1 = __importDefault(require("../abis/HashedTimelock.json"));
const CryptoService_1 = require("../cores/CryptoService");
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class BaseHtlcService {
    web3;
    contract;
    contractAddress;
    constructor(provider, contractAddress) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(provider));
        this.contract = new this.web3.eth.Contract(HashedTimelock_json_1.default.abi, contractAddress);
        this.contractAddress = contractAddress;
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
        return {
            contractId: res.events.LogHTLCNew.returnValues.contractId,
            hashPair,
        };
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
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId) {
        return this.contract.methods.getContract(contractId).call();
    }
}
exports.default = BaseHtlcService;
