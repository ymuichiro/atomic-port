const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const privateKeys = [process.env.EVM_PRIVATE_KEY];

const sepolia = {
  provider: () => new HDWalletProvider(privateKeys, 'https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd'),
  network_id: 11155111,
};

const rinkeby = {
  provider: () => new HDWalletProvider(privateKeys, 'https://rpc.ankr.com/eth_rinkeby'),
  network_id: 4,
};

const polygonTestnet = {
  provider: () => new HDWalletProvider(privateKeys, `https://rpc-mumbai.maticvigil.com`),
  network_id: 80001,
};

module.exports = {
  networks: {
    sepolia,
    rinkeby,
    polygonTestnet,
  },
  compilers: {
    solc: {
      version: '0.8.17',
    },
  },
};
