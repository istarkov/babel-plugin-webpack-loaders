// test/runtime.webpack.config.js is used and defined at .babelrc:/env/TEST/plugins
import expect from 'expect';

describe('runtime test', () => {
  it('css-modules loader should work', () => {
    const css = require('./assets/style.css');
    expect(css).toEqual({ main: 'style__main--3hKHQ', item: 'style__item--24uGR' });
  });

  it('css-modules + sass loaders should work', () => {
    const css = require('./assets/style.sass');
    expect(css).toEqual({ item: 'style__item--151LE', main: 'style__main--2KvR7' });
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
