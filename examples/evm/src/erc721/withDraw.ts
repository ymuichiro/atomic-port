import dotenv from 'dotenv';
import { ETH } from '../config';
import { EvmErc721Htlc } from '../../../../packages/evm/src';
dotenv.config();

async function withDraw(contractId: string, proof: string) {
  const { PRIVATEKEY, NETWORK } = ETH;
  const client = new EvmErc721Htlc(NETWORK.TEST.sepolia.erc721.endpoint, NETWORK.TEST.sepolia.erc721.contractAddress);
  const AccountService = client.web3.eth.accounts;
  const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
  const res = await client.withDraw(contractId, toAddress, proof);
  console.log(
    `----- Start withDraws https://sepolia.etherscan.io/tx/${res.result.transactionHash} -----`,
    await client.getContractInfo(res.result.events.HTLCERC721Withdraw.returnValues.contractId)
  );
}

async function start() {
  const contractId = '************************';
  const proof = '************************';
  await withDraw(contractId, proof);
}

start();
