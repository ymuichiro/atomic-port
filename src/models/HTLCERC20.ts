export interface HTLCERC20MintResult {
  blockHash: string;
  blockNumber: number;
  contractAddress: null;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: true;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  events: {
    HTLCERC20New: {
      address: string;
      blockHash: string;
      blockNumber: number;
      logIndex: number;
      removed: false;
      transactionHash: string;
      transactionIndex: number;
      id: string;
      returnValues: {
        contractId: string;
        sender: string;
        receiver: string;
        tokenContract: string;
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

export interface HTLCERC20WithDrawResult {
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
    HTLCERC20Withdraw: {
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
      raw: Object;
    };
  };
}
