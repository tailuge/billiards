const path = require('path');

module.exports = {
  entry: './src/gameclient.ts',
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
  output: {
    filename: 'library.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'library'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    host: '0.0.0.0',
    compress: true,
    port: 8080
  },
  performance: { hints: false }
};