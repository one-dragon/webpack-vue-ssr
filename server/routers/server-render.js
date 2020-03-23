/*
    服务端渲染
    开发、生成环境共用
*/

const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
    ctx.headers['Content-Type'] = 'text/html'

    // 服务端渲染时使用，渲染html
    const context = { url: ctx.path }

    try {
        const appString = await renderer.renderToString(context)

        // https://vue-meta.nuxtjs.org/guide/ssr.html#inject-metadata-into-page-string
        const { title, meta } = context.meta.inject()

        // https://ssr.vuejs.org/zh/guide/build-config.html#手动资源注入-manual-asset-injection
        const html = ejs.render(template, {
            appString,
            styles: context.renderStyles(),
            scripts: context.renderScripts(),
            resourceHints: context.renderResourceHints(),
            title: title.text(),
            meta: meta.text()
        })
        // 返回给客户端 html
        ctx.body = html
    } catch (err) {
        console.log('render error', err)
        throw err
    }
}
