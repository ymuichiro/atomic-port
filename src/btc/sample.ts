import * as bitcoin from 'bitcoinjs-lib';
import { btcSwap } from './btcSwap';
import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';

const ECPair = ECPairFactory(ecc);
const aliceWif = 'cNaEjitvA19JZxWAFyCFMsm16TvGEmVAW3AkPnVr8E9vgwdZWMGV';
const bobWif = 'cQBwuzEBYQrbWKFZZFpgitRpdDDxUrT1nzvhDWhxMmFtWdRnrCSm';

// const coininfo = require('coininfo')
// import Mona from "./mona"
// const network = coininfo.monacoin.test.toBitcoinJS()
import BitCoin from './bitcoin';
const network = bitcoin.networks.testnet;
const swap = new btcSwap(new BitCoin(), network);
const Alice = ECPair.fromWIF(aliceWif, network);
const Bob = ECPair.fromWIF(bobWif, network);

const amount = 5000;
const fee = 1800;
// const txId = 'e7693ea8407bb09cad8aea7fbd759155f2a37acde3bdccdcede854529758c16b';
// const contractAddress = 'tb1qfxd5av5ykf85w7selu3y2l2zlg63cglfvhkxgkwagc3m9fyz5jdsautdnr';
// const witnessScript = 'aa20136fa249d3379fa8d0fb98cdd20f1e3eabbe6b9034db5f07bd27109e7278a80e87632103745c9aceb84dcdeddf2c3cdc1edb0b0b5af2f9bf85612d73fa6394758eaee35d6703b6e824b17521027efbabf425077cdbceb73f6681c7ebe2ade74a65ea57ebcf0c42364d3822c59068ac';
// const proof = '5b9dfdefa2a66ca553517ae69629e07670dd5536fba29d97c708fc5f60f45fac';
const lockTime = 2;
swap.lock(lockTime, Alice, Bob, amount, fee);
// swap.withdraw(txId, contractAddress, witnessScript, Bob, proof, fee);
// swap.refund(txId, contractAddress, witnessScript, Alice, fee);
