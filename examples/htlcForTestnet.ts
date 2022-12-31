import { ETH } from './config';
import { HTLCService } from '../src/servicies/HTLCService';
import { Contracts } from '../src/cores/Contracts';

(async () => {
  // setup
  const { PRIVATEKEY } = ETH;
  const client = new HTLCService(Contracts.sepolia.native.endpoint, Contracts.sepolia.native.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  // mint
  const { result, hashPair } = await client.mint(toAddress, fromAddress, 1);
  console.log('----- Lock transaction enlistment completed -----', {
    fromAddress: fromAddress,
    toAddress: toAddress,
    contractId: result.events.LogHTLCNew.returnValues.contractId,
    transactionHash: result.transactionHash,
    proof: hashPair.proof,
    secret: hashPair.secret,
    contractInfo: await client.getContractInfo(result.events.LogHTLCNew.returnValues.contractId),
  });
  // issue
  const res = await client.withDraw(result.events.LogHTLCNew.returnValues.contractId, toAddress, hashPair.proof);
  console.log('----- Start withDraws -----');
  console.log('withDraw', `https://sepolia.etherscan.io/tx/${res.result.transactionHash}`);
  console.log(await client.getContractInfo(res.result.events.LogHTLCWithdraw.returnValues.contractId));
})();
