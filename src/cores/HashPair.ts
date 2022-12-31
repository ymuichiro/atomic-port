import crypto from 'crypto';
import { HashPair } from '../models/core';

/**
 * create a new hash pair
 * If you specify an existing secret or proof in the constructor, take over that value
 */
export function createHashPairForEvm(): HashPair {
  const s = crypto.randomBytes(32);
  const p1 = crypto.createHash('sha256').update(s).digest();
  const p2 = crypto.createHash('sha256').update(p1).digest();
  return {
    proof: '0x' + p2.toString('hex'),
    secret: '0x' + s.toString('hex'),
  };
}

/**
 * create a new hash pair
 * If you specify an existing secret or proof in the constructor, take over that value
 */
export function createHashPairForSymbol(): HashPair {
  const s = crypto.randomBytes(32);
  const p1 = crypto.createHash('sha256').update(s).digest();
  const p2 = crypto.createHash('sha256').update(p1).digest();
  return {
    proof: s.toString('hex').toUpperCase(),
    secret: p2.toString('hex').toUpperCase(),
  };
}
