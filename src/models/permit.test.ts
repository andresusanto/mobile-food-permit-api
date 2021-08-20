import os from "os";
import fs from "fs";
import path from "path";

import { Logger } from "winston";
import { logger } from "@src/utils/logger";
import { loadPermits } from "@src/models/permit";

beforeEach(() => {
  jest.resetAllMocks();
  jest
    .spyOn(logger, "info")
    .mockImplementation(() => null as unknown as Logger);
});

test("reject loading non-exist file", async () => {
  await expect(
    loadPermits(path.join(os.tmpdir(), "non-exist", "dummy"))
  ).rejects.toEqual(
    new Error("Failed to load permits. Provided fileName doesn't exist.")
  );
});

test("load valid CSV file", async () => {
  const testCSVFileName = path.join(
    os.tmpdir(),
    "mobile-food-permit-test-csv.csv"
  );
  const testCSVContent =
    `locationid,Applicant,FacilityType,cnn,LocationDescription,Address,blocklot,block,lot,permit,Status,FoodItems,X,Y,Latitude,Longitude,Schedule,dayshours,NOISent,Approved,Received,PriorPermit,ExpirationDate,Location,Fire Prevention Districts,Police Districts,Supervisor Districts,Zip Codes,Neighborhoods (old)\n` +
    `1524388,Flavors of Africa,Truck,9090000,MISSION ST: SHAW ALY to ANTHONY ST (543 - 586),555 MISSION ST,3721120,3721,120,21MFF-00068,APPROVED,Meat and vegi rice bowls: meat and vegi salad bowls: meat and vegi wraps: drinks and juices.,6013055.64573,2115118.24153,37.78844615690132,-122.3986412420388,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00068&ExportPDF=1&Filename=21MFF-00068_schedule.pdf,,,05/28/2021 12:00:00 AM,20210507,0,11/15/2021 12:00:00 AM,"(37.78844615690132, -122.3986412420388)",12,2,9,28855,6\n` +
    `1524389,Flavors of Africa,Truck,9090000,MISSION ST: SHAW ALY to ANTHONY ST (543 - 586),560 MISSION ST,3708095,3708,095,21MFF-00068,APPROVED,Meat and vegi rice bowls: meat and vegi salad bowls: meat and vegi wraps: drinks and juices.,6012851.27,2115274.827,37.78886471534304,-122.39935935136297,http://bsm.sfdpw.org/PermitsTracker/reports/report.aspx?title=schedule&report=rptSchedule&params=permit=21MFF-00068&ExportPDF=1&Filename=21MFF-00068_schedule.pdf,,,05/28/2021 12:00:00 AM,20210507,0,11/15/2021 12:00:00 AM,"(37.78886471534304, -122.39935935136297)",12,2,9,28855,6`;

  fs.writeFileSync(testCSVFileName, testCSVContent);

  await expect(loadPermits(testCSVFileName)).resolves.toEqual([
    expect.objectContaining({ locationId: "1524388" }),
    expect.objectContaining({ locationId: "1524389" }),
  ]);
});
