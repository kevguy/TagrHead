/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// let libraryName = 'Tagrhead';
let libraryName = '';

let plugins = [
  new ExtractTextPlugin({
    filename: "/stylesheets/tagrhead.[name].css",
    disable: false,
    allChunks: true
  })
], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: {
    Tagrhead: './src/Tagrhead.js',
    basic: './src/stylesheets/basic.scss',
    material: './src/stylesheets/material.scss',
    mdl: './src/stylesheets/mdl.scss'
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]' + outputFile,
    // library: libraryName,
    library: 'Tagrhead',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$|\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?sourceMap&minimize', 'sass-loader?sourceMap'],
          fallback: 'style-loader',
          publicPath: 'dist'
        })
      }
    ]
  },
  // resolve: {
  //   modules: [path.resolve('./src')],
  //   extensions: ['.json', '.js']
  // },
  plugins: plugins
};

module.exports = config;
