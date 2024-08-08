const path = require('path');

module.exports = {
  mode: 'production',
  entry: './build/qeen.js',
  output: {
    filename: 'qeen.js',
    path: path.resolve(__dirname, 'dist'),
  },
};