var path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'basement-attack'
  },
  devServer: {
    contentBase: path.join(__dirname, 'assets')
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
