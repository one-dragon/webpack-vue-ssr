
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const baseConfig = require('./webpack.config.base')
const { isDev } = require('./utils.js')


let config = merge(baseConfig, {
    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
    // 并且还会在编译 Vue 组件时，
    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
    target: 'node',
    mode: 'development',

    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',

    entry: path.join(__dirname, '../client/server-entry.js'),

    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    output: {
        libraryTarget: 'commonjs2',
        filename: 'server-entry.js',
        path: path.join(__dirname, '../server-build')
    },

    // 外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的 bundle 文件。
    // 从输出的 bundle 中排除依赖
    // 依赖的 dependencies 中的模块不需要打包到 server-entry.js 中，node 环境下直接可以 require
    externals: Object.keys(require('../package.json').dependencies),

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
    plugins: [
        new MiniCssExtractPlugin({
            // filename: 'css/[name].[contenthash:3].css',
            // chunkFilename: 'css/[name].[contenthash:3].css'
            filename: 'resources/css/[name].[contenthash:3].css',
            chunkFilename: 'resources/css/[name].[contenthash:3].css'
        }),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        // 这是将服务器的整个输出
        // 构建为单个 JSON 文件的插件。
        // 默认文件名为 `vue-ssr-server-bundle.json`
        new VueSSRServerPlugin()
    ]
})

module.exports = config
