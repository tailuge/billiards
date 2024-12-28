module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  transformIgnorePatterns: [
    // Exclude all node_modules except for chai and jsoncrush
    "node_modules/(?!(chai|jsoncrush))",
  ],
  transform: {
    // Use SWC for transforming both JavaScript and TypeScript files
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          minify: {
            compress: false,
            mangle: false,
            format: { comments: "all" },
          },
          // Enable ESM support in SWC
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2020",
        },
      },
    ],
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "gltf.ts",
    "webgl.ts",
    "dom.ts",
    "shorten.ts",
    "assets.ts",
  ],
  coverageReporters: ["text", "json"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".*GLTFExporter": "<rootDir>/test/mocks/gltfexporter.ts",
    ".*GLTFLoader": "<rootDir>/test/mocks/gltfloader.ts",
    ".*/sound": "<rootDir>/test/mocks/mocksound.ts",
  },
  // Enable ESM support in Jest
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM support in ts-jest
    },
  },
}
