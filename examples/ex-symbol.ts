import { Transaction, RepositoryFactoryHttp, Account, NetworkType, Address } from 'symbol-sdk';
import { Contracts } from '../src/models/Contracts';
import HTLCSymbolService from '../src/servicies/HTLCSymbolService';
import { SYMBOL } from './config';

const waitConfirmedTransaction = async (fromAddress: Address, hash: string) => {
  const repositoryFactory = new RepositoryFactoryHttp(Contracts.symbol.testnet.endpoint);
  const listener = repositoryFactory.createListener();
  return new Promise<Transaction>((ok, ng) => {
    listener.open().then(() => {
      listener.newBlock();
      listener.confirmed(fromAddress, hash).subscribe({
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

(async () => {
  // setup
  const client = new HTLCSymbolService(
    Contracts.symbol.testnet.endpoint,
    NetworkType.TEST_NET,
    Contracts.symbol.testnet.generationHashSeed,
    Contracts.symbol.testnet.epochAdjustment
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
  await waitConfirmedTransaction(senderAccount.address, signedTx.hash);
  setTimeout(async () => {
    const drawTx = client.withDraw(recipientAccount.address.plain(), hashPair.proof, hashPair.secret);
    const signedTx = await client.sign(recipientAccount.privateKey, drawTx);
    console.log('waiting...', signedTx.hash);
    await waitConfirmedTransaction(recipientAccount.address, signedTx.hash);
    console.log(signedTx);
  }, 3000);
})();
