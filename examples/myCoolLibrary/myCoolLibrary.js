import { main, item } from './myCoolStyle.sass';
import myCoolCssStyle from './myCoolCssStyle.css';
import png from './myCoolIstarkov.png';
import pngBig from './myCoolIstarkovBig.png';
import txt from './myCoolTextFile.txt';

console.log(  // eslint-disable-line no-console
`main = ${main}, item = ${item};
myCoolCssStyle = ${myCoolCssStyle};
png = ${png.substr(0, 80)}...;
pngBig = ${pngBig};
txt = ${txt};`
);
