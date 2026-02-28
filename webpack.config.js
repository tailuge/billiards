const path = require("node:path")
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const pages = [
  { template: "src/templates/index.html", chunks: ["index"] },
  { template: "src/templates/embed.html", chunks: ["index"] },
  { template: "src/templates/2p.html", chunks: [], inject: false },
  { template: "src/templates/multi.html", chunks: [], inject: false },
  { template: "src/templates/mockup.html", chunks: [], inject: false },
  // Diagrams
  { template: "src/templates/diagrams/diagrams.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/mathaven.html", chunks: ["mathaven"] },
  { template: "src/templates/diagrams/nineball.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/symmetry.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/roll.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/diamond.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/odd.html", chunks: ["diagram"] },
  { template: "src/templates/diagrams/plot.html", chunks: ["compare"] },
  { template: "src/templates/diagrams/gemini.html", chunks: [], inject: false },
]

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
      keep: (asset) => !asset.endsWith(".js") && !asset.endsWith(".html"),
    },
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
  plugins: pages.map((page) => {
    return new HtmlWebpackPlugin({
      template: page.template,
      filename: page.template.replace("src/templates/", ""),
      chunks: page.chunks,
      inject: page.inject ?? "body",
      scriptLoading: "defer",
      minify: false,
    })
  }),
  stats: {
    errorDetails: true,
  },
  cache: {
    type: "filesystem",
  },
}
