"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc721HtlcService_1 = __importDefault(require("./BaseErc721HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _PolygonErc721HtlcService extends BaseErc721HtlcService_1.default {
    static provider = "https://rpc-mumbai.maticvigil.com";
    static contractAddress = "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";
    constructor(provider, contractAddress) {
        super(provider ?? _PolygonErc721HtlcService.provider, contractAddress ?? _PolygonErc721HtlcService.contractAddress);
    }
}
exports.default = _PolygonErc721HtlcService;
