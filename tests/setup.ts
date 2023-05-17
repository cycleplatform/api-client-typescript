import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

export const restHandlers = [
  rest.get("https://api.cycle.io/v1/environments", (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json({}),
      ctx.set("X-AUTH-TOKEN", req.headers.get("Authorization") || ""),
      ctx.set("X-HUB-ID", req.headers.get("X-Hub-Id") || "")
    );
  }),
  rest.get("https://api.dev.cycle.io/v1/environments", (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json({}),
      ctx.set("X-AUTH-TOKEN", req.headers.get("Authorization") || ""),
      ctx.set("X-HUB-ID", req.headers.get("X-Hub-Id") || "")
    );
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
