import { RequestHandler } from "express";
import { GeoPermitSearcher } from "@src/indices/geo";

import config from "@src/utils/config";

/**
 * GET /v1/permit/_geo
 * @summary Search permit data using a given geospatial query.
 * @tags permits
 * @param {number} lat.query.required - latitude, for example: 37.75240499247832
 * @param {number} long.query.required - longitude, for example: -122.38700019629786
 * @param {number} maxKM.query - maximum distance in kilometers
 * @param {integer} limit.query - maximum number of items returned
 * @return {array<Permit>} 200 - success response - application/json
 * @return {object} 400 - bad request - application/json
 * @example response - 400 - bad request
 * {
 *   "error": "< description of the error >"
 * }
 */
export function createV1GeoSearchHandler(
  searcher: GeoPermitSearcher
): [string, RequestHandler] {
  return [
    "/v1/permit/_geo",
    (req, res) => {
      const lat = req.query.lat ? parseFloat(<string>req.query.lat) : NaN;
      const long = req.query.long ? parseFloat(<string>req.query.long) : NaN;
      const maxKM = req.query.maxKM
        ? parseFloat(<string>req.query.maxKM)
        : config.DEFAULT_MAX_DIST;
      const limit = req.query.limit
        ? parseInt(<string>req.query.limit)
        : config.DEFAULT_LIMIT;

      if (isNaN(lat) || isNaN(long))
        return res
          .status(400)
          .send({ error: "valid lat and long are required" });
      if (isNaN(limit)) return res.status(400).send({ error: "invalid limit" });
      if (isNaN(maxKM))
        return res.status(400).send({ error: "invalid max KM" });
      if (limit <= 0)
        return res
          .status(400)
          .send({ error: "limit must be greater than zero" });

      const result = searcher(long, lat, maxKM, limit);

      return res.send(result);
    },
  ];
}
