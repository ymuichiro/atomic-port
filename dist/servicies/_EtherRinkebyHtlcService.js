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
class _EtherRinkebyHtlcService extends BaseHtlcService_1.default {
    static provider = "https://rpc.ankr.com/eth_rinkeby";
    static contractAddress = "0x97ED40C207bf3B6dE4DB27E37E1989f3756E71f4";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherRinkebyHtlcService.provider, contractAddress ?? _EtherRinkebyHtlcService.contractAddress);
    }
}
exports.default = _EtherRinkebyHtlcService;
