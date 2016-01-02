[![Build Status](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders.svg?branch=master)](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders)

# babel-plugin-webpack-loaders

This babel 6 plugin allows you to use webpack loaders in babel.
It's now easy to run universal apps on the server without additional build steps and to create libraries as usual with `babel src --out-dir lib` command.

For now this plugin is at alpha quality and tested on webpack loaders I use in my projects.
These loaders are `file-loader`, `url-loader`, `css-loader`, `style-loader`, `sass-loader`, `postcss-loader`.
Plugin supports all webpack features like loaders chaining, webpack plugins, and all loaders params. It's easy because this plugin just uses webpack.

There are three examples here:

- [runtime css-modules example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/runExample/run.js) with simple [webpack config](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/run.webpack.config.js),
run it with `npm run example-run`

- [library example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/myCoolLibrary/myCoolLibrary.js) with [multi loaders-plugins webpack config](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/lib.webpack.config.js),
build it with `npm run example-build` and execute with `node build/myCoolLibrary/myCoolLibrary.js`, assets and code will be placed at `./build/myCoolLibrary` folder.

- [minimal-example-standalone-repo](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

# How it works

Look at [minimal-example](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

- You need to create [webpack config](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/webpack.config.js) file.

- You need add to `.babelrc` [next lines](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/webpack.config.js)

- Now you can run [next javascript file](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders/blob/master/example.js)

  ```javascript
  // example.js
  import css from './example.css';
  console.log('css-modules result:', css);
  ```

  with command `NODE_ENV=EXAMPLE ./node_modules/.bin/babel-node ./example.js` and you get the console output

  ```javascript
  css-modules result: { main: 'example__main--zYOjd', item: 'example__item--W9XoN' }
  ```

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

you can test local examples just cloning this repo and running next commands

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

The source of inspiration of this plugin is [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)

- But I love to write css with sass
- I just like webpack loaders (chaining, plugins, setting) .

# How plugin works internally

Plugin tests all `require` pathes with [test regexps](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L91) from webpack config loaders,

- for each successful test plugin [synchronously executes webpack](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/runWebPackSync.js#L15-L16),

- using babel-parse plugin [parses webpack output](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L7),

- plugin [replaces](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L104) require ast with parse ast output.

# Verbose mode in config

By default babel caches compiled files, if you need to view webpack stdout output, run commands with
`BABEL_DISABLE_CACHE=1` prefix
