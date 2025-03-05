import request from '@/utils/request'

// 查询敏感词管理列表
export function listWords(query) {
  return request({
    url: '/system/words/list',
    method: 'get',
    params: query
  })
}

// 查询敏感词管理详细
export function getWords(id) {
  return request({
    url: '/system/words/' + id,
    method: 'get'
  })
}

// 新增敏感词管理
export function addWords(data) {
  return request({
    url: '/system/words',
    method: 'post',
    data: data
  })
}

// 修改敏感词管理
export function updateWords(data) {
  return request({
    url: '/system/words',
    method: 'put',
    data: data
  })
}

// 删除敏感词管理
export function delWords(id) {
  return request({
    url: '/system/words/' + id,
    method: 'delete'
  })
}
