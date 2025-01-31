import { getClient } from ".";
import { type components } from "./generated/types";

export type TrackJobSettings = {
    pollingInterval?: number;
};

export type JobProgressEvent = ReturnType<typeof getJobProgress> & {
    state: components["schemas"]["JobState"]["current"];
};

class JobTracker extends EventTarget {
    promise: Promise<components["schemas"]["Job"]>;

    constructor(
        client: ReturnType<typeof getClient>,
        job: string | { id: string },
        customSettings?: TrackJobSettings
    ) {
        super();
        this.promise = this.track(client, job, customSettings);
    }

    private async track(
        client: ReturnType<typeof getClient>,
        job: string | { id: string },
        customSettings?: TrackJobSettings
    ): Promise<components["schemas"]["Job"]> {
        const jobId = typeof job === "object" ? job.id : job;
        const settings: TrackJobSettings = {
            pollingInterval: 2000,
            ...customSettings,
        };

        let retryCounter = 0;

        while (true) {
            const jresp = await client.GET("/v1/jobs/{jobId}", {
                params: { path: { jobId } },
            });

            if (jresp.error) {
                if (retryCounter < 5 && jresp.error.error.code === "404.job") {
                    retryCounter++;
                    await this.delay(settings.pollingInterval);
                    continue;
                }
                throw jresp.error;
            }

            const jobData = jresp.data.data;

            const progress = getJobProgress(jobData);

            this.dispatchEvent(
                new CustomEvent<JobProgressEvent>("progress", {
                    detail: { ...progress, state: jobData.state.current },
                })
            );

            if (isJobDone(jobData)) {
                if (jobData.state.current === "error") {
                    new CustomEvent<components["schemas"]["Job"]>("error", {
                        detail: jobData,
                    });
                    throw jobData;
                }

                this.dispatchEvent(
                    new CustomEvent<components["schemas"]["Job"]>("done", {
                        detail: jobData,
                    })
                );
                return jobData;
            }

            await this.delay(settings.pollingInterval);
        }
    }

    private delay(ms: number = 2000) {
        return new Promise((res) => setTimeout(res, ms));
    }
}

function isJobDone(job: components["schemas"]["Job"]) {
    const doneState = [
        "completed",
        "error",
        "expired",
    ] as components["schemas"]["JobState"]["current"][];
    return doneState.includes(job.state.current);
}

export const zeroTimeString = "0001-01-01T00:00:00Z";
/**
 * Gets a breakdown of a job's progress
 * @param job A Cycle job
 * @returns an analysis of job progress
 */
export function getJobProgress(job: components["schemas"]["Job"]) {
    if (!job.tasks || job.tasks.length === 0) {
        return { total: 0, completed: 0, failed: 0, percent: 100 };
    }

    const stepAnalysis = job.tasks.reduce(
        (acc, cur) => {
            const taskStepCount = cur.steps?.length || 1;
            acc["total"] += taskStepCount;

            // task hasn't started yet
            if (cur.state.current === "pending") {
                return acc;
            }

            // no steps
            if (!cur.steps?.length) {
                switch (cur.state.current) {
                    case "completed":
                        acc["completed"] += 1;
                        break;
                    case "error":
                        acc["failed"] += 1;
                }
                return acc;
            }

            cur.steps?.forEach((s) => {
                if (s.completed !== zeroTimeString) {
                    acc["completed"] += 1;
                    return;
                }

                if (
                    ["error", "completed"].includes(cur.state.current || "") &&
                    s.started !== zeroTimeString
                ) {
                    // task is done but step didn't complete
                    acc["failed"] += 1;
                }
            });

            return acc;
        },
        { total: 0, completed: 0, failed: 0 }
    );

    return {
        ...stepAnalysis,
        percent: (stepAnalysis.completed / stepAnalysis.total) * 100,
    };
}

/**
 * Tracks a job in Cycle API and allows checking its progress.
 * @param client The Cycle API client instance
 * @param job A job ID or object containing an id field containing the ID of the job
 * @param customSettings Settings like polling interval in ms
 * @returns An object with a Promise and an EventTarget for tracking progress
 */
export function trackJob(
    client: ReturnType<typeof getClient>,
    job: string | { id: string },
    customSettings?: TrackJobSettings
) {
    return new JobTracker(client, job, customSettings);
}
