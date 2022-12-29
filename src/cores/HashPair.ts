import crypto from 'crypto';

/**
 * create a new hash pair
 * If you specify an existing secret or proof in the constructor, take over that value
 */
class HashPair {
  private readonly _secret: string;
  private readonly _proof: string;

  constructor(secret?: string, proof?: string) {
    if (typeof secret === 'string' && typeof proof === 'string') {
      this._secret = secret;
      this._proof = proof;
    } else {
      const _secret = crypto.randomBytes(32);
      const _proof1 = crypto.createHash('sha256').update(_secret).digest();
      const _proof2 = crypto.createHash('sha256').update(_proof1).digest();
      this._secret = _secret.toString('hex');
      this._proof = _proof2.toString('hex');
    }
  }

  public get proofForSymbol(): string {
    return this._proof.toUpperCase();
  }

  public get proofForEvm(): string {
    return '0x' + this._proof;
  }

  public get secretForSymbol(): string {
    return this._secret.toUpperCase();
  }

  public get secretForEvm(): string {
    return '0x' + this._secret;
  }
}

export default HashPair;
