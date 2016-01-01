// `npm bin`/webpack ./examples/CodeMirrorPlayground.sass ./build/res.js --config ./webpack.tmp.config.js
// cat ./build/res.js | grep 'module.exports = {'

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('./build/assets'),
  ],
  resolve: {
    alias: {
      'react-babel-playground': path.join(__dirname, 'src'),
    },
  },
  module: {
    exprContextCritical: false,
    loaders: [
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
            'postcss-loader',
            `sass-loader?precision=10&indentedSyntax=sass`,
          ]
        ),
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
        ],
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'examples')],
        exclude: [path.join(__dirname, 'examples', 'assets')],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
        include: [path.join(__dirname, 'node_modules'), path.join(__dirname, 'examples', 'assets')],
      },
      {
        test: /\.gif$/,
        loaders: ['url-loader'],
        include: [path.join(__dirname, 'examples')],
      },
    ],
  },
};
