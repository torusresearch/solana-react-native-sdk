import React, {useState} from 'react';
import TorusSolanaSdk from '@toruslabs/torus-solana-react-sdk';
import {View, Button, Linking, Text, ScrollView} from 'react-native';
import Snackbar from 'react-native-snackbar';

// const dummySPLTransaction =
//   '010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000205a44b854a51e704d2af5ada4ef25408550364a1e27cb7574b376f57db1763953f28be84dab0b091f9453c53ede3fbd9d1b9df5540e16b364a59b9191a4d2775eb5fe1031e6d2276b9dc3cc172723bbd0001525cf1d988d965245c354986d1750fc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d6106ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a90cdbfc197c9fda126242fd784364d8d155c66479f7b2a5698ca1a9bab3eedd44010404010302000a0c010000000000000006';
const dummySerializedTransaction =
  '010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000103a44b854a51e704d2af5ada4ef25408550364a1e27cb7574b376f57db1763953f1e140dde934169753442cad0586618f25f5a1eaf6349fe6b65becd77574d4aae000000000000000000000000000000000000000000000000000000000000000074539fd8a274c963db7a97c90d6ecf0dcd77cf4cc974d6061dd9122f0ec71f3c01020200010c02000000a086010000000000';
const dummyUint8Message = new Uint8Array([
  69, 120, 97, 109, 112, 108, 101, 32, 77, 101, 115, 115, 97, 103, 101,
]);
const dummyProviderState = {
  blockExplorerUrl: 'https://explorer.solana.com',
  chainId: '0x1',
  displayName: 'Solana Mainnet',
  logo: 'solana.svg',
  rpcTarget: 'https://api.mainnet-beta.solana.com',
  ticker: 'SOL',
  tickerName: 'Solana Token',
};
const dummyTopupPayload = {
  selectedAddress: 'C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW',
  provider: 'rampnetwork',
};
const dummySplTransfer = {
  mint_add: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', //USDC
  receiver_add: 'C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW',
  amount: 0.01,
};
const dummyNftTransfer = {
  mint_add: 'BAYYCCY31SRrexQKwGqDRonVzMiB2Y2HagNZQv6cNWk7',
  receiver_add: 'C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW'
};

const App = () => {
  const [result, setResult] = useState<string>('~So Empty~');

  // Configure the SDK, get a instance of SDK back.
  const torusSdk = new TorusSolanaSdk({
    base_url: 'http://192.168.1.3:8080',
    deeplink_schema: 'solanasdk',
  });

  function showSnackbar(text: string, callback: () => void) {
    Snackbar.show({
      text: text,
      duration: Snackbar.LENGTH_INDEFINITE,
      numberOfLines: 4,
      backgroundColor: '#910000',
      action: {
        text: 'OK',
        textColor: 'white',
        onPress: callback,
      },
    });
  }

  // All results are dropped in this callback
  torusSdk.getResults(Linking, (val: any) => {
    console.log('ALL RESULTS HERE', val);
    setResult(JSON.stringify(val || {}));
  });

  return (
    <View style={{paddingTop: 25}}>
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
      <Button
        onPress={() => {
          torusSdk.getUserInfo();
        }}
        title="User Info"
      />
      <Button
        onPress={() => {
          torusSdk.setProvider(dummyProviderState);
        }}
        title="Set Provider"
      />
      <Button
        onPress={() => {
          torusSdk.getProviderState();
        }}
        title="Get Provider State"
      />
      <Button
        onPress={() => {
          torusSdk.walletGetProviderState();
        }}
        title="Get Wallet Provider State"
      />
      <Button
        onPress={() => {
          showSnackbar(
            'We used a dummy data for demo purposes, transaction might fail. Change data if required and press OK to proceed',
            () => {
              torusSdk.topup(dummyTopupPayload);
            },
          );
        }}
        title="Topup"
      />
      <Button
        onPress={() => {
          showSnackbar(
            'We used a dummy data for demo purposes, transaction might fail. Change data if required and press OK to proceed',
            () => {
              torusSdk.sendTransaction(dummySerializedTransaction);
            },
          );
        }}
        title="Send Transaction"
      />
      <Button
        onPress={() => {
          showSnackbar(
            'We used a dummy data for demo purposes, transaction might fail. Change data if required and press OK to proceed',
            () => {
              torusSdk.sendSpl(dummySplTransfer);
            },
          );
        }}
        title="Send SPL Transaction"
      />
      <Button
        onPress={() => {
          showSnackbar(
            'We used a dummy data for demo purposes , transaction might fail. Change data if required and press OK to proceed',
            () => {
              torusSdk.signTransaction(dummySerializedTransaction);
            },
          );
        }}
        title="Sign Transaction"
      />
      <Button onPress={() => {
          showSnackbar(
            'We used a dummy data for demo purposes , transaction might fail. Change data if required and press OK to proceed',
            () => {
              torusSdk.signAllTransactions([
                dummySerializedTransaction,
                dummySerializedTransaction,
                dummySerializedTransaction,
              ]);
            },
          );
        }}
        title="Sign All Transactions"
      />
      <Button
        onPress={() => {
          torusSdk.getGaslessPublicKey();
        }}
        title="Get Gasless PubKey"
      />
      <Button
        onPress={() => {
          torusSdk.listNft();
        }}
        title="List Nft"
      />
      <Button
        onPress={() => {
          showSnackbar(
            'Change data in SDK as per *list nft* response, transfer might fail. Press OK to proceed',
            () => {
              torusSdk.sendNft(dummyNftTransfer);
            },
          );
        }}
        title="Send Nft"
      />

      <Button
        onPress={() => {
          torusSdk.signMessage(dummyUint8Message);
        }}
        title="SIGN MESSAGE"
      />
      <ScrollView style={{maxHeight: 200, marginTop: 50}}>
        <Text>RESULTS: </Text>
        <Text style={{marginTop: 10}}>{result}</Text>
      </ScrollView>
    </View>
  );
};

export default App;
