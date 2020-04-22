import Vue from 'vue'
import VueRouter from 'vue-router'

// 在vue-cli中创建的项目 @ 表示src
// 它是src项目的路径别名
// 好处: 不受当前路径影响
// 注意: @后面就是src路径,后面 别忘了写/
// 建议: 凡是需要路径查找的就使用@
// 如果加在的资源在当前路径资源下,就在当前目录下,正常写
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由有一个默认子路由.这个名字没有意义,警告
    // 正确的做法: 如果默认子路由,就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        // 我们通常把 / 设置为网站的首页
        path: '', // path为空,作为默认子路由渲染
        name: 'home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
