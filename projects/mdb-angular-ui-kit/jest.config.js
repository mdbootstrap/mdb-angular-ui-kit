const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  }
};
