import { Logger } from "winston";
import { logger } from "@src/utils/logger";
import { Permit } from "@src/models/permit";
import { indexPermitsGeo } from "@src/indices/geo";

beforeEach(() => {
  jest.resetAllMocks();
  jest
    .spyOn(logger, "info")
    .mockImplementation(() => null as unknown as Logger);
});

const testData: Array<Permit> = [
  {
    locationId: "1408991",
    applicantName: "MOMO INNOVATION LLC",
    facilityType: "TRUCK",
    locationDescription: "BUSH ST: BATTERY ST to SANSOME ST (100 - 199)",
    address: "1 BUSH ST",
    permitNumber: "19MFF-00131",
    status: "APPROVED",
    foodItems: "Noodles",
    latitude: 37.79092150726921,
    longitude: -122.4001004237385,
    schedule: "url",
    approvedTime: "03/12/2021 12:00:00 AM",
    receivedDate: "20191204",
    priorPermit: 0,
    expirationDate: "11/15/2021 12:00:00 AM",
    zipCode: "28854",
  },
  {
    locationId: "1515119",
    applicantName: "Tacos El Flaco",
    facilityType: "TRUCK",
    locationDescription: "03RD ST: 25TH ST to 26TH ST (2901 - 2999) -- EAST --",
    address: "2901 03RD ST",
    permitNumber: "21MFF-00041",
    status: "APPROVED",
    foodItems:
      "Tacos: Burritos: Tortas: Quesadillas: Chips & Salsa & Various Beverages",
    latitude: 37.75240499247832,
    longitude: -122.38700019629786,
    schedule: "url",
    approvedTime: "04/09/2021 12:00:00 AM",
    receivedDate: "20210330",
    priorPermit: 0,
    expirationDate: "11/15/2021 12:00:00 AM",
    zipCode: "28856",
  },
  {
    locationId: "1488685",
    applicantName: "El Alambre",
    facilityType: "TRUCK",
    locationDescription: "SHOTWELL ST: 14TH ST to 15TH ST (1 - 99)",
    address: "1800 FOLSOM ST",
    permitNumber: "20MFF-00015",
    status: "APPROVED",
    foodItems: "Tacos: Burritos: Quesadillas: Tortas",
    latitude: 37.76785244271805,
    longitude: -122.41610489253189,
    schedule: "url",
    approvedTime: "03/12/2021 12:00:00 AM",
    receivedDate: "20201102",
    priorPermit: 0,
    expirationDate: "11/15/2021 12:00:00 AM",
    zipCode: "28853",
  },
  {
    locationId: "1471042",
    applicantName: "California Kahve",
    facilityType: "TRUCK",
    locationDescription:
      "LA PLAYA: LINCOLN WAY \\ MARTIN LUTHER KING JR DR to IRVING ST (1200 - 1299)",
    address: "1234 GREAT HWY",
    permitNumber: "20MFF-00009",
    status: "APPROVED",
    foodItems:
      "Drip Coffee: Espresso Drinks: Matcha Green Tea: Black Teas: Herbal Teas: Crossaints: Savory and Sweet Breads",
    latitude: 37.76360804110198,
    longitude: -122.50959579624613,
    schedule: "url",
    approvedTime: "03/12/2021 12:00:00 AM",
    receivedDate: "20200810",
    priorPermit: 0,
    expirationDate: "11/15/2021 12:00:00 AM",
    zipCode: "56",
  },
  {
    locationId: "1515984",
    applicantName: "Senor Sisig",
    facilityType: "TRUCK",
    locationDescription: "FRONT ST: BROADWAY to VALLEJO ST (800 - 899)",
    address: "90 BROADWAY",
    permitNumber: "21MFF-00059",
    status: "APPROVED",
    foodItems: "Various menu items & drinks",
    latitude: 37.799260113502285,
    longitude: -122.39961794865545,
    schedule: "url",
    approvedTime: "04/09/2021 12:00:00 AM",
    receivedDate: "20210405",
    priorPermit: 0,
    expirationDate: "11/15/2021 12:00:00 AM",
    zipCode: "28860",
  },
];

test("different limit size", async () => {
  const searcher = indexPermitsGeo(testData);
  for (const limit of [1, 2, 3, 4, 5]) {
    const res = searcher(-122.39961794865545, 37.799260113502285, 1000, limit);
    expect(res.length).toEqual(limit);
  }
});

test("distance query", async () => {
  const searcher = indexPermitsGeo(testData);
  for (const { dist, result } of [
    { dist: 1, result: 2 },
    { dist: 5, result: 3 },
    { dist: 10, result: 4 },
    { dist: 100, result: 5 },
  ]) {
    const res = searcher(-122.39961794865545, 37.799260113502285, dist, 5);
    expect(res.length).toEqual(result);
  }
});
