import express from "express";
import request from "supertest";
import { Logger } from "winston";

import config from "@src/utils/config";
import { logger } from "@src/utils/logger";
import { createV1FuzzySearchHandler } from "@src/handlers/v1/permit/fuzzy-search";

beforeEach(() => {
  jest.resetAllMocks();
  jest
    .spyOn(logger, "info")
    .mockImplementation(() => null as unknown as Logger);
});

test("reject request with empty query", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1FuzzySearchHandler(searcher));

  const req = await request(app).get("/v1/permit/_fuzzy");
  expect(req.statusCode).toBe(400);
  expect(req.body).toEqual({ error: "query is required" });
  expect(searcher).not.toBeCalled();
});

test("reject request with limit", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1FuzzySearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_fuzzy")
    .query({ q: "test", limit: "hello" });
  expect(req.statusCode).toBe(400);
  expect(req.body).toEqual({ error: "invalid limit" });
  expect(searcher).not.toBeCalled();
});

test("reject request with negative limit", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1FuzzySearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_fuzzy")
    .query({ q: "test", limit: "-123" });
  expect(req.statusCode).toBe(400);
  expect(req.body).toEqual({ error: "limit must be greater than zero" });
  expect(searcher).not.toBeCalled();
});

test("valid request without limit", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1FuzzySearchHandler(searcher));

  const req = await request(app).get("/v1/permit/_fuzzy").query({ q: "test" });
  expect(req.statusCode).toBe(200);
  expect(searcher).toHaveBeenCalledWith("test", config.DEFAULT_LIMIT);
});

test("valid request with limit", async () => {
  const searcher = jest.fn();
  const app = express();
  app.use(...createV1FuzzySearchHandler(searcher));

  const req = await request(app)
    .get("/v1/permit/_fuzzy")
    .query({ q: "query", limit: 123 });
  expect(req.statusCode).toBe(200);
  expect(searcher).toHaveBeenCalledWith("query", 123);
});
