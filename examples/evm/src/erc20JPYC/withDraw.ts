import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmErc20Htlc } from '../../../../packages/evm/src';
dotenv.config();

async function withDraw(contractId: string, proof: string) {
  const { PRIVATEKEY, NETWORK } = ETH;
  const client = new EvmErc20Htlc(NETWORK.TEST.rinkeby.erc20.endpoint, NETWORK.TEST.rinkeby.erc20.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const res = await client.withDraw(contractId, toAddress, proof);
  console.log(
    `----- Start withDraws https://sepolia.etherscan.io/tx/${res.result.transactionHash} -----`,
    await client.getContractInfo(res.result.events.HTLCERC20Withdraw.returnValues.contractId)
  );
}

async function start() {
  const contractId = '************************';
  const proof = '************************';
  await withDraw(contractId, proof);
}

start();
