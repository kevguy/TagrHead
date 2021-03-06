/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

const ExtractTextPlugin = require('extract-text-webpack-plugin');

let libraryName = 'Tagrhead';

let plugins = [
  new ExtractTextPlugin({
    filename: "/stylesheets/tagrhead.[name].css",
    disable: false,
    allChunks: true
  })
], externals = {}, outputFile, cssLoaderStr, scssLoaderStr;

if (env === 'build' || env === 'bundle') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  cssLoaderStr = 'css-loader?sourceMap&minimize';
  scssLoaderStr = 'sass-loader?sourceMap';

  outputFile = env === 'build' ? '.min.js' : '.bundle.min.js';
} else {
  outputFile = '.js';
  cssLoaderStr = 'css-loader';
  scssLoaderStr = 'sass-loader';
}

const config = {
  entry: {
    Tagrhead: './src/Tagrhead.js',
    basic: './src/stylesheets/basic.scss',
    material: './src/stylesheets/material.scss',
    mdl: './src/stylesheets/mdl.scss',
    bdl: './src/stylesheets/bdl.scss'
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]' + outputFile,
    library: libraryName,
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
          use: [cssLoaderStr, scssLoaderStr],
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

if (env === 'build') {
  config.externals = {
    jquery: 'jQuery'
  }
}

module.exports = config;
