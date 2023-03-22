const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
var CircularDependencyPlugin = require('circular-dependency-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [path.resolve(buildRoot, 'index')],
  output: {
    filename: 'bundle.[contenthash].js',
    path: appRoot
  },
  mode: 'production',
  resolve: {
    fallback: {
      fs: false,
      net: false,
      path: require.resolve('path-browserify')
    },
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
        type: 'asset/resource'
      }
    ]
  },
  ignoreWarnings: [/Failed to parse source map/, /Can't resolve .* in '.*ws\/lib'/],
  plugins: [
    new CircularDependencyPlugin({
      exclude: /(node_modules|examples)\/./,
      failOnError: false
    }),
    new HtmlWebpackPlugin({ template: 'index_template.html' })
  ]
};

module.exports = config;
