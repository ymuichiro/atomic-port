"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const CryptoService_1 = require("../cores/CryptoService");
const HashedTimelockERC20_json_1 = __importDefault(require("../abis/HashedTimelockERC20.json"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc20HtlcServiceTest {
    web3;
    contract;
    constructor() {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider("https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd"));
        this.contract = new this.web3.eth.Contract(HashedTimelockERC20_json_1.default.abi, "0x13cf057B85085972a2FffdB73E952b1F5E850C0d");
    }
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId) {
        return this.contract.methods.getContract(contractId).call();
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, tokenContract, amount, gasLimit) {
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenContract, amount)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return [res.events.HTLCERC20New.returnValues, hashPair];
    }
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    async withDraw(contractId, senderAddress, secret, gasLimit) {
        const res = await this.contract.methods
            .withdraw(contractId, secret)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return res.events.HTLCERC20Withdraw;
    }
}
exports.default = _EtherErc20HtlcServiceTest;
