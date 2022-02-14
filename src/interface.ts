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

export interface JRPCResponse {
    jsonrpc: string,
    result: {
        data?: any;
        success: boolean;
        message?: string;
        method: string;
    },
    id: number;
}
