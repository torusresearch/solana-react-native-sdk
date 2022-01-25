# Torus Solana Redirect flow react native SDK
## _A. Steps to run the example project_
- ```cd``` in the project root.
- ```yarn```.
- ```yarn run build```.
- ```cd example``` .
- ```yarn```.
- ```yarn run <platform>```.

## _B. Steps to use SDK in your project_
- Step 1: Add a deeplik support in your app (if not already) : https://reactnavigation.org/docs/deep-linking/ .
- Step 2: Once you have the deeplink schema, install the package from registry ``` yarn add @toruslabs/torus-solana-react-sdk ``` .
_______
- Step 3: We use in app browsers to support auth and data transfer via redirect flow, in order to enable that in your target app follow the below steps


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-inappbrowser-reborn` and add `RNInAppBrowser.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppBrowser.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### iOS with Podfile
1. Open up `ios/Podfile`
- Add `pod 'RNInAppBrowser', :path => '../node_modules/react-native-inappbrowser-reborn'`
2. Run `pod install`

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
- Add `import com.proyecto26.inappbrowser.RNInAppBrowserPackage;` to the imports at the top of the file
- Add `new RNInAppBrowserPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-inappbrowser-reborn'
   project(':react-native-inappbrowser-reborn').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-inappbrowser-reborn/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
   implementation project(':react-native-inappbrowser-reborn')
   ```
4. Update ProGuard config (Optional)
- Append the following lines to your ProGuard config (`proguard-rules.pro`)
  ```
  -keepattributes *Annotation*
  -keepclassmembers class ** {
    @org.greenrobot.eventbus.Subscribe <methods>;
  }
  -keep enum org.greenrobot.eventbus.ThreadMode { *; }
  ```
  More details [here](https://github.com/proyecto26/react-native-inappbrowser#getting-started) .
____
- Step 4: Use the following code to configure and get started with the sdk.
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
## _C. How to build project_
- ```cd``` in this project root.
- ```yarn```.
- ```yarn run build```.