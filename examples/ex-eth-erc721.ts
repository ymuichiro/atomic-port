import { ETH } from './config';
import { HTLCERC721Service } from '../src/servicies/HTLCERC721Service';
import { Contracts } from '../src/models/Contracts';

(async () => {
  // setup
  const { PRIVATEKEY, TOKEN } = ETH;
  const client = new HTLCERC721Service(Contracts.sepolia.erc721.endpoint, Contracts.sepolia.erc721.contractAddress);
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
    contractInfo: await client.getContractInfo(result.events.HTLCERC721New.returnValues.contractId),
  });
  // issue
  const res = await client.withDraw(result.events.HTLCERC721New.returnValues.contractId, toAddress, hashPair.proof);
  console.log('----- Start withDraws -----');
  console.log('withDraw', `https://sepolia.etherscan.io/tx/${res.result.transactionHash}`);
  console.log(await client.getContractInfo(res.result.events.HTLCERC721Withdraw.returnValues.contractId));
})();
