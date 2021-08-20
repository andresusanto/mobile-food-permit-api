import KDBush from "kdbush";
import geokdbush from "geokdbush";
import { logger } from "@src/utils/logger";
import { Permit } from "@src/models/permit";

export type GeoPermitSearcher = (
  longitude: number,
  latitude: number,
  maxDistKM: number,
  limit: number
) => Array<Permit>;

export function indexPermitsGeo(permits: Array<Permit>): GeoPermitSearcher {
  logger.info("building geo-index for permit data");
  const index = new KDBush(
    permits,
    (p) => p.longitude,
    (p) => p.latitude
  );
  logger.info("done building geo-index");

  return (longitude, latitude, maxDistKM, limit) =>
    geokdbush.around(index, longitude, latitude, limit, maxDistKM);
}
