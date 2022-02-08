import {SdkRpc} from "../interface";
import {CallbackMsgType} from "./enum";

export function objectToQueryParams(obj: {[key:string]: string}): string {
    return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}

export function rpcResponse(status: CallbackMsgType, result?: string, method?: string): SdkRpc {
    return { jsonrpc: "2.0", id: 1, method, result, status }
}
