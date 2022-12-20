"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoService_1 = require("../cores/CryptoService");
const ERC721_json_1 = __importDefault(require("../abis/ERC721.json"));
const HashedTimelockERC721_json_1 = __importDefault(require("../abis/HashedTimelockERC721.json"));
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc721HtlcService extends BaseEvmService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractAddress = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider, contractAddress) {
        super(HashedTimelockERC721_json_1.default.abi, provider ?? _EtherErc721HtlcService.provider, contractAddress ?? _EtherErc721HtlcService.contractAddress);
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, tokenAddress, tokenId, gasLimit) {
        const erc721TokenContract = new this.web3.eth.Contract(ERC721_json_1.default.abi, tokenAddress);
        const approve = await erc721TokenContract.methods.approve(this.contractAddress, tokenId).send({ from: senderAddress, gas: gasLimit.toString() });
        console.log(approve.events.Approval.returnValues);
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenAddress, tokenId)
            .send({ from: senderAddress, gas: gasLimit.toString() });
        return {
            "contractId": res.events.HTLCERC721New.returnValues.contractId,
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
        return res.events.HTLCERC721Withdraw;
    }
}
exports.default = _EtherErc721HtlcService;
