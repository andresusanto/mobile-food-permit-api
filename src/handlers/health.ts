import { RequestHandler } from "express";
import { logger } from "@src/utils/logger";

/**
 * GET /health
 * @summary Application health-check endpoint.
 * @tags system
 * @return 200 - application is ready to serve requests
 * @return 503 - application is in shutting down state
 */
export function createHealthHandler(): [string, RequestHandler] {
  let processRequest = true;

  process.on("SIGTERM", () => {
    logger.info("received SIGTERM, healthcheck will now respond with 503");
    processRequest = false;
  });

  return [
    "/health",
    (_, res) => {
      if (processRequest) return res.sendStatus(200);
      res.sendStatus(503);
    },
  ];
}
