<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/47295014/218366041-d07fdf06-1b72-4c6d-8fa2-89dc8266553d.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
  <img alt="logo" src="https://user-images.githubusercontent.com/47295014/218366194-eee5969d-3c4c-4445-9303-5368c66aac9a.png">
</picture>
</div>

# Atomic port

This package is for HTLC transactions between the any blockchains. HTLC stands for Hashed time lock contract. HTLC allows direct transactions between different chains. Usage and examples are shown below.

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

## Chains or Tokens

The following chains & tokens are supported

- Bitcoin
  - [about bitcoin](https://bitcoin.org/)
  - [htlc package](./packages/bitcoin/README.md)
- Ethereum
  - [about ethereum](https://ethereum.org/)
  - [htlc package](./packages/evm/README.md)
- Polygon
  - [about polygon](https://polygon.technology/)
  - [htlc package](./packages/evm/README.md)
- JPYC
  - [about jpyc](https://jpyc.jp/)
  - [htlc package](./packages/evm/README.md)
- MONA
  - [about mona](https://monacoin.org/)
  - [htlc package](./packages/mona/README.md)
- Symbol
  - [about symbol](https://symbol-community.com/)
  - [htlc package](./packages/symbol/README.md)

## Example

A lock transaction is created to execute HTLC and initiate the transaction.
The executor keeps the generated Proof and shares the Secret with the counterparty.

```ts
async function lock() {
  // setup
  const client = new SymbolHtlc(
    SYMBOL.NETWORK.ENDPOINT,
    NetworkType.TEST_NET,
    SYMBOL.NETWORK.GENERATION_HASH_SEED,
    SYMBOL.NETWORK.EPOCH_ADJUSTMENT
  );
  const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
  const senderAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.FROM, NetworkType.TEST_NET);
  const hashPair = client.createHashPair();
  // lock
  const transaction = client.lock(recipientAccount.address.plain(), SYMBOL.CURRENCY.MOSAIC_ID, hashPair.secret, 1);
  const signedTx = await client.sign(SYMBOL.PRIVATEKEY.FROM, transaction);
  console.log('----- wait until transaction is approved -----', {
    fromAddress: senderAccount.address.pretty(),
    toAddress: recipientAccount.address.pretty(),
    transactionHash: signedTx.hash,
    proof: hashPair.proof,
    secret: hashPair.secret,
  });
  // Wait for secret transaction to be approved
  await waitConfirmedTransaction(SYMBOL.NETWORK.ENDPOINT, senderAccount.address, signedTx.hash);
}

async function start() {
  await lock();
}
```

When a transaction is completed, you will receive tokens from the block.
The Proof generated at this time is used.

```ts
async function withDraw(proof: string, secret: string) {
  const client = new SymbolHtlc(
    SYMBOL.NETWORK.ENDPOINT,
    NetworkType.TEST_NET,
    SYMBOL.NETWORK.GENERATION_HASH_SEED,
    SYMBOL.NETWORK.EPOCH_ADJUSTMENT
  );
  const recipientAccount = Account.createFromPrivateKey(SYMBOL.PRIVATEKEY.TO, NetworkType.TEST_NET);
  const drawTx = client.withDraw(recipientAccount.address.plain(), proof, secret);
  const signedTx = await client.sign(recipientAccount.privateKey, drawTx);
  console.log('waiting...', signedTx.hash);
  await waitConfirmedTransaction(SYMBOL.NETWORK.ENDPOINT, recipientAccount.address, signedTx.hash);
  console.log(signedTx);
}

async function start() {
  const proof = '************************';
  const secret = '************************';
  await withDraw(proof, secret);
}
```

An example of a flow is shown below.
※ If you cannot see the following as a figure, please check with your browser.

```mermaid
sequenceDiagram
    actor Alice
    participant Chain A
    participant Chain B
    actor Bob
    Note over Alice,Bob: Start trading
    Note over Alice: Create Secret&Proof
    Alice ->>  Chain A: Create Lock Tx(A) from Secret
    Note over Chain A: Tx Alice to Bob(is Lock)
    Alice -->> Bob:  Secret used is shared separately
    Bob -->> Chain A: Check if lock Tx(A) has block
    Bob ->> Chain B: Create Lock Tx(B) from Secret
    Note over Chain B: Tx Bob to Alice(is Lock)
    Alice -->> Chain B: Check if lock Tx(B) has block
    Alice ->> Chain B: Unlock Tx(B) using owned Proof
    Note over Chain B: Tx Bob to Alice(is unlock)
    Bob -->> Chain B: Get proof by Tx(B)
    Bob ->> Chain A: Unlock Tx(A) using acquired Proof
    Note over Chain A: Tx Alice to Bob(is unlock)
    Note over Alice,Bob: Transaction Completed
```
