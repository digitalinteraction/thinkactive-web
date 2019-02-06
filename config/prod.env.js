'use strict'
const packageConfig = require('../package.json')

module.exports = {
  NODE_ENV: '"production"',
  API_URL: '"/api"',
  PACKAGE_NAME: `'${packageConfig.name}'`,
  PACKAGE_VERSION: `'${packageConfig.version}'`
}
