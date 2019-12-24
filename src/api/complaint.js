import request from '@/utils/request'

export function complaintList(params) {
  return request({
    url: '/qrcode/complaintList',
    method: 'post',
    params
  })
}