
const path = require('path')

const Koa = require('koa')

const send = require('koa-send')

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development'

const staticRouter = require('./routers/static')

let Router
if (isDev) {
    Router = require('./routers/dev-ssr')
} else {
    Router = require('./routers/ssr')
}

// 中间件，处理请求地址、错误信息
app.use(async (ctx, next) => {
    try {
        console.log(`request with path ${ctx.path}`)
        await next()
    } catch (err) {
        console.log(err)
        ctx.status = 500
        if (isDev) {
            ctx.body = err.message
        } else {
            ctx.body = 'please try again later'
        }
    }
})

app.use(async (ctx, next) => {
    if (ctx.path === '/favicon.ico') {
        await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
    } else {
        await next()
    }
})

app.use(staticRouter.routes())
app.use(staticRouter.allowedMethods())

app.use(Router.routes())
app.use(Router.allowedMethods())

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || (isDev ? 3333 : 4444)

app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`)
})
