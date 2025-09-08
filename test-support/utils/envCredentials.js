import "dotenv/config";

// Single shared name across specs
export const TEST_USER_NAME = process.env.TEST_USER_NAME || "Greg";

// Pick credentials by set number, e.g. "1", "2", "3"
function pick(set) {
  const suffix = set ? `_${set}` : "";
  return {
    name: TEST_USER_NAME,
    email:
      process.env[`TEST_USER_EMAIL${suffix}`] ||
      process.env.TEST_USER_EMAIL ||
      "",
    password:
      process.env[`TEST_USER_PASSWORD${suffix}`] ||
      process.env.TEST_USER_PASSWORD ||
      "",
  };
}

// Explicit per-spec selection
export function getCredentials(setNumber) {
  const set = (setNumber ?? "1").toString().trim();
  return pick(set);
}
