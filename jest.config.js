module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2020',
          module: 'commonjs',
          moduleResolution: 'node10',
          ignoreDeprecations: '6.0',
          esModuleInterop: true,
          skipLibCheck: true,
          isolatedModules: true,
          types: ['jest', 'node'],
        },
      },
    ],
  },
  verbose: true,
};
