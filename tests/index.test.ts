import { getClient } from "../src/index";
import { expect, test } from "vitest";

test("test setting base URL", async () => {
    const baseUrl = "https://api.dev.cycle.io";
    const client = getClient({ baseUrl, apiKey: "testkey", hubId: "hub-123" });

    const resp = await client.GET("/v1/environments");

    // Mocked by msw to inject into this header
    expect(resp.response.url).toBe("https://api.dev.cycle.io/v1/environments");
});

test("test setting auth token", async () => {
    const token = "testToken";
    const client = getClient({ apiKey: token, hubId: "hub-123" });

    const resp = await client.GET("/v1/environments", {
        params: {
            query: {},
        },
    });

    // Mocked by msw to inject into this header
    expect(resp.response.headers.get("x-auth-token")).toBe(`Bearer ${token}`);
});

test("test setting hub scope", async () => {
    const token = "testToken";
    const hubId = "abc123";
    const client = getClient({ apiKey: token, hubId });

    const resp = await client.GET("/v1/environments");

    // Mocked by msw to inject into this header
    expect(resp.response.headers.get("x-hub-id")).toBe(hubId);
});

test("test query params are properly serialized", async () => {
    const token = "testToken";
    const hubId = "abc123";
    const baseUrl = "https://api.dev.cycle.io";

    const client = getClient({ baseUrl, apiKey: token, hubId });

    const resp = await client.GET("/v1/environments", {
        params: {
            query: {
                page: { size: 100, number: 1 },
                filter: {
                    state: "live,stopped",
                },
            },
        },
    });

    // Mocked by msw to inject into this header
    expect(resp.response.url).toBe(
        "https://api.dev.cycle.io/v1/environments?page[size]=100&page[number]=1&filter[state]=live%2Cstopped"
    );
});
