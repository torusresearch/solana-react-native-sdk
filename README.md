## WIP Torus Solana Redirect flow react native SDK.
- npm run build -> makes a lib folder at root
- on the target project [local install] -> yarn add ../torus-solana-react-sdk
- Deeplink feature is needed on the client react native project, if not already added add one using this link : https://reactnavigation.org/docs/deep-linking/
For whatever deeplink scehma chosen(or existing schema)

```
import TorusSolanaSdk from 'torus-solana-react-sdk';

// Configure the SDK, get a instance of SDK back.
const torusSdk = new TorusSolanaSdk({
    base_url: '<torus solana url>',
    deeplink_schema: '<deeplink scehma>',
  });

  // All results are dropped in this callback
  torusSdk.getResults(Linking, (val: any) => {
    console.log('ALL RESULTS HERE', val);
  });

torusSdk.login();
```

