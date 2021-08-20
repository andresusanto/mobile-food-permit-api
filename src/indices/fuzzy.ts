import Fuse from "fuse.js";
import { logger } from "@src/utils/logger";
import { Permit } from "@src/models/permit";

export type FuzzyPermitSearcher = (
  keyword: string,
  limit: number
) => Array<Permit>;

export function indexPermitsFuzzy(permits: Array<Permit>): FuzzyPermitSearcher {
  logger.info("building fuzzy-index for permit data");
  const index = new Fuse(permits, {
    keys: [
      "applicantName",
      "facilityType",
      "locationDescription",
      "address",
      "permitNumber",
      "status",
      "foodItems",
    ],
  });
  logger.info("done building fuzzy-index");

  return (keyword, limit) =>
    index.search(keyword, { limit }).map((result) => result.item);
}
