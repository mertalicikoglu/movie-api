// jest.config.js

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest', // Use ts-jest to process TypeScript files
    testEnvironment: 'node', // Use Node.js as test environment
    testMatch: [ // Specify location of test files
      "**/__tests__/**/*.test.(ts|js)"
    ],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    rootDir: '.', // Project root directory
    // Other configuration options can be added (coverage, reporters etc.)
  };