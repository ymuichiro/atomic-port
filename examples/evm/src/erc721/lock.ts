import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmErc721Htlc } from '../../../../packages/evm/src';
dotenv.config();

async function lock() {
  // setup
  const { PRIVATEKEY, NETWORK, TOKEN } = ETH;
  const client = new EvmErc721Htlc(NETWORK.TEST.sepolia.erc721.endpoint, NETWORK.TEST.sepolia.erc721.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const hashPair = client.createHashPair();
  // create token for test
  const tokenId = Math.floor(1000 * Math.random() * 10); // Once used, the Id is not available
  const newToken = await client.createToken(TOKEN.ERC721, fromAddress, tokenId);
  // lock
  const result = await client.lock(toAddress, fromAddress, hashPair.secret, Number(newToken.tokenId), TOKEN.ERC721);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.HTLCERC721New.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    tokenId: Number(newToken.tokenId),
    contractInfo: await client.getContractInfo(result.events.HTLCERC721New.returnValues.contractId),
  });
}

async function start() {
  await lock();
}

start();
