import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

