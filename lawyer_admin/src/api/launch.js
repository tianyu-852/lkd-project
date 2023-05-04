import request from '@/utils/request'

const AssetsApi = {
  AdvertisementPage: 'web/advertisement/page',
  AdvertisementOrderPage: 'web/advertisement/order/page',
  AdvertisementDetail: 'web/advertisement',
  AdvertisementPositions: 'web/advertisement/positions',
  AdvertisementEnablePositions: 'web/advertisement/enable/positions',
  AdvertisementPositionsEnable: 'web/advertisement/position/enable',
  AdvertisementExposureSub: 'web/advertisement/exposure-number/sub',
  AdvertisementStatus: 'web/advertisement/status'
}
/**
* 获取广告分页
*/
export const getAdvertisementPage = (page, search, startDate, endDate) => {
    return request({
      url: AssetsApi.AdvertisementPage,
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
* 获取广告位置列表
*/
export const getAdvertisementPositions = () => {
  return request({
    url: AssetsApi.AdvertisementPositions,
    method: 'get'
  })
}
/**
* 获取广告已开启的位置列表
*/
export const getAdvertisementEnablePositions = () => {
  return request({
    url: AssetsApi.AdvertisementEnablePositions,
    method: 'get'
  })
}
/**
 * 设置广告开启状态
 */
export const getAdvertisementPositionsEnable = (advertisementPositionId, isEnable) => {
    return request({
      url: AssetsApi.AdvertisementPositionsEnable,
      method: 'put',
      data: {
        advertisement_position_id: advertisementPositionId,
        is_enable: isEnable,
      }
    })
  }
/**
* 获取广告位置列表
*/
export const putAdvertisementPositions = (advertisementId, advertisementPositionIds) => {
  return request({
    url: AssetsApi.AdvertisementPositions,
    method: 'put',
    data: {
      advertisement_id: advertisementId,
      advertisement_position_ids: advertisementPositionIds,
    }
  })
}
/**
 * 获取广告详情 
*/
export const getAdvertisementDetail = (advertisementId) => {
  return request({
    url: AssetsApi.AdvertisementDetail,
    method: 'get',
    params: {
      advertisement_id: advertisementId,
    }
  })
}
/**
 *修改投放设定
*/
export const putAdvertisementDetail = (advertisementId, clickSubExposureNumber, timedFrequencySubExposureNumber, timedFrequencyHour) => {
  return request({
    url: AssetsApi.AdvertisementDetail,
    method: 'put',
    data: {
      advertisement_id: advertisementId,
      click_sub_exposure_number: clickSubExposureNumber,
      timed_frequency_sub_exposure_number: timedFrequencySubExposureNumber,
      timed_frequency_hour: timedFrequencyHour
    }
  })
}
/**
 * 抹零广告曝光量
 */
 export const putAdvertisementExposureSub = (advertisementId, exposureNumber) => {
  return request({
    url: AssetsApi.AdvertisementExposureSub,
    method: 'put',
    data: {
      advertisement_id: advertisementId,
      exposure_number: exposureNumber,
    }
  })
}
/**
 *  获取广告订单分页
 */
 export const getAdvertisementOrderPage = (page, searchUser, startDate, endDate, searchOrderNo, searchOrderStatus) => {
  return request({
    url: AssetsApi.AdvertisementOrderPage,
    method: 'get',
    params: {
      page,
      search_user: searchUser,
      start_date: startDate,
      end_date: endDate,
      search_order_no: searchOrderNo,
      search_order_status: searchOrderStatus
     }
  })
}
/**
 * 修改广告状态
 */
 export const putAdvertisementStatus = (advertisementId, status) => {
  return request({
    url: AssetsApi.AdvertisementStatus,
    method: 'put',
    data: {
      advertisement_id: advertisementId,
      status
    }
  })
}