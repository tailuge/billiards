module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          minify: {
            compress: false,
            mangle: false,
            format: { comments: "all" },
          },
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
  ],
  coverageReporters: ["text", "json"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".*GLTFExporter": "<rootDir>/test/mocks/gltfexporter.ts",
    ".*GLTFLoader": "<rootDir>/test/mocks/gltfloader.ts",
    ".*/sound": "<rootDir>/test/mocks/mocksound.ts",
  },
}
