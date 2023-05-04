import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // baseURL: 'https://api.lawkd.com/api',
  // timeout: 30000, // 请求超时时间
  timeout: 100000, // 请求超时时间
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    return JSONbig.parse(data)
  }],
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
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改

  if (token) {
    config.headers['Authorization'] = token
  }
  config.headers['X-Timestamp'] = new Date().getTime().toString().substr(0, 10)
  config.headers['X-Nonce'] = Math.random().toString(36).slice(-10)
  config.headers['X-Api-Version'] = 'v1'
  config.headers['X-Device-Type'] = 'admin'
  return config
}, errorHandler)

/**
 * 响应拦截器
 */
request.interceptors.response.use(response => {
  if (response.data.code !== 0) {
    const token = storage.get(ACCESS_TOKEN)

    if (response.data.code === 1002) {
      notification.error({
        message: '错误',
        description: response.data.message
      })
      return Promise.reject(response)
    } else if (response.data.code === 1001) {
      notification.error({
        message: '错误',
        description: response.data.message
      })

      return Promise.reject(response)
    } else if (response.data.code === 1009) {
      notification.error({
        message: '错误',
        description: '登录过期'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    } else if (response.data.code === 1003 || response.data.code === 1004) {
      notification.error({
        message: '错误',
        description: response.data.message
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    } else {
      if (response.data.data && response.data.code !== 'OK') notification.error({ message: '错误', description: response.data.message })
    }
  }
  
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
