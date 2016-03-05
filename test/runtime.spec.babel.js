// just to test that es6 config works
import expect from 'expect';

describe('runtime test', () => {
  it('css-modules loader should work', () => {
    const css = require('./assets/withoutExtractText/style.css');
    expect(css).toEqual({ item: 'style__item', main: 'style__main' });
  });
});
