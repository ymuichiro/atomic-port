import { ETH, SYMBOL } from './config';
import { NetworkType } from 'symbol-sdk/dist/src/model/network/NetworkType';
import EthService from '../src/servicies/_EtherRinkebyErc20HtlcService';
import SymbolService from '../src/servicies/SymbolService';
import HashPair from '../src/cores/HashPair';

function clients() {
  const { NETWORK } = SYMBOL;
  return {
    evmClient: new EthService(),
    xymClient: new SymbolService(
      NETWORK.NODE,
      NetworkType.TEST_NET,
      NETWORK.GENERATION_HASH_SEED,
      NETWORK.EPOCH_ADJUSTMENT
    ),
  };
}

async function evmMint(client: EthService, hashPair: HashPair) {
  const { PRIVATEKEY, TOKEN } = ETH;
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  console.log('evm from:', fromAddress);
  console.log('evm to  :', toAddress);
  const contractId = await client.mint(toAddress, fromAddress, hashPair, 1, TOKEN.JPYC);
  console.log(await client.getContractInfo(contractId));
  return { toAddress, contractId };
}

async function evmWithDraw(client: EthService, contractId: string, toAddress: string, hashPair: HashPair) {
  await client.withDraw(contractId, toAddress, hashPair.secretForEvm);
  console.log(await client.getContractInfo(contractId));
}

async function xymMint(client: SymbolService, hashPair: HashPair) {
  const { PRIVATEKEY, ADDRESS, NETWORK } = SYMBOL;
  const tx = client.mint(ADDRESS.RECIPIENT, hashPair, NETWORK.MOSAIC_ID, 1);
  await client.sign(PRIVATEKEY.FROM, tx);
  return client.getHash(hashPair.secretForSymbol, ADDRESS.RECIPIENT);
}

async function xymWithDraw(client: SymbolService, hashPair: HashPair) {
  const { PRIVATEKEY, ADDRESS } = SYMBOL;
  const drawTx = client.withDraw(ADDRESS.RECIPIENT, hashPair.proofForSymbol, hashPair.secretForSymbol);
  client.sign(PRIVATEKEY.FROM, drawTx).then((e) => {
    console.log('xym announced', e.message, client.getHash(hashPair.secretForSymbol, ADDRESS.RECIPIENT));
  });
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
