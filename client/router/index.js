
import VueRouter from 'vue-router'

// import Todo from '../views/todo/todo.vue'

export default () => {
    return new VueRouter({
        routes: [
            {
                path: '/',
                redirect: '/app'
            },
            {
                // path: '/app/:id', // /app/xxx
                path: '/app',
                props: true,
                // props: (route) => ({ id: route.query.b }),
                component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
                // component: Todo,
                name: 'app',
                meta: {
                    title: 'this is app',
                    description: 'asdasd'
                }
            },
            {
                path: '/test',
                component: () => import(/* webpackChunkName: "Test" */ '../views/test.vue'),
                name: 'test'
            }
        ],
        mode: 'history',
        linkActiveClass: 'active-link',
        linkExactActiveClass: 'exact-active-link',
        scrollBehavior (to, from, savedPositio) {
            if (savedPositio) {
                return savedPositio
            } else {
                return { x: 0, y: 0 }
            }
        }
    })
}
