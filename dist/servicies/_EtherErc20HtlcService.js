"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoService_1 = require("../cores/CryptoService");
const ERC20_json_1 = __importDefault(require("../abis/ERC20.json"));
const HashedTimelockERC20_json_1 = __importDefault(require("../abis/HashedTimelockERC20.json"));
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc20HtlcService extends BaseEvmService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractAddress = "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";
    constructor(provider, contractAddress) {
        super(HashedTimelockERC20_json_1.default.abi, provider ?? _EtherErc20HtlcService.provider, contractAddress ?? _EtherErc20HtlcService.contractAddress);
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, tokenAddress, amount, gasLimit) {
        const erc20TokenContract = new this.web3.eth.Contract(ERC20_json_1.default.abi, tokenAddress);
        // ERC20 や ERC721はまず小切手のようにコントラクトアドレスが受け取るための宣言をapproveによって行います
        // approveの第２引数はAmount
        const approve = await erc20TokenContract.methods.approve(this.contractAddress, amount).send({ from: senderAddress, gas: gasLimit.toString() });
        console.log(approve.events.Approval.returnValues);
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenAddress, amount)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return {
            "contractId": res.events.HTLCERC20New.returnValues.contractId,
            hashPair
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
}
exports.default = _EtherErc20HtlcService;
