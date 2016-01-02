// BUILDED WITHOUT PLUGIN `npm bin`/babel examples/myCoolLibrary --out-dir build/myCoolLibrary`
'use strict';

var _myCoolStyle = require('./myCoolStyle.sass');

var _myCoolCssStyle = require('./myCoolCssStyle.css');

var _myCoolCssStyle2 = _interopRequireDefault(_myCoolCssStyle);

var _myCoolIstarkov = require('./myCoolIstarkov.png');

var _myCoolIstarkov2 = _interopRequireDefault(_myCoolIstarkov);

var _myCoolIstarkovBig = require('./myCoolIstarkovBig.png');

var _myCoolIstarkovBig2 = _interopRequireDefault(_myCoolIstarkovBig);

var _myCoolTextFile = require('./myCoolTextFile.txt');

var _myCoolTextFile2 = _interopRequireDefault(_myCoolTextFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log( // eslint-disable-line no-console
'main = ' + _myCoolStyle.main + ', item = ' + _myCoolStyle.item + ';\nmyCoolCssStyle = ' + _myCoolCssStyle2.default + ';\npng = ' + _myCoolIstarkov2.default.substr(0, 80) + '...;\npngBig = ' + _myCoolIstarkovBig2.default + ';\ntxt = ' + _myCoolTextFile2.default + ';');
