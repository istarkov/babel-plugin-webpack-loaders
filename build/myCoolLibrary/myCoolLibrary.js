// BUILDED WITH PLUGIN `NODE_ENV=EXAMPLES_LIB `npm bin`/babel examples/myCoolLibrary --out-dir build/myCoolLibrary`

'use strict';

var _myCoolStyle = { "main": "myCoolStyle__main--1VXE-", "item": "myCoolStyle__item--2jogC", "bigItem": "myCoolStyle__bigItem--35oAS" };

var _myCoolCssStyle = { "cssmain": "myCoolCssStyle__cssmain--2YhBM", "cssitem": "myCoolCssStyle__cssitem--1sTGV" };

var _myCoolCssStyle2 = _interopRequireDefault(_myCoolCssStyle);

var _myCoolIstarkov = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABAgICAgICAgICAgIC ..."; // truncated by me

var _myCoolIstarkov2 = _interopRequireDefault(_myCoolIstarkov);

var _myCoolIstarkovBig = '/assets/' + "542eeceb5bf325cd3c9600b173ed751d.png";

var _myCoolIstarkovBig2 = _interopRequireDefault(_myCoolIstarkovBig);

var _myCoolTextFile = '/assets/' + "f3edca2ee09598e9ff8354e2057f5c77.txt";

var _myCoolTextFile2 = _interopRequireDefault(_myCoolTextFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log( // eslint-disable-line no-console
'main = ' + _myCoolStyle.main + ', item = ' + _myCoolStyle.item + ';\nmyCoolCssStyle = ' + _myCoolCssStyle2.default + ';\npng = ' + _myCoolIstarkov2.default.substr(0, 80) + '...;\npngBig = ' + _myCoolIstarkovBig2.default + ';\ntxt = ' + _myCoolTextFile2.default + ';');
