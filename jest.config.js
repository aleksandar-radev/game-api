/** @type {import('ts-jest').JestConfigWithTsJest} */
export const globals = {
  'process.env': {
    NODE_ENV: 'test',
  },
};
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleFileExtensions = ['ts', 'js'];
export const transform = {
  '^.+\\.ts$': 'ts-jest',
};
export const testMatch = ['**/__tests__/**/*.test.(ts|js)'];
