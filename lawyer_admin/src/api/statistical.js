import request from '@/utils/request'

const statisticalApi = {
  getStatisticalChannelPage: 'web/promotion/channel/page',
  setStatisticalChannel: 'web/promotion/channel',
  setStatisticalChannelConsume: 'web/promotion/channel/consume',
  deleteStatisticalChannel: 'web/promotion/channel',
  getStatisticalChannel: 'web/promotion/channel',
  getStatisticalPage: 'web/promotion/data/statistical/page',
  lawyerDataPage: 'web/statistics/lawyer-auth',
  orderDataPage: 'web/statistics/order',
  vipDataPage: 'web/statistics/vip',
  appActiveDataPage: 'web/statistics/active',
  addUserDataPage: 'web/statistics/add-user',
  TollDataPage: 'web/statistics/toll',
  UserActiveDataPage: 'web/statistics/user/active',
  LawyerActiveDataPage: 'web/statistics/lawyer/active',
  UserRelatedDate: 'web/statistics/user-related',
  LawyerRelatedDate: 'web/statistics/lawyer-related',
  ChargeOrderData: 'web/statistics/charge/order',
  PromotionChannelUrls: 'web/promotion/channel/urls',
  PromotionChannelPage: 'web/promotion/channel/customer-service/page',
  PromotionChannelNumber: 'web/promotion/channel/customer-service/lawyer-auth/number',
  PromotionChannelGuideUserPage: 'web/promotion/channel/customer-service/guide/user/page',
  PromotionChannelCustomerService: 'web/promotion/channel/customer-service',
}

export const getStatisticalChannelPage = page => {
  return request({
    url: statisticalApi.getStatisticalChannelPage,
    method: 'get',
    params: {
      page
    }
  })
}

export const getStatisticalChannel = promotionChannelId => {
  return request({
    url: statisticalApi.getStatisticalChannel,
    method: 'get',
    params: {
      promotion_channel_id: promotionChannelId
    }
  })
}

export const setStatisticalChannel = (
  promotionChannelNo,
  promotionChannelName,
  downloadUrl,
  promotionChannelId,
  customerServiceName,
  customerServiceWechat,
  isCustomerService
) => {
  return request({
    url: statisticalApi.setStatisticalChannel,
    method: 'post',
    data: {
      promotion_channel_no: promotionChannelNo,
      promotion_channel_name: promotionChannelName,
      download_url: downloadUrl,
      promotion_channel_id: promotionChannelId,
      customer_service_name: customerServiceName,
      customer_service_wechat: customerServiceWechat,
      is_customer_service: isCustomerService
    }
  })
}

export const setStatisticalChannelConsume = (
  promotionChannelId,
  closeAt,
  consume
) => {
  return request({
    url: statisticalApi.setStatisticalChannelConsume,
    method: 'post',
    data: {
      promotion_channel_id: promotionChannelId,
      close_at: closeAt,
      consume: consume,
    }
  })
}

export const deleteStatisticalChannel = promotionChannelId => {
  return request({
    url: statisticalApi.deleteStatisticalChannel,
    method: 'delete',
    data: {
      promotion_channel_id: promotionChannelId,
    }
  })
}

export const getStatisticalPage = page => {
  return request({
    url: statisticalApi.getStatisticalPage,
    method: 'get',
    params: {
      page
    }
  })
}
/**
 *  获取律师审核数据
 */
 export const getLawyerDataPage = () => {
  return request({
    url: statisticalApi.lawyerDataPage,
    method: 'get',
  })
}

/**
 *  获取下单统计数据
 */
 export const getOrderDataPage = params => {
  return request({
    url: statisticalApi.orderDataPage,
    // url: 'web/statistics/user-related',
    method: 'get',
    params,
  })
}

/**
 *  获取某日VIP统计数据 
 */
 export const getVipDataPage = date => {
  return request({
    url: statisticalApi.vipDataPage,
    method: 'get',
    params: {
      date
    }
  })
}
/**
 *  获取用户活跃数据 
 */
 export const getAppActiveDataPage = (startDate, endDate) => {
  return request({
    url: statisticalApi.appActiveDataPage,
    method: 'get',
    params: {
      start_date: startDate,
      end_date: endDate,
    }
  })
}

/**
 *  获取用户注册数据
 */
 export const getAddUserDataPage = (startDate, endDate) => {
  return request({
    url: statisticalApi.addUserDataPage,
    method: 'get',
    params: {
      start_date: startDate,
      end_date: endDate,
    }
  })
}
/**
 *  收费统计
 */
 export const getTollDataPage = (startDate, endDate) => {
  return request({
    url: statisticalApi.TollDataPage,
    method: 'get',
    params: {
      start_date: startDate,
      end_date: endDate,
    }
  })
}
/**
 *  用户日活统计
 */
 export const getUserActiveDataPage = date => {
  return request({
    url: statisticalApi.UserActiveDataPage,
    method: 'get',
    params: {
      date
    }
  })
}
/**
 *  律师日活统计
 */
 export const getLawyerActiveDataPage = date => {
  return request({
    url: statisticalApi.LawyerActiveDataPage,
    method: 'get',
    params: {
      date
    }
  })
}
/**
 *  用户相关统计
 */
 export const getUserRelatedDate = date => {
  return request({
    url: statisticalApi.UserRelatedDate,
    method: 'get',
    params: {
      date
    }
  })
}
/**
 *  律师相关统计
 */
 export const getLawyerRelatedDate = date => {
  return request({
    url: statisticalApi.LawyerRelatedDate,
    method: 'get',
    params: {
      date
    }
  })
}
/*
 * 获取收费订单统计
 */
 export const getChargeOrderData = (date) => {
  return request({
    url: statisticalApi.ChargeOrderData,
    method: 'get',
    params: {
      date
    }
  })
}
/**
 * 获取统计落地页列表 
 */
 export const getPromotionChannelUrls = (date) => {
  return request({
    url: statisticalApi.PromotionChannelUrls,
    method: 'get',
    params: {
      date
    }
  })
}
// 获取客服统计分页 
export const postPromotionChannelPage = (page, date, search) => {
  return request({
    url: statisticalApi.PromotionChannelPage,
    method: 'get',
    params: {
      page,
      date,
      search
    }
  })
}
// 获取客服统计总认证律师数量
export const getPromotionChannelNumber = () => {
  return request({
    url: statisticalApi.PromotionChannelNumber,
    method: 'get',
 
  })
}
// 获取统计标识进来的用户列表
export const getPromotionChannelGuideUserPage = (page, status, search, promotionChannelId, startDate, endDate) => {
  return request({
    url: statisticalApi.PromotionChannelGuideUserPage,
    method: 'get',
    params: {
      page,
      status,
      search,
      promotion_channel_id: promotionChannelId,
      start_date: startDate,
      end_date: endDate,
    }
  })
}
//  添加客服统计渠道 
export const postPromotionChannelCustomerService = (promotionChannelNo, customerServiceName, customerServiceWechat) => {
  return request({
    url: statisticalApi.PromotionChannelCustomerService,
    method: 'post',
    data: {
      promotion_channel_no: promotionChannelNo,
      customer_service_name: customerServiceName,
      customer_service_wechat: customerServiceWechat,
    }
  })
}

// 获取每日发布订单
export const getDailyOrderStatDataApi = params => {
  return request({
    url: '/v2/web/statistics/hour/order',
    method: 'get',
    params
  })
}

// 获取每日案源匹配统计
export const getDailyCaseSourceMatchStatDataApi = () => {
  return request({
    url: '/v2/web/admin/source/match/statistics',
    method: 'get',
  })
}

// 获取律师分布统计数据
export const getLawyerLayoutStatDataApi = params => {
  return request({
    url: '/v2/web/admin/optimization/lawyer/city',
    method: 'get',
    params,
  })
}
