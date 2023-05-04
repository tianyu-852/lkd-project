import httpRequest from './httpRequest';
import commonConfig from '@/common/config';

// const serverBaseUrl = `https://api.lawkd.com/api`;
const serverBaseUrl = `${ commonConfig[commonConfig.env].serverBaseUrl }/api`;

export default {
  // 获取登录验证码
  getLoginSMSCode: param => httpRequest(`${ serverBaseUrl }/v2/login/sms/code`, param, 'post'),
  // 用户登录
  userLogin: param => httpRequest(`${ serverBaseUrl }/v2/login/sms`, param, 'post'),
  // 拉取用户信息
  fetchUserInfo: () => httpRequest(`${ serverBaseUrl }/v2/get/customer/user/info`),
  // 获取签署合同模板列表
  getSignContractList: param => httpRequest(`${ serverBaseUrl }/v2/contract/template/list`, param),
  // 获取合同模板详情
  getContractTmpDetail: param => httpRequest(`${ serverBaseUrl }/v2/contract/sign/detail`, param),
  // 获取合同订单详情
  getContractOrderDetail: param => httpRequest(`${ serverBaseUrl }/v2/contract/order/detail`, param),
  // 创建客户VIP信息
  createClientVipInfo: param => httpRequest(`${ serverBaseUrl }/v2/add/contract/order`, param, 'post'),
  // 创建客户企业信息
  createClientCompanyInfo: param => httpRequest(`${ serverBaseUrl }/v2/add/contract/enterprise/info`, param, 'post'),
  // 获取合同列表
  getContractList: param => httpRequest(`${ serverBaseUrl }/v2/contract/order/list`, param),
  // 提交合同打款图片
  postContractPayImg: param => httpRequest(`${ serverBaseUrl }/v2/upload/contract/screenshots`, param, 'post'),
  // 财务提交审核
  financePostCheck: param => httpRequest(`${ serverBaseUrl }/v2/contract/financial/audit`, param, 'post'),
  // 获取团队列表
  getTeamMemberList: param => httpRequest(`${ serverBaseUrl }/v2/get/team/list`, param),
  // 获取添加销售验证码
  getPlusSellerSMSCode: param => httpRequest(`${ serverBaseUrl }/v2/send/sales/sms`, param, 'post'),
  // 添加团队销售人员
  plusTeamSeller: param => httpRequest(`${ serverBaseUrl }/v2/add/team`, param, 'post'),
  // 删除团队销售人员
  delTeamSeller: param => httpRequest(`${ serverBaseUrl }/v2/del/team/user`, param, 'post'),
  // 获取 E签宝签署文件 fileId
  createESignFile: param => httpRequest(`${ serverBaseUrl }/v2/sign/v3/create/file/template`, param, 'post'),
  // 发起 E签宝在线签署
  launchESignFlow: param => httpRequest(`${ serverBaseUrl }/v2/sign/v3/create`, param, 'post'),
  // 获取快递名称
  getExpressName: param => httpRequest(`${ serverBaseUrl }/v2/get/courier/name`, param),
  // 添加快递信息
  createExpressInfo: param => httpRequest(`${ serverBaseUrl }/v2/contract/add/courier`, param, 'post'),
  // 获取快递信息
  getExpressDetail: param => httpRequest(`${ serverBaseUrl }/v2/get/delivery/information`, param),
  // 获取合同模板列表
  getContractTmpList: param => httpRequest(`${ serverBaseUrl }/v2/contract/true/template/list`, param),
  // 获取案源订单类型列表
  getCauseSourceTypeList: () => httpRequest(`${ serverBaseUrl }/v2/demand/tree/types`),
  // 支付订单
  payOrder: param => httpRequest(`${ serverBaseUrl }/v2/payment`, param, 'post'),
  // 创建案源订单
  createCauseSource: param => httpRequest(`${ serverBaseUrl }/v2/demand/order`, param, 'post'),
  // 获取律师地区列表
  getLawyerRegionList: () => httpRequest(`${ serverBaseUrl }/v2/districts`),
  // 获取分类列表
  getCategoryList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/tags`, param),
  // 获取云盘文件列表
  getCloudStorageFileList: param => httpRequest(`${ serverBaseUrl }/v2/app/file/page`, param),
  // 上传云盘文件
  postCloudStorageFile: param => httpRequest(`${ serverBaseUrl }/v2/app/file`, param, 'post'),
  // 删除云盘文件
  delCloudStorageFile: param => httpRequest(`${ serverBaseUrl }/v2/app/file`, param, 'delete'),
  // 获取套餐 vip 分享列表
  getShareVipList: param => httpRequest(`${ serverBaseUrl }/v2/get/all/vip/list`, param),
  // 获取套餐 vip 分享小程序码
  getShareVipQRcode: param => httpRequest(`${ serverBaseUrl }/v2/get/vip/qrcode`, param),
  // 获取套餐分享订单列表
  getPriceShareOrderList: param => httpRequest(`${ serverBaseUrl }/v2/get/sales/side/share/list`, param),
  // 获取银行账户信息
  getBankAccountInfo: param => httpRequest(`${ serverBaseUrl }/v2/get/brought/account`, param),
  // 获取用户 openId
  getUserOpenId: param => httpRequest(`${ serverBaseUrl }/v2/user/set/wechat/openid`, param, 'post'),
  // 获取加盟商活动 数据
  getAllianceActivity: param => httpRequest(`${ serverBaseUrl }/v2/alliance/have`, param),
  // 获取加盟商活动 数据列表
  getAllianceActivityList: param => httpRequest(`${ serverBaseUrl }/v2/sales/share/list`, param),
  // 创建合同订单
  createContractOrder: param => httpRequest(`${ serverBaseUrl }/v2/sales/contract/order/create`, param, 'post'),
  // 获取合同订单编号列表
  getContractOrderSerialNumList: param => httpRequest(`${ serverBaseUrl }/v2/sales/contract/order/no/list`, param),
  // 搜索企业列表
  searchEnterpriseList: param => httpRequest(`${ serverBaseUrl }/v2/sales/enterprise/search`, param),
  // 获取服务套餐列表
  getContractServeList: param => httpRequest(`${ serverBaseUrl }/v2/sales/get/contract/list`, param),
};
