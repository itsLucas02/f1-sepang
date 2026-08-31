export const DRIVERS = [
  { id: "antonelli", firstName: "Kimi", surname: "Antonelli", number: "12", team: "Mercedes" },
  { id: "russell", firstName: "George", surname: "Russell", number: "63", team: "Mercedes" },
  { id: "hamilton", firstName: "Lewis", surname: "Hamilton", number: "44", team: "Ferrari" },
  { id: "norris", firstName: "Lando", surname: "Norris", number: "1", team: "McLaren" },
  { id: "leclerc", firstName: "Charles", surname: "Leclerc", number: "16", team: "Ferrari" },
  { id: "verstappen", firstName: "Max", surname: "Verstappen", number: "3", team: "Red Bull Racing" },
  { id: "piastri", firstName: "Oscar", surname: "Piastri", number: "81", team: "McLaren" },
  { id: "hadjar", firstName: "Isack", surname: "Hadjar", number: "6", team: "Red Bull Racing" },
  { id: "lawson", firstName: "Liam", surname: "Lawson", number: "30", team: "Racing Bulls" },
  { id: "gasly", firstName: "Pierre", surname: "Gasly", number: "10", team: "Alpine" },
  { id: "lindblad", firstName: "Arvid", surname: "Lindblad", number: "41", team: "Racing Bulls" },
  { id: "colapinto", firstName: "Franco", surname: "Colapinto", number: "43", team: "Alpine" },
  { id: "bearman", firstName: "Oliver", surname: "Bearman", number: "87", team: "Haas F1 Team" },
  { id: "bortoleto", firstName: "Gabriel", surname: "Bortoleto", number: "5", team: "Audi" },
  { id: "hulkenberg", firstName: "Nico", surname: "Hulkenberg", number: "27", team: "Audi" },
  { id: "sainz", firstName: "Carlos", surname: "Sainz", number: "55", team: "Williams" },
  { id: "albon", firstName: "Alexander", surname: "Albon", number: "23", team: "Williams" },
  { id: "ocon", firstName: "Esteban", surname: "Ocon", number: "31", team: "Haas F1 Team" },
  { id: "alonso", firstName: "Fernando", surname: "Alonso", number: "14", team: "Aston Martin" },
  { id: "stroll", firstName: "Lance", surname: "Stroll", number: "18", team: "Aston Martin" },
  { id: "bottas", firstName: "Valtteri", surname: "Bottas", number: "77", team: "Cadillac" },
  { id: "perez", firstName: "Sergio", surname: "Perez", number: "11", team: "Cadillac" },
] as const;

export type Driver = (typeof DRIVERS)[number];
export type DriverId = Driver["id"];

export const DRIVER_IDS = DRIVERS.map((driver) => driver.id) as DriverId[];

export function getDriver(driverId: DriverId) {
  const driver = DRIVERS.find((candidate) => candidate.id === driverId);

  if (!driver) {
    throw new Error(`Unknown driver: ${driverId}`);
  }

  return driver;
}

export function isDriverId(value: unknown): value is DriverId {
  return typeof value === "string" && DRIVER_IDS.includes(value as DriverId);
}
