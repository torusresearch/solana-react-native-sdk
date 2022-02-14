import { decode } from "base-64";
import { JRPCResponse } from "../interface";
import { CallbackMsgType } from "./enum";

export function objectToQueryParams(obj: {[key:string]: string}): string {
    return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}

export function parseResponseFromUrl(url: string) {
    try{
        const res = url.split('#result=')[1];
        const parsedRes = JSON.parse(decode(res));
        return parsedRes;
    } catch (e) {
        return {}
    }
}

export function rpcResponse(status: CallbackMsgType, method: string, message?: string): JRPCResponse {
    return { jsonrpc: "2.0", id: 1, result: {
        success: status === CallbackMsgType.SUCCESS ? true :false,
        message: message || "",
        method,
    } }
}