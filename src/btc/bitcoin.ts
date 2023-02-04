import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { Coin } from './btcSwap';
import mempoolJS from '@mempool/mempool.js';

const ECPair = ECPairFactory(ecc);
const validator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
  ECPair.fromPublicKey(pubkey).verify(msghash, signature);

const {
  bitcoin: { transactions, blocks, addresses },
} = mempoolJS({
  hostname: 'mempool.space',
  network: 'testnet',
});

export default class BitCoin implements Coin {
  public network = bitcoin.networks.testnet;
  public baseUrl = 'https://mempool.space/testnet';

  async getCurrentBlockHeight(): Promise<number> {
    return blocks.getBlocksTipHeight();
  }

  async postTransaction(txhex: string): Promise<any> {
    const endpoint = `${this.baseUrl}/api/tx`;
    console.log('Broadcasting Transaction to ' + endpoint);
    return new Promise(function (resolve, reject) {
      axios
        .post(endpoint, txhex)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getInputData(txid: string, contractAddress: string): Promise<{ value: number; index: number }> {
    const txInfo = await transactions.getTx({ txid });
    let value = 0;
    let index = 0;
    for (let i = 0; i < txInfo.vout.length; i++) {
      if (txInfo.vout[i].scriptpubkey_address == contractAddress) {
        value = txInfo.vout[i].value;
        index = i;
      }
    }
    return { value, index };
  }

  async getUtxos(address: string): Promise<{ hash: string; index: number; value: number }[]> {
    const utxosData = await addresses.getAddressTxsUtxo({ address });
    const utxos: { hash: string; index: number; value: number }[] = [];
    for (let i = 0; i < utxosData.length; i++) {
      const hash = utxosData[i].txid;
      const index = utxosData[i].vout;
      const value = utxosData[i].value;
      utxos.push({
        hash,
        index,
        value,
      });
    }
    return utxos;
  }

  buildAndSignTx(
    sender: ECPairInterface,
    address: string,
    network: bitcoin.networks.Network,
    recipient: string,
    sendingSat: number,
    feeSat: number,
    utxos: {
      hash: string;
      index: number;
      value: number;
    }[]
  ): string {
    // input元(utxo)のtxを追加:
    const psbt = new bitcoin.Psbt({ network });
    let total = 0;
    const pubKeyHash = bitcoin.crypto.hash160(sender.publicKey).toString('hex');
    for (let len = utxos.length, i = 0; i < len; i++) {
      const { hash, index, value } = utxos[i];
      psbt.addInput({
        hash,
        index,
        // sequence: 0xffffffff,
        // IMPORTANT: needs for a tx with witness!
        witnessUtxo: {
          script: Buffer.from('0014' + pubKeyHash, 'hex'),
          value,
        },
      });
      total += value;
    }

    psbt.addOutput({
      address: recipient,
      value: sendingSat,
    });

    const changeSat = total - sendingSat - feeSat;
    if (changeSat < 0) {
      console.log(`ERROR: 残高が不足しています。残高(UTXOトータル): ${total} satoshi`);
      return process.exit(0);
    }
    psbt.addOutput({
      address: address,
      value: changeSat,
    });

    console.log('トランザクション詳細:');
    console.log('送金元:', address);
    console.log('着金先:', recipient);
    console.log('現在の送金元UTXOトータル残高(satoshi):', total);
    console.log('送金額(satoshi):', sendingSat);
    console.log('手数料(satoshi):', feeSat);
    console.log('お釣り(satoshi):', changeSat);
    console.log('');

    for (let len = utxos.length, i = 0; i < len; i++) {
      psbt.signInput(i, sender);
      psbt.validateSignaturesOfInput(i, validator);
    }
    psbt.finalizeAllInputs();
    // tx hex取得
    const txHex = psbt.extractTransaction().toHex();
    return txHex;
  }
}
