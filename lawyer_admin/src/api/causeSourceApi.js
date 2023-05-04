import request from '@/utils/request'

/**
 * 获取案源标签列表
 */
export const getCauseSourceTagListApi = () => {
  return request({
    url: '/v2/web/admin/get/demand/tags',
    method: 'get'
  })
}

/**
 * 获取案源分类列表
 */
export const getCauseSourceCategoryListApi = (params = {}) => {
  return request({
    url: '/v2/web/admin/get/lawyer/tags',
    method: 'get',
    params
  })
}

/**
 * 获取律师地区列表
 */
export const getLawyerRegionListApi = () => {
  return request({
    url: '/v2/web/admin/get/districts',
    method: 'get'
  })
}

/**
 * 根据手机号 搜索用户
 */
export const searchUserApi = params => {
  return request({
    url: '/v2/web/admin/get/customer/service/user/page',
    method: 'get',
    params
  })
}

/**
 * 获取用户文件列表
 */
export const getUserFileApi = params => {
  return request({
    url: '/v2/web/admin/get/app/page',
    method: 'get',
    params
  })
}

/**
 * 上传添加用户文件
 */
export const postAddUserFileApi = param => {
  return request({
    url: '/v2/web/admin/cloud/file/add',
    method: 'post',
    data: param
  })
}

/**
 * 删除用户文件
 */
export const delUserFileApi = param => {
  return request({
    url: '/v2/web/admin/cloud/file/delete',
    method: 'delete',
    data: param
  })
}

/**
 * 获取案源列表
 */
export const causeSourceListApi = params => {
  return request({
    url: '/v2/web/admin/get/clues/info',
    method: 'get',
    params
  })
}

/**
 * 隐藏案源列表
 */
export const hiddenCauseSourceApi = param => {
  return request({
    url: '/v2/web/diabetes/mellitus/show/operation',
    method: 'post',
    data: param
  })
}

/**
 * 显示案源列表
 */
export const showCauseSourceApi = param => {
  return request({
    url: '/v2/web/diabetes/mellitus/show/operation',
    method: 'post',
    data: param
  })
}

/***
 * 重新发布
 */
export const againPublishApi = param => {
  return request({
    url: '/v2/web/clues/redistribution',
    method: 'post',
    data: param
  })
}

/***
 * 转案源
 */
export const changeOriginApi = param => {
  return request({
    url: '/v2/web/transfer/clues',
    method: 'post',
    data: param
  })
}


/**
 * 案源转社区动态
 */
 export const causeSourceToCommunityDynApi = param => {
  return request({
    url: '/v2/web/order/to/question',
    method: 'post',
    data: param
  })
}


/**
 * 获取案源线索列表
 */
 export const getCauseSourceClueListApi = params => {
  return request({
    url: '/v2/web/user/havior/list',
    method: 'get',
    params
  })
}

/**
 * 获取案源线索用户帖子列表
 */
 export const getCauseSourceClueUserDynamicListApi = params => {
  return request({
    url: '/web/question/page',
    method: 'get',
    params
  })
}

/**
 * 获取案源线索用户录音列表
 */
 export const getCauseSourceClueUserVoiceListApi = params => {
  return request({
    url: '/v2/web/ali/hidden/call/list',
    method: 'get',
    params
  })
}

/**
 * 获取案源线索用户帖子列表
 */
 export const getCauseSourceClueUserChatListApi = params => {
  return request({
    url: '/v2/web/im/chat/target/list',
    method: 'get',
    params
  })
}

/**
 * 更新案源线索标签
 */
 export const putCauseSourceClueLabelApi = params => {
  return request({
    url: '/v2/web/user/havior/update',
    method: 'post',
    data: params
  })
}

/**
 * 案源线索分配
 */
 export const postCauseSourceClueAssignApi = params => {
  return request({
    url: '/v2/web/user/havior/select/labeler',
    method: 'post',
    data: params
  })
}

/**
 * 案源线索 标签法务列表
 */
 export const getlawManagerRoleApi = () => {
  return request({
    url: '/v2/web/user/havior/get/personnel',
    method: 'get',
  })
}

/**
 * 案源线索分配数据
 */
 export const getCauseSourceClueAssignDataApi = params => {
  return request({
    url: '/v2/web/user/havior/label/ave',
    method: 'get',
    params
  })
}

/**
 * 获取案源精选列表
 */
export const getCauseSourceFeatureListApi = params => {
  return request({
    url: '/v2/web/choiceness/order/list',
    method: 'get',
    params
  })
}


/**
 * 发布案源精选
 */
 export const postCauseSourceFeatureApi = param => {
  return request({
    url: '/v2/web/add/choiceness/order',
    method: 'post',
    data: param
  })
}

/**
 * 更新案源精选
 */
 export const updateCauseSourceFeatureApi = param => {
  return request({
    url: '/v2/web/update/choiceness/order',
    method: 'post',
    data: param
  })
}

/**
 * 删除案源精选
 */
 export const delCauseSourceFeatureApi = param => {
  return request({
    url: '/v2/web/del/choiceness/order',
    method: 'post',
    data: param
  })
}

/**
 * 获取案源精选 文件列表
 */
 export const getCauseSourceFeatureFileListApi = params => {
  return request({
    url: '/v2/web/admin/file/list',
    method: 'get',
    params
  })
}

/**
 * 添加案源精选 文件
 */
 export const postCauseSourceFeatureFileApi = param => {
  return request({
    url: '/v2/web/add/admin/file',
    method: 'post',
    data: param
  })
}

/**
 * 删除案源精选 文件
 */
 export const delCauseSourceFeatureFileApi = param => {
  return request({
    url: '/v2/web/del/admin/file',
    method: 'post',
    data: param
  })
}

/**
 * 获取案源精选 文件列表
 */
 export const getCauseSourceClueQiyeDataApi = params => {
  return request({
    url: '/v2/web/user/havior/cache',
    method: 'post',
    data: params
  })
}

/**
 * 设置后台账号 线索标签权限
 */
 export const setHoutaiAccountCauseSourceClueLabelRightsApi = params => {
  return request({
    url: '/v2/web/customer/label/set/admin',
    method: 'post',
    data: params
  })
}

/**
 * 获取案源合作列表
 */
export const getCauseSourceUnionListApi = params => {
  return request({
    url: '/v2/web/admin/lawyer/cooperation/list',
    method: 'get',
    params
  })
}

/**
 * 获取案源合作详情
 */
export const getCauseSourceDetailApi = params => {
  return request({
    url: '/v2/web/admin/cooperation/detail',
    method: 'get',
    params
  })
}

/**
 * 获取案源匹配 vip列表
 */
 export const getCaseSourceMatchVipListApi = params => {
  return request({
    url: '/v2/web/admin/source/match/open/list',
    method: 'get',
    params
  })
}

/**
 * 获取案源匹配 套餐列表
 */
 export const getCaseSourceMatchMenuListApi = params => {
  return request({
    url: '/v2/web/admin/source/match/package/list',
    method: 'get',
    params
  })
}

/**
 * 开通 案源匹配 vip会员
 */
 export const postCaseSrouceMatchVipApi = params => {
  return request({
    url: '/v2/web/admin/open/source/match/package',
    method: 'post',
    data: params
  })
}

/**
 * 更新 案源匹配vip会员 销售
 */
 export const updateCaseSourceVipSellerApi = params => {
  return request({
    url: '/v2/web/admin/update/source/match/sales',
    method: 'post',
    data: params
  })
}

/**
 * 获取案源vip 使用记录列表
 */
 export const getCaseSourceVipUseRecordApi = params => {
  return request({
    url: '/v2/web/admin/source/match/clues/list',
    method: 'get',
    params
  })
}

/**
 * 获取案源vip 详情
 */
 export const getLawyerCaseSourceVipDetailApi = params => {
  return request({
    url: '/v2/web/admin/source/match/user/detail',
    method: 'get',
    params
  })
}

/**
 * 获取案源vip 线索列表
 */
 export const getCaseSourceMatchClueListApi = params => {
  return request({
    url: '/v2/web/user/havior/source/match/list',
    method: 'get',
    params
  })
}

/**
 * 手动匹配 案源匹配vip 线索
 */
 export const postCaseSourceVipMatchClueApi = params => {
  return request({
    url: '/v2/web/user/havior/source/matching',
    method: 'post',
    data: params
  })
}

/**
 * 移除律师 案源匹配vip
 */
 export const removeLawyerCaseSourceVipApi = params => {
  return request({
    url: '/v2/web/del/source/match/package/warehouse',
    method: 'post',
    data: params
  })
}

/**
 * 获取案源匹配地区列表
 */
 export const getCaseSourceMatchRegionListApi = () => {
  return request({
    url: '/v2/web/admin/source/match/city/statistics',
    method: 'get',
  })
}

/**
 * 移除律师 案源匹配vip
 */
 export const updateCaseSourceMathMaxNumApi = params => {
  return request({
    url: '/v2/web/update/source/match/package/max/num',
    method: 'post',
    data: params
  })
}

/**
 * 获取 案源匹配vip 律师列表
 */
 export const getCaseSourceRegionLawyerListApi = params => {
  return request({
    url: '/v2/web/user/havior/matched/lawyer',
    method: 'get',
    params
  })
}

/**
 * 获取本地案源
 */
 export const getCaseSourceNativeListApi = params => {
  return request({
    url: '/v2/web/admin/local/case/source/list',
    method: 'get',
    params
  })
}

/**
 * 发布 本地案源
 */
export const createCaseSourceNativeApi = params => {
  return request({
    url: '/v2/web/add/local/case/source',
    method: 'post',
    data: params
  })
}

/**
 * 获取律师主页本地案源列表
 */
 export const getLawyerCaseSourceNativeListApi = params => {
  return request({
    url: '/v2/web/admin/lawyer/local/case/source/list',
    method: 'get',
    params
  })
}

/**
 * 获取律师主页本地案源通话记录
 */
 export const getLawyerCaseSourceNativeCallRecordApi = params => {
  return request({
    url: '/v2/web/admin/lawyer/local/case/call/list',
    method: 'get',
    params
  })
}

/**
 * 获取本地案源统计数据
 */
 export const getCaseSourceNativeStateApi = params => {
  return request({
    url: '/v2/web/get/local/case/statistical',
    method: 'get',
    params
  })
}

/**
 * 获取本地案源免费领取设置列表
 */
 export const getCaseSourceNativeGetSetListApi = params => {
  return request({
    // url: '/v2/web/local/case/optimization/plan/list',
    url: '/v2/web/local/num/package/list',
    method: 'get',
    params
  })
}

/**
 * 添加 本地案源免费领取设置
 */
 export const postCaseSourceNativeGetSetApi = params => {
  return request({
    // url: '/v2/web/set/local/case/time/and/type',
    url: '/v2/web/add/local/num/package',
    method: 'post',
    data: params
  })
}

/**
 * 删除 本地案源免费领取设置
 */
export const delCaseSourceNativeGetSetApi = params => {
  return request({
    url: '/v2/web/del/num/package',
    method: 'post',
    data: params
  })
}

/**
 * 获取本地案源 vip会员 列表
 */
export const getCaseSourceVipListApi = params => {
  return request({
    url: '/v2/web/local/package/warehouse/list',
    method: 'get',
    params
  })
}

/**
 * 获取本地案源 vip菜单 列表
 */
export const getCaseSourceVipMenuListApi = params => {
  return request({
    url: '/v2/web/admin/package/list',
    method: 'get',
    params
  })
}

/**
 * 开通 本地案源 vip会员
 */
 export const postCaseSourceVipApi = params => {
  return request({
    url: '/v2/web/admin/open/package',
    method: 'post',
    data: params
  })
}


/**
 * 分配本地案源给律师
 */
export const dispatchNativeCauseSourceToLawyerApi = param => {
  return request({
    url: '/v2/web/admin/send/local/case/source',
    method: 'post',
    data: param
  })
}

/**
 * 分配本地案源给律师
 */
export const getLawyerCauseSourceUseRecordApi = params => {
  return request({
    url: '/v2/web/local/case/source/statistics/list',
    method: 'get',
    params
  })
}

/**
 * 合作一城一律 合作律师列表
 */
export const getCauseSourceCityUnionLawyerApi = params => {
  return request({
    url: '/v2/web/local/case/source/release/list',
    method: 'get',
    params
  })
}

/**
 * 添加 一城一律 合作律师
 */
 export const postCauseSourceCityUnionLawyerApi = param => {
  return request({
    url: '/v2/web/add/local/case/source/release',
    method: 'post',
    data: param
  })
}
