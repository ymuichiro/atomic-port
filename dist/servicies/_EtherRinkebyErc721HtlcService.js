"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErc721HtlcService_1 = __importDefault(require("./BaseErc721HtlcService"));
/**
 * Base class for HTLC operations on each EVM
 */
class _EtherRinkebyErc721HtlcService extends BaseErc721HtlcService_1.default {
    static provider = "https://rpc.ankr.com/eth_rinkeby";
    static contractAddress = "0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd";
    constructor(provider, contractAddress) {
        super(provider ?? _EtherRinkebyErc721HtlcService.provider, contractAddress ?? _EtherRinkebyErc721HtlcService.contractAddress);
    }
}
exports.default = _EtherRinkebyErc721HtlcService;
