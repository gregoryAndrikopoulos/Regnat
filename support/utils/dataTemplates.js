export const DEFAULT_ADDRESS = {
  firstName: "Gregory",
  lastName: "Tester",
  company: "Based Company",
  address: "123 Main St",
  address2: "Unit 4",
  country: "United States",
  state: "IL",
  city: "Chicago",
  zipcode: "60601",
  mobile: "+14155550123",
};

export function buildAddress(overrides = {}) {
  return { ...DEFAULT_ADDRESS, ...overrides };
}
