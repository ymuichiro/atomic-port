import { Transaction, RepositoryFactoryHttp, Account, NetworkType } from 'symbol-sdk';
import { Contracts } from '../src/cores/Contracts';
import { HashPair } from '../src/models/core';
import HTLCSymbolService from '../src/servicies/HTLCSymbolService';
import { SYMBOL } from './config';

const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
const senderAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.FROM, NetworkType.TEST_NET);

const waitConfirmedTransaction = async (privateKey: string, hash: string) => {
  const repositoryFactory = new RepositoryFactoryHttp(Contracts.symbol.testnet.endpoint);
  const listener = repositoryFactory.createListener();
  const address = Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET).address;
  return new Promise<Transaction>((ok, ng) => {
    listener.open().then(() => {
      listener.newBlock();
      listener.status(address, hash).subscribe({
        next: (v) => {
          console.log('status', v);
          listener.close();
        },
        error: (err) => {
          console.error('status', err);
          listener.close();
        },
      });
      listener.confirmed(address, hash).subscribe({
        next: (v) => {
          console.log('Announcement approved');
          listener.close();
          ok(v);
        },
        error: (err) => {
          console.error(err);
          listener.close();
          ng(err);
        },
      });
    });
  });
};

async function mint(client: HTLCSymbolService) {
  const { hashPair, transaction } = client.mint(recipientAccount.address.plain(), SYMBOL.CURRENCY.MOSAIC_ID, 1);
  const signedTx = await client.sign(SYMBOL.PRIVATEKEY.FROM, transaction);
  console.log('\n', '-'.repeat(5), 'wait until transaction is approved', '-'.repeat(5));
  console.log('From', senderAccount.address.pretty());
  console.log('To', recipientAccount.address.pretty());
  console.log('waiting...', signedTx.hash);
  await waitConfirmedTransaction(SYMBOL.PRIVATEKEY.FROM, signedTx.hash);
  return { signedTx, hashPair };
}

async function withDraw(client: HTLCSymbolService, hashPair: HashPair) {
  const address = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET).address;
  const drawTx = client.withDraw(address.plain(), hashPair.proof, hashPair.secret);
  const signedTx = await client.sign(SYMBOL.PRIVATEKEY.TO, drawTx);
  console.log('waiting...', signedTx.hash);
  await waitConfirmedTransaction(SYMBOL.PRIVATEKEY.TO, signedTx.hash);
  console.log(signedTx);
}

// flow
(async () => {
  const client = new HTLCSymbolService(
    Contracts.symbol.testnet.endpoint,
    NetworkType.TEST_NET,
    Contracts.symbol.testnet.generationHashSeed,
    Contracts.symbol.testnet.epochAdjustment
  );
  const { hashPair, signedTx } = await mint(client);
  console.log('\n', '-'.repeat(5), 'Lock transaction enlistment completed', '-'.repeat(5));
  console.log('> xym transaction hash', signedTx.hash);
  console.log('proof', hashPair.proof, '\nsecret', hashPair.secret);
  console.log('\n', '-'.repeat(5), 'Start withDraws', '-'.repeat(5));
  setTimeout(async () => {
    await withDraw(client, hashPair);
  }, 3 * 1000);
})();
