import 'react-native-url-polyfill/auto';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import TorusSolanaRNSDK from '@toruslabs/torus-solana-react-sdk';
import {View, Button, Text, ScrollView, Linking} from 'react-native';

import {toUTF8Array, generateTransaction, ChainID, networkMap} from './utils';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const dummyProviderState = {
  blockExplorerUrl: 'https://explorer.solana.com',
  chainId: '0x2',
  displayName: 'Solana Testnet',
  logo: 'solana.svg',
  rpcTarget: 'https://api.testnet.solana.com',
  ticker: 'SOL',
  tickerName: 'Solana Token',
};

// Configure the SDK, get a instance of SDK back.
const torusSdk = new TorusSolanaRNSDK({
  base_url: 'http://localhost:8080',
  deeplink_schema: 'solanasdk',
});

const App = () => {
  const [result, setResult] = useState<string>('~So Empty~');
  const [pubkey, setPubkey] = useState<string>('');
  const [chainId, setChainId] = useState<ChainID>('0x1');
  const [nfts, setNFTS] = useState([]);
  const [dummyTX, setDummyTX] = useState<string>('');

  useEffect(() => {
    generateTransaction(chainId, pubkey, pubkey, 0.0001).then(tx =>
      setDummyTX(tx),
    );
  }, [pubkey, chainId]);

  const dummyTopupPayload = useMemo(
    () => ({
      selectedAddress: pubkey,
      provider: 'rampnetwork',
    }),
    [pubkey],
  );

  const handleResult = useCallback(val => {
    console.log(val.method);
    switch (val.method) {
      case 'get_accounts':
        setPubkey(val.result[0]);
        break;
      case 'wallet_get_provider_state':
        console.log(val.result.accounts[0]);
        setPubkey(val.result.accounts[0]);
        setChainId(val.result.chainId);
        break;
      case 'nft_list':
        setNFTS(val.result);
        break;
      default:
        console.log('default called');
        break;
    }
    setResult(JSON.stringify(val || {}));
  }, []);

  const sendTransaction = useCallback(
    async (
      chain: ChainID,
      sender: string,
      receiver: string,
      amount: number,
      feePayer = sender,
    ) => {
      const transaction = await generateTransaction(
        chain,
        sender,
        receiver,
        amount,
        feePayer,
      );
      torusSdk.sendTransaction(transaction);
    },
    [],
  );

  const transferNFT = useCallback((receiver_add, mint_add) => {
    torusSdk.sendNft({
      mint_add,
      receiver_add,
    });
  }, []);

  const transferSPL = useCallback(
    (amount: number, receiver_add: string, mint_add: string) => {
      torusSdk.sendSpl({
        amount,
        mint_add,
        receiver_add,
      });
    },
    [],
  );

  // All results are dropped in this callback
  torusSdk.onResult(Linking, (val: any) => {
    console.log('ALL RESULTS HERE', val);
    handleResult(val);
  });

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 25,
        flexGrow: 1,
        borderWidth: 1,
        borderColor: 'red',
      }}>
      <View style={{marginBottom: 20, marginTop: 20}}>
        <Button
          onPress={() => {
            torusSdk.login();
          }}
          title="LOGIN"
        />
        <Button
          onPress={() => {
            torusSdk.logout();
          }}
          title="LOGOUT"
        />
      </View>
      <View style={{marginBottom: 20}}>
        <Button
          onPress={() => {
            torusSdk.walletGetProviderState();
          }}
          title="Get Wallet Provider State"
          color={pubkey && chainId ? '' : 'green'}
        />
        <Button
          onPress={() => {
            torusSdk.getProviderState();
          }}
          title="Get Provider State"
        />
      </View>
      <View style={{marginBottom: 20}}>
        <Button
          onPress={() => {
            torusSdk.getUserInfo();
          }}
          title="User Info"
        />
        <Button
          onPress={() => {
            torusSdk.listNft();
          }}
          title="List Nft"
        />
        <Button
          onPress={() => {
            torusSdk.setProvider(dummyProviderState);
          }}
          title="Set Provider"
        />
        <Button
          onPress={() => {
            torusSdk.topup(dummyTopupPayload);
          }}
          title="Topup"
        />
      </View>
      <Button
        onPress={() => {
          sendTransaction(chainId, pubkey, pubkey, 0.0001);
        }}
        title="Send Transaction"
        disabled={!(pubkey && chainId)}
      />
      <Button
        onPress={() => {
          transferSPL(
            0.001,
            pubkey,
            'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', //USDC
          );
        }}
        title="Send SPL Transaction"
        disabled={!pubkey}
      />
      <Button
        onPress={() => {
          torusSdk.signTransaction(dummyTX);
        }}
        title="Sign Transaction"
        disabled={!pubkey}
      />
      <Button
        onPress={() => {
          torusSdk.signAllTransactions([dummyTX, dummyTX, dummyTX]);
        }}
        title="Sign All Transactions"
        disabled={!pubkey}
      />
      <Button
        onPress={() => {
          transferNFT(pubkey, nfts[0]);
        }}
        title="Send Nft"
        disabled={!pubkey || !nfts.length}
      />

      <Button
        onPress={() => {
          torusSdk.signMessage(toUTF8Array('Example Message')); // TODO: why can't this be string ??
        }}
        title="SIGN MESSAGE"
      />
      <View style={{marginTop: 50, flex: 1}}>
        <Text>Network: {networkMap[chainId]}</Text>
        <Text>Pubkey: {pubkey || 'NA'}</Text>
        <Text>RESULTS:</Text>
        <Text style={{marginTop: 10}}>{result}</Text>
      </View>
    </ScrollView>
  );
};

export default App;
