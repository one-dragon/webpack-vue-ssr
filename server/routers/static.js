
const Router = require('koa-router')
const send = require('koa-send')

const staticRouter = new Router({ prefix: '/dist' }) // 只会处理 '/dist' 开头的路径内容

staticRouter.get('/*', async ctx => {
    await send(ctx, ctx.path)
})

module.exports = staticRouter
