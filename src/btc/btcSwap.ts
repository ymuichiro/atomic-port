import * as bitcoin from 'bitcoinjs-lib';
import { ECPairInterface } from 'ecpair';
const bip65 = require('bip65');
const crypto = require('crypto');
const varuint = require('varuint-bitcoin');

export interface Coin {
  getCurrentBlockHeight: () => Promise<number>;
  postTransaction(txhex: string): Promise<any>;
  getUtxos(address: string): Promise<{ hash: string; index: number; value: number }[]>;
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
  ): string;
  getInputData(txid: string, contractAddress: string): Promise<{ value: number; index: number }>;
}

export interface HashPair {
  secret: string;
  proof: string;
}

export class btcSwap {
  public coin: Coin;
  public network: bitcoin.networks.Network;

  constructor(coin: Coin, network: any) {
    this.coin = coin;
    this.network = network;
  }

  public async lock(
    lockHeight: number,
    sender: ECPairInterface,
    receiver: ECPairInterface,
    amount: number,
    fee: number
  ) {
    const blockHeight = await this.coin.getCurrentBlockHeight();
    const TIMELOCK = blockHeight + lockHeight;
    const timelock = bip65.encode({ blocks: TIMELOCK });
    console.log('Timelock expressed in block height: ', timelock);
    const hashPair = this.createHashPair();
    console.log('proof:', hashPair.proof);
    console.log('secret:', hashPair.secret);
    const swapContract = this.swapContractGenerator(receiver.publicKey, sender.publicKey, hashPair.secret, timelock);
    console.log('Swap contract (witness script):');
    console.log(swapContract.toString('hex'));

    const p2wsh = bitcoin.payments.p2wsh({
      redeem: { output: swapContract, network: this.network },
      network: this.network,
    });
    console.log('P2WSH swap smart contract address:', p2wsh.address);

    const senderAddress = bitcoin.payments.p2wpkh({ pubkey: sender.publicKey, network: this.network }).address;
    const contractAddress = p2wsh.address;

    if (senderAddress == undefined || contractAddress == undefined)
      throw new Error('senderAddress or contractAddress is undefined');
    // UTXOを取得
    const utxos = await this.coin.getUtxos(senderAddress);

    if (!utxos || utxos.length <= 0) {
      console.log(`ERROR: 指定されたアドレス ${senderAddress} には現在利用可能なUTXOがありませんでした。`);
      return process.exit(0);
    }
    // トランザクションHEXを作成
    const txHex = this.coin.buildAndSignTx(sender, senderAddress, this.network, contractAddress, amount, fee, utxos);
    console.log('Transaction hexadecimal:');
    console.log(txHex);

    this.coin
      .postTransaction(txHex)
      .then((result) => console.log('Transaction hash:', result))
      .catch((err) => console.error(err.response.data));
  }

  async withdraw(
    txId: string,
    contractAddress: string,
    witnessScript: string,
    receiver: ECPairInterface,
    preImage: string,
    feeSat: number
  ) {
    const psbt = new bitcoin.Psbt({ network: this.network });
    const receiverAddress = bitcoin.payments.p2wpkh({ pubkey: receiver.publicKey, network: this.network }).address;
    const { value, index } = await this.coin.getInputData(txId, contractAddress);

    psbt.addInput({
      hash: txId,
      index,
      sequence: 0xfffffffe,
      witnessUtxo: {
        script: Buffer.from('0020' + bitcoin.crypto.sha256(Buffer.from(witnessScript, 'hex')).toString('hex'), 'hex'),
        value,
      },
      witnessScript: Buffer.from(witnessScript, 'hex'),
    });
    psbt.addOutput({
      address: receiverAddress!,
      value: value - feeSat,
    });

    psbt.signInput(0, receiver);

    const getFinalScripts = (inputIndex: number, input: any, script: Buffer | (number | Buffer)[]) => {
      const decompiled = bitcoin.script.decompile(script);
      if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_HASH256) {
        throw new Error(`Can not finalize input #${inputIndex}`);
      }

      const witnessStackClaimBranch = bitcoin.payments.p2wsh({
        redeem: {
          input: bitcoin.script.compile([input.partialSig[0].signature, Buffer.from(preImage, 'hex')]),
          output: Buffer.from(witnessScript, 'hex'),
        },
      });

      return {
        finalScriptSig: undefined,
        finalScriptWitness: witnessStackToScriptWitness(witnessStackClaimBranch.witness),
      };
    };
    psbt.finalizeInput(0, getFinalScripts);

    console.log('Transaction hexadecimal:');
    const txHex = psbt.extractTransaction().toHex();
    console.log(txHex);

    this.coin
      .postTransaction(txHex)
      .then((result) => console.log('Transaction hash:', result))
      .catch((err) => console.error(err.response.data));
  }

  async refund(txId: string, contractAddress: string, witnessScript: string, sender: ECPairInterface, feeSat: number) {
    const psbt = new bitcoin.Psbt({ network: this.network });
    const decompiled = bitcoin.script.decompile(Buffer.from(witnessScript, 'hex'));
    if (decompiled == null || decompiled[6] == null) throw new Error("script hasn't lock time");
    const lockTime = bitcoin.script.number.decode(decompiled[6] as Buffer);

    const timelock = bip65.encode({ blocks: lockTime });
    psbt.setLocktime(timelock);

    const senderAddress = bitcoin.payments.p2wpkh({ pubkey: sender.publicKey, network: this.network }).address;
    const { value, index } = await this.coin.getInputData(txId, contractAddress);

    psbt.addInput({
      hash: txId,
      index,
      sequence: 0xfffffffe,
      witnessUtxo: {
        script: Buffer.from('0020' + bitcoin.crypto.sha256(Buffer.from(witnessScript, 'hex')).toString('hex'), 'hex'),
        value,
      },
      witnessScript: Buffer.from(witnessScript, 'hex'),
    });
    psbt.addOutput({
      address: senderAddress!,
      value: value - feeSat,
    });

    psbt.signInput(0, sender);

    const getFinalScripts = (inputIndex: number, input: any, script: Buffer | (number | Buffer)[]) => {
      const decompiled = bitcoin.script.decompile(script);
      if (!decompiled || decompiled[0] !== bitcoin.opcodes.OP_HASH256) {
        throw new Error(`Can not finalize input #${inputIndex}`);
      }

      const witnessStackRefundBranch = bitcoin.payments.p2wsh({
        redeem: {
          input: bitcoin.script.compile([input.partialSig[0].signature, Buffer.from('', 'hex')]),
          output: Buffer.from(witnessScript, 'hex'),
        },
      });

      return {
        finalScriptSig: undefined,
        finalScriptWitness: witnessStackToScriptWitness(witnessStackRefundBranch.witness),
      };
    };
    psbt.finalizeInput(0, getFinalScripts);

    console.log('Transaction hexadecimal:');
    const txHex = psbt.extractTransaction().toHex();
    console.log(txHex);

    this.coin
      .postTransaction(txHex)
      .then((result) => console.log('Transaction hash:', result))
      .catch((err) => console.error(err.response.data));
  }

  createHashPair(): HashPair {
    const s = crypto.randomBytes(32);
    const p1 = crypto.createHash('sha256').update(s).digest();
    const p2 = crypto.createHash('sha256').update(p1).digest();
    return {
      proof: s.toString('hex'),
      secret: p2.toString('hex'),
    };
  }

  swapContractGenerator(
    receiverPublicKey: Buffer,
    userRefundPublicKey: Buffer,
    PAYMENT_HASH: string,
    timelock: number
  ) {
    return bitcoin.script.fromASM(
      `
            OP_HASH256
            ${PAYMENT_HASH}
            OP_EQUAL
            OP_IF
            ${receiverPublicKey.toString('hex')}
            OP_ELSE
            ${bitcoin.script.number.encode(timelock).toString('hex')}
            OP_CHECKLOCKTIMEVERIFY
            OP_DROP
            ${userRefundPublicKey.toString('hex')}
            OP_ENDIF
            OP_CHECKSIG
            `
        .trim()
        .replace(/\s+/g, ' ')
    );
  }
}

function witnessStackToScriptWitness(witness: any): Buffer {
  let buffer = Buffer.allocUnsafe(0);
  function writeSlice(slice: any) {
    buffer = Buffer.concat([buffer, Buffer.from(slice)]);
  }

  function writeVarInt(i: any) {
    const currentLen = buffer.length;
    const varintLen = varuint.encodingLength(i);

    buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)]);
    varuint.encode(i, buffer, currentLen);
  }

  function writeVarSlice(slice: any) {
    writeVarInt(slice.length);
    writeSlice(slice);
  }

  function writeVector(vector: any) {
    writeVarInt(vector.length);
    vector.forEach(writeVarSlice);
  }

  writeVector(witness);

  return buffer;
}
