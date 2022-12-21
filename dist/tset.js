"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _EtherHtlcService_1 = __importDefault(require("./servicies/_EtherHtlcService"));
const _EtherErc20HtlcService_1 = __importDefault(require("./servicies/_EtherErc20HtlcService"));
const _EtherErc721HtlcService_1 = __importDefault(require("./servicies/_EtherErc721HtlcService"));
const ERC721_json_1 = __importDefault(require("./abis/ERC721.json"));
// eth
const _etherHtlc = new _EtherHtlcService_1.default();
const _etherErc20Htlc = new _EtherErc20HtlcService_1.default();
const _etherErc721Htlc = new _EtherErc721HtlcService_1.default();
const PRIVATE_KEY1 = "09a30c3ffac631be9bf11495819fbaadf036f08a2cc90ae1fde061df2653126c";
const PRIVATE_KEY2 = "945170294f88dbcba5431dc65130bd8634d5ce30dceaf68d546ba90ca2c50cc2";
const GAS = 1000000;
_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherErc20Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherErc721Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
_etherErc20Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
_etherErc721Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
async function htlcTest() {
    const mint = await _etherHtlc.mint(_etherHtlc.web3.eth.accounts.wallet[1].address, _etherHtlc.web3.eth.accounts.wallet[0].address, 3600, 1, GAS);
    console.log("ETH", "HTLC", "mint");
    console.log(mint);
    const contractId = mint.contractId;
    console.log(await _etherHtlc.getContractInfo(contractId));
    const draw = await _etherHtlc.withDraw(contractId, _etherHtlc.web3.eth.accounts.wallet[1].address, mint.hashPair.secret, GAS);
    console.log("ETH", "HTLC", "withDraw");
    console.log(draw);
    console.log(await _etherHtlc.getContractInfo(contractId));
}
async function erc20Test() {
    const mint = await _etherErc20Htlc.mint(_etherErc20Htlc.web3.eth.accounts.wallet[1].address, _etherErc20Htlc.web3.eth.accounts.wallet[0].address, 3600, 1, GAS, "0x396810E66B06686A4A10d50b13BA9056b3f73372");
    console.log("ETH", "ERC20_HTLC", "mint");
    console.log(mint);
    const contractId = mint.contractId;
    console.log(await _etherErc20Htlc.getContractInfo(contractId));
    const draw = await _etherErc20Htlc.withDraw(contractId, _etherErc20Htlc.web3.eth.accounts.wallet[1].address, mint.hashPair.secret, GAS);
    console.log("ETH", "ERC20_HTLC", "withDraw");
    console.log(draw);
    console.log(await _etherErc20Htlc.getContractInfo(contractId));
}
async function erc721Test(tokenId) {
    const mint = await _etherErc721Htlc.mint(_etherErc721Htlc.web3.eth.accounts.wallet[1].address, _etherErc721Htlc.web3.eth.accounts.wallet[0].address, 3600, tokenId, GAS, "0xA0Ce6944AcCa20a9201E36a42C6a2a4c7e42aB72");
    console.log("ETH", "ERC721_HTLC", "mint");
    console.log(mint);
    const contractId = mint.contractId;
    console.log(await _etherErc721Htlc.getContractInfo(contractId));
    const draw = await _etherErc721Htlc.withDraw(contractId, _etherErc721Htlc.web3.eth.accounts.wallet[1].address, mint.hashPair.secret, GAS);
    console.log("ETH", "ERC721_HTLC", "withDraw");
    console.log(draw);
    console.log(await _etherErc721Htlc.getContractInfo(contractId));
}
// テストのためにERC721Tokenが必要な場合、以下関数で作成できます
// 作成後、メタマスクにトークン追加する場合は、必要な情報はトークンアドレス`0xA0Ce6944AcCa20a9201E36a42C6a2a4c7e42aB72` and tokenId です。使用済みIDは使えないので100以降ぐらいを指定すると良いかもしれません
async function createErc721(tokenId) {
    const erc721TokenContract = new _etherHtlc.web3.eth.Contract(ERC721_json_1.default.abi, "0xA0Ce6944AcCa20a9201E36a42C6a2a4c7e42aB72");
    const sender = _etherHtlc.web3.eth.accounts.wallet[0].address;
    const res = await erc721TokenContract.methods.mint(sender, tokenId).send({ from: sender, gas: GAS.toString() });
    console.log(res.events.Transfer.returnValues);
}
// テスト実行用
(async () => {
    //htlcTest();
    //erc20Test();
    await createErc721(15);
    await erc721Test(14);
})();
/* // symbol
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
); */
