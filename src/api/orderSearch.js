
import request from '@/utils/request'

export function orderSearch(data) {
  return request({
    url: '/order/orderSearch',
    method: 'post',
    data
  })
}