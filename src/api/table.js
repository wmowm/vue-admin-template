import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}
