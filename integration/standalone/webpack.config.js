const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
var CircularDependencyPlugin = require('circular-dependency-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [path.resolve(buildRoot, 'index')],
  output: {
    filename: 'bundle.[contentHash].js',
    path: appRoot
  },
  mode: 'production',
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
    new HtmlWebpackPlugin({ template: 'index_template.html' })
  ]
};

module.exports = config;
