"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseHtlcService_1 = __importDefault(require("./BaseHtlcService"));
/**
 * HTLC operations on the Polygon Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _PolygonHtlcService extends BaseHtlcService_1.default {
    static provider = "https://rpc-mumbai.maticvigil.com";
    static contractId = "0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B";
    constructor(provider, contractId) {
        super(provider ?? _PolygonHtlcService.provider, contractId ?? _PolygonHtlcService.contractId);
    }
}
exports.default = _PolygonHtlcService;
