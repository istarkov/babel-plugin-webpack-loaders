var path = require('path'); // eslint-disable-line no-var
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line no-var
var autoprefixer = require('autoprefixer');  // eslint-disable-line no-var

module.exports = {
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../build/myCoolLibrary'),
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
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
        ],
      },
      {
        test: /\.png$/,
        loaders: ['url-loader'],
      },
    ],
  },
};
