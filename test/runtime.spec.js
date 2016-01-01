// test/runtime.webpack.config.js is used and defined at .babelrc:/env/TEST/plugins
import expect from 'expect';

describe('runtime test', () => {
  it('css-modules loader should work', () => {
    const css = require('./assets/withoutExtractText/style.css');
    expect(css).toEqual({ item: 'style__item--114y2', main: 'style__main--FyeeK' });
  });

  it('css-modules + sass loaders should work', () => {
    const css = require('./assets/withoutExtractText/style.sass');
    expect(css).toEqual({ item: 'style__item--3xWFz', main: 'style__main--2G5AL' });
  });

  it('css-modules loader with ExtractText plugin should work', () => {
    const css = require('./assets/withExtractText/style.css');
    expect(css).toEqual({ itemET: 'style__itemET--2RhIj', mainET: 'style__mainET--351DK' });
  });

  it('css-modules + sass loader with ExtractText plugin should work', () => {
    const css = require('./assets/withExtractText/style.sass');
    expect(css).toEqual({ itemET: 'style__itemET--tSpra', mainET: 'style__mainET--1ov5K' });
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
});
