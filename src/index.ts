import createClient, { type Middleware } from "openapi-fetch";
import type { paths, components } from "./generated/types";

export { paths, components };

export function getClient({
    apiKey,
    baseUrl = "https://api.cycle.io",
    hubId,
    fetch: customFetch,
}: {
    baseUrl?: string;
    apiKey: string;
    hubId: string;
    fetch?: typeof fetch;
}) {
    const client = createClient<paths>({
        baseUrl,
        fetch: customFetch || fetch,
    });

    const authMiddleware: Middleware = {
        async onRequest(req) {
            req.headers.set("Authorization", `Bearer ${apiKey}`);
            req.headers.set("X-Hub-Id", hubId);
            return req;
        },
    };

    client.use(authMiddleware);
    return client;
}
