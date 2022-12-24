import { NetworkType, SecretLockInfo } from "symbol-sdk";
declare class SymbolService {
    private readonly node;
    private readonly networkType;
    private readonly generationHashSeed;
    private readonly currencyMosaicId;
    private readonly epochAdjustment;
    constructor(node: string, networkType: NetworkType, generationHashSeed: string, currencyMosaicId: string, epochAdjustment: number);
    secretLockTransaction(senderPrivateKey: string, recipientAddress: string, mosaicId: string, amount: number, duration: number): Promise<object>;
    secretProofTransaction(senderPrivateKey: string, recipientAddress: string, proof: string, secret: string): Promise<object>;
    getLockTransaction(compositeHash: string): Promise<SecretLockInfo>;
    private compositeHash;
}
export default SymbolService;
