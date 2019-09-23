import request from '@/utils/request'


export function upload(url,formData,headers){
  return request.post(url, formData, headers)
}

export function getFileList() {
  return request({
    url: '/api/upload/list',
    method: 'get',
  })
}
