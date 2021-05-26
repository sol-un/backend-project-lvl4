import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Dotenv from 'dotenv-webpack';

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devtool: 'source-map',
  // entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    // publicPath: '/assets/',
  },
  devServer: {
    host: 'localhost',
    // contentBase: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/',
    port: 8080,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin(),
    (function () { // eslint-disable-line func-names
      switch (mode) {
        case 'development':
          return new Dotenv();
        case 'production':
          return new Dotenv({ systemvars: true });
        case 'test':
          return new Dotenv({ systemvars: true });
        default:
          throw new Error(`Unknown environment variable: ${mode}!`);
      }
    }()),
  ],
};
