module.exports = {
  verbose: false,
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.(tsx?)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules",
    "<rootDir>/dist"
  ],
  testRegex: "(/src/.*(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testEnvironment: "jsdom",
  "testURL": "https://testing.io",
  moduleNameMapper: {
    'eosjs': '<rootDir>/src/__mocks__/eosjs.ts'
  },
}