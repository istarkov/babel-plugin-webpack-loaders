module.exports = function config() {
  return {
    output: {
      // YOU NEED TO SET libraryTarget: 'commonjs2'
      libraryTarget: 'commonjs2',
    },
    module: {
      loaders: [
        {
          test: /\.txt$/,
          loaders: ['file-loader?name=[name].[ext]'],
        },
      ],
    },
  };
};
