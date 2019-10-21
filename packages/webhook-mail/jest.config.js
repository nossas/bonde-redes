module.exports = {
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist']
};