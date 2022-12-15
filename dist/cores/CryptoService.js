"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSecretHashPair = exports.calcCompositeHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const js_sha3_1 = require("js-sha3");
/**
 * generate proof & secret string for secret hash pair
 */
function bufferToString(buffer) {
    return "0x" + buffer.toString("hex");
}
/**
 * Symbol is subject to two sha256 operations,
 * while ETH and Polygon are subject to only one sha256 operation.
 */
function generateHash(secret) {
    return crypto_1.default.createHash("sha256").update(secret).digest();
}
const calcCompositeHash = (secret, address) => {
    return js_sha3_1.sha3_256.create().update(secret).update(address).digest();
};
exports.calcCompositeHash = calcCompositeHash;
/**
 * Key pair used for HTLC generation.
 * In case of exchange between Symbols, hashing with SHA256 must be done twice.
 */
const newSecretHashPair = () => {
    const secret = crypto_1.default.randomBytes(32);
    const hash = generateHash(generateHash(secret));
    return {
        secret: bufferToString(secret),
        hash: bufferToString(hash),
    };
};
exports.newSecretHashPair = newSecretHashPair;
