const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const polyfill = require('@babel/polyfill')
const DotenvPlugin = require('dotenv-webpack')

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: ['@babel/polyfill', './app.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundl.js'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: 
        [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new NodemonPlugin({
            ignore: ['*.js.map']
        }),
        new DotenvPlugin()
    ]
}