import request from '@/utils/request'

/**
 * 获取法务列表
 */
export const getLawManagerListApi = params => {
  return request({
    url: '/v2/web/legal/affairs/list',
    method: 'get',
    params
  })
}

/**
 * 添加销售端用户
 */
export const postAddLawManagerApi = param => {
  return request({
    url: '/v2/web/legal/affairs/add',
    method: 'post',
    data: param
  })
}

/**
 * 删除法务
 */
 export const delLawManagerApi = param => {
  return request({
    url: '/v2/web/legal/affairs/delete',
    method: 'delete',
    data: param
  })
}
