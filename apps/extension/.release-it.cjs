const baseConfig = require("../../.release-it.base.cjs");

const config = {
  ...baseConfig,
  // TODO: we do not want to bump the version of the packages that are not published
  // hooks: {
  //   "after:bump": [
  //     "yarn bump -p chains -p components -p crypto -p shared -p storage -p types -p utils",
  //   ],
  // },
};

module.exports = config;
