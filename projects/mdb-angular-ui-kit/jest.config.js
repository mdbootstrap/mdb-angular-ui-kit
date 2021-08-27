const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/projects/mdb-angular-ui-kit/tsconfig.spec.json',
    },
  },
};
