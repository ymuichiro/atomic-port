<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/47295014/218366041-d07fdf06-1b72-4c6d-8fa2-89dc8266553d.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
  <img alt="logo" src="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
</picture>
</div>

[Go to top](#../../README.md)

# @atomic-port/mona

This package is for HTLC transactions between the any blockchains. HTLC allows direct transactions between different chains. Usage and examples are shown below.

<br>

## Attention

This script was created and released for research and experimentation and is not intended to encourage actual use.
Trading of crypto assets may require licenses, applications, or approvals in some countries.
Please consider using them at your own risk.

<br>

## Test is now open to the public.

Transactions on each chain in this library are currently available only on the testnet.
If you wish to use it in a production environment, please change the network and other parameters.

<br>

## Introduction

Install the necessary libraries

**npm**

```
npm install --save web3 @mempool/mempool.js bip65 bitcoinjs-lib@6 coininfo ecpair tiny-secp256k1 varuint-bitcoin @atomic-port/mona
```

**yarn**

```
yarn add web3 @mempool/mempool.js bip65 bitcoinjs-lib@6 coininfo ecpair tiny-secp256k1 varuint-bitcoin @atomic-port/mona
```

HTLC issues a secret and key in advance and uses this to issue a secret lock.
When both parties agree to the transaction, the secret and key are exchanged separately, and the key is used to receive a token. This is how the cross-chain swap is performed.

<br>

## Issue a secret lock

You can publish using this package with the following operations.
The output hashPair contains a secret and a proof. The secret is shared in advance, and the proof is issued at a mutually agreed timing.

[lock.ts](../../examples/mona/src/lock.ts)

<br>

## Unlocking by Proof

With a secret lock, locked assets are withdrawn through a secret proof transaction.

[withDraw.ts](../../examples/mona/src/withDraw.ts)

<br>

For more detailed examples, please check the sample collection below
[examples](examples/README.md)

<br>

## More Documents

- [about mona](https://monacoin.org/)
