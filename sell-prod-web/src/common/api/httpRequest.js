import axios from 'axios';
import JSONbig from 'json-bigint';
import store from '@/store';
import { Message } from 'element-ui';

// 创建 axios 实例
const http = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // 请求超时时间 单位是ms，这里设置了 3s 的超时时间
  timeout: 3 * 1000,
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    return JSONbig.parse(data);
  }],
});

/**
 * 请求拦截器
 */
http.interceptors.request.use(config => {
  const userToken = store.state.userModule.userToken; // 用户 token
  userToken && (config.headers['Authorization'] = userToken);

  config.headers['X-Timestamp'] = new Date().getTime().toString().substr(0, 10);
  config.headers['X-Nonce'] = Math.random().toString(36).slice(-10);
  config.headers['X-Api-Version'] = 'v1';
  config.headers['X-Device-Type'] = 'admin';
  return config;
}, error => {
  return Promise.reject(error);
});

/**
 * 响应拦截器
 */
http.interceptors.response.use(response => {
  console.log(response);
  const resData = response.data;

  if (resData.code !== 0) {
    Message.error({ message: resData.message || '服务错误' });

    // token 过期
    if (resData.code === 1009) {
      // Message.warning({ message: '登录过期' });
      store.dispatch('userModule/userLogoutAction').then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }

    return Promise.reject(resData);
  }

  return resData;
}, error => {
  return Promise.reject(error);
});

/**
 * 封装 http 请求
 * @param {String} url url
 * @param {Object} data 请求数据
 * @param {String} method 请求方法
 */
const httpRequest = (url = '', data = {}, method = 'get') => {
  return http.request({
    url,
    method: method.toLowerCase(),
    [method === 'get' ? 'params' : 'data']: data
  });
};

export default httpRequest;
