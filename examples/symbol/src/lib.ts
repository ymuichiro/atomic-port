import { RepositoryFactoryHttp, Address, Transaction } from 'symbol-sdk';

/**
 * wait for transaction to be confirmed
 */
export const waitConfirmedTransaction = async (endpoint: string, fromAddress: Address, hash: string) => {
  const repositoryFactory = new RepositoryFactoryHttp(endpoint);
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
