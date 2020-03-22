
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseConfig = require('./webpack.config.base')
const { isDev } = require('./utils.js')

let devServer = {
    port: 8000,
    host: 'localhost',
    overlay: {
        errors: true
    },
    headers: { 'Access-Control-Allow-Origin': '*' }, // 设置可跨域
    historyApiFallback: {
        index: '/index.html'
    },
    proxy: {},
    hot: true
}

let config

if (isDev) {
    config = merge(baseConfig, {
        mode: 'development',
        devtool: '#cheap-module-eval-source-map',
        output: {
            publicPath: 'http://127.0.0.1:8000/'
        },
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
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'template.html')
            }),

            new webpack.HotModuleReplacementPlugin(),

            // 此插件在输出目录中
            // 生成 `vue-ssr-client-manifest.json`。
            new VueSSRClientPlugin()
            // new webpack.NoEmitOnErrorsPlugin()
        ]
    })
} else {
    config = merge(baseConfig, {
        mode: 'production',
        // entry: {
        //     app: path.join(__dirname, '../client/client-entry.js'),
        //     // vendors: ['vue']
        // },
        entry: path.join(__dirname, '../client/client-entry.js'),
        output: {
            filename: '[name].[chunkhash:8].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: [
                        // MiniCssExtractPlugin.loader,
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
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
            runtimeChunk: true
        },
        plugins: [
            // new MiniCssExtractPlugin({
            //     // filename: 'css/[name].[contenthash:3].css',
            //     // chunkFilename: 'css/[name].[contenthash:3].css'
            //     filename: 'resources/css/[name].[contenthash:3].css',
            //     chunkFilename: 'resources/css/[name].[contenthash:3].css'
            // }),

            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'template.html')
            }),

            // 此插件在输出目录中
            // 生成 `vue-ssr-client-manifest.json`。
            new VueSSRClientPlugin()
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
