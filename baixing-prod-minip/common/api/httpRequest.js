import Request from '@/common/lib/luch-request';
import { Base64 } from '@/common/lib/js-base64';
const crypto = require('crypto');
import * as commonUtil from '@/common/utils';
import store from '@/store';

const http = new Request();

/**
 * 把字符串作为 URI 组件进行编码
 * @param {String} str
 */
const _urlEncode = str => {
  return encodeURIComponent(str).replace(/\+/g, '%20').replace(/\*/g, '%2A');
};

/**
 * 初始化请求头部信息
 * @param {*} urlPath
 * @param {*} data
 * @returns http 请求头部信息
 */
const _initHttpHeader = httpConfig => {
  const deviceType = 'wechat-mini-program'; // 设备类型 微信小程序
  const timestamp = Math.floor(+new Date() / 1000) + ''; // 10 位时间戳字符串
  const noncestr = commonUtil.randomStr(8); // 8 位随机字符串

  const reqPath = httpConfig.url.split('.com')[1]; // 请求路径
  const userToken = store.state.userModule.userToken; // 用户 token
  // 拼接请求头部字符串
  const reqHeaderStr = `${ userToken ? ('authorization=' + _urlEncode(userToken) + '&') : '' }x-device-type=${ deviceType }&x-nonce=${ noncestr }&x-timestamp=${ timestamp }`;
  // 拼接请求路径 + 头部字符串
  let signatureStr = `${ reqPath }${ reqHeaderStr }`;

  // 请求参数对象
  const reqParamObj = httpConfig.method === 'GET' ? httpConfig.params : httpConfig.data;

  if (Object.keys(reqParamObj).length && Object.values(reqParamObj).length) {
    // 将请求对象中的 key 值进行排序 (对所有待签名参数按照字段名 key 的 ASCII 码从小到大排序（字典序）)
    const reqParamKeys = Object.keys(reqParamObj).sort();
    // eg: a=1&b=2&c=3
    const reqParamStr = reqParamKeys.map(reqParamKey => {
      let _reqKeyValStr = '';
      // 排除掉空值
      if (reqParamObj[reqParamKey]) {
        _reqKeyValStr = `${ _urlEncode(reqParamKey) }=${ _urlEncode(reqParamObj[reqParamKey]) }`;
      }
      return _reqKeyValStr;
    }).filter(item => item).join('&');

    signatureStr += reqParamStr;
  }

  // console.log(signatureStr);
  // hmac sha1 加密, 取16进制的值
  const signatureHex = crypto.createHmac('sha1', timestamp).update(signatureStr).digest('hex');

  // base64 加密
  const signature = Base64.encode(signatureHex);


  const headerObj = {
    'X-Timestamp': timestamp, // 10 位时间戳字符串
    'X-Nonce': noncestr, // 8 位随机字符串
    'X-App-Version-Number': '2.0.1', // X-App-Version-Number
    'X-Api-Version': 'v1', // api版本号
    'X-Device-Type': deviceType, // 设备
    'X-Source-App': '0', // 来自于哪个 app 0: 百姓律师
    'X-Signature': signature, // 接口签名
    'content-type': 'application/x-www-form-urlencoded',
    // "x-is-debug": '1'
  };
  // 添加 token 到 header 中
  (userToken) && (headerObj['Authorization'] = `${ userToken }`);

  return headerObj;
};

/**
 * 全局配置修改 setConfig
 */
http.setConfig(config => {
  config.header = {
    ...config.header
  };
  // 返回的数据类型 | 主要解决长整形数字精度丢失问题
  config.dataType = 'string';

  return config;
});

/**
 * 请求拦截器
 */
http.interceptors.request.use(config => {
  config.header = { ..._initHttpHeader(config) };
  // console.log(config);

  return config;
}, config => {
  console.log('请求拦截错误：', config);
  return Promise.reject(config);
});

/**
 * 响应拦截器
 */
http.interceptors.response.use(response => {
  // console.log('响应成功:', response);
  const resData = response.data;

  uni.hideLoading();
  // 业务状态码不等于 0 轻提示
  if (resData.code !== 0) {
    uni.showToast({ icon: 'none', title: resData.message || 'Error', duration: 3000 });
    // code: 1009 token 过期
    if (resData.code === 1009) {
      store.dispatch('userModule/removeUserTokenAndUserInfoAction');
      uni.navigateTo({ url: '/pagesV1/common/login' });
    }

    return Promise.reject(resData);
  }

  return resData;
}, response => {
  console.log('响应拦截错误:', response);

  uni.hideLoading();
  if (response.statusCode === 403) {
    uni.showToast({ icon: 'none', title: '暂无权限', duration: 3000 });
  } else {
    uni.showToast({ icon: 'none', title: '服务器出错', duration: 3000 });
  }

  return Promise.reject(response.data);
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
    method: method.toUpperCase(),
    [method === 'get' ? 'params' : 'data']: data
  });
};

export default httpRequest;
