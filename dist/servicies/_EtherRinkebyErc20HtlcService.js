"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc20HtlcService_1 = __importDefault(require("./BaseErc20HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherRinkebyErc20HtlcService extends BaseErc20HtlcService_1.default {
    static provider = "https://rpc.ankr.com/eth_rinkeby";
    static contractAddress = "0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherRinkebyErc20HtlcService.provider, contractAddress ?? _EtherRinkebyErc20HtlcService.contractAddress);
    }
}
exports.default = _EtherRinkebyErc20HtlcService;
