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

// https://github.com/webpack/node-libs-browser
const internalNodeModules = {
  assert: 1,
  buffer: 1,
  child_process: 1,
  cluster: 1,
  console: 1,
  constants: 1,
  crypto: 1,
  dgram: 1,
  dns: 1,
  domain: 1,
  events: 1,
  fs: 1,
  http: 1,
  https: 1,
  module: 1,
  net: 1,
  os: 1,
  path: 1,
  process: 1,
  punycode: 1,
  querystring: 1,
  readline: 1,
  repl: 1,
  stream: 1,
  string_decoder: 1,
  sys: 1,
  timers: 1,
  tls: 1,
  tty: 1,
  url: 1,
  util: 1,
  vm: 1,
  zlib: 1,
};

const resolveFilePath = (resolver, filenameAbs, filePath) => {
  try {
    return resolver.resolveSync({}, dirname(filenameAbs), filePath);
  } catch (e) {
    if (!(filePath in internalNodeModules)) {
      throw e;
    }
  }
  return undefined;
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

        const fileAbsPath = resolveFilePath(resolver, filenameAbs, filePath);
        // resolver.resolveSync({}, dirname(filenameAbs), filePath);

        if (!fileAbsPath) {
          return;
        }

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
