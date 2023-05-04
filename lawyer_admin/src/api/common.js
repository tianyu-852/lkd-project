import request from '@/utils/request'

const commonApi = {
  UploadImage: 'web/common/upload/image',
  UploadFile: 'common/file',
  webAddress: 'web/address',
  webLocation: 'web/location',
  userConfigOss: 'web/user/config/oss',
  UploadFiles: 'web/common/upload/files'
  
}
/**
 * 上传图片
 */
export const uploadImage = async (image) => {
  const form = new FormData()
  form.append('image', image)
  return request({
    url: commonApi.UploadImage,
    method: 'post',
    data: form
  })
}
/**
 * 批量上传图片
 */
 export const UploadFiles = async (image) => {
  const form = new FormData()
  for (let i = 0; i < image.length; i++) {
    form.append('files[]', image[i])
  }
 
  return request({
    url: commonApi.UploadFiles,
    method: 'post',
    data: form
  })
}
/**
 * 上传文件
 */
 export const UploadFile = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return request({
    url: commonApi.UploadFile,
    method: 'post',
    data: form
  })
}
/**
 * 获取客户端直传OSS Token
 */
export const getUserConfigOss = () => {
  return request({
    url: commonApi.userConfigOss,
    method: 'get',
  })
}
/**
 * 地址转坐标
 */
export const webAddress = (address) => {
  return request({
    url: commonApi.webAddress,
    method: 'get',
    params: {
      address
    }
  })
}
/**
 * 坐标转地址
 * lat	纬度
 * lng  经度
 */
 export const webLocation = (lng, lat) => {
  return request({
    url: commonApi.webLocation,
    method: 'get',
    params: {
      lng,
      lat,
    }
  })
}

/**
 * 获取 阿里云oss config 新消息
 */
export const getOssConfigInfo = () => {
  return request({
    url: '/v2/app/free/oss/token',
    method: "get",
  })
}

/**
 * 上传阿里语音识别语音文件
 */
export const postOSSVoiceFileApi = param => {
  return request({
    url: '/v2/web/ali/voice/discern/upfile',
    method: "post",
    data: param
  })
}
/**
 * 上传阿里语音识别语音文件
 */
export const getOSSVoiceFileTranslateApi = param => {
  return request({
    url: '/v2/web/ali/voice/discern/detail',
    method: "post",
    data: param
  })
}

/**
 * 获取 阿里云oss config 信息
 */
 export const getOSSConfigApi = () => {
  return request({
    url: '/v2/app/oss/token',
    method: "get",
  })
}
