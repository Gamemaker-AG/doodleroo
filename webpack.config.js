var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'assets')
  },
  resolve: {
  	modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
