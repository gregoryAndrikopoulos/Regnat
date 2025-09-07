import { faker } from "@faker-js/faker";

/**
 * Call once (e.g., in WDIO before hook) to seed faker from env.
 * Example: export FAKER_SEED=12345 (can vary per worker).
 */
function initFakerSeed() {
  const seed = Number(process.env.FAKER_SEED);
  if (!Number.isNaN(seed)) faker.seed(seed);
}

/** Short, readable, unique, seedable email with +tag. */
function fakeEmail(prefix = "automation", domain = "example.com") {
  const tag = faker.string.alphanumeric(6).toLowerCase();
  return `${prefix}+${tag}@${domain}`;
}

function fakePassword() {
  return faker.internet.password({ length: 12 });
}

function fakeName() {
  return faker.person.firstName();
}

/** DOB strings matching select controls */
function fakeDOB() {
  return { day: "24", month: "May", year: "1993" };
}

/** Maps site’s address fields */
function fakeAddress(overrides = {}) {
  const base = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: "United States",
    state: faker.location.state({ abbreviated: true }) || "IL",
    city: faker.location.city(),
    zipcode: faker.location.zipCode("#####"),
    mobile: faker.phone.number("+1##########"),
  };
  return { ...base, ...overrides };
}

export {
  initFakerSeed,
  fakeEmail,
  fakePassword,
  fakeName,
  fakeDOB,
  fakeAddress,
};
