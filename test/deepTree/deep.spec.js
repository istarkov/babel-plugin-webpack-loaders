import expect from 'expect';

import emptyJs from 'empty';

describe('deep test', () => {
  it('css-modules loader should work with ..', () => {
    const css = require('../assets/withoutExtractText/style.css');
    expect(css).toEqual({ item: 'style__item', main: 'style__main' });
  });

  it('must resolve import js files in resolve modules', () => {
    expect(emptyJs).toEqual(1000);
  });

  it('must resolve require js files in resolve modules', () => {
    const emptyR = require('empty');
    expect(emptyR.default).toEqual(1000);
  });
});
