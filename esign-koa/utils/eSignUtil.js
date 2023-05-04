const httpESignUtil = require('./httpESignUtil');
const path = require('path');
const commonUtils = require('.');

/**
 * 创建个人签署账号
 */
exports.createPersonAccountId = async ({ userMobile, userIdNumber, userName, userEmail }) => {
  // 请求 body
  const reqBodyData = {
    'thirdPartyUserId': userMobile,
    'name': userName,
    'idNumber': userIdNumber,
    'idType': 'CRED_PSN_CH_IDCARD',
    'mobile': userMobile,
    'email': userEmail
  };
  // 接口地址
  const createESignOrgAccountUrl = '/v1/accounts/createByThirdPartyUserId';

  try {
    const postReqESignRes = await httpESignUtil.postReqESign(createESignOrgAccountUrl, reqBodyData);
    // console.log(postReqESignRes);
    // 关于报错 “code=53000000，message=账号已存
    const personAccountId = (postReqESignRes.code === 0 || postReqESignRes.code === 53000000) ? postReqESignRes['data']['accountId'] : '';
    return personAccountId;
  } catch (error) {
    throw error;
  }
};

/**
 * 创建企业签署账号
 */
 exports.createOrgAccountId = async ({ orgName, orgIdNumber, orgUserName }) => {
  // 请求 body
  const reqBodyData = {
    'thirdPartyUserId': orgIdNumber,
    'name': orgName,
    'idNumber': orgIdNumber,
    'idType': 'CRED_ORG_USCC',
    'orgLegalName': orgUserName,
  };
  // 接口地址
  const createESignOrgAccountUrl = '/v1/organizations/createByThirdPartyUserId';

  try {
    const postReqESignRes = await httpESignUtil.postReqESign(createESignOrgAccountUrl, reqBodyData);
    // console.log(postReqESignRes);
    // 关于报错 “code=53000000，message=账号已存
    const orgAccountId = (postReqESignRes.code === 0 || postReqESignRes.code === 53000000) ? postReqESignRes['data']['orgId'] : '';
    return orgAccountId;
  } catch (error) {
    throw error;
  }
};

/**
 * 上传合同文件到 e签宝
 */
exports.uploadFile = async () => {
  // 合同文件路径
  const realFile = path.resolve(__dirname, '../pdf/zu_fang.pdf');
  // 文件 MD5 by base64
  const contentMd5 = await commonUtils.readFileMd5ByBase64(realFile);
  // 获取文件信息
  const fileInfo = await commonUtils.readFileInfo(realFile);
  // 目标文件的MIME类型
  const contentType = 'application/octet-stream';
  // 是否转换成pdf文档
  const convert2Pdf = false;

  // 请求 body
  const reqBodyData = {
    "contentMd5": contentMd5,
    "contentType": contentType, 
    "convert2Pdf": convert2Pdf,
    "fileName": fileInfo.name, 
    "fileSize": fileInfo.size
  }

  // 获取文件上传地址
  const getESignUploadUrl = '/v1/files/getUploadUrl';

  try {
    const postReqESignRes = await httpESignUtil.postReqESign(getESignUploadUrl, reqBodyData);
    if (postReqESignRes.code !== 0) throw('获取上传链接错误');

    // e签宝 上传文件 url
    const eSignUploadFileUrl = postReqESignRes['data']['uploadUrl'];
    // 上传文件到 e签宝 put方式上传
    const putReqESignRes = await httpESignUtil.putReqESign(eSignUploadFileUrl, realFile, contentType, contentMd5);

    return putReqESignRes.errCode === 0 ? postReqESignRes['data']['fileId'] : null;
  } catch (error) {
    throw error;
  }
}
