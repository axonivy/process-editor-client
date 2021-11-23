const webpack = require('webpack');
const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
var CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  entry: [path.resolve(buildRoot, 'index')],
  output: {
    filename: 'bundle.js',
    path: appRoot
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
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
      },
      {
        test: /\.(ttf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          esModule: false
        }
      }
    ]
  },
  node: { fs: 'empty', net: 'empty' },
  stats: {
    warningsFilter: [/Failed to parse source map/]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /(node_modules|examples)\/./,
      failOnError: false
    }),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])
  ]
};
