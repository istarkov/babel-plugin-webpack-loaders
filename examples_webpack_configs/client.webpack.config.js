var libConfig = require('./lib.webpack.config');  // eslint-disable-line no-var
var path = require('path'); // eslint-disable-line no-var

module.exports = Object.assign(
  {},
  libConfig,
  {
    entry: [
      path.join(__dirname, '../examples/myCoolLibrary/myCoolLibrary.js'),
    ],
    module: {
      loaders: [].concat(
        libConfig.module.loaders,
        [
          {
            test: /\.js$/,
            loaders: ['babel'],
            include: [
              path.join(__dirname, '../examples'),
            ],
          },
        ]
      ),
    },
    output: {
      // for babel plugin
      // libraryTarget: 'commonjs2',
      filename: 'myCoolLibrary.js',
      // where to place webpack files
      path: path.join(__dirname, '../build/myCoolLibrary2/'),
      // for url-loader if limit exceeded to set publicPath
      publicPath: '/assets/',
    },
  }
);
