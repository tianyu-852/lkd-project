import request from '@/utils/request'

/**
 * 获取埋点数据
 */
 export const getUserPointLogApi = params => {
  return request({
    url: '/v2/web/staticstical/buried/point/list',
    method: 'get',
    params
  })
}

/**
 * 获取律师广告点击 埋点列表
 */
 export const getLawyerAdvertLogApi = params => {
  return request({
    url: '/v2/web/user/advertisement/log',
    method: 'get',
    params
  })
}

/**
 * 获取律师广告发起私聊 埋点列表
 */
 export const getLawyerAdvertChatLogApi = params => {
  return request({
    url: '/v2/web/user/chat/log',
    method: 'get',
    params
  })
}
