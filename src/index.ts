import createClient, { type Middleware } from "openapi-fetch";
import type { paths, components, operations } from "./generated/types";

export { paths, components, operations };

export * from "./jobs";

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
        async onRequest({ request }) {
            request.headers.set("Authorization", `Bearer ${apiKey}`);
            request.headers.set("X-Hub-Id", hubId);
            return request;
        },
    };

    client.use(authMiddleware);
    return client;
}
