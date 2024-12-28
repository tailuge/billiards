const path = require("path")
const nodeExternals = require("webpack-node-externals")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  target: "node",
  externals: [
    nodeExternals({
      allowlist: [], // Add any dependencies that should NOT be externalized
    }),
  ],
  entry: "./src/network/server/server.ts",
  output: {
    path: path.resolve(__dirname, "../../../dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [path.resolve(__dirname, "../../../node_modules"), "node_modules"],
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true, // Tree shaking
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  cache: {
    type: "filesystem", // Enable caching
  },
}
