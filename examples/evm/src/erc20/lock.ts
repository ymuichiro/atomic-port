import dotenv from 'dotenv';
import { ETH } from '../config';
dotenv.config();

async function lock() {
  // setup
  const { PRIVATEKEY, NETWORK, TOKEN } = ETH;
  const client = new HTLCService(NETWORK.TEST.sepolia.erc20.endpoint, NETWORK.TEST.sepolia.erc20.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const hashPair = client.createHashPair();
  // lock
  const result = await client.lock(toAddress, fromAddress, hashPair.secret, 1, TOKEN.ALICE);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.HTLCERC20New.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    contractInfo: await client.getContractInfo(result.events.HTLCERC20New.returnValues.contractId),
  });
}

async function start() {
  await lock();
}

start();
