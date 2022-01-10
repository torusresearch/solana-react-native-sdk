// @ts-ignore added here cz @types/react-native giving weird bugs of repetitive declaration
import { Linking } from 'react-native';
import { TorusSolanaConfig } from './interface';
import { defaultConfig } from './utils/constants';
import { CallbackMsgType } from './utils/enum';
import {encode as btoa} from 'base-64';
import { objectToQueryParams } from './utils/helper';

export default class TorusSolanaSdk { 
    sdkConfig: TorusSolanaConfig = defaultConfig;

    constructor(config?: TorusSolanaConfig) {
        if (config) { 
            this.sdkConfig = config;
        }
    }
    private _resultCallback = (event: any,  type?: CallbackMsgType) => {
        console.error("CALLBACK NOT REGISTERED")
    };

    login() { 
        this.openUrl("login");
    }

    signMessage() { 
        this.openUrl("sign_message");
    }

    private async openUrl(method: string) {
        const baseurl = `${this.sdkConfig.base_url}/redirectflow`;
        let url = baseurl;
        let params = {};
        switch (method) {
            // case "set_provider":
            //     params = {
            //         blockExplorerUrl: "https://explorer.solana.com",
            //         chainId: "0x1",
            //         displayName: "Solana Mainnet",
            //         logo: "solana.svg",
            //         rpcTarget: solanaWeb3.clusterApiUrl("mainnet-beta"),
            //         ticker: "SOL",
            //         tickerName: "Solana Token",
            //     };
            //     break;
            case "iframe_status":
                params = {
                    isFullScreen: false,
                    rid: "",
                };
                break;
            case "topup":
                params = {
                    params: {
                        selectedAddress: "C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW",
                    },
                    provider: "rampnetwork",
                };
                break;
            // case "send_transaction":
            //     params = {
            //         message: await generateTransaction(),
            //     };
            //     break;
            // case "sign_transaction":
            //     params = {
            //         message: await generateTransaction(),
            //     };
            //     break;
            case "sign_message":
                params = {
                    data: (new TextEncoder()).encode("Example Message"),
                };
                break;
            case "nft_transfer":
                params = {
                    mint_add: "BAYYCCY31SRrexQKwGqDRonVzMiB2Y2HagNZQv6cNWk7",
                    receiver_add: "C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW",
                    sender_add: "C4Letg829ytf5PqyEDSdBUWs4T1GT7whYGrZsJreftgW"
                };
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
        const resolvePath = `${this.sdkConfig.deeplink_schema}://redirect-handle`;
        url = `${url}?${objectToQueryParams(queryParams)}&resolveRoute=${resolvePath}${useParams ? "#params=" + encodedParams : ""
            }`;
        Linking.openURL(url).catch((err: any) => this._resultCallback("Error openeing URL", CallbackMsgType.ERROR));
    }

    getResults(linkingObject: any, callback: (event: any, type?: CallbackMsgType) => void) { 
        this._resultCallback = callback;
        linkingObject.addEventListener('url', (data: any) => { 
            callback(data, CallbackMsgType.SUCCESS)
        });
    }
}