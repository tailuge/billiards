const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
let packagedeps = require("./package.json")
module.exports = {
  entry: {
    index: "./src/index.ts",
    diagram: "./src/diagrams.ts",
    mathaven: "./src/mathaven.ts",
    compare: "./src/compare.ts",
  },
  module: {
    rules: [
      {
        use: "swc-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    allowedHosts: [".gitpod.io"],
    host: "0.0.0.0",
    compress: true,
    port: 8080,
    client: {
      progress: true,
    },
  },
  performance: { hints: false },
  mode: "production",
  devtool: "source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        extractComments: false,
        terserOptions: {
          safari10: true,
        },
      }),
    ],
    usedExports: true,
    moduleIds: "deterministic",
  },
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
