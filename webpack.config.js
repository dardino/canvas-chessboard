/* jshint esversion: 9 */

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
    mode: "production",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    entry: './src/canvasChessBoard.ts',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'ChessBoard on HTMLCanvasElement'
        })
    ],
    output: {
        filename: 'canvasChessBoard.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        globalObject: 'this',
        // libraryExport: 'default',
        library: 'canvas-chessboard'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }, {
            test: /\.less$/,
            use: [{
                    loader: 'style-loader', // creates style nodes from JS strings
                },
                {
                    loader: 'css-loader', // translates CSS into CommonJS
                },
                {
                    loader: 'less-loader', // compiles Less to CSS
                }
            ]
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
};