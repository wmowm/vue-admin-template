import request from '@/utils/request'

export function getMenuList() {
    return request({
      url: '/api/menu/GetMenuList',
      method: 'get'
    })
  }

  export function getMenuButtonList(params) {
    return request({
      url: '/api/menu/getMenuButtonList',
      method: 'get',
      params
    })
  }

  export function createDir(data) {
    return request({
      url: '/api/menu/createDir',
      method: 'post',
      data
    })
  }

  export function getDir(params) {
    return request({
      url: '/api/menu/getDir',
      method: 'get',
      params
    })
  }

  export function updateDir(data) {
    return request({
      url: '/api/menu/updateDir',
      method: 'post',
      data
    })
  }

  export function deleteDir(params) {
    return request({
      url: '/api/menu/deleteDir',
      method: 'get',
      params
    })
  }