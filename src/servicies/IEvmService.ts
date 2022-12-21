import Web3 from "web3";

/**
 * Base class for HTLC operations on each EVM
 */
interface IEvmService {
  web3: Web3;

  getContractInfo(contractId: string): Promise<object>;
  mint(
    recipientAddress: string,
    senderAddress: string,
    lockSeconds: number,
    amountOrTokenId: number,
    gasLimit: number,
    tokenAddress: string | undefined
  ): Promise<object>;
  withDraw(
    contractId: string,
    senderAddress: string,
    secret: string,
    gasLimit: number
  ): Promise<string>;
}

export default IEvmService;
