import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

export const restHandlers = [
    http.get("https://api.dev.cycle.io/v1/environments", ({ request }) => {
        return new HttpResponse("{}", {
            status: 403,
            headers: {
                "X-AUTH-TOKEN": request.headers.get("Authorization") || "",
                "X-HUB-ID": request.headers.get("X-Hub-Id") || "",
            },
        });
    }),
    http.get("https://api.cycle.io/v1/environments", ({ request }) => {
        return new HttpResponse("{}", {
            status: 403,
            headers: {
                "X-AUTH-TOKEN": request.headers.get("Authorization") || "",
                "X-HUB-ID": request.headers.get("X-Hub-Id") || "",
            },
        });
    }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
