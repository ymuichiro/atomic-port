import { Network } from "symbol-sdk/src/symbol/Network";
declare class SymbolService {
    private readonly facade;
    private readonly node;
    constructor(network: Network, node: string);
    secretLockTransaction(senderPrivateKey: string, recipientAddress: string, mosaicId: bigint, amount: bigint, duration: bigint): Promise<{
        message: any;
        hashPair: import("..").HashPair;
        compositeHash: any;
    }>;
    private getLockTransaction;
    private compositeHash;
}
export default SymbolService;
