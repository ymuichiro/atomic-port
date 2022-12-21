"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const CryptoService_1 = require("../cores/CryptoService");
const HashedTimelockERC721_json_1 = __importDefault(require("../abis/HashedTimelockERC721.json"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc721HtlcServiceTest {
    web3;
    contract;
    constructor() {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider("https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd"));
        this.contract = new this.web3.eth.Contract(HashedTimelockERC721_json_1.default.abi, "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264");
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
    async mint(recipientAddress, senderAddress, lockSeconds, tokenAddress, tokenId, gasLimit) {
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenAddress, tokenId)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return [res.events.HTLCERC721New.returnValues, hashPair];
    }
    /**
     * Receive tokens stored under the key at the time of HTLC generation
     */
    async withDraw(contractId, senderAddress, secret, gasLimit) {
        const res = await this.contract.methods
            .withdraw(contractId, secret)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return res.events.HTLCERC721Withdraw;
    }
}
exports.default = _EtherErc721HtlcServiceTest;
