import {
  client,
  setAuthToken,
  setHubScope,
  setBaseUrl,
  querySerializer,
} from "../src/index";
import { expect, test } from "vitest";

test("test setting base URL", async () => {
  const baseUrl = "https://api.dev.cycle.io";
  setBaseUrl(baseUrl);

  const envs = client.GET("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.url).toBe("https://api.dev.cycle.io/v1/environments");
});

test("test setting auth token", async () => {
  const token = "abc123";
  setAuthToken(token);

  const envs = client.GET("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.headers.get("x-auth-token")).toBe(`Bearer ${token}`);
});

test("test setting hub scope", async () => {
  const hubId = "abc123";
  setHubScope(hubId);

  const envs = client.GET("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.headers.get("x-hub-id")).toBe(hubId);
});

test("test changing auth token between requests", async () => {
  const token1 = "abc123";
  const token2 = "def456";

  setAuthToken(token1);

  const envs = client.GET("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.headers.get("x-auth-token")).toBe(`Bearer ${token1}`);

  setAuthToken(token2);

  const envs2 = client.GET("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp2 = await envs2;

  // Mocked by msw to inject into this header
  expect(resp2.response.headers.get("x-auth-token")).toBe(`Bearer ${token2}`);
});

test("test query params are properly serialized", async () => {
  const baseUrl = "https://api.dev.cycle.io";
  setBaseUrl(baseUrl);

  const envs = client.GET("/v1/environments", {
    params: {
      query: {
        page: { size: 100, number: 1 },
        filter: {
          state: "live,stopped",
        },
      },
    },
    querySerializer,
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.url).toBe(
    "https://api.dev.cycle.io/v1/environments?page%5Bsize%5D=100&page%5Bnumber%5D=1&filter%5Bstate%5D=live%2Cstopped"
  );
});
