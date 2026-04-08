/* jshint esversion: 9 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  devtool:
    process.env.NODE_ENV == "production" ? undefined : "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8080,
    hot: true,
    client: {
      overlay: true,
    },
  },
  entry: {
    canvasChessBoard: "./src/canvasChessBoard.ts",
    presets: "./src/presets/index.ts",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "ChessBoard on HTMLCanvasElement",
      template: "./test/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./src/presets/**/*.scss",
          to: "fonts/[name][ext]",
        },
        {
          from: "./src/presets/**/*.ttf",
          to: "fonts/[name][ext]",
        },
        {
          from: "./src/presets/**/*.woff*",
          to: "fonts/[name][ext]",
        },
        {
          from: "./src/presets/**/*.otf",
          to: "fonts/[name][ext]",
        },
      ],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    globalObject: "this",
    // libraryExport: 'default',
    library: "canvas-chessboard",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
