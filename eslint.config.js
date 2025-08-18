import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import prettier from "eslint-plugin-prettier";

export default [
  // JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        // WDIO globals
        browser: "readonly",
        $: "readonly",
        $$: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      // Inline the recommended JS rules (no "extends" in flat config)
      ...js.configs.recommended.rules,

      // Enforce Prettier formatting
      "prettier/prettier": "error",

      // Your tweaks
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Mocha/WDIO specs: enable mocha globals only for tests
  {
    files: ["**/*.spec.js", "specs/**/*.js", "specs/**/*.js"],
    languageOptions: { globals: { ...globals.mocha } },
  },

  // JSON files
  {
    files: ["**/*.json"],
    plugins: { json }, // <-- register the plugin
    language: "json/json", // <-- now ESLint can find this language
    rules: {
      ...json.configs.recommended.rules, // inline the recommended rules
    },
  },

  // Ignore generated/infra
  {
    ignores: [
      "node_modules/**",
      "allure-results/**",
      "allure-report/**",
      "reports/**",
      "infra/**",
    ],
  },
];
