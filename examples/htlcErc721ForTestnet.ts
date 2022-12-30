import { ETH } from './config';
import { HTLCERC721Service } from '../src/servicies/HTLCERC721Service';
import { Contracts } from '../src/cores/Contracts';
import { HashPair } from '../src/models/core';

async function mint(client: HTLCERC721Service) {
  const { PRIVATEKEY, TOKEN } = ETH;
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  console.log('evm from:', fromAddress);
  console.log('evm to  :', toAddress);
  const { contractId, hashPair } = await client.mint(toAddress, fromAddress, 1, TOKEN.ALICE);
  console.log(await client.getContractInfo(contractId));
  return { toAddress, contractId, hashPair };
}

async function withDraw(client: HTLCERC721Service, contractId: string, toAddress: string, hashPair: HashPair) {
  await client.withDraw(contractId, toAddress, hashPair.secret);
  console.log(await client.getContractInfo(contractId));
}

// flow
(async () => {
  // issue
  const client = new HTLCERC721Service(Contracts.sepolia.erc721.endpoint, Contracts.sepolia.erc721.contractAddress);
  const { contractId, hashPair, toAddress } = await mint(client);
  console.log('-'.repeat(5), 'Lock transaction enlistment completed', '-'.repeat(5));
  console.log('\n> evm contract id', contractId);
  console.log('proof', hashPair.proof, '\nsecret', hashPair.secret);

  console.log('-'.repeat(5), 'Start withDraws', '-'.repeat(5));
  withDraw(client, contractId, toAddress, hashPair);
})();
