# Mobile Food Permit API &middot; [![Build](https://github.com/andresusanto/mobile-food-permit-api/actions/workflows/build.yml/badge.svg)](https://github.com/andresusanto/mobile-food-permit-api/actions/workflows/build.yml) [![License](https://img.shields.io/github/license/andresusanto/mobile-food-permit-api.svg)](https://github.com/andresusanto/mobile-food-permit-api/blob/main/LICENSE)

A simple backend microservice that provides an API to access all mobile food permits data (request, expired, suspended, approved). The data source for this API is provided by [SFGov](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Permit-Map/px6q-wjh5).

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/andresusanto/mobile-food-permit-api)

In short, this API:

- provides endpoints to query data by using Geolocation or Partial/Fuzzy keyword query.
- performs in-memory fuzzy and geospatial indexing to significantly speed-up read queries.
- is packaged as a Docker container and can be deployed in any docker container hosting, including Kubernetes.

### Demo

[<img width="480" alt="image" src="https://user-images.githubusercontent.com/7076809/130314032-738c7571-f770-49db-b236-ce50aa83349e.png">](https://mobile-food-permit-api.herokuapp.com/docs)

A demo instance of this API is available on Heroku:

**[Demo (Swagger-UI)](https://mobile-food-permit-api.herokuapp.com/docs)**

## The Stack

1. **App:** TypeScript/Node.js app with Express.js.
2. **API-Docs:** Swagger/OpenAPI 3.0, generated directly from the code-base with express-jsdoc-swagger.
3. **Code Standard and Quality:** ESLint and Prettier.
4. **Unit Testing:** Jest and Supertest.
5. **Logging:** Winston.
6. **Indexing Lib:** Fuse.js (fuzzy index) and Geokdbush (geospatial index).
7. **CI/CD:** GitHub Action to automatically test, build, and deploy changes on mainline branch.

## Deploying

### Heroku

Requirements:

1. Active Heroku Account
2. Heroku CLI v7.x or newer

Steps:

```bash
# Log-in to your Heroku Account (if you have not logged in before):
$ heroku login


# Sign-in into the Heroku Container Registry by using this command:
$ heroku container:login


# Build the docker image and push it to the container registry:
$ heroku container:push web


# Release the built image:
$ heroku container:release web
```

### Other container hosting providers

As the app is packaged as a Docker container, it can be deployed on any container hosting providers such as AWS ECS, Google AppEngine, Azure ACI, or on any Kubernetes Clusters.

**Docker Image**

```bash
$ docker pull ghcr.io/andresusanto/mobile-food-permit-api:<TAG>
```

**Supported Docker Tags:**

1. `latest`, `v1.0.1` - Latest released tag
2. `main` - Mainline build _(unstable)_

[See all docker tags here](https://github.com/andresusanto/mobile-food-permit-api/pkgs/container/mobile-food-permit-api).

### Running it locally using docker:

```bash
$ docker run --rm -p 3000:3000 --name mobile-food-permit-api ghcr.io/andresusanto/mobile-food-permit-api:<TAG>
```

## Developing

Requirements:

1. Node 14.x or newer
2. npm 7.x or newer

**Before developing:**

```bash
# Install all required tool and dependencies:

$ npm i
```

**When developing:**

```bash
# Start the local development server:

$ npm run dev
```

**After making changes:**

```bash
# Perform code formatting (if do not have Prettier integration with Your IDE)
$ npm run format


# Perform code linting
$ npm run lint


# Perform unit-tests:
$ npm test
```

## Building

Requirements:

1. Docker v20.x or newer

Steps:

```bash
# Run the docker build command:
$ docker build -t <NAME>:<TAG> .


# Push the built image to registry
$ docker push <NAME>:<TAG>
```

## Environment Variables

See [config.ts](./src/utils/config.ts) for more details.

| Environment        | Type                                        | Description                                                                             | Default Value                    |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| `PORT`             | _integer_                                   | the port in which the app should listen to.                                             | `3000`                           |
| `NODE_ENV`         | _string_ (`production`, `development`)      | indicates the environment on where this app is running.                                 |                                  |
| `DEFAULT_LIMIT`    | _integer_                                   | the default limit of returned data if limit is not given in search query.               | `10`                             |
| `DEFAULT_MAX_DIST` | _float_                                     | the default maximum distance (in kilometers) if maxKM is not specified in search query. | `10`                             |
| `LOG_LEVEL`        | _string_ (`debug`, `info`, `warn`, `error`) | the log level configured for the app logger.                                            | `info`                           |
| `DATA_SOURCE`      | _string_                                    | the location of the CSV data source.                                                    | `<app location>/data/source.csv` |

## Limitations/Trade-offs

1. The API does not have any authentication/authorisation layers for simplicity
2. The app performs indexing on start-up and does not persist the built indices for simplicity. Depending on the size of the data, persisting the built indices would make the start-up time faster.
