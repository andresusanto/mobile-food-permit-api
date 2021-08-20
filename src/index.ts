import express from "express";
import swagger from "express-jsdoc-swagger";

import config from "@src/utils/config";
import { logger, loggerMiddleware } from "@src/utils/logger";

import { loadPermits } from "@src/models/permit";
import { indexPermitsGeo } from "@src/indices/geo";
import { indexPermitsFuzzy } from "@src/indices/fuzzy";

import { createHealthHandler } from "@src/handlers/health";
import { createV1GeoSearchHandler } from "@src/handlers/v1/permit/geo-search";
import { createV1FuzzySearchHandler } from "@src/handlers/v1/permit/fuzzy-search";

(async () => {
  const app = express();
  const permits = await loadPermits(config.DATA_SOURCE);
  const geoSearchPermits = indexPermitsGeo(permits);
  const fuzzySearchPermits = indexPermitsFuzzy(permits);

  app.use(loggerMiddleware);
  app.get(...createHealthHandler());
  app.get(...createV1GeoSearchHandler(geoSearchPermits));
  app.get(...createV1FuzzySearchHandler(fuzzySearchPermits));

  swagger(app)({
    info: {
      version: "1.0.0",
      title: "Mobile Food Permit API",
      description: "Simple yet performant API to retrieve Mobile Food Permits.",
      license: {
        name: "MIT",
      },
    },
    baseDir: __dirname,
    filesPattern: config.IS_PRODUCTION
      ? ["./**/*.ts", "./**/*.js"]
      : "./**/*.ts",
    swaggerUIPath: "/docs",
    exposeSwaggerUI: true,
  });

  app.listen(config.PORT, async () => {
    logger.info(`app is ready. listening in port ${config.PORT}`);
  });
})();
