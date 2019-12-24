import request from '@/utils/request'

export function userProhibition(data) {
  return request({
    url: '/user/userProhibition',
    method: 'post',
    data
  })
}
