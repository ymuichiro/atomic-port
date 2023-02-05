<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/47295014/218366041-d07fdf06-1b72-4c6d-8fa2-89dc8266553d.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
  <img alt="logo" src="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
</picture>
</div>

[Go to top](#../../README.md)

# @atomic-port/evm

This package is for HTLC transactions between the any blockchains. HTLC allows direct transactions between different chains. Usage and examples are shown below.

<br>

## Test is now open to the public.

Transactions on each chain in this library are currently available only on the testnet.
If you wish to use it in a production environment, please change the network and other parameters.

### Deployed Contracts

#### Sepolia （TestNet）

##### native

- Endpoint: https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd
- Contract address: 0x549DEC2d00C3db272F337Ac4874503Ecf5205955

##### ERC20

- Endpoint: https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd
- Contract address: 0xbD674927a77f4Ca6f01Ac470A33747E060C3Ccd0

##### ERC721

- Endpoint: https://sepolia.infura.io/v3/85eb73cb20fc46058b5044657ed33efd
- Contract address: 0x4Bf07078493464447732B2a23126697b1C85DF9F

#### Rinkeby （TestNet）

##### native

- Endpoint: https://rpc.ankr.com/eth_rinkeby
- Contract address: 0x97ED40C207bf3B6dE4DB27E37E1989f3756E71f4

##### ERC20

- Endpoint: https://rpc.ankr.com/eth_rinkeby
- Contract address: 0x5F30A927063AA056Ee8BA93Be1175f7485c89Cac

##### ERC721

- Endpoint: https://rpc.ankr.com/eth_rinkeby
- Contract address: 0x3b1B7AB12c115148B4bbe14E8327Da6c1DfD70cd

#### Matic （TestNet）

##### native

- Endpoint: https://rpc-mumbai.maticvigil.com
- Contract address: 0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B

##### ERC20

- Endpoint: https://rpc-mumbai.maticvigil.com
- Contract address: 0xa66ffa7b45d9138e6A93bBa1f29a580bd559E5cC

##### ERC721

- Endpoint: https://rpc-mumbai.maticvigil.com
- Contract address: 0x6003028E5C3FB11c5F002902dDa1E18cF6a5D34B

<br>

## Introduction

Install the necessary libraries

**npm**

```
npm install --save web3 @atomic-port/evm
```

**yarn**

```
yarn add web3 @atomic-port/evm
```

HTLC issues a secret and key in advance and uses this to issue a secret lock.
When both parties agree to the transaction, the secret and key are exchanged separately, and the key is used to receive a token. This is how the cross-chain swap is performed.

<br>

## Issue a secret lock

You can publish using this package with the following operations.
The output hashPair contains a secret and a proof. The secret is shared in advance, and the proof is issued at a mutually agreed timing.

[native/lock.ts](../../examples/evm/src/native/lock.ts)<br>
[erc20/lock.ts](../../examples/evm/src/erc20/lock.ts)<br>
[erc721/lock.ts](../../examples/evm/src/erc721/lock.ts)<br>
[erc20JPYC/lock.ts](../../examples/evm/src/erc20JPYC/lock.ts)<br>
[erc20Polygon/lock.ts](../../examples/evm/src/erc20Polygon/lock.ts)<br>

<br>

## Unlocking by Proof

With a secret lock, locked assets are withdrawn through a secret proof transaction.

[native/withDraw.ts](../../examples/evm/src/native/withDraw.ts)<br>
[erc20/withDraw.ts](../../examples/evm/src/erc20/withDraw.ts)<br>
[erc721/withDraw.ts](../../examples/evm/src/erc721/withDraw.ts)<br>
[erc20JPYC/withDraw.ts](../../examples/evm/src/erc20JPYC/withDraw.ts)<br>
[erc20Polygon/lock.ts](../../examples/evm/src/erc20Polygon/withDraw.ts)<br>

<br>

For more detailed examples, please check the sample collection below
[examples](examples/README.md)

<br>

## More Documents

- [about ethereum](https://ethereum.org/)
