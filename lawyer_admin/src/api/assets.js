import request from '@/utils/request'

const AssetsApi = {
  AssetsStatistics: 'web/withdraw/page',
  DetailStatistics: 'web/balance/detail/page',
  PaymentStatistics: 'web/withdraw/payment/page',
  SuccessStatistics: 'web/withdraw/success/page',
  WithdrawStatistics: 'v2/web/withdraw/check'
}

/**
 * 获取资产信息
 */

export const getAssetsStatistics = params => {
  return request({
    url: AssetsApi.AssetsStatistics,
    method: 'get',
    params
  })
}

/**
 * 获取资金流水信息
 */
 export const getDetailStatistics = (page, id, startDate, endDate) => {
  return request({
    url: AssetsApi.DetailStatistics,
    method: 'get',
    params: {
     page,
     user_id: id,
     start_date: startDate,
     end_date: endDate,
    }
  })
}

/**
 * 获取支付记录
 */

 export const getPaymentStatistics = (page, type, search, startDate, endDate) => {
  return request({
    url: AssetsApi.PaymentStatistics,
    method: 'get',
    params: {
     page,
     payment_type: type,
     search,
     start_date: startDate,
     end_date: endDate,
    }
  })
}

/**
 * 获取转账记录
 */
 export const getSuccessStatistics = (page, search, startDate, endDate) => {
  return request({
    url: AssetsApi.SuccessStatistics,
    method: 'get',
    params: {
     page,
     search,
     start_date: startDate,
     end_date: endDate,
    }
  })
}

/**
 * 转账接口
 */
export const getWithdrawStatistics = id => {
  return request({
    url: AssetsApi.WithdrawStatistics,
    method: 'post',
    data: {
      withdraw_id: id
    }
  })
}

/**
 * 获取转账记录类别
 */
 export const getTransferAccountRecordList = params => {
  return request({
    url: '/v2/web/admin/transfer/list',
    method: 'get',
    params
  })
}

/**
 * 更新支付宝账号信息
 */
 export const updateAliPayAccountApi = param => {
  return request({
    url: '/v2/web/user/ali/bind',
    method: 'post',
    data: param
  })
}
/**
 * 驳回申请提现
 */
 export const rejectApplyWithdrawApi = param => {
  return request({
    url: '/v2/web/withdraw/back',
    method: 'post',
    data: param
  })
}
