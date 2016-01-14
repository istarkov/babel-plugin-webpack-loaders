import { resolve as fsResolve, dirname } from 'path';
import resolve from 'resolve';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import runWebPackSync from './runWebPackSync';
import { StringLiteral } from 'babel-types';

const processWebPackResult = (webPackResult, { output: { publicPath = '' } = {} } = {}) => {
  const webpackResultAst = parse(webPackResult);
  let expr = null;

  // without ExtractTextPlugin css-loader result looks like `blabla.locals = {...blbala}`
  traverse(webpackResultAst, {
    FunctionExpression(pathFn) {
      if (pathFn.node.params.length >= 2 && pathFn.node.params[1].name === 'exports') {
        pathFn.traverse({
          AssignmentExpression(path) {
            if (path.node.left.property && path.node.left.property.name === 'locals') {
              expr = path.node.right;
            }
          },
        });
      }
    },
  });

  // with ExtractTextPlugin css-loader result looks like `module.exports = {...blbala}`
  if (expr === null) {
    traverse(webpackResultAst, {
      FunctionExpression(pathFn) {
        if (pathFn.node.params.length >= 2 && pathFn.node.params[1].name === 'exports') {
          pathFn.traverse({
            AssignmentExpression(path) {
              if (path.node.left.property && path.node.left.property.name === 'exports') {
                expr = path.node.right;
              }
            },
            BinaryExpression(pathBin) {
              pathBin.traverse({
                MemberExpression(pathM) {
                  if (
                    pathM.node.object.name === '__webpack_require__' &&
                    pathM.node.property.name === 'p'
                  ) {
                    pathM.replaceWith(StringLiteral(publicPath)); // eslint-disable-line
                  }
                },
              });
            },
          });
        }
      },
    });
  }

  return expr;
};

export default function ({ types: t }) {
  // some strange error occurs if I move this fn outside context
  // and then run babel-node with this plugin
  const localInteropRequire = (path) => {
    const res = require(fsResolve(process.cwd(), path));
    if ('default' in res) {
      return res.default;
    }
    return res;
  };

  return {
    visitor: {
      CallExpression(
        path,
        {
          file: { opts: { filenameRelative } },
          opts: { config: configPath = './webpack.config.js', verbose = true } = {},
        }
      ) {
        const { callee: { name: calleeName }, arguments: args } = path.node;

        if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
          return;
        }

        const config = localInteropRequire(fsResolve(process.cwd(), configPath));
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

          const fileAbsPath = resolve.sync(
            filePath,
            {
              basedir: dirname(filenameRelative),
            }
          );

          const webPackResult = runWebPackSync({ path: fileAbsPath, configPath, config, verbose });

          const expr = processWebPackResult(webPackResult, config);

          if (expr !== null) {
            path.replaceWith(expr);
          } else {
            path.remove();
          }
        }
      },
    },
  };
}
