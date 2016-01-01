import { resolve, dirname } from 'path';
import { parse } from 'babylon';
import traverse from 'babel-traverse';
import runWebPackSync from './runWebPackSync';
import 'babel-register';

const processWebPackResult = (webPackResult) => {
  const webpackResultAst = parse(webPackResult);
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

export default function ({ types: t }) {
  // some strange error occurs if I move this fn outside context
  // and then run babel-node with this plugin
  const localInteropRequire = (path) => {
    const res = require(resolve(process.cwd(), path));
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
          const webPackResult = runWebPackSync({ path: fileAbsPath, configPath, config });

          const expr = processWebPackResult(webPackResult);
          path.replaceWith(expr);
        }
      },
    },
  };
}
