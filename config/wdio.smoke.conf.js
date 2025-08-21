import { makeConfig } from "./wdio.shared.conf.js";

export const config = makeConfig({
  specsGlob: "../specs/smoke/**/*.spec.js",
});
