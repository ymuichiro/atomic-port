import dotenv from 'dotenv';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { BitcoinHtlc } from '../../../packages/bitcoin/src/BitcoinHtlc';
import { BITCOIN } from './config';
dotenv.config();

async function withDraw(hash: string, contractAddress: string, witnessScript: string, proof: string) {
  const { WIF } = BITCOIN;
  const ECPair = ECPairFactory(ecc);
  const Bob = ECPair.fromWIF(WIF.TO, bitcoin.networks.testnet);
  const swap = new BitcoinHtlc(bitcoin.networks.testnet);
  return await swap.withdraw(hash, contractAddress, witnessScript, Bob, proof);
}

async function start() {
  const hash = '************************';
  const contractAddress = '************************';
  const witnessScript = '************************';
  const proof = '************************';
  await withDraw(hash, contractAddress, witnessScript, proof);
}

start();
