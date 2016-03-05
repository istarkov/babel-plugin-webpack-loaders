import path from 'path';

export default {
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
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]',
          'postcss-loader',
        ],
        include: [
          path.join(__dirname, 'assets/withoutExtractText'),
        ],
      },
    ],
  },
};
