// The same as @vjeux did https://github.com/vjeux/download-file-sync/blob/master/index.js
// `npm bin`/webpack Playground.sass ./build/res.js --config ./webpack.tmp.config.js
export default ({ path, configPath }) => {
  console.log('webpack/bin/webpack', require.resolve('webpack/bin/webpack'))
  // return require('child_process')
  //  .execFileSync('curl', ['--silent', '-L', url], { encoding: 'utf8' });
};
