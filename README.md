[![Travis CI](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders.svg?branch=master)](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders)
[![Appveyor](https://ci.appveyor.com/api/projects/status/r4rctajjme24wl0q?svg=true)](https://ci.appveyor.com/project/istarkov/babel-plugin-webpack-loaders)

# babel-plugin-webpack-loaders

This Babel 6 plugin allows you to use webpack loaders in Babel.
It's now easy to run universal apps on the server without additional build steps, to create libraries as usual with `babel src --out-dir lib` command, to run tests without mocking-prebuilding source code.
It just replaces `require - import` statements with `webpack loaders` results. Take a look at this Babel [build output  diff](https://github.com/istarkov/babel-plugin-webpack-loaders/commit/2a7a6d1e61ea3d052b34afd5c3abc46f075d277c#diff-4) to get the idea.

For now this plugin is of alpha quality and tested on webpack loaders I use in my projects.
These loaders are `file-loader`, `url-loader`, `css-loader`, `style-loader`, `sass-loader`, `postcss-loader`.
The plugin supports all webpack features like loaders chaining, webpack plugins, and all loaders params. It's easy because this plugin just uses webpack.

Three examples:

- [runtime css-modules example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/runExample/run.js) with simple [webpack config](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/run.webpack.config.js),
run it with `npm run example-run`

- [library example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/myCoolLibrary/myCoolLibrary.js) with [multi loaders-plugins webpack config](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/lib.webpack.config.js),
build it with `npm run example-build` and execute with `node build/myCoolLibrary/myCoolLibrary.js`, assets and code will be placed at `./build/myCoolLibrary` folder.

  Here is an [output diff](https://github.com/istarkov/babel-plugin-webpack-loaders/commit/2a7a6d1e61ea3d052b34afd5c3abc46f075d277c#diff-4) of this [library example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/myCoolLibrary/myCoolLibrary.js) built without and with the plugin.

- [minimal-example-standalone-repo](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

## Warning

**Do not run this plugin as part of a webpack frontend configuration. This plugin is intended only for backend compilation.**


# How it works

Take a look at this [minimal-example](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

- You need to create a [webpack config](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/webpack.config.js)

- You need to add [these lines](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/.babelrc#L1-L16) to `.babelrc`

- Now you can run [example.js](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/example.js)

  ```javascript
  // example.js
  import css from './example.css';
  console.log('css-modules result:', css);
  ```

  with the command `NODE_ENV=EXAMPLE ./node_modules/.bin/babel-node ./example.js` and you'll get the following console output:

  ```javascript
  css-modules result: { main: 'example__main--zYOjd', item: 'example__item--W9XoN' }
  ```

Here I placed [output diff](https://github.com/istarkov/babel-plugin-webpack-loaders/commit/2a7a6d1e61ea3d052b34afd5c3abc46f075d277c#diff-4)
of this [babel library](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/myCoolLibrary/myCoolLibrary.js) build without and with the plugin.
As you can see the plugin just replaces require with loaders results. [All loaders](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/example-output/build/myCoolLibrary/assets/myCoolStyle.css#L12) and [plugins](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/example-output/build/myCoolLibrary/assets/myCoolStyle.css#L4) have been applied to generated assets


# Install

```shell
npm install --save-dev babel-cli babel-plugin-webpack-loaders
```

# Examples

[webpack configs](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/examples_webpack_configs),
[examples](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/examples),
[.babelrc example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/.babelrc),
[tests](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/test),
[minimal-example-repo](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

You can try out the examples by cloning this repo and running the following commands:

```shell
npm install
# example above
npm run example-run
# library example - build library with a lot of modules
npm run example-build
# and now you can use your library using just node
node build/myCoolLibrary/myCoolLibrary.js
# test sources are also good examples
npm run test
```

# Why

The source of inspiration for this plugin was [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform), but it was missing some features I wanted:

- I love writing CSS using Sass
- I like webpack and its loaders (chaining, plugins, settings)
- I wanted to open source a UI library which heavily used CSS Modules, Sass and other webpack loaders.
  The library consisted of many small modules and every module needed to be available to users independently such as  `lodash/blabla/blublu`.
  With this plugin the heavy build file for the library could be replaced with just one command: `babel src --out-dir lib`.

# How the plugin works internally

The plugin tests all `require` paths with [test regexps](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L91) from the loaders in the webpack config, and then for each successful test:

1. [synchronously executes webpack](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/runWebPackSync.js#L15-L16)

2. [parses webpack output](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L7) using babel-parse

3. [replaces](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L104) the required ast with the parsed ast output

# Verbose mode in config

By default Babel caches compiled files, if you need to view webpack stdout output, run commands with a
`BABEL_DISABLE_CACHE=1` prefix.

# Thanks to

[Felix Kling](https://github.com/fkling) and his [astexplorer](https://github.com/fkling/astexplorer)

[James Kyle](https://github.com/thejameskyle) and his [babel-plugin-handbook](https://github.com/thejameskyle/babel-plugin-handbook)

[Michal Kvasničák](https://github.com/michalkvasnicak) and his [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)
