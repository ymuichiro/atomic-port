import dotenv from 'dotenv';
import { waitConfirmedTransaction } from './lib';
import { SYMBOL } from './config';
import { Account, NetworkType } from 'symbol-sdk';
import { SymbolHtlc } from '../../../packages/symbol/src';
dotenv.config();

async function lock() {
  // setup
  const client = new SymbolHtlc(
    SYMBOL.NETWORK.ENDPOINT,
    NetworkType.TEST_NET,
    SYMBOL.NETWORK.GENERATION_HASH_SEED,
    SYMBOL.NETWORK.EPOCH_ADJUSTMENT
  );
  const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
  const senderAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.FROM, NetworkType.TEST_NET);
  const hashPair = client.createHashPair();
  // lock
  const transaction = client.lock(recipientAccount.address.plain(), SYMBOL.CURRENCY.MOSAIC_ID, hashPair.secret, 1);
  const signedTx = await client.sign(SYMBOL.PRIVATEKEY.FROM, transaction);
  console.log('----- wait until transaction is approved -----', {
    fromAddress: senderAccount.address.pretty(),
    toAddress: recipientAccount.address.pretty(),
    transactionHash: signedTx.hash,
    proof: hashPair.proof,
    secret: hashPair.secret,
  });
  // Wait for secret transaction to be approved
  await waitConfirmedTransaction(SYMBOL.NETWORK.ENDPOINT, senderAccount.address, signedTx.hash);
}

async function start() {
  await lock();
}

start();
