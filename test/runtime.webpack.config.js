var path = require('path'); // eslint-disable-line no-var
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line no-var
var autoprefixer = require('autoprefixer');  // eslint-disable-line no-var

module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new ExtractTextPlugin('out.css'), // eslint-disable-line
  ],
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  resolve: {
    // we made a mistake in the past, webpack does not support modules, just modulesDirectories
    // but we will support this name for backward compatibility
    modules: [
      path.join(__dirname, 'backwardCompatResolve'),
    ],
    modulesDirectories: [
      __dirname,
      'node_modules',
      path.join(__dirname, 'resolveDir'),
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
          'sass-loader?precision=10&indentedSyntax=sass',
        ],
        include: [
          path.join(__dirname, 'assets/withoutExtractText'),
          path.join(__dirname, 'resolveDir'),
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
            'postcss-loader',
          ],
        }),
        include: [
          path.join(__dirname, 'assets/withExtractText'),
          path.join(__dirname, '../node_modules'),
        ],
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]',
            'postcss-loader',
            'sass-loader?precision=10&indentedSyntax=sass',
          ],
        }),
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
