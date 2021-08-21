import { RequestHandler } from "express";
import { FuzzyPermitSearcher } from "@src/indices/fuzzy";

import config from "@src/utils/config";

/**
 * GET /v1/permit/_fuzzy
 * @summary Search permit data using a given keyword query.
 * @tags permits
 * @param {string} query.query.required - search query, for example: burger
 * @param {integer} limit.query - maximum number of items returned
 * @return {array<Permit>} 200 - success response - application/json
 * @return {object} 400 - bad request - application/json
 * @example response - 400 - bad request
 * {
 *   "error": "< description of the error >"
 * }
 */
export function createV1FuzzySearchHandler(
  searcher: FuzzyPermitSearcher
): [string, RequestHandler] {
  return [
    "/v1/permit/_fuzzy",
    (req, res) => {
      const query = <string>req.query.query;
      const limit = req.query.limit
        ? parseInt(<string>req.query.limit)
        : config.DEFAULT_LIMIT;

      if (!query) return res.status(400).send({ error: "query is required" });
      if (isNaN(limit)) return res.status(400).send({ error: "invalid limit" });
      if (limit <= 0)
        return res
          .status(400)
          .send({ error: "limit must be greater than zero" });

      const result = searcher(query, limit);

      return res.send(result);
    },
  ];
}
