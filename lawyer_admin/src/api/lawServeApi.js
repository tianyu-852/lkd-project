import request from '@/utils/request'

/**
 * 获取企业套餐列表
 */
export const getEnterpriseLawServeListApi = params => {
  return request({
    url: '/v2/web/admin/enterprise/entry/list',
    method: 'get',
    params
  })
}

/**
 * 获取企业服务套餐列表
 */
export const getLawServeVipListApi = () => {
  return request({
    url: '/v2/web/admin/enterprise/entry/vip/list',
    method: 'get',
  })
}

/**
 * 获取法务管家列表
 */
export const getLawManagerListApi = () => {
  return request({
    url: '/v2/web/admin/enterprise/entry/legal/list',
    method: 'get',
  })
}

/**
 * 添加企业套餐
 */
export const addEnterpriseLawServeApi = param => {
  return request({
    url: '/v2/web/admin/enterprise/entry/create',
    method: 'post',
    data: param
  })
}

/**
 * 添加企业套餐
 */
export const updatEnterpriseLawServeApi = param => {
  return request({
    url: '/v2/web/admin/enterprise/entry/edit',
    method: 'post',
    data: param
  })
}

/**
 * 获取企业套餐详情
 */
 export const getEnterpriseLawServeDetailApi = params => {
  return request({
    url: '/v2/web/admin/enterprise/entry/detail',
    method: 'get',
    params
  })
}

/**
 * 获取企业套餐法务管家列表
 */
 export const getLawServeLawManagerListApi = params => {
  return request({
    url: '/v2/web/admin/legal/list',
    method: 'get',
    params
  })
}

/**
 * 更新企业套餐 法律管家 权限
 */
 export const updateLawServeLawManagerPermissionApi = param => {
  return request({
    url: '/v2/web/set/enterprise/auth',
    method: 'post',
    data: param
  })
}
