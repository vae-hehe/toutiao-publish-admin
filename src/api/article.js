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

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章列表
export const deleteArticle = (articleId) => {
  return request({
    method: 'DELETE',
    // 接口文档中写的路径参数需要在url中传递
    // 接口路径中:xxx格式的字段,需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 发布文章
// 不传第二个参数默认是false,不存为草稿
export const AddArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft: draft // 是否存为草稿(true存为草稿)
    },
    data // 请求体
  })
}

// 获取指定文章
export const getArticle = (articleId) => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
