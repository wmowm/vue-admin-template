import request from '@/utils/request'

  // 获取验证码
  export function getAuthCode() {
    return request({
      url: '/api/user/getAuthCode',
      method: 'get'
    })
  }

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'api/user/info',
    method: 'get',
    params: { token },
    
  })
}

export function logout() {
  return request({
    url: 'api/user/logout',
    method: 'post'
  })
}
