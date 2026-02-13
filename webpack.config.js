const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
let packagedeps = require("./package.json")
module.exports = {
  entry: {
    vendor: Object.keys(packagedeps.dependencies),
    index: { dependOn: "vendor", import: "./src/index.ts" },
    diagram: { dependOn: "vendor", import: "./src/diagrams.ts" },
    mathaven: { dependOn: "vendor", import: "./src/mathaven.ts" },
    compare: { dependOn: "vendor", import: "./src/compare.ts" },
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
          safari10: true,
        },
      }),
    ],
    usedExports: true,
    moduleIds: "named",
  },
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
