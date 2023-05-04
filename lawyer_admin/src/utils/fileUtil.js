import Axios from 'axios'
import store from '@/store'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const uploadFileUrl = `/web/admin/upload/file`

/**
 * 随机数 未指定长度则为32位
 */
 const _randomStrFunc = len => {
  len = len || 8
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * 生成上传图片路径
 */
 const _createFilePath = (file, filePathPrefix = 'lkd-file') => {
  const fileName = file.name
  const pos = fileName.lastIndexOf('.')

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  const time = new Date().getTime()

  return `lvkuaidaimages/${ filePathPrefix }/${ year }${ month }${ day }-${ time }-${ _randomStrFunc(6) }${ fileName.substring(pos) }`
}

// 创建 axios 实例
const axios = Axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // baseURL: 'https://api.lawkd.com/api',
  // timeout: 30000, // 请求超时时间
  timeout: 300000, // 请求超时时间
  // transformResponse: [function (data) {
  //   // Do whatever you want to transform the data
  //   return JSONbig.parse(data)
  // }],
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    // const data = error.response.data
    // 从 localstorage 获取 token
  }
  return Promise.reject(error)
}

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // console.log(storage.get(ACCESS_TOKEN))

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) config.headers['Authorization'] = token

  config.headers['X-Timestamp'] = new Date().getTime().toString().substr(0, 10) // 时间戳
  config.headers['X-Nonce'] = Math.random().toString(36).slice(-10) // 随机字符串
  config.headers['X-Api-Version'] = 'v1' // api版本号
  config.headers['X-Device-Type'] = 'admin' // 设备类型
  config.headers['Content-Type'] = 'multipart/form-data' // 传输文件类型
  return config

}, errorHandler)

/**
 * 响应拦截器
 */
// axios.interceptors.response.use(response => {

// }, errorHandler)


/**
 * 单上传文件
 */
const uploadFile = async (fileBlob, fileKey = 'file') => {
  const formData = new FormData()
  // 是否是 File 对象
  if (fileBlob instanceof File) {
    formData.append('path', _createFilePath(fileBlob))
  }
  formData.set(fileKey, fileBlob, 'file.png')

  try {
    const uploadRes = await axios.request({
      url: uploadFileUrl,
      method: 'post',
      data: formData,
    })
    // console.log(uploadRes)

    if (uploadRes.status === 200) {
      const uploadResData = uploadRes.data
  
      // 业务状态码不等于 0 轻提示
      if (uploadResData.code !== 0) {
        // uni.showToast({ icon: 'none', title: uploadResData.message || 'Error', duration: 3000 });
        // code: 1009 token 过期
        if (uploadResData.code === 1009) {
          // store.dispatch('userModule/removeUserTokenAndUserInfoAction');
        }
  
        return Promise.reject(uploadResData)
      }
  
      return uploadResData.data.url
    } else {
      // http 请求错误
      console.log(uploadRes)
      return Promise.reject(uploadRes.data)
    }
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

/**
 * 多上传文件
 */
// const uploadMultipleFile = () => ()

export default {
  uploadFile
}
