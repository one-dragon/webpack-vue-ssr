
import createApp from './create-app'

export default context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
    return new Promise((resolve, reject) => {
        const { app, router } = createApp()

        // 设置服务器端 router 的位置
        router.push(context.url)
        // 获取设置的 metaInfo 信息
        // https://vue-meta.nuxtjs.org/guide/ssr.html#add-vue-meta-to-the-context
        context.meta = app.$meta()

        // https://router.vuejs.org/zh/api/#router-onready
        // 等到 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            // https://router.vuejs.org/zh/api/#router-getmatchedcomponents
            // 返回目标位置或是当前路由匹配的组件数组 (是数组的定义/构造类，不是实例)。通常在服务端渲染的数据预加载时使用。
            const matchedComponents = router.getMatchedComponents()
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) {
                // return reject({ code: 404 })
                return reject(new Error('no component matched'))
            }

            // Promise 应该 resolve 应用程序实例，以便它可以渲染
            resolve(app)
        }, (err) => {
            console.log('router==============')
            reject(err)
        })
    })
}
