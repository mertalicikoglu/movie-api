// jest.config.js

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest', // Use ts-jest to process TypeScript files
    testEnvironment: 'node', // Use Node.js as test environment
    roots: ['<rootDir>/src', '<rootDir>/__tests__'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testTimeout: 10000
};