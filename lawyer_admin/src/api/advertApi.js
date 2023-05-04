import request from '@/utils/request'

/**
 * 获取广告位置列表
 */
export const getAdvertPositionListApi = params => {
  return request({
    url: '/v2/web/advertisement/position/list',
    method: 'get',
    params
  })
}

/**
 * 获取广告列表
 */
export const getAdvertListApi = params => {
  return request({
    url: '/v2/web/advertisement/list',
    method: 'get',
    params
  })
}

/**
 * 获取 app 路由列表
 */
export const getAppRouteListApi = () => {
  return request({
    url: '/v2/common/jumps',
    method: 'get',
  })
}

/**
 * 获取 律师广告 待选数据
 */
export const getLawyerAdvertChoosableInfoApi = params => {
  return request({
    url: '/v2/web/advertisement/get/mum/and/money',
    method: 'get',
    params
  })
}

/**
 * 获取 律师广告 价格信息
 */
export const getLawyerAdvertPriceInfoApi = () => {
  return request({
    url: '/v2/web/advertisement/get/pack',
    method: 'get',
  })
}

/**
 * 设置 律师广告 价格信息
 */
export const postLawyerAdverPriceApi = param => {
  return request({
    url: '/v2/web/advertisement/set/pack',
    method: 'post',
    data: param
  })
}

/**
 * 获取 律师广告 优选折扣
 */
 export const getLawyerAdvertBestInfoApi = () => {
  return request({
    url: '/v2/web/advertisement/config',
    method: 'get',
  })
}

/**
 * 设置 律师广告 优选折扣
 */
 export const postLawyerAdvertBestInfoApi = param => {
  return request({
    url: '/v2/web/advertisement/edit/config',
    method: 'post',
    data: param
  })
}

/**
 * 添加广告
 */
export const postAddAdvertApi = param => {
  return request({
    url: '/v2/web/advertisement/add',
    method: 'post',
    data: param
  })
}

/**
 * 删除广告
 */
 export const delAdvertApi = param => {
  return request({
    url: '/v2/web/advertisement/del',
    method: 'delete',
    data: param
  })
}

/**
 * 开启/关闭广告
 */
 export const switchAdvertStatusApi = param => {
  return request({
    url: '/v2/web/advertisement/update/status',
    method: 'post',
    data: param
  })
}

/**
 * 获取广告位置列表
 */
export const getAdvertPositonListApi = params => {
  return request({
    url: '/v2/web/advertisement/position/list',
    method: 'get',
    params
  })
}

/**
 * 获取广告分类列表
 */
export const getAdvertClassListApi = params => {
  return request({
    url: '/v2/web/advertisement/position/group/list',
    method: 'get',
    params
  })
}

/**
 * 获取广告位已选的日期列表
 */
export const getAdvertSelectedDateApi = params => {
  return request({
    url: '/v2/web/advertisement/date/list',
    method: 'get',
    params
  })
}

/**
 * 添加广告位置
 */
 export const postAddAdvertPositionApi = param => {
  return request({
    url: '/v2/web/advertisement/position/add',
    method: 'post',
    data: param
  })
}

/**
 * 删除广告位
 */
 export const delLawyerAdvertPositionApi = param => {
  return request({
    url: '/v2/web/advertisement/del',
    method: 'delete',
    data: param
  })
}


/**
 * 添加官方广告
 */
 export const postAddOfficAdvertApi = param => {
  return request({
    url: '/v2/web/advertisement/add/easy',
    method: 'post',
    data: param
  })
}
