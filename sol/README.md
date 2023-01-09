# sol

Smart contract on the EVM side. If modifications are needed on the contract side, modify the code in this directory and deploy.

## Setup

Visual Studio Code extension [solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) is required for development.
Be sure to open the following workspaces.

[evm-symbol-swap.code-workspace](../evm-symbol-swap.code-workspace)

Then install the necessary packages.

```shell
npm install
```

Set up the information for the network where the smart contract will be deployed.
Here are some examples.

[truffle-config.js](truffle-config.js)

```javascript
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '4447',
    },
  },
  compilers: {
    solc: {
      version: '^0.8.0',
    },
  },
};
```
