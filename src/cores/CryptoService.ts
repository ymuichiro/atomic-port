import crypto from "crypto";
import { sha3_256 as sha3 } from "js-sha3";
import { HashPair } from "../models/CryptoModel";

/**
 * generate proof & secret string for secret hash pair
 */
function bufferToString(buffer: Buffer): string {
  return "0x" + buffer.toString("hex");
}

/**
 * Symbol is subject to two sha256 operations,
 * while ETH and Polygon are subject to only one sha256 operation.
 */
function generateHash(secret: Buffer) {
  return crypto.createHash("sha256").update(secret).digest();
}

export const calcCompositeHash = (secret: string, address: string) => {
  return sha3.create().update(secret).update(address).digest();
};

/**
 * Key pair used for HTLC generation.
 * In case of exchange between Symbols, hashing with SHA256 must be done twice.
 */
export const newSecretHashPair = (): HashPair => {
  const secret = crypto.randomBytes(32);
  const hash = generateHash(generateHash(secret));
  return {
    secret: bufferToString(secret),
    hash: bufferToString(hash),
  };
};
