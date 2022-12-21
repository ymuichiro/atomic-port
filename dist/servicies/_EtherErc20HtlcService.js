"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc20HtlcService_1 = __importDefault(require("./BaseErc20HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherErc20HtlcService extends BaseErc20HtlcService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractAddress = "0x13cf057B85085972a2FffdB73E952b1F5E850C0d";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherErc20HtlcService.provider, contractAddress ?? _EtherErc20HtlcService.contractAddress);
    }
}
exports.default = _EtherErc20HtlcService;
