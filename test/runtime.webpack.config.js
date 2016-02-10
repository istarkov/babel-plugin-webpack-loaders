var path = require('path'); // eslint-disable-line no-var
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line no-var
var autoprefixer = require('autoprefixer');  // eslint-disable-line no-var

module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new ExtractTextPlugin(path.parse(process.argv[2]).name + '.css'),
  ],
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  resolve: {
    modules: [
      __dirname,
      'node_modules',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
          'postcss-loader',
        ],
        include: [
          path.join(__dirname, 'assets/withoutExtractText'),
        ],
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]',
          'postcss-loader',
          `sass-loader?precision=10&indentedSyntax=sass`,
        ],
        include: [
          path.join(__dirname, 'assets/withoutExtractText'),
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
            'postcss-loader',
          ]
        ),
        include: [
          path.join(__dirname, 'assets/withExtractText'),
          path.join(__dirname, '../node_modules/normalize.css'),
        ],
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]',
            'postcss-loader',
            `sass-loader?precision=10&indentedSyntax=sass`,
          ]
        ),
        include: [path.join(__dirname, 'assets/withExtractText')],
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
