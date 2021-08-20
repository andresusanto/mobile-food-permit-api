import express from "express";
import request from "supertest";
import { Logger } from "winston";

import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { createV1GeoSearchHandler } from "@src/handlers/v1/permit/geo-search";

beforeEach(() => {
  jest.resetAllMocks();
  jest
    .spyOn(logger, "info")
    .mockImplementation(() => null as unknown as Logger);
});

test("reject request with invalid lat long", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1GeoSearchHandler(searcher));

  const reqs = await Promise.all([
    request(app).get("/v1/permit/_geo"),
    request(app).get("/v1/permit/_geo").query({ lat: "a", long: "b" }),
    request(app).get("/v1/permit/_geo").query({ lat: "123", long: "aa" }),
    request(app).get("/v1/permit/_geo").query({ lat: "bb", long: "123" }),
    request(app)
      .get("/v1/permit/_geo")
      .query({ lat: "bb", long: "123", maxKM: "12" }),
  ]);

  for (const req of reqs) {
    expect(req.statusCode).toBe(400);
    expect(req.body).toEqual({ error: "valid lat and long are required" });
  }

  expect(searcher).not.toBeCalled();
});

test("reject request with invalid Max KM", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1GeoSearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_geo")
    .query({ lat: "123", long: "123", maxKM: "abc" });
  expect(req.statusCode).toBe(400);
  expect(req.body).toEqual({ error: "invalid max KM" });
  expect(searcher).not.toBeCalled();
});

test("reject request with invalid limit", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1GeoSearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_geo")
    .query({ lat: "123", long: "123", limit: "abc" });
  expect(req.statusCode).toBe(400);
  expect(req.body).toEqual({ error: "invalid limit" });
  expect(searcher).not.toBeCalled();
});

test("valid request without limit without max km", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1GeoSearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_geo")
    .query({ lat: "11.11111", long: "22.22222" });

  expect(req.statusCode).toBe(200);
  expect(searcher).toHaveBeenCalledWith(
    22.22222,
    11.11111,
    config.DEFAULT_MAX_DIST,
    config.DEFAULT_LIMIT
  );
});

test("valid request with limit with max km", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1GeoSearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_geo")
    .query({ lat: "12.11111", long: "23.22222", limit: "15", maxKM: "2" });
  expect(req.statusCode).toBe(200);
  expect(searcher).toHaveBeenCalledWith(23.22222, 12.11111, 2, 15);
});
