var path = require('path'); // eslint-disable-line no-var
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line no-var
var autoprefixer = require('autoprefixer');  // eslint-disable-line no-var

module.exports = {
  output: {
    // for babel plugin
    libraryTarget: 'commonjs2',
    // where to place css
    path: path.join(__dirname, '../build/myCoolLibrary'),
    // for url-loader if limit exceeded to set publicPath
    publicPath: '/assets/',
  },
  plugins: [
    new ExtractTextPlugin(path.parse(process.argv[2]).name + '.css'),
  ],
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  module: {
    loaders: [
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
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
            'postcss-loader',
          ]
        ),
      },
      {
        test: /\.png$/,
        loaders: ['url-loader?limit=7000'],
      },
      {
        test: /\.txt$/,
        loaders: ['file-loader'],
      },
    ],
  },
};
