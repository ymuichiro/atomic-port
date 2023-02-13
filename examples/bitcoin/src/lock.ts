import dotenv from 'dotenv';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { BitcoinHtlc } from '../../../packages/bitcoin/src/BitcoinHtlc';
import { BITCOIN } from './config';
dotenv.config();

async function lock() {
  const ECPair = ECPairFactory(ecc);
  const { WIF } = BITCOIN;

  const Alice = ECPair.fromWIF(WIF.FROM, bitcoin.networks.testnet);
  const Bob = ECPair.fromWIF(WIF.TO, bitcoin.networks.testnet);
  const swap = new BitcoinHtlc(bitcoin.networks.testnet);

  const hashPair = swap.createHashPair();
  const lock = await swap.lock(Alice, Bob, hashPair.secret, 5000, { fee: 1800, lockHeight: 2 });
  console.log({ hashPair, lock });
}
async function start() {
  await lock();
}

start();
