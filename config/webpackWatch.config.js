const configFactory = require('./webpack.config');
const commonConfig = configFactory('production')
console.log(commonConfig)
const config = {
  ...commonConfig,
}
module.exports = config;