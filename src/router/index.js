import Vue from 'vue'
import VueRouter from 'vue-router'

// 在vue-cli中创建的项目 @ 表示src
// 它是src项目的路径别名
// 好处: 不受当前路径影响
// 注意: @后面就是src路径,后面 别忘了写/
// 建议: 凡是需要路径查找的就使用@
// 如果加在的资源在当前路径资源下,就在当前目录下,正常写
import Login from '@/views/login'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
