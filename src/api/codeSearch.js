import request from '@/utils/request'

export function codeSearch(data) {
  return request({
    url: '/qrcode/codeSearch',
    method: 'post',
    data
  })
}