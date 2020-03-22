// import Vue from 'vue'
// import App from './app.vue'

// import './assets/styles/global.styl'

// const root = document.createElement('div')
// document.body.appendChild(root)

// new Vue({
//     render: (h) => h(App)
// }).$mount(root)

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import App from './app.vue'
import createRouter from './router/index'
import createStore from './store/index'

import './assets/styles/global.styl'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = createRouter()
const store = createStore()

const app = new Vue({
    router,
    store,
    render: h => h(App)
})
// }).$mount('#root')
router.onReady(() => {
    app.$mount('#root')
})
