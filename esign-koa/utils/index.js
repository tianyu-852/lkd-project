const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

/**
 * 使用 HmacSHA256 算法哈希(哈希秘钥为secret)，再对 hash 值使用 Base64 加密得到最终的签名值 sign
 */
exports.strHmacSignBase64 = (reqToSignObj, secretKey) => {
  const stringToSign = `${ reqToSignObj.HTTPMethod }\n${ reqToSignObj.Accept }\n${ reqToSignObj['Content-MD5'] }\n${ reqToSignObj['Content-Type'] }\n${ reqToSignObj.Date }\n${ reqToSignObj.Headers }${ reqToSignObj.Url }`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(stringToSign);
  const strHmacBase64 = hmac.digest('base64');
  return strHmacBase64;
}

/**
 * md5 加密字符串
 * @param {String} filePath 
 */
exports.strMd5Bybase64 = str => {
  const md5sum = crypto.createHash('md5');
  md5sum.update(str);

  const strMd5Base64 = md5sum.digest('base64');
  return strMd5Base64;
};

/**
 * 获取文件 MD5 + base64
 * @param {String} filePath 
 * @returns 
 */
exports.readFileMd5ByBase64 = (filePath) => {
  return new Promise((reslove) => {
    const md5sum = crypto.createHash('md5');
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('data', function (chunk) {
      md5sum.update(chunk);
    });
    
    fileStream.on('end', function () {
      const fileMd5 = md5sum.digest('base64');
      reslove(fileMd5);
    })
  })
}

/**
 * 获取文件信息
 * @param {String} filePath 
 * @returns 
 */
exports.readFileInfo = (filePath) => {
  return new Promise((reslove) => {
    fs.stat(filePath, function (err, stats) {
      if (err) {
        throw err;
      }
      const name = path.basename(filePath); // 文件名称
      stats.name = name;
      reslove(stats);
    });
  })
}
