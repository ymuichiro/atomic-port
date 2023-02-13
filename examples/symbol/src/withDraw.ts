import dotenv from 'dotenv';
import { waitConfirmedTransaction } from './lib';
import { SYMBOL } from './config';
import { Account, NetworkType } from 'symbol-sdk';
import { SymbolHtlc } from '../../../packages/symbol/src';
dotenv.config();

async function withDraw(proof: string, secret: string) {
  const client = new SymbolHtlc(
    SYMBOL.NETWORK.ENDPOINT,
    NetworkType.TEST_NET,
    SYMBOL.NETWORK.GENERATION_HASH_SEED,
    SYMBOL.NETWORK.EPOCH_ADJUSTMENT
  );
  const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
  const drawTx = client.withDraw(recipientAccount.address.plain(), proof, secret);
  const signedTx = await client.sign(recipientAccount.privateKey, drawTx);
  console.log('waiting...', signedTx.hash);
  await waitConfirmedTransaction(SYMBOL.NETWORK.ENDPOINT, recipientAccount.address, signedTx.hash);
  console.log(signedTx);
}

async function start() {
  const proof = '************************';
  const secret = '************************';
  await withDraw(proof, secret);
}

start();
