import test from 'ava';
import css from '../assets/withoutExtractText/style.css';

test(t => {
  t.same(css, { item: 'style__item', main: 'style__main' });
});
