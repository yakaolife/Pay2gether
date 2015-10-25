module.exports = {
  context: __dirname + "/public",
  entry: {
    app: "./app.jsx",
    pool_detail: "./pool_detail.jsx"
  },

  output: {
    filename: "[name].js",
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
        loaders: ["babel-loader"],
      }
    ],
  },
}
