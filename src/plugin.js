import { resolve, dirname, relative } from 'path';
import { ResolverFactory, SyncNodeJsInputFileSystem } from 'enhanced-resolve';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import runWebPackSync from './runWebPackSync';
import memoize from './memoize';
import { StringLiteral } from 'babel-types';
import colors from 'colors/safe';

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

const isInAbsResolveModulesPath = memoize(
  ({ resolve: { modules = [] } = {} }) => {
    // support only absolute pathes in resolve.modules for js and jsx files
    // because node_modules aliasing is a bad practice
    const absPathes = modules
      .filter(p => p === resolve(p));

    return (fileAbsPath) => absPathes.some((p) => fileAbsPath.indexOf(p) === 0);
  }
);

const isJSFile = (fileAbsPath) => {
  const test = /\.jsx?$/;
  return test.test(fileAbsPath);
};

const isRelativePath = (fileAbsPath) => {
  return fileAbsPath.indexOf('.') === 0;
};

const warn = (() => {
  const msgs = {};

  return (message) => {
    if (message in msgs) {
      return;
    }

    msgs[message] = true;

    console.error( // eslint-disable-line
      colors.yellow(message)
    );
  };
})();

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

        if (process.env.BABEL_DISABLE_CACHE !== '1') {
          warn(
`babel-plugin-webpack-loader:
To avoid caching errors you need to set BABEL_DISABLE_CACHE=1 environment variable.
More information at issue #36`
          );
        }

        const [{ value: filePath }] = args;

        // to support babel builds (babel-node works fine)
        const filenameAbs = resolve(filenameRelative);

        const resolver = getEnhancedResolver(config);

        const fileAbsPath = resolveFilePath(resolver, filenameAbs, filePath);

        if (!fileAbsPath) {
          return;
        }

        // for js and jsx files inside resolve.modules,
        // for absolute folders only i.e. `path.join(__dirname, 'resolveDir')`
        // replace require('xxx') to relative path i.e. `require('../resolveDir/xxx')`
        if (
          isJSFile(fileAbsPath) &&
          !isRelativePath(filePath) &&
          isInAbsResolveModulesPath(config)(fileAbsPath)
        ) {
          const relPath = (
            (p) => isRelativePath(p)
              ? p
              : `./${p}`
          )(relative(dirname(filenameAbs), fileAbsPath));

          // path.replaceWith(t.stringLiteral(relPath));
          path.get('arguments.0').replaceWith(t.stringLiteral(relPath));
          return;
        }

        if (config.module.loaders.some((l) => l.test.test(filePath) || l.test.test(fileAbsPath))) {
          if (isJSFile(fileAbsPath)) {
            warn(
`babel-plugin-webpack-loader:
js and jsx files in loaders is unsupported by webpack-loader plugin.
all babel settings in loader will be skipped`
            );
            return;
          }

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
