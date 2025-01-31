import { getClient } from "../src/index";
import { expect, describe, it, vi, afterEach } from "vitest";
import { server } from "./setup";
import { http, HttpResponse } from "msw";
import { getMockJob, resetMockedJob } from "./jobs/job.mock";
import { trackJob } from "../src/jobs";

describe("trackJob", () => {
    afterEach(() => {
        resetMockedJob();
    });
    it("should resolve when the job completes", async () => {
        const client = getClient({ apiKey: "test-key", hubId: "test-hub" });

        const jobId = "679924d679a6ef7d9ed1930c";
        const tracker = trackJob(client, jobId, { pollingInterval: 100 });

        // Listen to progress events
        const progressSpy = vi.fn();
        tracker.addEventListener("progress", progressSpy);

        // Wait for job to complete
        const job = await tracker.promise;

        expect(job.state.current).toBe("completed");
        expect(progressSpy).toHaveBeenCalled(); // Ensure progress events were triggered
        // expect(callCount).toBeGreaterThan(1); // Ensure polling occurred
    });

    it("should fail if the job errors out", async () => {
        server.use(
            http.get("https://api.cycle.io/v1/jobs/:jobId", ({  }) => {
                return HttpResponse.json({
                    data: {
                        ...getMockJob(),
                        state: { current: "error" },
                    },
                });
            })
        );

        const client = getClient({ apiKey: "test-key", hubId: "test-hub" });
        const jobId = "679924d679a6ef7d9ed1930c";
        const tracker = trackJob(client, jobId, { pollingInterval: 100 });

        await expect(tracker.promise).rejects.toThrow(); // Expect it to fail
    });

    it("should trigger progress updates", async () => {
        const client = getClient({ apiKey: "test-key", hubId: "test-hub" });
        const jobId = "679924d679a6ef7d9ed1930c";
        const tracker = trackJob(client, jobId, { pollingInterval: 100 });

        const progressUpdates: any[] = [];
        tracker.addEventListener("progress", (event) => {
            progressUpdates.push((event as CustomEvent).detail);
        });

        await tracker.promise;
        console.log("EVVV", progressUpdates);

        expect(progressUpdates.length).toBeGreaterThan(1); // Ensure multiple progress updates
        expect(progressUpdates[0].percent).toBe(0);
        expect(progressUpdates[progressUpdates.length - 1].state).toBe(
            "completed"
        );
    });
});
