export const DRIVERS = [
  {
    id: "antonelli",
    firstName: "Kimi",
    surname: "Antonelli",
    number: "12",
    team: "Mercedes",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kimi%20Antonelli%20at%20the%20Melbourne%20Walk%20during%20the%202026%20Australian%20Grand%20Prix%20%28028A7923%29%20cropped.jpg?width=900",
      credit: "Yu Chu Chin / CC BY-SA 4.0",
    },
  },
  {
    id: "russell",
    firstName: "George",
    surname: "Russell",
    number: "63",
    team: "Mercedes",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/George%20Russell%20%2853837544922%29.jpg?width=900",
      credit: "Peter Menzel / CC BY-SA 2.0",
    },
  },
  {
    id: "hamilton",
    firstName: "Lewis",
    surname: "Hamilton",
    number: "44",
    team: "Ferrari",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lewis%20Hamilton%20portrait.jpg?width=900",
      credit: "Ben Novakovic / CC BY-SA 2.0",
    },
  },
  {
    id: "norris",
    firstName: "Lando",
    surname: "Norris",
    number: "1",
    team: "McLaren",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lando%20Norris%20Formula%201%20Driver%20%2849379469418%29.jpg?width=900",
      credit: "David Merrett / CC BY 2.0",
    },
  },
  {
    id: "leclerc",
    firstName: "Charles",
    surname: "Leclerc",
    number: "16",
    team: "Ferrari",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Charles-Leclerc%20%28cropped%29.jpg?width=900",
      credit: "Gilzetbase / CC BY-SA 4.0",
    },
  },
  {
    id: "verstappen",
    firstName: "Max",
    surname: "Verstappen",
    number: "3",
    team: "Red Bull Racing",
    media: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/BelgianGP24-MaxVerstappen-1%20%28cropped%29.jpg?width=900",
      credit: "Thekuner / CC BY-SA 4.0",
    },
  },
  { id: "piastri", firstName: "Oscar", surname: "Piastri", number: "81", team: "McLaren", media: null },
  { id: "hadjar", firstName: "Isack", surname: "Hadjar", number: "6", team: "Red Bull Racing", media: null },
  { id: "lawson", firstName: "Liam", surname: "Lawson", number: "30", team: "Racing Bulls", media: null },
  { id: "gasly", firstName: "Pierre", surname: "Gasly", number: "10", team: "Alpine", media: null },
  { id: "lindblad", firstName: "Arvid", surname: "Lindblad", number: "41", team: "Racing Bulls", media: null },
  { id: "colapinto", firstName: "Franco", surname: "Colapinto", number: "43", team: "Alpine", media: null },
  { id: "bearman", firstName: "Oliver", surname: "Bearman", number: "87", team: "Haas F1 Team", media: null },
  { id: "bortoleto", firstName: "Gabriel", surname: "Bortoleto", number: "5", team: "Audi", media: null },
  { id: "hulkenberg", firstName: "Nico", surname: "Hulkenberg", number: "27", team: "Audi", media: null },
  { id: "sainz", firstName: "Carlos", surname: "Sainz", number: "55", team: "Williams", media: null },
  { id: "albon", firstName: "Alexander", surname: "Albon", number: "23", team: "Williams", media: null },
  { id: "ocon", firstName: "Esteban", surname: "Ocon", number: "31", team: "Haas F1 Team", media: null },
  { id: "alonso", firstName: "Fernando", surname: "Alonso", number: "14", team: "Aston Martin", media: null },
  { id: "stroll", firstName: "Lance", surname: "Stroll", number: "18", team: "Aston Martin", media: null },
  { id: "bottas", firstName: "Valtteri", surname: "Bottas", number: "77", team: "Cadillac", media: null },
  { id: "perez", firstName: "Sergio", surname: "Perez", number: "11", team: "Cadillac", media: null },
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
