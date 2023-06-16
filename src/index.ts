import createClient from "openapi-fetch";
import type { paths } from "./generated/types";

let authToken: string | undefined = undefined;
let hubScope: string | undefined = undefined;
let baseUrl = "https://api.cycle.io";

export function setAuthToken(token: string | undefined) {
  authToken = token;
}

export function setHubScope(hubId: string | undefined) {
  hubScope = hubId;
}

export function setBaseUrl(url: string) {
  baseUrl = url;
}

const baseClient = createClient<paths>();
export const client = new Proxy(baseClient, {
  get(_, key: keyof typeof baseClient) {
    const headers: HeadersInit = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (hubScope) {
      headers["X-Hub-Id"] = hubScope;
    }
    const newClient = createClient<paths>({
      headers,
      baseUrl,
    });
    return newClient[key];
  },
});

type ParamVal = string | number | Record<string, string | number> | string[];
type Params<T extends string, K extends ParamVal> = Partial<Record<T, K>>;

/** Converts any Cycle query parameters into a URL search string */
export function querySerializer<T extends string, K extends ParamVal>(
  params: Params<T, K>
): string {
  const nv = Object.entries(params).reduce((acc, [k, v]) => {
    if (typeof v === "string") {
      acc[k] = v;
      return acc;
    }

    if (v && typeof v === "object") {
      Object.keys(v).forEach(
        (sk) => (acc[`${k}[${sk}]`] = (v as Record<string, string>)[sk])
      );
    }

    return acc;
  }, {} as Record<string, string>);

  return new URLSearchParams(nv).toString();
}
