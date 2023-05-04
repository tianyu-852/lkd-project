const axios = require('axios');
const fs = require('fs');
const commonUtils = require('.');

const esignHost = 'https://smlopenapi.esign.cn'; // 沙箱模拟环境
const esignAppId = '7438910928'; // 应用 ID
const esignAppSecret = 'c75aa326dfb9ed22b22a563aa5f3519c'; // 应用 Secret

/**
 * post 请求 e签宝
 * @param {*} reqUrl 
 * @param {*} reqBody
 */
const postReqESign = async (reqUrl, reqBody) => {
  const contentType = 'application/json; charset=UTF-8';
  const contentMD5 = commonUtils.strMd5Bybase64(JSON.stringify(reqBody));
  // console.log('contentMD5-18:', contentMD5);

  // 需要签名的对象
  const reqToSignObj = {
    'HTTPMethod': 'POST',
    'Accept': '*/*',
    'Content-MD5': contentMD5,
    'Content-Type': contentType,
    'Date': '',
    'Headers': '',
    'Url': reqUrl
  };
  // 请求签名签名字符串
  const reqSignature = commonUtils.strHmacSignBase64(reqToSignObj, esignAppSecret);
  // console.log(reqSignature)

  // 构建请求头
  const headers = {
    'Accept': '*/*',
    'X-Tsign-Open-Auth-Mode': 'Signature',
    'Content-Type': contentType,
    'X-Tsign-Open-App-Id': esignAppId,
    'X-Tsign-Open-Ca-Timestamp': `${ +new Date() }`,
    'Content-MD5': contentMD5,
    'X-Tsign-Open-Ca-Signature': reqSignature,
  };
  
  return new Promise((resolve, reject) => {
    axios({
      url: esignHost + reqUrl,
      method: 'post',
      headers,
      data: reqBody
    }).then(res => {
      // console.log('正确：', res.data);
      resolve(res.data);
    }).catch(err => {
      reject(err);
    });
  });
};

/**
 * put 请求 e签宝
 * @param {*} reqUrl 
 * @param {*} reqBody
 */
 const putReqESign = async (uploadUrl, filePath, contentType, contentMd5) => {
  const headers = { 'Content-Type': contentType, 'Content-MD5': contentMd5 };
  // 文件二进制流
  const fileBuffer = fs.readFileSync(filePath);
  // console.log(fileBuffer);

  return new Promise((resolve, reject) => {
    axios({
      url: uploadUrl,
      method: 'put',
      headers,
      data: fileBuffer
    }).then(res => {
      // console.log('正确：', res.data);
      resolve(res.data);
    }).catch(err => {
      reject(err);
    });
  });
 }

module.exports = {
  postReqESign,
  putReqESign
};
