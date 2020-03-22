

const { isDev } = require('./utils.js')

module.exports = {
    hotReload: !!isDev,
    cssModules: {
        localIdentName: '[path]-[name]-[hash:base64:5]',
        camelCase: true
    }
}