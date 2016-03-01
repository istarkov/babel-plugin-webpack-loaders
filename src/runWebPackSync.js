import { join } from 'path';
import { readFileSync } from 'fs';
import rimraf from 'rimraf';
import colors from 'colors/safe';
import { tmpdir } from 'os';
import { quote } from 'shell-quote';
import { execSync } from 'child_process';

export default ({ path, configPath, config, verbose }) => {
  const DEFAULT_OUTPUT_PATH = tmpdir();

  const webPackPath = require.resolve('webpack/bin/webpack');
  const rnd = `${(new Date()).getTime()}_${Math.round(1000000 * Math.random())}`;
  const outPath = join(config.output.path || DEFAULT_OUTPUT_PATH, `.webpack.res.${rnd}.js`);

  // I need to run webpack via execSync because I have not found the way how to run
  // babel visitors asynchronously or run webpack compile synchronously
  const webPackStdOut = execSync(
    quote([
      'node', // for windows support
      webPackPath,
      path, outPath,
      '--config', configPath,
      '--colors', '--bail',
    ])
  );

  if (verbose) {
    console.error( // eslint-disable-line
      colors.blue(`Webpack stdout for ${path}\n`) + // eslint-disable-line prefer-template
      colors.blue('---------\n') +
      `${webPackStdOut}\n` +
      colors.blue('---------')
    );
  }

  const webPackResult = readFileSync(outPath, { encoding: 'utf8' });
  rimraf.sync(outPath);

  return webPackResult;
};
