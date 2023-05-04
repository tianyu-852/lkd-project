import request from '@/utils/request'

const userApi = {
  AppVersion: 'web/app/version',
  AppVersionHistory: 'web/app/version/history',
  AppAndroidUpload: 'web/app/android-apk/upload',
}

// 获取最新app版本
export const getAppVersion = () => {
  return request({
    url: userApi.AppVersion,
    method: 'get',
    params: {

    }
  })
}
// 保存更新版本
 export const postAppVersion = (iosNewestVersion, iosOldestVersion, iosCheckVersion, iosUpdateInfo, androidUpdateInfo, androidOldestVersion, androidNewestVersion, lawyerAndroidUpdateInfo, lawyerIosUpdateInfo) => {
  return request({
    url: userApi.AppVersion,
    method: 'post',
    data: {
      ios_newest_version: iosNewestVersion,
      ios_oldest_version: iosOldestVersion,
      ios_check_version: iosCheckVersion,
      ios_update_info: iosUpdateInfo,
      android_update_info: androidUpdateInfo,
      android_oldest_version: androidOldestVersion,
      android_newest_version: androidNewestVersion,
      lawyer_android_update_info: lawyerAndroidUpdateInfo,
      lawyer_ios_update_info: lawyerIosUpdateInfo
    }
  })
}
// 获取App版本历史
export const getAppVersionHistory = (page) => {
  return request({
    url: userApi.AppVersionHistory,
    method: 'get',
    params: {
      page
    }
  })
}
// 获取安卓APK上传链接
export const postAppAndroidUpload = (contentMd5) => {
  return request({
    url: userApi.AppAndroidUpload,
    method: 'post',
    data: {
      content_md5: contentMd5
    }
  })
}

/**
 * 获取 APP 设置
 */
export const getAppConfgApi = () => {
  return request({
    url: '/v2/web/config/get/app/config',
    method: 'get',
  })
}

/**
 * 设置 APP 设置
 */
export const postAppConfgApi = param => {
  return request({
    url: '/v2/web/config/set/config',
    method: 'post',
    data: param
  })
}

// 获取 app 版本信息
export const getAppVersionApi = params => {
  return request({
    url: '/v2/web/app/version',
    method: 'get',
    params
  })
}

// 更新 app 版本信息
export const postAppVersionApi = params => {
  return request({
    url: '/v2/web/app/version',
    method: 'post',
    data: params
  })
}

// 获取 app 历史版本信息
export const getAppHistoryVersionApi = params => {
  return request({
    url: '/v2/web/app/version/history',
    method: 'get',
    params
  })
}

// 获取 app 协议列表
export const getAppProtocolListApi = params => {
  return request({
    url: '/v2/web/agreement/list',
    method: 'get',
    params
  })
}

// 获取 app 协议详情
export const getAppProtocolDetailApi = params => {
  return request({
    url: '/v2/web/agreement/detail',
    method: 'get',
    params
  })
}

// 更新 app 协议
export const postAppProtocolApi = params => {
  return request({
    url: '/v2/web/agreement/set',
    method: 'post',
    data: params
  })
}


// 获取 自动间隔发单 列表
export const getAutoPubOrderListApi = () => {
  return request({
    url: '/v2/web/automatic/config/list',
    method: 'get',
  })
}

// 添加 自动间隔发单 项
export const postAutoPubOrderApi = params => {
  return request({
    url: '/v2/web/add/automatic/config',
    method: 'post',
    data: params
  })
}

// 删除 自动间隔发单 项
export const delAutoPubOrderApi = params => {
  return request({
    url: '/v2/web/del/automatic/config',
    method: 'post',
    data: params
  })
}
