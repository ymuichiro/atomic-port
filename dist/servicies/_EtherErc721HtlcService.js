"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc721HtlcService_1 = __importDefault(require("./BaseErc721HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc721HtlcService extends BaseErc721HtlcService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractAddress = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherErc721HtlcService.provider, contractAddress ?? _EtherErc721HtlcService.contractAddress);
    }
}
exports.default = _EtherErc721HtlcService;
