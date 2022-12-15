import _EtherHtlcService from "./servicies/_EtherHtlcService";
import { Network } from "symbol-sdk/src/symbol/Network";
import { Hash256 } from "symbol-sdk/src/CryptoTypes";
import SymbolService from "./servicies/SymbolService";

// eth
const _etherHtlc = new _EtherHtlcService();
const PRIVATE_KEY1 = "";
const PRIVATE_KEY2 = "";
const GAS = 1000000;

// symbol
const node = "https://sym-test.opening-line.jp";
const privateKey = "";
const recipientAddress = "";
const network = new Network(
  "testnet",
  0x98,
  new Date(Date.UTC(2022, 9, 31, 21, 7, 47)),
  new Hash256(
    "49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4"
  )
);
const symbolService = new SymbolService(network, node);
symbolService.secretLockTransaction(
  privateKey,
  recipientAddress,
  0x72c0212e67a08bcen, // mosaicId
  1n, // amount
  5760n // duration
);

_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
const recipient = _etherHtlc.web3.eth.accounts.wallet[0].address;
const sender = _etherHtlc.web3.eth.accounts.wallet[1].address;

async () => {
  const mint = await _etherHtlc.mint(recipient, sender, 3600, 1, GAS);
  const draw = await _etherHtlc.withDraw(sender, mint[1].secret, GAS);
  console.log("ETH", "HTLC", "mint", mint);
  console.log("ETH", "HTLC", "draw", draw);
};
