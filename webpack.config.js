const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const GolfMinifierPlugin = require('./build_plugins/golfMinifier');

module.exports = {
  mode: 'production',
  entry: './build/qeen.js',
  output: {
    filename: 'qeen.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        minify: TerserPlugin.uglifyJsMinify,
        terserOptions: {
          compress: {
            passes: 10,
            inline: true,
            drop_debugger: true,
            dead_code: true,
            conditionals: true,
            unused: true,
            evaluate: true,
            sequences: true,
            booleans: true,
            loops: true,
            toplevel: true,
            hoist_funs: true,
            hoist_vars: true,
            if_return: true,
            join_vars: true,
            collapse_vars: true,
            reduce_funcs: true,
            reduce_vars: true,
            side_effects: true,
            pure_getters: true,
            keep_fargs: false,
            keep_fnames: false,
            reduce_vars: true,
            collapse_vars: true,
          },
          output: {
            comments: false,
          },
          mangle: {
            properties: {
              regex: /^_/,
            },
            toplevel: true,
          },
        },
      }),
    ],
    usedExports: true,
  },
  plugins: [
    new GolfMinifierPlugin(),
  ],
};