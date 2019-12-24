import request from '@/utils/request'
export function getProhibition(data) {
  return request({
    url: '/qrcode/codeProhibition',
    method: 'post',
    data
  })
}