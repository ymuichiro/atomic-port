"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
const HashedTimelockERC20_json_1 = __importDefault(require("../abis/HashedTimelockERC20.json"));
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc20HtlcService extends BaseEvmService_1.default {
    static provider = "https://rpc-mumbai.maticvigil.com";
    static contractId = "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";
    constructor(provider, contractId) {
        super(HashedTimelockERC20_json_1.default, provider ?? _EtherErc20HtlcService.provider, contractId ?? _EtherErc20HtlcService.contractId);
    }
}
exports.default = _EtherErc20HtlcService;
