import request from '@/utils/request'

/**
 * 获取个人客户列表
 */
export const getClientPersonListApi = params => {
  return request({
    url: '/v2/web/user/admin/list',
    method: 'get',
    params
  })
}

/**
 * 获取企业客户列表
 */
export const getClientCompanyListApi = params => {
  return request({
    url: '/v2/web/user/enterprise/admin/list2',
    method: 'get',
    params
  })
}

/**
 * 获取企业联系人列表
 */
export const getCompanyContactListApi = params => {
  return request({
    url: '/v2/web/user/enterprise/son',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情列表
 */
export const getClientOrderListApi = params => {
  return request({
    url: '/v2/web/order/list',
    method: 'get',
    params
  })
}

/**
 * 获取企业套餐菜单列表
 */
 export const getEnterpriseLawServeVipListApi = () => {
  return request({
    url: '/v2/web/admin/enterprise/entry/vip/list',
    method: 'get',
  })
}

/**
 * 获取个人套餐菜单列表
 */
 export const getPersonLawServeVipListApi = () => {
  return request({
    url: '/v2/web/get/vip/list',
    method: 'get',
  })
}

/**
 * 获取企业套餐详情
 */
 export const getEnterpriseLawServeDetailApi = params => {
  return request({
    url: '/v2/web/admin/user/enterprise/detail',
    method: 'get',
    params
  })
}

/**
 * 更新企业套餐 信息
 */
 export const updatEnterpriseLawServeApi = param => {
  return request({
    url: '/v2/web/edit/user/enterprise/info',
    method: 'post',
    data: param
  })
}

/**
 * 添加企业联系人
 */
 export const addEnterpriseOtherContactApi = param => {
  return request({
    url: '/v2/web/admin/enterprise/bind/user',
    method: 'post',
    data: param
  })
}

/**
 * 删除企业联系人
 */
 export const delEnterpriseOtherContactApi = param => {
  return request({
    url: '/v2/web/admin/del/certification/bind/user',
    method: 'post',
    data: param
  })
}
