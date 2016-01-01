module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
          `sass-loader?precision=10&indentedSyntax=sass`,
        ],
      },
      {
        test: /\.bin$/,
        loaders: ['url-loader?limit=100&name=[name].[ext]'],
      },
      {
        test: /\.txt$/,
        loaders: ['file-loader?name=[name].[ext]'],
      },
    ],
  },
};
