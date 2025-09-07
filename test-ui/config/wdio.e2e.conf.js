import { makeConfig } from "./wdio.shared.conf.js";

// Reuse shared config
export const config = makeConfig({
  specsGlob: "../specs/e2e/**/*.spec.js",
  junitLabel: "e2e",
});
