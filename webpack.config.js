const path = require("node:path")
const TerserPlugin = require("terser-webpack-plugin")
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
    host: "localhost",
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
    sideEffects: true,
    innerGraph: true,
    splitChunks: {
      cacheGroups: {
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: "three",
          chunks: "all",
          priority: 20,
        },
        interact: {
          test: /[\\/]node_modules[\\/]interactjs[\\/]/,
          name: "interact",
          chunks: "all",
          priority: 10,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: 0,
        },
      },
    },
    moduleIds: "named",
  },
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
