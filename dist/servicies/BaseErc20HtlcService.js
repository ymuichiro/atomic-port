"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const HashedTimelockERC20_json_1 = __importDefault(require("../abis/HashedTimelockERC20.json"));
const ERC20_json_1 = __importDefault(require("../abis/ERC20.json"));
const CryptoService_1 = require("../cores/CryptoService");
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class BaseErc20HtlcService {
    web3;
    contract;
    contractAddress;
    constructor(provider, contractAddress) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(provider));
        this.contract = new this.web3.eth.Contract(HashedTimelockERC20_json_1.default.abi, contractAddress);
        this.contractAddress = contractAddress;
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, amount, gasLimit, tokenAddress) {
        const erc20TokenContract = new this.web3.eth.Contract(ERC20_json_1.default.abi, tokenAddress);
        // ERC20 や ERC721はまず小切手のようにコントラクトアドレスが受け取るための宣言をapproveによって行います
        // approveの第２引数はAmount
        const approve = await erc20TokenContract.methods
            .approve(this.contractAddress, amount)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        console.log(approve.events.Approval.returnValues);
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenAddress, amount)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return {
            contractId: res.events.HTLCERC20New.returnValues.contractId,
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
        return res.events.HTLCERC20Withdraw;
    }
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId) {
        return this.contract.methods.getContract(contractId).call();
    }
}
exports.default = BaseErc20HtlcService;
