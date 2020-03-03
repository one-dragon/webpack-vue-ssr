
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseConfig = require('./webpack.config.base')
const { isDev } = require('./utils.js')

let devServer = {
    port: 8000,
    host: 'localhost',
    overlay: {
        errors: true,
    },
    hot: true
}

let config

if (isDev) {
    config = merge(baseConfig, {
        mode: 'development',
        devtool: '#cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                        'stylus-loader'
                    ]
                }
            ]
        },
        devServer,
        plugins: [
            new HtmlWebpackPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    })
} else {
    config = merge(baseConfig, {
        mode: 'production',
        entry: {
            app: path.join(__dirname, '../client/index.js'),
            vendors: ['vue']
        },
        output: {
            filename: '[name].[chunkhash:8].js'
        },
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                        'stylus-loader'
                    ]
                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            runtimeChunk: true
        },
        plugins: [
            new MiniCssExtractPlugin({
                // filename: 'css/[name].[contenthash:3].css',
                // chunkFilename: 'css/[name].[contenthash:3].css'
                filename: 'resources/css/[name].[contenthash:3].css',
                chunkFilename: 'resources/css/[name].[contenthash:3].css'
            }),

            new HtmlWebpackPlugin(),

            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'vendor'
            // }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'runtime'
            // })
        ]
    })
}

module.exports = config