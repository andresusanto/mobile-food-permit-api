import path from "path";

export default {
  PORT: parseInt(process.env.PORT || "3000"),
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT || "10"),
  DEFAULT_MAX_DIST: parseInt(process.env.DEFAULT_MAX_DIST || "10"),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DATA_SOURCE:
    process.env.DATA_SOURCE || path.join(process.cwd(), "data", "source.csv"),
};
