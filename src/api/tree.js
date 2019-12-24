import request from '@/utils/request'

export function getDetail(data) {
  return request({
    url: '/qrcode/codeDetail',
    method: 'post',
    data
  })
}
