export const ETH = {
  PRIVATEKEY: {
    FROM: process.env.FROM_PRIVATE_KEY as string,
    TO: process.env.TO_PRIVATE_KEY as string,
  },
  NETWORK: {
    TEST: {
      sepolia: {
        native: {
          endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
          contractAddress: '0x549DEC2d00C3db272F337Ac4874503Ecf5205955',
        },
        erc20: {
          endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
          contractAddress: '0xbD674927a77f4Ca6f01Ac470A33747E060C3Ccd0',
        },
        erc721: {
          endpoint: 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd',
          contractAddress: '0x4Bf07078493464447732B2a23126697b1C85DF9F',
        },
      },
      rinkeby: {
        erc20: {
          endpoint: 'https://rpc.ankr.com/eth_rinkeby',
          contractAddress: '0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac',
        },
        erc721: {
          endpoint: 'https://rpc.ankr.com/eth_rinkeby',
          contractAddress: '0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd',
        },
        native: {
          endpoint: 'https://rpc.ankr.com/eth_rinkeby',
          contractAddress: '0x97ED40C207bf3B6dE4DB27E37E1989f3756E71f4',
        },
      },
      matic: {
        native: {
          endpoint: 'https://rpc-mumbai.maticvigil.com',
          contractAddress: '0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B',
        },
        erc20: {
          endpoint: 'https://rpc-mumbai.maticvigil.com',
          contractAddress: '0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC',
        },
        erc721: {
          endpoint: 'https://rpc-mumbai.maticvigil.com',
          contractAddress: '0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B',
        },
      },
    },
  },
  TOKEN: {
    JPYC: '0x564e849C68350248B441e1BC592aC8b4e07ef1E9',
    ALICE: '0x396810E66B06686A4A10d50b13BA9056b3f73372',
    ERC721: '0xA0Ce6944AcCa20a9201E36a42C6a2a4c7e42aB72',
    MATIC_ERC20: '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1',
  },
};
