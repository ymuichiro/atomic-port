"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseHtlcService_1 = __importDefault(require("./BaseHtlcService"));
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherHtlcService extends BaseHtlcService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractAddress = "0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherHtlcService.provider, contractAddress ?? _EtherHtlcService.contractAddress);
    }
}
exports.default = _EtherHtlcService;
