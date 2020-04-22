// 文章相关请求模块

import request from '@/utils/request'

/**
 * 获取文章列表
 */

export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // body参数使用 data设置
    // query 参数使用params设置
    // Header参数使用headers设置
    params
  })
}
