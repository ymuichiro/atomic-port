import { ETH } from './config';
import { HTLCService } from '../src/servicies/HTLCService';
import { Contracts } from '../src/models/Contracts';
import { MintOptions } from '../src/models/core';

(async () => {
  // setup
  const { PRIVATEKEY } = ETH;
  const client = new HTLCService(Contracts.sepolia.native.endpoint, Contracts.sepolia.native.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const hashPair = client.createHashPair();
  // mint
  const options: MintOptions = {
    lockSeconds: 50,
  };
  const result = await client.mint(toAddress, fromAddress, hashPair.secret, 1, options);
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
  setTimeout(async () => {
    // 以下をここで行うと期限を過ぎているためエラーとなる
    // const res = await client.withDraw(result.events.LogHTLCNew.returnValues.contractId, toAddress, hashPair.proof);
    const res = await client.refund(result.events.LogHTLCNew.returnValues.contractId, fromAddress);
    console.log('----- Start Refund -----');
    console.log('withDraw', `https://sepolia.etherscan.io/tx/${res.transactionHash}`);
    console.log(await client.getContractInfo(res.events.LogHTLCRefund.returnValues.contractId));
  }, 50000);
})();
