import { Transaction, RepositoryFactoryHttp, Account, NetworkType } from 'symbol-sdk';
import { Contracts } from '../src/cores/Contracts';
import { HashPair } from '../src/cores/HashPair';
import HTLCSymbolService from '../src/servicies/HTLCSymbolService';
import { SYMBOL } from './config';

const repositoryFactory = new RepositoryFactoryHttp(Contracts.symbol.testnet.endpoint);
const listener = repositoryFactory.createListener();

const getUnresolvedAddress = (privateKey: string) => {
  return Account.createFromPrivateKey(privateKey, NetworkType.TEST_NET).address;
};

const waitConfirmedTransaction = async (privateKey: string, hash: string) => {
  return new Promise<Transaction>((ok, ng) => {
    listener.open().then(() => {
      listener.newBlock();
      listener.confirmed(getUnresolvedAddress(privateKey), hash).subscribe({
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

export async function xymMint(client: HTLCSymbolService, hashPair: HashPair) {
  const { PRIVATEKEY, ADDRESS, CURRENCY } = SYMBOL;
  const tx = client.mint(ADDRESS.RECIPIENT, hashPair, CURRENCY.MOSAIC_ID, 1);
  const signedTx = await client.sign(PRIVATEKEY.FROM, tx);
  console.log('-'.repeat(5), 'wait until transaction is approved', '-'.repeat(5));
  console.log('waiting...', signedTx.hash);
  await waitConfirmedTransaction(PRIVATEKEY.FROM, signedTx.hash);
  return signedTx.hash;
}

export async function xymWithDraw(client: HTLCSymbolService, hashPair: HashPair) {
  const { PRIVATEKEY, ADDRESS } = SYMBOL;
  const drawTx = client.withDraw(ADDRESS.RECIPIENT, hashPair.proofForSymbol, hashPair.secretForSymbol);
  client.sign(PRIVATEKEY.FROM, drawTx).then((e) => {
    console.log('xym announced', e.hash, '\n', client.getHash(hashPair.secretForSymbol, ADDRESS.RECIPIENT));
  });
}
