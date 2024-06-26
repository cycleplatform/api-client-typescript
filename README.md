# Cycle API Client - Web & NodeJS

A Cycle API client for the Web/NodeJS

_This is an auto-generated API client based on the [OpenAPI Spec for Cycle](https://github.com/cycleplatform/api-spec). Please do not open any PRs for the generated code under /src/generated. If you have any questions on what changes are made in the latest version, please refer to the spec above._

## Basics

This client utilizes [openapi-typescript](https://github.com/drwpow/openapi-typescript) to generate the type definitions for our client. The client itself is a pre-built [openapi-fetch](https://github.com/drwpow/openapi-typescript/tree/main/packages/openapi-fetch) client for convenience.

Every request should be typesafe, and only endpoints described in the spec will be valid in Typescript as the first parameter to `GET`, `POST`, `PATCH`, or `DELETE`

## Usage

### Installation

```bash
npm i @cycleplatform/api-client-typescript
```

### Making a Request

```ts
import { client } from "@cycleplatform/api-client-typescript";

const client = getClient({
    apiKey: "<your-api-key>",
    hubId: "<your-hub-id>",
});

const resp = await client.GET("/v1/containers/{containerId}", {
    params: {
        path: {
            containerId: "<container-id>",
        },
    },
});

console.log(resp.data, resp.error);
```

### Overriding the Base URL

In some cases it may be necessary to override the default URL of `https://api.cycle.io`. For example, if you are running a custom Cycle core, your API endpoint will be different than the default.

```ts
import { client } from "@cycleplatform/api-client-typescript";

const baseUrl = "https://api.my-company.cycle.io";

const client = getClient({
    baseUrl,
    apiKey: "<your-api-key>",
    hubId: "<your-hub-id>",
});

const resp = await client.GET("/v1/containers/{containerId}", {
    params: {
        path: {
            containerId: "<container-id>",
        },
    },
});

console.log(resp.data, resp.error);
```

## Development

### Cloning submodules

`git submodule update --recursive --remote`

### Building

To build a local copy of this client, run `npm run build:lib` to create a `./dist` folder with the necessary files.

### Testing

`npm run test:ts && npm run test`
