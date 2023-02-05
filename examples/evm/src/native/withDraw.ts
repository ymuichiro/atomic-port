import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmHtlc } from '../../../../packages/evm/src';
dotenv.config();

async function withDraw(contractId: string, proof: string) {
  const { PRIVATEKEY, NETWORK } = ETH;
  const client = new EvmHtlc(NETWORK.TEST.sepolia.native.endpoint, NETWORK.TEST.sepolia.native.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const res = await client.withDraw(contractId, toAddress, proof);
  console.log(
    `----- Start withDraws https://sepolia.etherscan.io/tx/${res.result.transactionHash} -----`,
    await client.getContractInfo(res.result.events.LogHTLCWithdraw.returnValues.contractId)
  );
}

async function start() {
  const contractId = '************************';
  const proof = '************************';
  await withDraw(contractId, proof);
}

start();
