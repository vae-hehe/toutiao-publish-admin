// 用户相关请求模块
import request from '@/utils/request'

// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    headers: {
    // 属性名和值都要看借口的要求
    // 属性名: Authorization,接口要求的
    // 属性值: Bearer空格token数据
    // Authorization: `Bearer ${user.token}`
    }
  })
}

// 编辑用户资料
export const editUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}

// 注意: data必须传递FromData对象
// 编辑用户头像
export const editUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 获取粉丝列表
export const getFans = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params
  })
}
