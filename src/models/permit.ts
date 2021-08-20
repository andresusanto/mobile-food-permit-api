import fs from "fs";
import { parseFile } from "@fast-csv/parse";
import { logger } from "@src/utils/logger";

export type PermitStatus =
  | "APPROVED"
  | "REQUESTED"
  | "EXPIRED"
  | "SUSPEND"
  | "ISSUED";

export type FacilityType = "TRUCK" | "PUSH_CART" | "UNKNOWN";

/**
 * Permit model
 * @typedef {object} Permit
 * @property {string} locationId
 * @property {string} applicantName
 * @property {string} facilityType - enum:TRUCK,PUSH_CART,UNKNOWN
 * @property {string} locationDescription
 * @property {string} address
 * @property {string} permitNumber
 * @property {string} status - enum:APPROVED,REQUESTED,EXPIRED,SUSPEND,ISSUED
 * @property {string} foodItems
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} schedule
 * @property {string} approvedTime
 * @property {string} receivedDate
 * @property {string} receivedDate
 * @property {number} priorPermit
 * @property {string} expirationDate
 * @property {string} zipCode
 */
export interface Permit {
  locationId: string;
  applicantName: string;
  facilityType: FacilityType;
  locationDescription: string;
  address: string;
  permitNumber: string;
  status: PermitStatus;
  foodItems: string;
  latitude: number;
  longitude: number;
  schedule: string;
  approvedTime: string;
  receivedDate: string;
  priorPermit: number;
  expirationDate: string;
  zipCode: string;
}

/**
 * PermitCSV is the structure used
 * by the original CSV data.
 */
interface PermitCSV {
  locationid: string;
  Applicant: string;
  FacilityType: string;
  LocationDescription: string;
  Address: string;
  permit: string;
  Status: PermitStatus;
  FoodItems: string;
  Latitude: string;
  Longitude: string;
  Schedule: string;
  Approved: string;
  Received: string;
  PriorPermit: string;
  ExpirationDate: string;
  "Zip Codes": string;
}

export async function loadPermits(fileName: string): Promise<Array<Permit>> {
  if (!fs.existsSync(fileName))
    throw new Error("Failed to load permits. Provided fileName doesn't exist.");

  const permits: Array<Permit> = [];
  logger.info("loading permits from csv");
  await new Promise((res, rej) =>
    parseFile(fileName, {
      headers: true,
    })
      .on("error", rej)
      .on("data", (data: PermitCSV) =>
        permits.push({
          locationId: data.locationid,
          applicantName: data.Applicant,
          facilityType:
            <FacilityType>data.FacilityType.toUpperCase().replace(" ", "_") ||
            "UNKNOWN",
          locationDescription: data.LocationDescription,
          address: data.Address,
          permitNumber: data.permit,
          status: data.Status,
          foodItems: data.FoodItems,
          latitude: parseFloat(data.Latitude),
          longitude: parseFloat(data.Longitude),
          schedule: data.Schedule,
          approvedTime: data.Approved,
          receivedDate: data.Received,
          priorPermit: parseInt(data.PriorPermit),
          expirationDate: data.ExpirationDate,
          zipCode: data["Zip Codes"],
        })
      )
      .on("end", res)
  );
  logger.info("permits are loaded");
  return permits;
}
