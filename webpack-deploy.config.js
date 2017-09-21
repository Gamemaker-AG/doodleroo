var path = require('path');
let base = require("./webpack.config.js")

module.exports = {
  ...base,
  output: {
    ...base.output,
    path: path.resolve(__dirname, 'docs'),
  }
}
