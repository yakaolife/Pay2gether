module.exports = {
  context: __dirname + "/public",
  entry: "./app.jsx",

  output: {
    filename: "app.js",
    path: __dirname + "/public",
  },

  resolve: {
    extensions: ["", ".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ["babel-loader?stage=1"],
      }
    ],
  },
}
