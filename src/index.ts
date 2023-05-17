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
