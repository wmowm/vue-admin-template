import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/api/user/createUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user/updateUser',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/user/deleteUser',
    method: 'post',
    data
  })
}