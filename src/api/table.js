import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/qrcode/codeList',
    method: 'post',
    params
  })
}
