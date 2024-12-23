const path = require("path");
const nodeExternals = require(path.resolve(__dirname, "../../../node_modules/webpack-node-externals"));

module.exports = {
  target: "node",
  externals: [nodeExternals()],
  entry: "./src/network/server/server.ts",
  output: {
    path: path.resolve(__dirname, "../../../dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.resolve(__dirname, "../../../node_modules"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
