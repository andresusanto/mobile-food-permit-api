# Mobile Food Permit API &middot; [![Build](https://github.com/andresusanto/mobile-food-permit-api/actions/workflows/build.yml/badge.svg)](https://github.com/andresusanto/mobile-food-permit-api/actions/workflows/build.yml) [![License](https://img.shields.io/github/license/andresusanto/mobile-food-permit-api.svg)](https://github.com/andresusanto/mobile-food-permit-api/blob/main/LICENSE)

A simple backend microservice that provides an API to access all mobile food permits data (request, expired, suspended, approved). The data source for this API is provided by [SFGov](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Permit-Map/px6q-wjh5).

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/andresusanto/mobile-food-permit-api)

In short, this API:

- provides endpoints to query data by using Geolocation or Partial/Fuzzy keyword query.
- performs in-memory fuzzy and geospatial indexing to significantly speed-up read queries.
- is packaged as a Docker container and can be deployed in any docker container hosting, including Kubernetes.

### Demo

A demo instance of this API is available on Heroku:

**[Demo (Swagger-UI)](https://mobile-food-permit-api.herokuapp.com/docs)**

## The Stack

1. **App:** TypeScript/Node.js app with Express.js.
2. **API-Docs:** Swagger/OpenAPI 3.0, generated directly from the code-base with express-jsdoc-swagger.
3. **Code Standard and Quality:** ESLint and Prettier.
4. **Unit Testing:** Jest and Supertest.
5. **Logging:** Winston.
6. **Indexing Lib:** Fuse.js (fuzzy index) and Geokdbush (geospatial index).
7. **CI/CD:** GitHub Action to automatically build images on mainline branch, push it to container registry, and deploy it to Heroku.

## Deploying

### Heroku

Requirements:

1. Active Heroku Account _(only for deploying)_
2. Heroku CLI v7.x or newer _(only for deploying)_

Steps:

1. Log-in to your Heroku Account _if you have not logged in before_:

```
$ heroku login
```

2. Sign-in into the Heroku Container Registry by using this command:

```
$ heroku container:login
```

3. Build the docker image and push it to the container registry:

```
$ heroku container:push web
```

4. Release the built image:

```
$ heroku container:release web
```

### Other container hosting providers

As the app is packaged as a Docker container, it can be deployed on any container hosting providers such as AWS ECS, Google AppEngine, Azure ACI, or on any Kubernetes Clusters.

**Docker Image**

```
$ docker pull ghcr.io/andresusanto/mobile-food-permit-api:<TAG>
```

**Supported Docker Tags:**

1. `latest`, `v1.0.1` - Latest released tag
2. `main` - Mainline build _(unstable)_

[See all docker tags here](https://github.com/andresusanto/mobile-food-permit-api/pkgs/container/mobile-food-permit-api).

### Running it locally using docker:

```
$ docker run --rm -p 3000:3000 --name mobile-food-permit-api ghcr.io/andresusanto/mobile-food-permit-api:<TAG>
```

## Developing

Requirements:

1. Node 14.x or newer
2. npm 7.x or newer

**Before developing:**

1. Install all required tool and dependencies:

```
$ npm i
```

**When developing:**

1. Start the local development server:

```
$ npm run dev
```

**After making changes:**

1. Perform code formatting _(if do not have Prettier integration with Your IDE)_

```
$ npm run format
```

2. Perform code linting

```
$ npm run lint
```

3. Perform unit-tests:

```
$ npm run test
```

## Building

Requirements:

1. Docker v20.x or newer

Steps:

1. Run the docker build command:

```
$ docker build -t <NAME>:<TAG> .
```

2. Push the built image to registry

```
$ docker push <NAME>:<TAG>
```

## Environment Variables

See [config.ts](./src/utils/config.ts) for more details.

1. `PORT` _(integer)_ - the port in which the app should listen to. defaults to `3000`.
2. `NODE_ENV` _(string: `production` or `development`)_ - indicates the environment on where this app is running.
3. `DEFAULT_LIMIT` _(integer)_ - the default limit of returned data if limit is not given in search query. defaults to `10`.
4. `DEFAULT_MAX_DIST` _(float)_ - the default maximum distance (in kilometers) if maxKM is not specified in search query. defaults to `10`.
5. `LOG_LEVEL` _(string: `debug`, `info`, `warn`, `error`)_ - the log level configured for the app logger. defaults to `info`.
6. `DATA_SOURCE` _(string)_ - the location of the CSV data source. defaults to `<app location>/data/source.csv`

## Limitations/Trade-offs

1. The API does not have any authentication/authorisation layers - for simplicity
2. The app performs indexing on start-up and does not persist the built indices - for simplicity. Depending on the size of the data, persisting the built indices would make the app start-up time faster.
