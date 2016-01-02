[![Build Status](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders.svg?branch=master)](https://travis-ci.org/istarkov/babel-plugin-webpack-loaders)

# babel-plugin-webpack-loaders

This babel 6 plugin allows you to use webpack loaders in babel.
It's now easy to run universal apps on the server without additional build steps and to create libraries as usual with `babel src --out-dir lib` command.

For now this plugin is at alpha quality and tested on webpack loaders I use in my projects.
These loaders are `file-loader`, `url-loader`, `css-loader`, `style-loader`, `sass-loader`, `postcss-loader`.
Plugin supports all webpack features like loaders chaining, webpack plugins, and all loaders params. It's easy because this plugin just uses webpack.

# How it works

You need to create webpack config file, like [this](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/examples_webpack_configs/run.webpack.config.js)

```javascript
// webpack.config.js css-modules loader example
module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
    path: './build',
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

```json
{
  "presets": ["es2015"],
  "env": {
    "EXAMPLES_RUN": {
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
.main {
  display: flex;
}

.item {
  flex: 1 1 auto;
}
```

```javascript
import css from './some.css';
console.log(css);
```

Run `NODE_ENV=EXAMPLES_RUN babel-node your.js` and you get console output

```javascript
{ main: 'some__main--2kmsh', item: 'some__item--ocDmM' }
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

# Why

The source of inspiration of this plugin is [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)

- But I love to write css with sass (sometimes with less or with scss), and it's easy to configure with webpack loaders,
with full support of images and fonts preloading as base64 (using url-loader).

- Webpack already has a lot of loaders with a lot of params, so I could reuse them

- I have a lot of webpack configs there all troubles with params and settings was solved

# How plugin works internally

Plugin tests all `require` pathes with [test regexps](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L91) from webpack config loaders,

- for each successful test plugin [synchronously executes webpack](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/runWebPackSync.js#L15-L16),

- using babel-parse plugin [parses webpack output](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L7),

- plugin [replaces](https://github.com/istarkov/babel-plugin-webpack-loaders/blob/master/src/plugin.js#L104) require ast with parse ast output.
