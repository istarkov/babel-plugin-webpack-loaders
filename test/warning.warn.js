import sinon from 'sinon';
import expect from 'expect';

import { transform } from 'babel-core';
import babelPresetEs2015 from 'babel-preset-es2015';
import babelPresetStage0 from 'babel-preset-stage-0';
import babelPluginWebpackLoader from '../lib/plugin.js';

describe('warning test', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not output warning if webpack loader contains js jsx', () => {
    sinon.stub(console, 'error');
    const codeStr = `
      import empty from './test/resolveDir/empty';
    `;

    transform(
      codeStr,
      {
        presets: [
          babelPresetEs2015,
          babelPresetStage0,
        ],
        plugins: [
          [
            babelPluginWebpackLoader,
            {
              config: './test/warning.webpack.config.js',
              verbose: false,
            },
          ],
        ],
        retainLines: true,
      }
    );

    expect(console.error.calledOnce).toBe(false); // eslint-disable-line
    // expect(console.error.args[0][0].indexOf('babel-plugin-webpack-loader') > -1).toBe(true);
  });
});
