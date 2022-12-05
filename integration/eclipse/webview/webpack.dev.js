const config = require('./webpack.config.js');

const dev = {
  ...config,
  mode: 'development',
  devtool: 'source-map'
};

module.exports = dev;
