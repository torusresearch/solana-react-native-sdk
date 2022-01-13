# Torus Solana Redirect flow react native SDK
## _Steps to run the example project_
- ```cd``` in the project root.
- ```yarn```.
- ```yarn run build```.
- ```cd example``` .
- ```yarn```.
- ```yarn run <platform>```.

## _Steps to use SDK in your project_
- Add a deeplik support in your app (if not already) : https://reactnavigation.org/docs/deep-linking/ .
- Once you have the deeplink schema, install the package from registry ``` yarn add @toruslabs/torus-solana-react-sdk ``` .
- Use the following code to configure and get started with the sdk.
```
import { Linking } from 'react-native';
import TorusSolanaSdk from '@toruslabs/torus-solana-react-sdk';
....
const torusSdk = new TorusSolanaSdk({
    base_url: '<torus solana url>',
    deeplink_schema: '<deeplink scehma>',
  });

  // All results are dropped in this callback
  torusSdk.getResults(Linking, (response: any) => {
    console.log('ALL RESULTS HERE', response);
  });
....
torusSdk.login();
```
## _Steps to make a local build and use it in project_
1. ##### Make the local build
- ```cd``` in this project root.
- ```yarn```.
- ```yarn run build```.
2. ##### Use the local build in your project
- ```cd``` in the your project root.
- ```yarn add <path to the cloned repo>```.
- Serve the app.
