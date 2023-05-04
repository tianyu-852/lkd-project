import httpRequest from './httpRequest';
import commonConfig from '@/common/config';

// const serverBaseUrl = `https://api.lawkd.com/api`;
// const serverBaseUrl  = `https://devapi.lawkd.com/api`;
const serverBaseUrl = `${ commonConfig[commonConfig.env].serverBaseUrl }/api`;

export default {
  // 用户登录
  userLogin: param => httpRequest(`${ serverBaseUrl }/v2/login/wechat/mini-program`, param, 'post'),
  // 拉取用户信息
  fetchUserInfo: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise`, param),
  // 更新用户头像
  updateUserAvatar: param => httpRequest(`${ serverBaseUrl }/v2/user/avatar`, param, 'put'),
  // 获取首页头部 banner 列表
  getIndexBannerList: () => httpRequest(`${ serverBaseUrl }/v2/enterprise/index/banner`),
  // 获取应用说明信息
  getAppExplainInfo: () => httpRequest(`${ serverBaseUrl }/v2/enterprise/config`),
  // 获取严选律师列表
  getStrictSelectLawyerList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/strict`, param),
  // 获取今日动态列表
  getTodayDynamicList: param => httpRequest(`${ serverBaseUrl }/v2/order/today`, param),
  // 获取服务订单列表
  // getServerOrderList: param => httpRequest(`${ serverBaseUrl }/v2/demand/grab/order/page`, param),
  getServerOrderList: param => httpRequest(`${ serverBaseUrl }/v2/demand/all/page`, param),
  // 获取服务订单详情
  getServerOrderDetail: param => httpRequest(`${ serverBaseUrl }/v2/demand`, param),
  // 获取服务订单竞价列表
  getServerOrderBidList: param => httpRequest(`${ serverBaseUrl }/v2/demand/lawyers`, param),
  // 获取服务订单类型
  getServerOrderTypeList: () => httpRequest(`${ serverBaseUrl }/v2/order/enterprise/demand/types`),
  // 获取普法知识列表
  getPopLawKnowledgeList: param => httpRequest(`${ serverBaseUrl }/v2/law/mandate/expand`, param),
  // 获取地区列表
  getRegionList: () => httpRequest(`${ serverBaseUrl }/v2/districts`),
  // 获取当前位置城市信息
  getCurLocCityInfo: param => httpRequest(`${ serverBaseUrl }/v2/location`, param),
  // 获取案件类型列表
  getCaseTypeList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/tags`, param),
  // 获取律师详情
  getLawyerDetail: param => httpRequest(`${ serverBaseUrl }/v2/lawyer`, param),
  // 获取律师好评列表
  getLawyerEvaluateList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/evaluate/page`, param),
  // 获取律师动态列表
  getLawyerDynamicList: param => httpRequest(`${ serverBaseUrl }/user/home/reply/page`, param),
  // 获取系统提供的充值选项列表
  getSysPayOptionList: () => httpRequest(`${ serverBaseUrl }/v2/recharge/config2`),
  // 获取服务规格列表
  getServerSpecList: () => httpRequest(`${ serverBaseUrl }/v2/enterprise/vip2`),
  // 获取服务权限信息
  getServerRightsInfo: () => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/privilege`),
  // 获取企业 vip 支付订单
  getServerSpecPayOrder: param => httpRequest(`${ serverBaseUrl }/v2/order/enterprise/vip`, param, 'post'),
  // 获取充值 支付订单
  getRechargePayOrder: param => httpRequest(`${ serverBaseUrl }/v2/recharge/order`, param, 'post'),
  // 支付订单
  payOrder: param => httpRequest(`${ serverBaseUrl }/v2/payment`, param, 'post'),
  // 获取账单列表
  getAccountBillList: param => httpRequest(`${ serverBaseUrl }/v2/bill/page`, param),
  // 获取更新支付密码验证码
  getUpdatePayPwordVerifyCode: param => httpRequest(`${ serverBaseUrl }/v2/user/deal/password/code`, param, 'post'),
  // 设置支付密码
  setPayPassword: param => httpRequest(`${ serverBaseUrl }/v2/user/deal/password`, param, 'put'),
  // 发起账户提现
  launchAccountWithdraw: param => httpRequest(`${ serverBaseUrl }/v2/withdraw`, param, 'post'),
  // 获取企业认证信息
  getCompanyProveInfo: () => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/base`),
  // 根据企业 id 获取企业认证信息
  getIdCompanyProveInfo: param => httpRequest(`${ serverBaseUrl }/v2/customer/enterprise/detail`, param),
  // 更新企业认证信息
  updateCompanyProveInfo: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/base`, param, 'put'),
  // 识别企业营业执照信息
  ocrCompanyLicenseInfo: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/business/license/ocr`, param, 'post'),
  // 获取律师认证配置信息
  getLawyerProveConfigInfo: () => httpRequest(`${ serverBaseUrl }/v2/lawyer/auth/config`),
  // 获取官方客服信息
  getOfficKefuInfo: () => httpRequest(`${ serverBaseUrl }/v2/enterprise/customer2`),
  // 获取官方客服二维码
  getOfficKefuQrcode: param => httpRequest(`${ serverBaseUrl }/v2/customer/wechat/image`, param),
  // 获取个人 vip 支付订单
  getPersonVipPayOrder: param => httpRequest(`${ serverBaseUrl }/order/vip`, param, 'post'),
  // 获取套餐 vip 分享列表
  getShareVipList: param => httpRequest(`${ serverBaseUrl }/v2/get/all/vip/list`, param),
  // 获取套餐 vip 分享小程序码
  getShareVipQRcode: param => httpRequest(`${ serverBaseUrl }/v2/get/vip/qrcode`, param),
  // 获取银行账户信息
  getBankAccountInfo: param => httpRequest(`${ serverBaseUrl }/v2/get/brought/account`, param),
  // 获取分享 vip 销售端销售标识
  getShareVipSellerFlag: () => httpRequest(`${ serverBaseUrl }/v2/get/sales/create/share`),
  // 获取价格分享 vip 信息
  getShareVipInfo: param => httpRequest(`${ serverBaseUrl }/v2/sales/share/vip`, param),
};
