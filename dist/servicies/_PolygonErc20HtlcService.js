"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoService_1 = require("../cores/CryptoService");
const HashedTimelockERC20_json_1 = __importDefault(require("../abis/HashedTimelockERC20.json"));
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc20HtlcService extends BaseEvmService_1.default {
    static provider = "https://rpc-mumbai.maticvigil.com";
    static contractAddress = "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";
    constructor(provider, contractAddress) {
        super(HashedTimelockERC20_json_1.default.abi, provider ?? _PolygonErc20HtlcService.provider, contractAddress ?? _PolygonErc20HtlcService.contractAddress);
    }
    /**
     * Issue HTLC and obtain the key at the time of issue
     */
    async mint(recipientAddress, senderAddress, lockSeconds, tokenAddress, amount, gasLimit) {
        const hashPair = (0, CryptoService_1.newSecretHashPair)();
        const lockPeriod = Math.floor(Date.now() / 1000) + lockSeconds;
        const res = await this.contract.methods
            .newContract(recipientAddress, hashPair.hash, lockPeriod, tokenAddress, amount)
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
exports.default = _PolygonErc20HtlcService;
