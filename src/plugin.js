import { resolve, dirname } from 'path';
import { ResolverFactory, SyncNodeJsInputFileSystem } from 'enhanced-resolve';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import runWebPackSync from './runWebPackSync';
import memoize from './memoize';
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

  return traverse.removeProperties(expr);
};

// memoize resolver instance
const getEnhancedResolver = memoize(
  ({ resolve: configResolve }) => (
    ResolverFactory.createResolver({
      fileSystem: new SyncNodeJsInputFileSystem(),
      ...configResolve,
    })
  )
);

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
          opts: { config: configPath = './webpack.config.js', verbose = true } = {},
        }
      ) {
        // don't process current plugin
        if (typeof getEnhancedResolver === 'undefined') {
          return;
        }

        const { callee: { name: calleeName }, arguments: args } = path.node;

        if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
          return;
        }

        const config = localInteropRequire(resolve(process.cwd(), configPath));
        if (Object.keys(config).length === 0) {
          // it's possible require calls inside webpack config or bad config
          return;
        }

        const [{ value: filePath }] = args;

        // to support babel builds (babel-node works fine)
        const filenameAbs = resolve(filenameRelative);

        const resolver = getEnhancedResolver(config);
        const fileAbsPath = resolver.resolveSync({}, dirname(filenameAbs), filePath);

        if (config.module.loaders.some((l) => l.test.test(filePath) || l.test.test(fileAbsPath))) {
          const webPackResult = runWebPackSync({ path: fileAbsPath, configPath, config, verbose });

          const expr = processWebPackResult(webPackResult, config);

          if (expr !== null) {
            if (expr.type === 'FunctionExpression') {
              path.remove();
            } else {
              path.replaceWith(expr);
            }
          } else {
            path.remove();
          }
        }
      },
    },
  };
}
