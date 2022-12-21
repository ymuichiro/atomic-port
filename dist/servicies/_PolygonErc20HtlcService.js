"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc20HtlcService_1 = __importDefault(require("./BaseErc20HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc20HtlcService extends BaseErc20HtlcService_1.default {
    static provider = "https://rpc-mumbai.maticvigil.com";
    static contractAddress = "0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC";
    constructor(provider, contractAddress) {
        super(provider ?? _PolygonErc20HtlcService.provider, contractAddress ?? _PolygonErc20HtlcService.contractAddress);
    }
}
exports.default = _PolygonErc20HtlcService;
