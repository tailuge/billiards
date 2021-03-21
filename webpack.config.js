const path = require('path');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    host: '0.0.0.0',
    compress: true,
    port: 8080
  },
  performance: { hints: false },
  mode: 'production',
  optimization: {
     usedExports: true,
     moduleIds: 'named'
 },
};