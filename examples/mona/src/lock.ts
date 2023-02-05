import dotenv from 'dotenv';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import coininfo from 'coininfo';
import { MonaHtlc } from '../../../packages/mona/src';
import { MONA } from './config';
dotenv.config();
const network = coininfo.monacoin.test.toBitcoinJS();

async function lock() {
  const ECPair = ECPairFactory(ecc);
  const { WIF } = MONA;

  const Alice = ECPair.fromWIF(WIF.FROM, network);
  const Bob = ECPair.fromWIF(WIF.TO, network);
  const swap = new MonaHtlc(network);

  const hashPair = swap.createHashPair();
  const lock = await swap.lock(Alice, Bob, hashPair.secret, 4900000, { fee: 100000, lockHeight: 2 });
  console.log({ hashPair, lock });
}
async function start() {
  await lock();
}

start();
