import express from "express";
import request from "supertest";
import { Logger } from "winston";

import { logger } from "@src/utils/logger";
import { createHealthHandler } from "@src/handlers/health";

beforeEach(() => {
  jest.resetAllMocks();
  jest
    .spyOn(logger, "info")
    .mockImplementation(() => null as unknown as Logger);
});

test("send 503 after receiving SIGTERM", async () => {
  let mockSIGTERM: (...args: unknown[]) => void = () => null;
  const mockProcess = jest
    .spyOn(process, "on")
    .mockImplementation((_, listener) => {
      mockSIGTERM = listener;
      return null as unknown as typeof process;
    });

  const app = express();
  app.use(...createHealthHandler());
  expect(mockProcess).toBeCalled();

  const beforeSIGTERM = await request(app).get("/health");
  expect(beforeSIGTERM.statusCode).toBe(200);

  // Send a fake SIGTERM
  mockSIGTERM();

  const afterSIGTERM = await request(app).get("/health");
  expect(afterSIGTERM.statusCode).toBe(503);
});
