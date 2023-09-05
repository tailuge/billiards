module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".*GLTFExporter": "<rootDir>/test/mocks/gltfexporter.ts",
    ".*GLTFLoader": "<rootDir>/test/mocks/gltfloader.ts",
    ".*/sound": "<rootDir>/test/mocks/mocksound.ts",
  },
}
