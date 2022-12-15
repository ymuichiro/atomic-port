"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEvmService_1 = __importDefault(require("./BaseEvmService"));
const HashedTimelockERC721_json_1 = __importDefault(require("../abis/HashedTimelockERC721.json"));
/**
 * HTLC operations on the Ethereum Test Net.
 * Passing a value to the constructor will overwrite the specified value.
 */
class _EtherErc721HtlcService extends BaseEvmService_1.default {
    static provider = "https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd";
    static contractId = "0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264";
    constructor(provider, contractId) {
        super(HashedTimelockERC721_json_1.default, provider ?? _EtherErc721HtlcService.provider, contractId ?? _EtherErc721HtlcService.contractId);
    }
}
exports.default = _EtherErc721HtlcService;
