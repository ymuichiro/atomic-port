"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _EtherRinkebyHtlcService_1 = __importDefault(require("./servicies/_EtherRinkebyHtlcService"));
const _EtherRinkebyErc20HtlcService_1 = __importDefault(require("./servicies/_EtherRinkebyErc20HtlcService"));
const _EtherRinkebyErc721HtlcService_1 = __importDefault(require("./servicies/_EtherRinkebyErc721HtlcService"));
const ERC721_json_1 = __importDefault(require("./abis/ERC721.json"));
// eth
const _etherHtlc = new _EtherRinkebyHtlcService_1.default();
const _etherErc20Htlc = new _EtherRinkebyErc20HtlcService_1.default();
const _etherErc721Htlc = new _EtherRinkebyErc721HtlcService_1.default();
// 以下のアカウントを使ってもらうとERC20トークンなどは持っているので楽かと思います
const PRIVATE_KEY1 = "09a30c3ffac631be9bf11495819fbaadf036f08a2cc90ae1fde061df2653126c";
const PRIVATE_KEY2 = "945170294f88dbcba5431dc65130bd8634d5ce30dceaf68d546ba90ca2c50cc2";
const GAS = 1000000;
//
_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherErc20Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherErc721Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY1);
_etherHtlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
_etherErc20Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
_etherErc721Htlc.web3.eth.accounts.wallet.add(PRIVATE_KEY2);
// HTLCテスト用
async function htlcTest() {
    const mint = await _etherHtlc.mint(_etherHtlc.web3.eth.accounts.wallet[1].address, _etherHtlc.web3.eth.accounts.wallet[0].address, 3600, 1, GAS);
    console.log("ETH", "HTLC", "mint");
    console.log(mint);
    const contractId = mint.contractId;
    // 引き出し前のpreimageが0x0000....であることが確認できます
    console.log(await _etherHtlc.getContractInfo(contractId));
    // どちらでも構わないのですが引き出しは受取者が行っています（PrivateKey2の方）
    const draw = await _etherHtlc.withDraw(contractId, _etherHtlc.web3.eth.accounts.wallet[1].address, mint.hashPair.secret, GAS);
    console.log("ETH", "HTLC", "withDraw");
    console.log(draw);
    // 引き出し後のpreimageが公開されるのでもう一方のトランザクションの引き出しが可能になります
    console.log(await _etherHtlc.getContractInfo(contractId));
}
// ERC20Cテスト用
async function erc20Test() {
    const mint = await _etherErc20Htlc.mint(_etherErc20Htlc.web3.eth.accounts.wallet[1].address, _etherErc20Htlc.web3.eth.accounts.wallet[0].address, 3600, 10000, GAS, "0x564e849C68350248B441e1BC592aC8b4e07ef1E9" // JPYC Rinkeby
    // "0x396810E66B06686A4A10d50b13BA9056b3f73372" // AliceToken
    );
    console.log("ETH", "ERC20_HTLC", "mint");
    console.log(mint);
    const contractId = mint.contractId;
    console.log(await _etherErc20Htlc.getContractInfo(contractId));
    const draw = await _etherErc20Htlc.withDraw(contractId, _etherErc20Htlc.web3.eth.accounts.wallet[1].address, mint.hashPair.secret, GAS);
    console.log("ETH", "ERC20_HTLC", "withDraw");
    console.log(draw);
    console.log(await _etherErc20Htlc.getContractInfo(contractId));
}
// ERC721Cテスト用
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
    const res = await erc721TokenContract.methods
        .mint(sender, tokenId)
        .send({ from: sender, gas: GAS.toString() });
    console.log(res.events.Transfer.returnValues);
}
// symbol
const SymbolService_1 = __importDefault(require("./servicies/SymbolService"));
const symbol_sdk_1 = require("symbol-sdk");
const node = "https://mikun-testnet.tk:3001";
const privateKey = "5DB8324E7EB83E7665D500B014283260EF312139034E86DFB7EE736503EAEC02";
const recipientAddress = "TA5LGYEWS6L2WYBQ75J2DGK7IOZHYVWFWRLOFWI";
const symbolService = new SymbolService_1.default(node, symbol_sdk_1.NetworkType.TEST_NET, "49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4", "72C0212E67A08BCE", 1667250467);
async function symbolLock() {
    return await symbolService.secretLockTransaction(privateKey, recipientAddress, "72C0212E67A08BCE", // mosaicId
    1, // amount
    5760 // duration
    );
}
async function getLockTransaction(compositHash) {
    return await symbolService.getLockTransaction(compositHash);
}
async function symbolProof() {
    return await symbolService.secretProofTransaction(privateKey, recipientAddress, "0x47b53d063e1a809684705037e4ea75fb4c656e0ce898daaee997c403bf2e2542", "0xdbb0a7fd2f0a45bdf919457bea4c95c0a170f3fa47affa25854478f4e355029e");
}
// テスト実行用
(async () => {
    // ここからevm
    // htlcTest();
    erc20Test();
    // await createErc721(15);
    // await erc721Test(14);
    // ここまでevm
    // ここからsymbol
    // console.log(await symbolLock());
    /* console.log(
      await getLockTransaction(
        "FE22B6622758CFDE3D144DABFCBFB80188A77801E142DACAF0188F3D82E68A5B"
      )
    );*/
    // console.log(await symbolProof());
    // ここまでsymbol
})();
