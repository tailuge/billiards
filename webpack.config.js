const path = require("node:path")
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        extractComments: false,
        terserOptions: {
          compress: {
            unused: true,
            dead_code: true,
          },
          mangle: true,
          safari10: true,
        },
      }),
    ],
    usedExports: true,
    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 250000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1]
            return `npm.${packageName.replace("@", "")}`
          },
        },
      },
    },
  },
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
