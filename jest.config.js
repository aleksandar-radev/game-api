/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    "process.env": {
      NODE_ENV: "test",
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|js)"],
};
