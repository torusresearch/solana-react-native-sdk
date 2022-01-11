// @ts-ignore added here cz @types/react-native giving weird bugs of repetitive declaration
import { Linking } from 'react-native';
import { ProviderConfig, TorusSolanaConfig } from './interface';
import { defaultConfig } from './utils/constants';
import { CallbackMsgType } from './utils/enum';
import {encode as btoa,  decode as atob} from 'base-64';
import { objectToQueryParams } from './utils/helper';
import 'text-encoding-polyfill'
// @ts-ignore added here cz @types/react-native giving weird bugs of repetitive declaration
import { URLSearchParams } from 'whatwg-url';
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer')
export default class TorusSolanaSdk { 
    private _sdkConfig: TorusSolanaConfig = defaultConfig;

    constructor(config?: TorusSolanaConfig) {
        if (config) { 
            this._sdkConfig = config;
        }
    }
    private _resultCallback = (event: any,  type?: CallbackMsgType) => {
        console.error("CALLBACK NOT REGISTERED")
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

    topup(payload: { selectedAddress: string,provider: string}) { 
        this.openUrl("topup", payload);
    }
    
    signTransaction(serializedTransaction: string) { 
        this.openUrl("sign_transaction", serializedTransaction);
    }

    signMessage(message: Uint8Array) { 
        this.openUrl("sign_message", message);
    }
    
    sendTransaction(serializedTransaction: string) { 
        this.openUrl("send_transaction", serializedTransaction);
    }

    getGaslessPublicKey() { 
        this.openUrl("get_gasless_public_key");
    }

    listNft() { 
        this.openUrl("nft_list");
    }

    sendNft(transactionData: {mint_add: string,receiver_add: string,sender_add: string}) { 
        this.openUrl("nft_transfer", transactionData);
    }

    iframeStatus(iframeData: {isFullScreen: boolean,rid: string}) { 
        this.openUrl("iframe_status", iframeData);
    }

    private async openUrl(method: string, data?: any) {
        const baseurl = `${this._sdkConfig.base_url}/redirectflow`;
        let url = baseurl;
        let params = {};
        switch (method) {
            case "set_provider":
                params = { ...data };
                break;
            case "iframe_status":
                params = {...data};
                break;
            case "topup":
                params = {
                    params: {
                        selectedAddress: data.selectedAddress,
                    },
                    provider: data.provider,
                };
                break;
            case "send_transaction":
                params = {
                    message: data,
                };
                break;
            case "sign_transaction":
                params = {
                    message: data,
                };
                break;
            case "sign_message":
                params = {
                    data,
                };
                break;
            case "nft_transfer":
                params = { ...data };
                break;
            default:
        }
        let queryParams: {[key:string]: string} = {};
        queryParams["method"] = method;
        let encodedParams = btoa(JSON.stringify(params));
        let useParams = true;
        if ((typeof params === "object" && Object.keys(params).length === 0) || (Array.isArray(params) && params.length === 0)) {
            useParams = false;
        }
        const resolvePath = `${this._sdkConfig.deeplink_schema}://redirect-handle`;
        url = `${url}?${objectToQueryParams(queryParams)}&resolveRoute=${resolvePath}${useParams ? "#params=" + encodedParams : ""
            }`;
        Linking.openURL(url).catch((err: any) => this._resultCallback("Error openeing URL", CallbackMsgType.ERROR));
    }

    getResults(linkingObject: any, callback: (event: any, type?: CallbackMsgType) => void) { 
        this._resultCallback = callback;
        linkingObject.addEventListener('url', (resultUrl: any) => { 
            callback({result : atob(`${new URLSearchParams(resultUrl.url).get('result')}`) || '', method: new URLSearchParams(resultUrl.url).get('method')}, CallbackMsgType.SUCCESS)
        });
    }
}