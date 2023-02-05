import dotenv from 'dotenv';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { MonaHtlc } from '../../../packages/mona/src';
import { MONA } from './config';
dotenv.config();

async function withDraw(hash: string, contractAddress: string, witnessScript: string, proof: string) {
  const { WIF } = MONA;
  const ECPair = ECPairFactory(ecc);
  const Bob = ECPair.fromWIF(WIF.TO, bitcoin.networks.testnet);
  const swap = new MonaHtlc(bitcoin.networks.testnet);
  return await swap.withdraw(hash, contractAddress, witnessScript, Bob, proof, { fee: 100000 });
}

async function start() {
  const hash = '************************';
  const contractAddress = '************************';
  const witnessScript = '************************';
  const proof = '************************';
  await withDraw(hash, contractAddress, witnessScript, proof);
}

start();
