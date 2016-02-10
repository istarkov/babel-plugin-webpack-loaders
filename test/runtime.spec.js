// test/runtime.webpack.config.js is used and defined at .babelrc:/env/TEST/plugins
import expect from 'expect';

describe('runtime test', () => {
  it('css-modules loader should work', () => {
    const css = require('./assets/withoutExtractText/style.css');
    expect(css).toEqual({ item: 'style__item', main: 'style__main' });
  });

  it('css-modules + sass loaders should work', () => {
    const css = require('./assets/withoutExtractText/style.sass');
    expect(css).toEqual({ item: 'style__item', main: 'style__main' });
  });

  it('css-modules loader with ExtractText plugin should work', () => {
    const css = require('./assets/withExtractText/style.css');
    expect(css).toEqual({ itemET: 'style__itemET', mainET: 'style__mainET' });
  });

  it('css-modules + sass loader with ExtractText plugin should work', () => {
    const css = require('./assets/withExtractText/style.sass');
    expect(css).toEqual({ itemET: 'style__itemET', mainET: 'style__mainET' });
  });

  it('file loader should work', () => {
    const text = require('./assets/file.txt');
    expect(text).toEqual('file.txt');
  });

  it('url loader for small files should load file content', () => {
    const text = require('./assets/url.bin');
    const fromBase64 = (new Buffer(text.split(',')[1], 'base64')).toString();
    // \n because my atom editor set it for every file
    expect(fromBase64).toEqual('hello world\n');
  });

  it('url loader for big files should load file name', () => {
    const text = require('./assets/urlBig.bin');
    expect(text).toEqual('urlBig.bin');
  });

  it('resolve should work as node resolve', () => {
    const text = require('normalize.css/normalize.css');
    expect(text).toEqual(undefined);
  });

  it('resolve.modules from webpack config should work', () => {
    const text = require('assets/file.txt');
    expect(text).toEqual('file.txt');
  });
});
