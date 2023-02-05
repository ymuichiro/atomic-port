import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmHtlc } from '../../../../packages/evm/src';
dotenv.config();

async function lock() {
  // setup
  const { PRIVATEKEY, NETWORK } = ETH;
  const client = new EvmHtlc(NETWORK.TEST.sepolia.native.endpoint, NETWORK.TEST.sepolia.native.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const hashPair = client.createHashPair();
  // lock
  const result = await client.lock(toAddress, fromAddress, hashPair.secret, 1);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.LogHTLCNew.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    contractInfo: await client.getContractInfo(result.events.LogHTLCNew.returnValues.contractId),
  });
}

async function start() {
  await lock();
}

start();
