import test from 'ava';
import css from '../assets/withoutExtractText/style.css';

test(t => {
  t.deepEqual(css, { item: 'style__item', main: 'style__main' });
});
