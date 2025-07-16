module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    coverageDirectory: 'coverage',
    testTimeout: 10000,
    moduleNameMapper: {
        '^@/fixtures/(.*)$': '<rootDir>/tests/fixtures/$1' // 사진: Unsplash의 Peter Thomas
    },
};