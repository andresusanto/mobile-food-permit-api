import winston from "winston";
import expressWinston from "express-winston";
import config from "@src/utils/config";

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

export const loggerMiddleware = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});
