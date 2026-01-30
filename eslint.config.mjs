import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import html from 'eslint-plugin-html';
import sonarjs from 'eslint-plugin-sonarjs';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    ignores: [
      "dist/*",
      "!dist/picker.html",
      "node_modules/**",
      "webpack.config.js",
      "jest.config.js",
      ".yarn/**",
      ".aider.tags.cache.v3/**",
      ".vscode/**"
    ],
  },
  {
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
    files: ["test/**/*.js", "test/**/*.ts"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
    }
  },
);
