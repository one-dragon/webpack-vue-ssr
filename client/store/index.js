
import Vuex from 'vuex'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
    return new Vuex.Store({
        strict: isDev,
        state: {},
        mutations: {},
        actions: {},
        getters: {},
        modules: {}
    })
}
