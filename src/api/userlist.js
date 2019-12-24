import request from '@/utils/request'

export function userList(params) {
  return request({
    url: '/user/userList',
    method: 'post',
    params
  })
}