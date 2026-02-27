'use strict';

const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')
const pkg = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.ANALYZE === 'true'

const banner = `********************************************************************************************************************
 *  Backendless SDK for JavaScript. Version: ${pkg.version}
 *
 *  Copyright 2012-${ new Date().getFullYear() } BACKENDLESS.COM. All Rights Reserved.
 *
 *  NOTICE: All information contained herein is, and remains the property of Backendless.com and its suppliers,
 *  if any. The intellectual and technical concepts contained herein are proprietary to Backendless.com and its
 *  suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret
 *  or copyright law. Dissemination of this information or reproduction of this material is strictly forbidden
 *  unless prior written permission is obtained from Backendless.com.
 ********************************************************************************************************************`

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

  plugins: [
    new webpack.BannerPlugin({ banner }),
    ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],

  output: {
    library      : 'Backendless',
    libraryTarget: 'umd',
    path         : path.resolve('./dist'),
    filename     : isProd ? 'backendless.min.js' : 'backendless.js'
  }
}
