module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>", "<rootDir>/../tests"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/unit/mobile/**/*.test.ts",
    "**/unit/mobile/**/*.test.tsx",
    "**/integration/mobile/**/*.test.ts",
    "**/integration/mobile/**/*.test.tsx",
  ],
  // Tests live outside mobile/ so node_modules must be explicitly reachable
  modulePaths: ["<rootDir>/node_modules"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-native-community|expo(nent)?|expo-modules-core|@expo|expo-router|@expo/vector-icons)/)",
  ],
  moduleNameMapper: {
    // Expo winter runtime lazily requires this; the lazy getter breaks Jest 30's
    // scope check. Return a minimal stub so the getter never attempts the require.
    "^.+[/\\\\]expo[/\\\\]src[/\\\\]winter[/\\\\]ImportMetaRegistry(\\.ts)?$":
      "<rootDir>/__mocks__/expo-import-meta-registry.js",
  },
};
