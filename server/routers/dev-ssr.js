
const path = require('path')
const Router = require('koa-router')
const axios = require('axios')
const fs = require('fs')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs()
serverCompiler.outputFileSystem = mfs

let bundle // 获取 vue-ssr-server-bundle.json 内容
// 调用 watch 方法会触发 webpack 执行器，但之后会监听变更（很像 CLI 命令: webpack --watch），一旦 webpack 检测到文件变更，就会重新执行编译。该方法返回一个 Watching 实例。
// http://webpack.html.cn/api/node.html
serverCompiler.watch({}, (err, stats) => {
    if (err) throw err // 打包错误抛出
    stats = stats.toJson()
    stats.errors.forEach(err => console.log(err))
    stats.warnings.forEach(warn => console.warn(warn))
    // stats = stats.toJson()
    // // eslint 错误、或不是打包错误
    // if (stats.hasErrors()) {
    //     console.error(stats.errors)
    // }
    // if (stats.hasWarnings()) {
    //     console.warn(stats.warnings)
    // }

    // 获取 VueSSRServerPlugin 打包的json文件
    const bundlePath = path.join(
        serverConfig.output.path,
        'vue-ssr-server-bundle.json'
    )
    // 默认读取是 二进制
    // 转 json
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))

    console.log('new bundle generated')
})

// 处理服务端渲染返回内容
const handleSSR = async (ctx) => {
    if (!bundle) {
        ctx.body = '等一会，别着急……'
        return
    }

    // 获取客户端构建清单响应
    const clientManifestRes = await axios.get(
        'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
    )
    // 获取客户端构建清单内容
    const clientManifest = clientManifestRes.data

    // 读取 html模板
    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs'),
        { encoding: 'utf-8' }
    )

    // 创建一个 BundleRenderer 实例
    // https://ssr.vuejs.org/zh/guide/bundle-renderer.html#传入-bundlerenderer
    const renderer = VueServerRenderer.createBundleRenderer(bundle, {
        inject: false, // 控制使用 template 时是否执行自动注入。默认是 true
        clientManifest // 提供一个由 vue-server-renderer/client-plugin 生成的客户端构建 manifest 对象。此对象包含了 webpack 整个构建过程的信息，从而可以让 bundle renderer 自动推导需要在 HTML 模板中注入的内容。
    })
    // renderer.renderToString()

    await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
