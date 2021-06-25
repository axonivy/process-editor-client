// @ts-check
const path = require('path');

const outputPath = path.resolve(__dirname, '../extension/pack');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'web',
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    filename: 'webview.js',
    path: outputPath
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  node: { fs: 'empty', net: 'empty' }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
  }
  return config;
};
