import { components } from "../../src";

let hitCount = 0; // Tracks how many times the endpoint was hit

function getMockJob(): components["schemas"]["Job"] {
    hitCount++; // Increment on each call

    const totalSteps = 6; // Number of steps in the job
    const stepIndex = Math.min(hitCount - 1, totalSteps); // Ensure we don't overflow

    // Determine current state of job/task
    const jobState = hitCount < totalSteps + 2 ? "running" : "completed"; 
    const taskState = hitCount < totalSteps + 2 ? "running" : "completed"; 

    // Update steps dynamically
    const steps = [
        "Preparing",
        "Importing",
        "Building",
        "Verifying",
        "Saving",
        "Cleaning",
    ].map((caption, index) => {
        const stepState = index < stepIndex ? "completed" : index === stepIndex ? "started" : "queued";
        return {
            caption,
            description: `Step ${index + 1} of ${totalSteps}`,
            started: index <= stepIndex ? new Date().toISOString() : "0001-01-01T00:00:00Z",
            completed: stepState === "completed" ? new Date().toISOString() : "0001-01-01T00:00:00Z",
        };
    });

    return {
        id: "679924d679a6ef7d9ed1930c",
        queue: "hub-6799222a44801f92ed14cce5-images",
        caption: "Importing image 'cycleplatform/getting-started:latest'",
        schedule: "",
        events: {
            queued: "2025-01-28T18:41:26.269Z",
            started: "2025-01-28T18:41:26.269Z",
            completed: jobState === "completed" ? new Date().toISOString() : "0001-01-01T00:00:00Z",
        },
        expires: "2025-01-28T19:41:25.780Z",
        tasks: [
            {
                id: "679924d679a6ef7d9ed1930d",
                caption: "Importing image 'cycleplatform/getting-started:latest'",
                header: "image.import",
                events: {
                    queued: "2025-01-28T18:41:26.269Z",
                    started: "2025-01-28T18:41:26.269Z",
                    completed: taskState === "completed" ? new Date().toISOString() : "0001-01-01T00:00:00Z",
                },
                error: null,
                steps,
                state: {
                    current: taskState,
                    changed: new Date().toISOString(),
                },
                input: {
                    id: "679924d5dbd63240427ccf4c",
                },
                output: null,
            },
        ],
        hash: "060f4d226d64560101ca3f32aa31ad06",
        limit_duplicates: false,
        creator: {
            id: "5bac2478b6393d0001f21aad",
            type: "account",
        },
        hub_id: "6799222a44801f92ed14cce5",
        state: {
            current: jobState,
            changed: new Date().toISOString(),
            error: null,
        },
    };
}

export function resetMockedJob() {
    hitCount = 0
}

export { getMockJob };
