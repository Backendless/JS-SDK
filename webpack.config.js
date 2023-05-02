'use strict';

const TerserPlugin = require('terser-webpack-plugin')
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

  resolve: {
    fallback: {
      Buffer: false,
      fs    : false,
    }
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

  optimization: {
    minimize : isProd,
    minimizer: [new TerserPlugin({
      parallel     : true,
      terserOptions: {
        ecma: 6,
      },
    })],
  },

  output: {
    library      : 'Backendless',
    libraryTarget: 'umd',
    path         : path.resolve('./dist'),
    filename     : isProd ? 'backendless.min.js' : 'backendless.js'
  }
}
