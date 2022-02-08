import {ProviderConfig, SDKConfig, SdkRpc} from "./interface";
import {defaultConfig} from "./utils/constants";
import {CallbackMsgType} from "./utils/enum";
// atob and btoa are available in the context of the browser,
// and that's why it works there, not primarily in react native
import {decode as atob, encode as btoa} from "base-64";
import {objectToQueryParams, rpcResponse} from "./utils/helper";
// https://github.com/sideway/joi/issues/2141#issuecomment-558429490
import "text-encoding-polyfill";
import InAppBrowser from "react-native-inappbrowser-reborn";

import {URL, URLSearchParams} from "whatwg-url";

if (typeof BigInt === "undefined") global.BigInt = require("big-integer");

export default class TorusSolanaRNSDK {
  private config: SDKConfig = defaultConfig;

  constructor(config?: SDKConfig) {
    if (config) {
      this.config = config;
    }
  }
  private _resultCallback = (response: SdkRpc) => {
    console.error("CALLBACK NOT REGISTERED");
  };

  login() {
    this.openUrl("login");
  }

  logout() {
    this.openUrl("logout");
  }

  getUserInfo() {
    this.openUrl("user_info");
  }

  setProvider(providerConfig: ProviderConfig) {
    this.openUrl("set_provider", providerConfig);
  }

  getProviderState() {
    this.openUrl("get_provider_state");
  }

  walletGetProviderState() {
    this.openUrl("wallet_get_provider_state");
  }

  topup(payload: { selectedAddress: string; provider: string }) {
    this.openUrl("topup", payload);
  }

  signTransaction(serializedTransaction: string) {
    this.openUrl("sign_transaction", serializedTransaction);
  }

  signAllTransactions(serializedTransactions: string[]) {
    this.openUrl("sign_all_transactions", serializedTransactions);
  }

  // TODO: why??
  signMessage(message: Uint8Array) {
    this.openUrl("sign_message", message);
  }

  sendTransaction(serializedTransaction: string) {
    this.openUrl("send_transaction", serializedTransaction);
  }

  // Get the list of all the NFTs in the wallet. There's a limit to browser redirect URL.
  // we should only send the minimum required info back like account addresses and image URLs.
  listNft() {
    this.openUrl("nft_list");
  }

  sendSpl(transactionData: {
    mint_add: string;
    receiver_add: string;
    amount: number;
  }) {
    this.openUrl("spl_transfer", transactionData);
  }

  sendNft(transactionData: { mint_add: string; receiver_add: string }) {
    this.openUrl("nft_transfer", transactionData);
  }

  iframeStatus(iframeData: { isFullScreen: boolean; rid: string }) {
    this.openUrl("iframe_status", iframeData);
  }

  private async openUrl(method: string, data?: any) {
    if (!this._resultCallback) {
      throw new Error('CALLBACK NOT REGISTERED');
    }
    const baseURL = `${this.config.base_url}/redirectflow`;
    let params = {};
    switch (method) {
      case "set_provider":
        params = { ...data };
        break;
      case "iframe_status":
        params = { ...data };
        break;
      case "topup":
        params = {
          selectedAddress: data.selectedAddress,
          provider: data.provider,
        };
        break;
      case "send_transaction":
      case "sign_transaction":
      case "sign_all_transactions":
      case "sign_message":
        params = {
          message: data,
        };
        break;
      case "spl_transfer":
      case "nft_transfer":
        params = { ...data };
        break;
      default:
    }

    let queryParams: { [key: string]: string } = {};
    queryParams["method"] = method;

    let encodedParams = btoa(JSON.stringify(params));
    const resolvePath = `${this.config.deeplink_schema}://redirect-handle`;
    let url = `${baseURL}?${objectToQueryParams(queryParams)}&resolveRoute=${resolvePath}#params=${encodedParams}`;
    try {
      if (await InAppBrowser.isAvailable()) {
        // close any existing sessions in background - https://github.com/proyecto26/react-native-inappbrowser/issues/254
        await InAppBrowser.closeAuth();
        // openAuth session, save response in 'respose'
        console.log("EOPN", url);
        const response = await InAppBrowser.openAuth(url, resolvePath, {
          ephemeralWebSession: false,
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false
        });

        // parse the response, send data back to app
        // 'response.type === 'success'' means that inAppBrowser redirected back to app successfully, it does not mean the intended task completed successfully.
        // the intended task completed successfully, if isComplete=true in response url.
        if (response.type === 'success' && response.url) {
          console.log("res", response.url);
          const url = new URL(response.url);
          const queryParams = new URLSearchParams(url.search);
          this._resultCallback(
              rpcResponse((queryParams.get("isComplete") === 'true')? CallbackMsgType.SUCCESS: CallbackMsgType.ERROR, atob(`${queryParams.get("result")}`), queryParams.get("method") ||'')
          );
          return;
        } else if (response.type === 'cancel' || response.type === 'dismiss') {
          this._resultCallback(rpcResponse(CallbackMsgType.CANCEL));
          return;
        }
        this._resultCallback(rpcResponse(CallbackMsgType.ERROR));
      }
      this._resultCallback(rpcResponse(CallbackMsgType.ERROR, "InAppBrowser not available"));
      return;
    } catch (e) {
      this._resultCallback(rpcResponse(CallbackMsgType.ERROR, `Error opening URL: ${JSON.stringify(e)}`))
    }
  }

  onResult(linkingObject: any,
           callback: (result: SdkRpc) => void
  ) {
    this._resultCallback = callback;
    linkingObject.addEventListener("url", (resultUrl: any) => {
      const url = new URL(resultUrl.url);
      callback(
          rpcResponse(CallbackMsgType.SUCCESS, atob(`${new URLSearchParams(url.search).get("result")}`), new URLSearchParams(url.search).get("method") || "")
      );
    });
  }
}
