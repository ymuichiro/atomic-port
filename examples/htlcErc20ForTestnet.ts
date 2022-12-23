import { ETH } from './config';
import { HTLCERC20Service } from '../src/servicies/HTLCERC20Service';
import { Contracts } from '../src/cores/Contracts';

(async () => {
  // setup
  const { PRIVATEKEY, TOKEN } = ETH;
  const client = new HTLCERC20Service(Contracts.sepolia.erc20.endpoint, Contracts.sepolia.erc20.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  // mint
  const { result, hashPair } = await client.mint(toAddress, fromAddress, 1, TOKEN.ALICE);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.HTLCERC20New.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    contractInfo: await client.getContractInfo(result.events.HTLCERC20New.returnValues.contractId),
  });
  // issue
  const res = await client.withDraw(result.events.HTLCERC20New.returnValues.contractId, toAddress, hashPair.proof);
  console.log('----- Start withDraws -----');
  console.log('withDraw', `https://sepolia.etherscan.io/tx/${res.result.transactionHash}`);
  console.log(await client.getContractInfo(res.result.events.HTLCERC20Withdraw.returnValues.contractId));
})();
