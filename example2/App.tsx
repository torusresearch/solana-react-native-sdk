import React from 'react';
import TorusSolanaSdk from 'torus-solana-react-sdk';
import {View, Button, Linking} from 'react-native';

const App = () => {
  // Configure the SDK, get a instance of SDK back.
  const torusSdk = new TorusSolanaSdk({
    base_url: 'http://192.168.1.17:8080',
    deeplink_schema: 'solanasdk',
  });

  // All results are dropped in this callback
  torusSdk.getResults(Linking, (val: any) => {
    console.log('ALL RESULTS HERE', val);
  });

  return (
    <View>
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
      {/* <Button
        onPress={() => {
          torusSdk.setProvider();
        }}
        title="Set Provider"
      /> */}
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
      {/* <Button
        onPress={() => {
          torusSdk.topup();
        }}
        title="Topup"
      />
      <Button
        onPress={() => {
          torusSdk.sendTransaction();
        }}
        title="Send Transaction"
      />
      <Button
        onPress={() => {
          torusSdk.signTransation();
        }}
        title="Sign Transaction"
      /> */}
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
      {/* <Button
        onPress={() => {
          torusSdk.sendNft();
        }}
        title="Send Nft"
      /> */}

      {/* <Button
        onPress={() => {
          torusSdk.signMessage();
        }}
        title="SIGN MESSAGE"
      /> */}
    </View>
  );
};

export default App;
