"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const CryptoService_1 = require("../cores/CryptoService");
/**
 * Base class for HTLC operations on each EVM
 */
class BaseEvmService {
    web3;
    contract;
    contractId;
    constructor(abi, provider, contractAddress) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(provider));
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
        this.contractId = contractAddress;
    }
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo() {
        return this.contract.methods.getContract(this.contractId).call();
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
        return [res.event.LogHTLCNew.returnValues, hashPair];
    }
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    async withDraw(senderAddress, secret, gasLimit) {
        const res = await this.contract.methods
            .withdraw(this.contractId, secret)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return res.events.LogHTLCWithdraw;
    }
}
exports.default = BaseEvmService;
