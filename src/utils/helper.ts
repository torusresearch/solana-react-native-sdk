export function objectToQueryParams(obj: {[key:string]: string}): string { 
    return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}