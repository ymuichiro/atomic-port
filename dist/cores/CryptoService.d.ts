import { HashPair } from "../models/CryptoModel";
export declare const calcCompositeHash: (secret: string, address: string) => number[];
/**
 * Key pair used for HTLC generation.
 * In case of exchange between Symbols, hashing with SHA256 must be done twice.
 */
export declare const newSecretHashPair: () => HashPair;
