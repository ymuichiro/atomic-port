export const SYMBOL = {
  PRIVATEKEY: {
    FROM: process.env.FROM_PRIVATE_KEY as string,
    TO: process.env.TO_PRIVATE_KEY as string,
  },
  CURRENCY: {
    MOSAIC_ID: '72C0212E67A08BCE',
  },
  NETWORK: {
    GENERATION_HASH_SEED: '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4',
    EPOCH_ADJUSTMENT: 1667250467,
    ENDPOINT: 'https://mikun-testnet.tk:3001',
    WEBSOCKET: 'wss://mikun-testnet.tk:3001/ws',
  },
};
