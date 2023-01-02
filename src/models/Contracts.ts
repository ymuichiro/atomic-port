export namespace Contracts {
  export interface ContractConfig {
    endpoint: string;
    contractAddress: string;
  }

  export interface SymbolConfig {
    generationHashSeed: string;
    epochAdjustment: number;
    endpoint: string;
    websocket: string;
  }

  export namespace sepolia {
    export const native: ContractConfig = {
      endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
      contractAddress: '0x822f315505C67727E3bDC89b8ff7a5cEc3dDEBF7',
    };
    export const erc20: ContractConfig = {
      endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
      contractAddress: '0x13cf057B85085972a2FffdB73E952b1F5E850C0d',
    };
    export const erc721: ContractConfig = {
      endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
      contractAddress: '0x010f8d96C3D3BbA7b3935da8B20AAB3C9E2F6264',
    };
  }

  export namespace rinkeby {
    export const erc20: ContractConfig = {
      endpoint: 'https://rpc.ankr.com/eth_rinkeby',
      contractAddress: '0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac',
    };
    export const erc721: ContractConfig = {
      endpoint: 'https://rpc.ankr.com/eth_rinkeby',
      contractAddress: '0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd',
    };
    export const native: ContractConfig = {
      endpoint: 'https://rpc.ankr.com/eth_rinkeby',
      contractAddress: '0x97ED40C207bf3B6dE4DB27E37E1989f3756E71f4',
    };
  }

  export namespace matic {
    export const native: ContractConfig = {
      endpoint: 'https://rpc-mumbai.maticvigil.com',
      contractAddress: '0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B',
    };
    export const erc20: ContractConfig = {
      endpoint: 'https://rpc-mumbai.maticvigil.com',
      contractAddress: '0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC',
    };
    export const erc721: ContractConfig = {
      endpoint: 'https://rpc-mumbai.maticvigil.com',
      contractAddress: '0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B',
    };
  }

  export namespace symbol {
    export const testnet: SymbolConfig = {
      generationHashSeed: '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4',
      epochAdjustment: 1667250467,
      endpoint: 'https://mikun-testnet.tk:3001',
      websocket: 'wss://mikun-testnet.tk:3001/ws',
    };
  }
}
