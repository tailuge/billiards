const path = require("node:path")
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

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
        test: /\.ts$/,
        use: "swc-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "chunk-[name]-[contenthash:8].js",
    clean: {
      keep: (asset) => !asset.endsWith(".js"),
    },
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
      maxSize: 250000,
      minSize: 20000,
      cacheGroups: {
        interact: {
          test: /[\\/]node_modules[\\/]interactjs[\\/]/,
          name: "interact",
          priority: 20,
          enforce: true,
        },
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: "three",
          priority: 10,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "dist/index.html",
      filename: "index.html",
      chunks: ["index"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/2p.html",
      filename: "2p.html",
      chunks: [], // 2p.html is a wrapper with iframes, doesn't need its own entry's JS
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: "dist/embed.html",
      filename: "embed.html",
      chunks: ["index"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/multi.html",
      filename: "multi.html",
      chunks: [],
      inject: false,
    }),
    // Diagrams
    new HtmlWebpackPlugin({
      template: "dist/diagrams/diagrams.html",
      filename: "diagrams/diagrams.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/mathaven.html",
      filename: "diagrams/mathaven.html",
      chunks: ["mathaven"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/nineball.html",
      filename: "diagrams/nineball.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/symmetry.html",
      filename: "diagrams/symmetry.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/roll.html",
      filename: "diagrams/roll.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/diamond.html",
      filename: "diagrams/diamond.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/odd.html",
      filename: "diagrams/odd.html",
      chunks: ["diagram"],
      inject: "body",
      scriptLoading: "defer",
    }),
    new HtmlWebpackPlugin({
      template: "dist/diagrams/plot.html",
      filename: "diagrams/plot.html",
      chunks: ["compare"],
      inject: "body",
      scriptLoading: "defer",
    }),
  ],
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
