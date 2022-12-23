export interface HTLCMintResult {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: null;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  events: {
    LogHTLCNew: {
      address: string;
      blockHash: string;
      blockNumber: number;
      logIndex: number;
      removed: boolean;
      transactionHash: string;
      transactionIndex: number;
      id: string;
      returnValues: {
        contractId: string;
        sender: string;
        receiver: string;
        amount: string;
        hashlock: string;
        timelock: string;
      };
      event: string;
      signature: string;
      raw: Object;
    };
  };
}

export interface HTLCWithDrawResult {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  events: {
    LogHTLCWithdraw: {
      address: string;
      blockHash: string;
      blockNumber: number;
      logIndex: number;
      removed: boolean;
      transactionHash: string;
      transactionIndex: number;
      id: string;
      returnValues: {
        contractId: string;
      };
      event: string;
      signature: string;
      raw: object;
    };
  };
}
