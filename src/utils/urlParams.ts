import { headers } from "next/headers";
import type { ProductParams } from "@/types/searchParams";

type Params = ProductParams;

export function getUrlParams(params: Params): string {
    const headerList = headers();
    const pathname = headerList.get("x-pathname");
    const url = new URL(pathname ? pathname : "/", process.env.NEXT_PUBLIC_URL);

    let key: keyof Params;
    for (key in params) {
        const value: any = params[key];
        if (value == undefined)
            url.searchParams.delete(key, value);
        else if (value instanceof Array) {
            value.forEach(v => url.searchParams.append(key, v))
            
        } else
            url.searchParams.set(key, value);     
    }

    return url.toString();
}