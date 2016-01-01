import { resolve, dirname } from 'path';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import runWebPackSync from './runWebPackSync';
import 'babel-register';

const webPackResult_ = `
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"main":"CodeMirrorPlayground__main--3cj4Y","item":"CodeMirrorPlayground__item--3hTvt","busy":"CodeMirrorPlayground__busy--1CkCI","visible":"CodeMirrorPlayground__visible--pTIQ5","component":"CodeMirrorPlayground__component--38sC8","highlight":"CodeMirrorPlayground__highlight--1kxPS"};

/***/ }
/******/ ]);
`;

const processWithWebPack = () => {
  const webpackResultAst = parse(webPackResult_);
  let expr = null;
  traverse(webpackResultAst, {
    FunctionExpression(pathFn) {
      if (pathFn.node.params.length === 2 && pathFn.node.params[1].name === 'exports') {
        pathFn.traverse({
          AssignmentExpression(path) {
            expr = path.node.right;
          },
        });
      }
    },
  });

  return expr;
};

const localInteropRequire = (path) => {
  const res = require(resolve(process.cwd(), path));
  if ('default' in res) {
    return res.default;
  }
  return res;
};

export default function ({ types: t }) {
  return {
    visitor: {
      CallExpression(
        path,
        {
          file: { opts: { filenameRelative } },
          opts: { config: configPath = './webpack.config.js' } = {},
        }
      ) {
        const { callee: { name: calleeName }, arguments: args } = path.node;

        if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
          return;
        }

        const config = localInteropRequire(resolve(process.cwd(), configPath));
        if (Object.keys(config).length === 0) {
          // it's possible require calls inside webpack config or bad config
          return;
        }

        // TODO add other webpack checks
        if (config.module.loaders.some((l) => l.test.test(args[0].value))) {
          const [{ value: filePath }] = args;

          if (!t.isVariableDeclarator(path.parent)) {
            throw new Error(
                `You can't import file ${filePath} to a module scope.`
            );
          }

          const fileAbsPath = resolve(process.cwd(), dirname(filenameRelative), filePath);
          const webPackResult = runWebPackSync({ path: fileAbsPath, configPath });


          console.log('fileAbsPath', fileAbsPath);
          // console.log('traverse', expr.type);
          const expr = processWithWebPack(fileAbsPath, webPackResult);
          path.replaceWith(expr);
        }
      },
    },
  };
}
