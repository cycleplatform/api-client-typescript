import createClient from "openapi-fetch";
import { paths } from "./__generated/types";

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
export default new Proxy(baseClient, {
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
