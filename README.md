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

## Issue a secret lock on the Symbol side

You can publish using this package with the following operations.
The output hashPair contains a secret and a proof. The secret is shared in advance, and the proof is issued at a mutually agreed timing.

```ts
const client = new HTLCSymbolService(
  Contracts.symbol.testnet.endpoint,
  NetworkType.TEST_NET,
  Contracts.symbol.testnet.generationHashSeed,
  Contracts.symbol.testnet.epochAdjustment
);
const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
const senderAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.FROM, NetworkType.TEST_NET);
const { hashPair, transaction } = client.lock(recipientAccount.address.plain(), SYMBOL.CURRENCY.MOSAIC_ID, 1);
const signedTx = await client.sign(SYMBOL.PRIVATEKEY.FROM, transaction);
```

## Symbol side issues secret proof

With a secret lock, locked assets are withdrawn through a secret proof transaction.

```ts
const drawTx = client.withDraw(recipientAccount.address.plain(), hashPair.proof, hashPair.secret);
const signedTx = await client.sign(recipientAccount.privateKey, drawTx);
```

## Issue a secret lock on the EVM side

As when issued with Symbol, the asset is pre-locked and a secret and proof are issued.
The output hashPair contains a secret and a proof.

```ts
const client = new HTLCService(Contracts.sepolia.native.endpoint, Contracts.sepolia.native.contractAddress);
const AccountService = client.web3.eth.accounts;
const fromAddress = AccountService.wallet.add(PRIVATEKEY.FROM).address;
const toAddress = AccountService.wallet.add(PRIVATEKEY.TO).address;
const { result, hashPair } = await client.lock(toAddress, fromAddress, 1);
```

## Secret proofs are issued on the EVM side.

The EVM also withdraws the locked assets when indicating the completion of the transaction.

```ts
const res = await client.withDraw(result.events.LogHTLCNew.returnValues.contractId, toAddress, hashPair.proof);
```

For more detailed examples, please check the sample collection below
[examples](examples/README.md)

## Chains

The following chains are supported

- [ethereum](https://ethereum.org/)
- [polygon](https://polygon.technology/)
- [jpyc](https://jpyc.jp/)
- [symbol](https://symbol-community.com/)
