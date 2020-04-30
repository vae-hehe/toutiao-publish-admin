// 基于axios封装的请求模块

import axios from 'axios'
// 加载json-bigint
// 会把超出js安全整数范围的数据转换成另一种类型为BigNumber的数据
// 我们使用的时候要把这个数字转成字符串才可以 BingNumber.toString()
import JSONbig from 'json-bigint'

import router from '@/router'

// 非组件模块可以这样加载使用 element 的 message 提示组件
import { Message } from 'element-ui'

// 创建一个axios实例,说白了就是赋值了一个axios
// 我们通过这个实例去发送请求,把需要的配置,配置给这个实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径

  // 定义后端返回的原始数据的处理
  // 参数 data就是后端返回的原始数据(未经处理的JSON格式)
  transformResponse: [function (data) {
    // axios默认在内部使用JSON.parse来转换原始数据
    try {
      // 转换成功,将结果返回
      return JSONbig.parse(data)
    } catch (error) {
      // 如果转换失败,进入这里
      // 直接返回数据给请求使用
      return data
    }
  }]
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
// token无效返回 401错误
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应会进入这里

  // response 是响应数据
  // 注意: 一定要把相应结果return,否则真正发请求的位置拿不到响应
  return response
}, function (error) {
  const status = error.response.status
  // 所有超出 2xx 的响应码进入这里
  console.log('异常')
  if (error.response && status === 401) {
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    // 跳转到登录界面
    router.push('/login')
    // this.$message
    Message.error('登录状态无效,请重新登录')
  } else if (status === 403) {
    // 没有操作权限
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误,请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常,请稍后重试')
  }

  return Promise.reject(error)
})

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from '/utils/request.js'
