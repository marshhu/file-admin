import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/api/v1/file',
    method: 'post',
    data
  })
}

export function getfileinfo(filesha1) {
  return request({
    url: '/api/v1/file',
    method: 'get',
    params: { filesha1 }
  })
}

export function getall() {
    return request({
      url: '/api/v1/file',
      method: 'get',
    })
  }