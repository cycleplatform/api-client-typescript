import client, { setAuthToken, setHubScope, setBaseUrl } from "../index";
import { expect, test } from "vitest";

test("test setting base URL", async () => {
  const baseUrl = "https://api.dev.cycle.io";
  setBaseUrl(baseUrl);

  const envs = client.get("/v1/environments", {
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

  const envs = client.get("/v1/environments", {
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

  const envs = client.get("/v1/environments", {
    params: {
      query: {},
    },
  });
  const resp = await envs;

  // Mocked by msw to inject into this header
  expect(resp.response.headers.get("x-hub-id")).toBe(hubId);
});
