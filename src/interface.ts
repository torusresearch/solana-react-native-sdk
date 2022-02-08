import {CallbackMsgType} from "./utils/enum";

export interface SDKConfig {
    base_url: string
    deeplink_schema: string
}
export interface ProviderConfig {
    blockExplorerUrl: string;
    logo: string;
    tickerName: string;
    ticker: string;
    rpcTarget: string;
    chainId: string;
    displayName: string;
}

export interface SdkRpc {
    jsonrpc: string,
    method?: string,
    result?: string,
    status: CallbackMsgType
    id: number;
}
