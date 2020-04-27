import request from '@/utils/request'

// 上传图片素材
export const uploadImages = (data) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求头中的 Content-Type设置为 multipart/form-data  但是我们使用 axios 上传文件的话不需要手动设置, 只要给 data 一个 FormData() 对象就可以了
    // new FormData()
    data
  })
}

// 获取图片素材列表
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 删除图片素材
export const deleteImages = (imageId) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}

// 收藏图片素材
export const collectImages = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}
