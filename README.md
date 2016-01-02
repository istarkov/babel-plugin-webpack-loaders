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

Install

```shell
npm install --save-dev babel-cli css-loader postcss-loader style-loader babel-plugin-webpack-loaders
```

or just clone [minimal-example](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

You need to create webpack config file, like [this](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/run.webpack.config.js)

```javascript
// webpack.config.js css-modules loader example
module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
        ],
      },
    ],
  },
};
```

You need to add to `.babelrc` next lines like [here](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/.babelrc#L9-L19)
(_set "verbose": false if you don't want webpack output_)

```json
{
  "presets": ["es2015"],
  "env": {
    "EXAMPLE": {
      "plugins": [
        [
          "babel-plugin-webpack-loaders",
          {
            "config": "./webpack.config.js",
            "verbose": false,
          }
        ]
      ]
    }
  }
}
```

And now you can include [css](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/runExample/some.css) with support of css-modules into [js file](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples/runExample/run.js)

```css
/* example.css */
.main {
  display: flex;
}

.item {
  flex: 1 1 auto;
}
```

```javascript
// example.js
import css from './example.css';
console.log('css-modules result:', css);
```

Run `NODE_ENV=EXAMPLE ./node_modules/.bin/babel-node ./example.js` and you get console output

```javascript
css-modules result: { main: 'example__main--zYOjd', item: 'example__item--W9XoN' }
```

you can test this and other examples just cloning this repo and running next commands
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


# Install

```shell
npm install babel-plugin-webpack-loaders
```

# Examples

[webpack configs](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/examples_webpack_configs)

[examples](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/examples)

[.babelrc example](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/.babelrc)

[tests](https://github.com/istarkov/babel-plugin-webpack-loaders/tree/master/test)

[minimal-example-repo](https://github.com/istarkov/minimal-example-for-babel-plugin-webpack-loaders)

# Why

The source of inspiration of this plugin is [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)

- But I love to write css with sass (sometimes with less or with scss), and it's easy to configure with webpack loaders,
with full support of images and fonts preloading as base64 (using url-loader).

- Webpack already has a lot of loaders with a lot of params, so I could reuse them

- I have a lot of webpack configs where all troubles with params and settings was solved

# How plugin works internally

Plugin tests all `require` pathes with [test regexps](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L91) from webpack config loaders,

- for each successful test plugin [synchronously executes webpack](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/runWebPackSync.js#L15-L16),

- using babel-parse plugin [parses webpack output](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L7),

- plugin [replaces](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L104) require ast with parse ast output.

# Verbose mode in config

By default babel caches compiled files, if you need to view webpack stdout output, run commands with
`BABEL_DISABLE_CACHE=1` prefix
