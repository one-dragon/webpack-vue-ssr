<template>
  <div id="app">
    <!-- <div id="cover"></div>
    <Header></Header>
    <todo></todo>
    <Footer></Footer> -->
    <!-- <notification content="test notify"></notification> -->
    <tabs value="1">
        <tab label="tab1" index="1"></tab>
        <tab index="2">
            <span slot="label" style="color: red;">tab2</span>
        </tab>
        <tab label="tab3" index="3"></tab>
    </tabs>
    <router-view />
    <button @click="notify">click me</button>
  </div>
</template>

<script>
// import Header from './layout/header.vue'
// import Footer from './layout/footer.jsx'
// import Todo from './views/todo/todo.vue'

export default {
    metaInfo: {
        title: 'Todo App',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'keywords', content: 'keywords-keywords' },
            { name: 'description', content: 'description-description' }
        ]
    },
    components: {
        // Header,
        // Footer,
        // Todo
    },
    methods: {
        notify () {
            this.$notify({
                content: 'test $notify',
                btn: 'close'
            })
        }
    },
    mounted () {
        // this.$notify({
        //     content: 'test $notify',
        //     btn: 'close'
        // })
    }
}
</script>

<style lang="stylus" scoped>
#app{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
#cover{
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-color #999
  opacity .9
  z-index -1
}
</style>
