import request from '@/utils/request'

/**
 * 获取销售列表
 */
export const getSellListApi = (page, size = 15, search = '') => {
  return request({
    url: '/v2/web/customer/management/list',
    method: 'get',
    params: {   
      page,
      size,
      search
    }
  })
}

/**
 * 获取销售后台账号列表
 */
export const getSellHouTaiAccountListApi = () => {
  return request({
    url: '/v2/web/customer/admin/account',
    method: 'get',
  })
}

/**
 * 完全转移客户到指定销售人员
 */
export const transferAllClientToAssignSellApi = param => {
  return request({
    url: '/v2/web/customer/management/move/customer',
    method: 'post',
    data: param
  })
}

/**
 * 添加销售人员
 */
 export const postAddSellServiceApi = param => {
  return request({
    url: '/v2/web/customer/management/add/customer',
    method: 'post',
    data: param
  })
}

/**
 * 批量转移客户到指定销售人员
 */
export const transferBatchClientToAssignSellApi = param => {
  return request({
    url: '/v2/web/customer/management/move/customer/log',
    method: 'post',
    data: param
  })
}

/**
 * 更新销售人员信息
 * @param putSellServiceId {String} 更新人员 id
 */
export const putSellServiceApi = (putSellServiceId, param) => {
  return request({
    url: '/v2/web/customer/management/update/customer',
    method: 'put',
    data: {
      customer_id: putSellServiceId,
      ...param
    }
  })
}

/**
 * 删除销售人员
 */
export const delSellServiceApi = sellServiceId => {
  return request({
    url: '/v2/web/customer/management/del/customer',
    method: 'delete',
    data: {
      customer_id: sellServiceId
    }
  })
}

/**
 * 获取企业律云用户列表
 */
 export const getQiyeClientApi = params => {
  return request({
    url: '/v2/web/customer/management/customer/log/list',
    method: 'get',
    params,
  })
}

// 添加/修改企业律云用户备注
export const putQiyeClientRemarkApi = ({ remark, customer_log_id }) => {
  return request({
    url: '/v2/web/customer/management/update/customer/log',
    method: 'put',
    data: {
      remark,
      customer_log_id
    }
  })
}

/**
 * 获取销售标签列表
 */
 export const getSellLabelListApi = params => {
  return request({
    url: '/v2/web/customer/label/list',
    method: 'get',
    params,
  })
}

/**
 * 添加标签
 */
 export const postAddLabelApi = param => {
  return request({
    url: '/v2/web/customer/label/add',
    method: 'post',
    data: param
  })
}

/**
 * 更新标签
 * @param putLabelId {String} 更新标签 id
 */
export const putLabelApi = (putLabelId, param) => {
  return request({
    url: '/v2/web/customer/label/update',
    method: 'put',
    data: {
      customer_label_id: putLabelId,
      ...param
    }
  })
}

/**
 * 客户添加标签
 * @param clientLogId {String} 客户记录 id
 */
export const putClientAddLabelApi = (clientLogId, param) => {
  return request({
    url: '/v2/web/customer/admin/label/bind',
    method: 'put',
    data: {
      customer_log_id: clientLogId,
      ...param
    }
  })
}

/**
 * 获取客户跟进记录列表
 */
export const getClientRemarkListApi = params => {
  return request({
    url: '/v2/web/customer/remark/list',
    method: 'get',
    params,
  })
}

/**
 * 获取通话记录列表
 */
export const getCloudCallListApi = (params, data) => {
  return request({
    url: '/web/ali/cloud/call',
    method: 'post',
    params,
    data
  })
}

/**
 * 获取通话文件记录
 */
export const getCloudCallFileApi = (params, data) => {
  return request({
    url: '/web/ali/cloud/call',
    method: 'post',
    params,
    data
  })
}

/**
 * 获取销售提成详情
 */
 export const geSellCommissionApi = params => {
  return request({
    url: '/v2/web/customer/management/commission/detail',
    method: 'get',
    params,
  })
}

/**
 * 获取 vip 列表
 */
 export const geVipListApi = () => {
  return request({
    url: '/v2/web/list/vip/with/icon',
    method: 'get',
  })
}

/**
 * 发送 vip消息给用户
 */
 export const sendVipMsgApi = params => {
  return request({
    url: '/v2/web/send/invite/user/activate/vip',
    method: 'post',
    data: params
  })
}
