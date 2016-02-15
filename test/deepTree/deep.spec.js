import expect from 'expect';

describe('deep test', () => {
  it('css-modules loader should work with ..', () => {
    const css = require('../assets/withoutExtractText/style.css');
    expect(css).toEqual({ item: 'style__item', main: 'style__main' });
  });

  it('must resolve js files in resolve modules', () => {
    const emptyJs = require('empty'); // eslint-disable-line
  });
});
