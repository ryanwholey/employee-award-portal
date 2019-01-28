const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { NODE_ENV } = process.env

function getPlugins(env) {
    if (env === 'development') {
        return [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './index.html'),
                inject: false
            })
        ]
    }
}

module.exports = {
    mode: NODE_ENV || 'production',
    devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
    entry: path.resolve(__dirname, './index'),
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }, 
    devServer: {
        port: 8080,
        historyApiFallback: true,
    },
    plugins: getPlugins(NODE_ENV)
}