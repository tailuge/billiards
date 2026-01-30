import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import html from 'eslint-plugin-html';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
