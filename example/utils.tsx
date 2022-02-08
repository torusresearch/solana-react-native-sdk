import {
  Connection,
  SystemProgram,
  PublicKey,
  Transaction,
  clusterApiUrl,
  Cluster,
} from '@solana/web3.js';

export type ChainID = '0x1' | '0x2' | '0x3';

export const networkMap = {
  '0x1': 'mainnet-beta',
  '0x2': 'testnet',
  '0x3': 'devnet',
};

export const toUTF8Array = (str: string): Uint8Array => {
  const utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
    // surrogate pair
    else {
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return new Uint8Array(utf8);
};

export const generateTransaction = async (
  chainId: ChainID,
  sender_add: string,
  receiver_add: string,
  amount = 0.0001,
  feePayer = sender_add,
) => {
  const rpcTarget = clusterApiUrl(networkMap[chainId] as Cluster);

  const conn = new Connection(rpcTarget);

  const blockhash = (await conn.getRecentBlockhash('finalized')).blockhash;
  console.log('current blockhash = ', blockhash);
  const TransactionInstructions = SystemProgram.transfer({
    fromPubkey: new PublicKey(sender_add),
    toPubkey: new PublicKey(receiver_add),
    lamports: amount * 1000000000,
  });
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(feePayer),
  }).add(TransactionInstructions);
  return transaction
    .serialize({requireAllSignatures: false, verifySignatures: false})
    .toString('hex');
};
