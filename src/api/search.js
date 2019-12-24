import request from '@/utils/request'

export function userSearch(data) {
  return request({
    url: '/user/userSearch',
    method: 'post',
    data
  })
}