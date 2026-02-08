import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/src/**/*.{ts,tsx}"],
  })),

  {
    files: ["**/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/no-duplicates": "error",
    },
  },
];
