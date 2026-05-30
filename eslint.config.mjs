import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import html from 'eslint-plugin-html';
import sonarjs from 'eslint-plugin-sonarjs';

const nodeGlobals = {
  __dirname: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
}

const testGlobals = {
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
  ...nodeGlobals,
}

const commonJsRules = {
  "no-undef": "off",
}

export default tseslint.config(
  {
    name: 'eslint/recommended',
    ...eslint.configs.recommended,
  },
  ...tseslint.configs.recommended,
  {
    name: 'sonarjs/recommended',
    ...sonarjs.configs.recommended,
  },
  {
    name: 'billiards/parser-options',
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  {
    name: 'billiards/ignores',
    ignores: [
      "dist/*",
      "!dist/picker.html",
      "node_modules/**",
      "release/**",
      "webpack.config.js",
      "jest.config.js",
      ".yarn/**",
      ".aider.tags.cache.v3/**",
      ".vscode/**"
    ],
  },
  {
    name: 'billiards/rules',
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-require-imports": "off",
      "sonarjs/public-static-readonly": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/constructor-for-side-effects": "off",
    },
  },
  {
    name: 'billiards/html-files',
    files: ["dist/picker.html"],
    plugins: { html },
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        requestAnimationFrame: "readonly",
        THREE: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        btoa: "readonly",
        atob: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
  {
    name: 'billiards/node-files',
    files: ["desktop/**/*.cjs"],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: commonJsRules,
  },
  {
    name: 'billiards/test-files',
    files: ["test/**/*.js", "test/**/*.ts"],
    languageOptions: {
      globals: testGlobals,
    },
    rules: commonJsRules,
  },
);
