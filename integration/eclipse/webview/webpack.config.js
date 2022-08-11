const webpack = require('webpack');
const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  entry: [path.resolve(buildRoot, 'index')],
  output: {
    filename: 'bundle.js',
    path: appRoot
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
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
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          esModule: false
        }
      }
    ]
  },
  node: { fs: 'empty', net: 'empty' },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /(node_modules|examples)\/./,
      failOnError: false
    })
  ],
  stats: {
    warningsFilter: [/Failed to parse source map/]
  },
  infrastructureLogging: {
    level: 'log'
  }
};
