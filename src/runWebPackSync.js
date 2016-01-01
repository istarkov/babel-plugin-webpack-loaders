import { join } from 'path';
import { readFileSync } from 'fs';
import rimraf from 'rimraf';
import colors from 'colors/safe';

export default ({ path, configPath, config }) => {
  const DEFAULT_OUTPUT_PATH = '/tmp';

  const webPackPath = require.resolve('webpack/bin/webpack');
  const rnd = `${(new Date()).getTime()}_${Math.round(1000000 * Math.random())}`;
  const outPath = join(config.output.path || DEFAULT_OUTPUT_PATH, `.webpack.res.${rnd}.js`);

  // I need to run webpack via execFileSync because I have not find the way how to run
  // babel visitors asynchronously or run webpack compile synchronously
  const webPackStdOut = require('child_process')
    .execFileSync(webPackPath, [path, outPath, '--config', configPath, '--colors']);

  console.log( // eslint-disable-line
    colors.blue(`Webpack stdout for ${path}\n`) +
    colors.blue(`---------\n`) +
    `${webPackStdOut}\n` +
    colors.blue(`---------`)
  );

  const webPackResult = readFileSync(outPath, { encoding: 'utf8' });
  rimraf.sync(outPath);

  return webPackResult;
};
