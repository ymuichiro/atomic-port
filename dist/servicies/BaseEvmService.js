"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
/**
 * Base class for HTLC operations on each EVM
 */
class BaseEvmService {
    web3;
    contract;
    contractAddress;
    constructor(abi, provider, contractAddress) {
        this.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(provider));
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
        this.contractAddress = contractAddress;
    }
    /**
     * Obtain contract information for the current instance
     */
    getContractInfo(contractId) {
        return this.contract.methods.getContract(contractId).call();
    }
}
exports.default = BaseEvmService;
