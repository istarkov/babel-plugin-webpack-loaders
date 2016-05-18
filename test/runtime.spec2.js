// test/runtime.webpack2.config.js is used and defined at .babelrc:/env/TEST2/plugins
import expect from 'expect';

describe('runtime test with webpack@2', () => {
  it('file-loader should work', () => {
    const text = require('./assets/file.txt');
    expect(text).toEqual('file.txt');
  });
});
