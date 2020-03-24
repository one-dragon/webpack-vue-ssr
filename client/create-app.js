
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueMeta from 'vue-meta'

import App from './app.vue'
import createRouter from './router/index'
import createStore from './store/index'

import './assets/styles/global.styl'

import Notification from './components/notification'
import Tabs from './components/tabs'
Vue.use(Notification)
Vue.use(Tabs)

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueMeta)

export default () => {
    const router = createRouter()
    const store = createStore()

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    return { app, router, store }
}
