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
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment'

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
      },
      {
        // 我们通常把 / 设置为网站的首页
        path: '/article', // path为空,作为默认子路由渲染
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫: 说白了所有的页面导航都会经过这里
// 守卫页面的导航的
// to: 要去的路由信息
// from: 来自那里路由信息
// next: 放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login,判断登录状态
  // 如果没有登录,跳转到登录界面
  // 登录了允许通过
  const user = JSON.parse(localStorage.getItem('user'))
  // 校验费登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      // 没有登录,太转到登录界面
      next('/login')
    }
  } else {
    // 登录界面,允许通过
    next()
  }
})

export default router
