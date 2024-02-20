const path = require('path');

const buildRoot = path.resolve(__dirname, 'lib');
const appRoot = path.resolve(__dirname, 'app');
const CircularDependencyPlugin = require('circular-dependency-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [path.resolve(buildRoot, 'index')],
  output: {
    filename: 'bundle.[contentHash].js',
    path: appRoot
  },
  mode: 'production',
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
  plugins: [
    new CircularDependencyPlugin({
      exclude: /(node_modules|examples)\/./,
      failOnError: false
    }),
    new HtmlWebpackPlugin({ template: 'diagram_template.html', filename: 'diagram.html' })
  ],
  stats: {
    warningsFilter: [/Failed to parse source map/]
  },
  infrastructureLogging: {
    level: 'log'
  }
};