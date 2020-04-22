// 基于axios封装的请求模块

import axios from 'axios'

// 创建一个axios实例,说白了就是赋值了一个axios
// 我们通过这个实例去发送请求,把需要的配置,配置给这个实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
})

// 请求拦截器
request.interceptors.request.use(
  // 所有请求会经过这里
  // config 是当前请求相关的配置信息
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有用户登录信息,就加token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 然后我们可以在允许请求出去之前定制统一的业务处理
    // 例如: 统一的设置 token
    // 当这里 return config 之后请求才会真的发出去
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from '/utils/request.js'
