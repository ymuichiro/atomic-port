<div align="center">
<img src="assets/evm-symbol-swap-logo-wide.png" alt="evm-symbol-swap-logo" title="evm-symbol-swap-logo">
</div>

# EVM <-> Symbol Swap

This package is for HTLC transactions between the EVM blockchain and Symbol. Usage and examples are shown below.

## Introduction

Install the necessary libraries

**npm**

```
npm install --save symbol-sdk@2 web3
```

**yarn**

```
yarn add symbol-sdk@2 web3
```

HTLC issues a secret and key in advance and uses this to issue a secret lock.
When both parties agree to the transaction, the secret and key are exchanged separately, and the key is used to receive a token.
This is how the cross-chain swap is performed.

```ts
const hashPair = new HashPair();
```

To do a secret lock on the EVM chain side, do the following

```ts
const client = new HTLCService(Contracts.sepolia.native.endpoint, Contracts.sepolia.native.endpoint);
const hashPair = new HashPair();
const AccountService = client.web3.eth.accounts;
const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
const contractId = await client.mint(toAddress, fromAddress, hashPair, 1);
console.log(await client.getContractInfo(contractId));
```

To do a secret lock on the Symbol chain side, do the following

```ts
const client = new HTLCSymbolService(
  Contracts.symbol.testnet.endpoint,
  NetworkType.TEST_NET,
  Contracts.symbol.testnet.generationHashSeed,
  Contracts.symbol.testnet.epochAdjustment
);
const tx = client.mint(ADDRESS.RECIPIENT, hashPair, CURRENCY.MOSAIC_ID, 1);
await client.sign(PRIVATEKEY.FROM, tx);
console.log(client.getHash(hashPair.secretForSymbol, ADDRESS.RECIPIENT));
```

To receive tokens on the EVM chain side, do the following

```ts
await client.withDraw(contractId, toAddress, hashPair.secretForEvm);
console.log(await client.getContractInfo(contractId));
```

To receive tokens on the Symbol chain side, do the following

```ts
const { PRIVATEKEY, ADDRESS } = SYMBOL;
const drawTx = client.withDraw(ADDRESS.RECIPIENT, hashPair.proofForSymbol, hashPair.secretForSymbol);
client.sign(PRIVATEKEY.FROM, drawTx).then((e) => {
  console.log('xym announced', e.message, client.getHash(hashPair.secretForSymbol, ADDRESS.RECIPIENT));
});
```

For more detailed examples, please check the sample collection below
[examples](examples/README.md)

## Chains

The following chains are supported

- [ethereum](https://ethereum.org/)
- [polygon](https://polygon.technology/)
- [jpyc](https://jpyc.jp/)
- [symbol](https://symbol-community.com/)
