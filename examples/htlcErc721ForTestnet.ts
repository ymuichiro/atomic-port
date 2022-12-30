import { ETH } from './config';
import { NetworkType } from 'symbol-sdk/dist/src/model/network/NetworkType';
import { HTLCERC721Service } from '../src/servicies/HTLCERC721Service';
import HTLCSymbolService from '../src/servicies/HTLCSymbolService';
import { HashPair } from '../src/cores/HashPair';
import { Contracts } from '../src/cores/Contracts';
import { xymMint, xymWithDraw } from './htlcSymbolTestNet';

function clients() {
  return {
    evmClient: new HTLCERC721Service(Contracts.sepolia.erc721.endpoint, Contracts.sepolia.erc721.contractAddress),
    xymClient: new HTLCSymbolService(
      Contracts.symbol.testnet.endpoint,
      NetworkType.TEST_NET,
      Contracts.symbol.testnet.generationHashSeed,
      Contracts.symbol.testnet.epochAdjustment
    ),
  };
}

async function evmMint(client: HTLCERC721Service, hashPair: HashPair) {
  const { PRIVATEKEY, TOKEN } = ETH;
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  console.log('evm from:', fromAddress);
  console.log('evm to  :', toAddress);
  const contractId = await client.mint(toAddress, fromAddress, hashPair, 1, TOKEN.ALICE);
  console.log(await client.getContractInfo(contractId));
  return { toAddress, contractId };
}

async function evmWithDraw(client: HTLCERC721Service, contractId: string, toAddress: string, hashPair: HashPair) {
  await client.withDraw(contractId, toAddress, hashPair.secretForEvm);
  console.log(await client.getContractInfo(contractId));
}

// flow
(async () => {
  // issue
  const { evmClient, xymClient } = clients();
  const hashPair = new HashPair();
  const [evm, xym] = await Promise.all([evmMint(evmClient, hashPair), xymMint(xymClient, hashPair)]);
  console.log('-'.repeat(5), 'Lock transaction enlistment completed', '-'.repeat(5));
  console.log('xym transaction hash', xym, '\nproof', hashPair.proofForSymbol, '\nsecret', hashPair.secretForSymbol);
  console.log('evm contract id', evm.contractId, '\nproof', hashPair.proofForEvm, '\nsecret', hashPair.secretForEvm);

  console.log('-'.repeat(5), 'Start withDraws', '-'.repeat(5));
  xymWithDraw(xymClient, hashPair);
  evmWithDraw(evmClient, evm.contractId, evm.toAddress, hashPair);
})();
