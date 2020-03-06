'use strict';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd ? false : 'source-map',

  target: 'web',

  mode: process.env.NODE_ENV,

  performance: { hints: false },

  entry: {
    'bundle': './src/index.js'
  },

  node: {
    Buffer: false,
    fs    : 'empty'
  },

  module: {
    noParse: /backendless-request/,

    rules: [
      {
        test   : /\.js$/,
        exclude: /node_modules/,
        loader : 'babel-loader'
      }
    ]
  },

  output: {
    library      : 'Backendless',
    libraryTarget: 'umd',
    path         : path.resolve('./dist'),
    filename     : isProd ? 'backendless.min.js' : 'backendless.js'
  },

  plugins: isProd ? [new UglifyJsPlugin()] : []
}
