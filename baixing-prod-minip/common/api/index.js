import httpRequest from './httpRequest';
import commonConfig from '@/common/config';

const serverBaseUrl = `${ commonConfig[commonConfig.env].serverBaseUrl }/api`;

export default {
  // 拉取个人信息
  fetchUserInfoApi: () => httpRequest(`${ serverBaseUrl }/session`),
  // 获取企业认证短信验证码
  getEnterpriseApproveSMSCode: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/code`, param, 'post'),
  // 根据关键字搜索企业列表
  searchEnterpriseList: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/api/search`, param),
  // 设置用户企业信息
  setEnterpriseInfo: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/set/info`, param, 'post'),
  // 提交用户企业银行汇款验证信息
  postEnterpriseBankVerifyInfo: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/pay/cert`, param, 'post'),
  // 获取用户企业银行汇款验证信息
  getEnterpriseBankVerifyInfo: () => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/cert`),
  // 删除企业认证信息
  delEnterpriseVerifyInfo: () => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/cert/delete`, {}, 'post'),
  // 获取用户企业信息
  getEnterpriseInfo: () => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/base`),
  // 获取银行列表
  getBankList: () => httpRequest(`${ serverBaseUrl }/v2/common/bank/list`),
  // 获取腾讯人脸核身「E证通」EidToken
  getQcloudFaceVerifyEidToken: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/ecard/token`, param),
  // 获取腾讯人脸核身「E证通」认证结果
  getQcloudFaceVerifyEidResult: param => httpRequest(`${ serverBaseUrl }/v2/user/enterprise/ecard/result`, param),

  // 获取应用说明信息
  getAppConfigInfoApi: () => httpRequest(`${ serverBaseUrl }/v2/baixing/config`),
  // 获取官方客服信息
  getOfficialCustomerApi: () => httpRequest(`${ serverBaseUrl }/v2/enterprise/customer`),
  // 获取地区列表
  getRegionListApi: () => httpRequest(`${ serverBaseUrl }/v2/districts`),
  // 获取案件类型列表
  getCaseTypeListApi: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/tags`, param),
  // 获取法律中心案源列表
  getCauseSourceListApi: param => httpRequest(`${ serverBaseUrl }/v2/demand/all/page`, param),
  // 获取当前位置城市信息
  getCurLocCityInfoApi: param => httpRequest(`${ serverBaseUrl }/location`, param),
  // 获取当前位置城市信息 v2
  getLocCityInfoApi: param => httpRequest(`${ serverBaseUrl }/v2/location`, param),
  // 获取案源订单类型列表
  getCauseSourceOrderTypeApi: param => httpRequest(`${ serverBaseUrl }/v2/order/enterprise/demand/types`, param),
  // 获取案源订单发布类型列表
  getCauseSourceOrderTypeTreeApi: () => httpRequest(`${ serverBaseUrl }/v2/demand/tree/types`),
  // 发布案源订单
  createCauseSourceOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/demand/order`, param, 'post'),
  // 获取案源订单详情
  getCauseSourceOrderDetailApi: param => httpRequest(`${ serverBaseUrl }/v2/demand`, param),
  // 获取案源订单竞争律师
  getCauseSourceOrderCompeteLawyerListApi: param => httpRequest(`${ serverBaseUrl }/v2/demand/lawyers`, param),
  // 获取案源订单 电话咨询 分类列表
  getCauseSourceOrderTelAskCategoryApi: () => httpRequest(`${ serverBaseUrl }/v2/get/telephone/counseling/tag`),
  // 获取案源订单 委托打官司 分类列表
  getCauseSourceOrderEntrustCategoryApi: () => httpRequest(`${ serverBaseUrl }/v2/lawyer/case/tags`),
  // 获取云盘文件列表
  getCloudStorageFileListApi: param => httpRequest(`${ serverBaseUrl }/v2/app/file/page`, param),
  // 上传云盘文件
  postCloudStorageFileApi: param => httpRequest(`${ serverBaseUrl }/v2/app/file`, param, 'post'),
  // 删除云盘文件
  delCloudStorageFileApi: param => httpRequest(`${ serverBaseUrl }/v2/app/file`, param, 'delete'),
  // 获取更新联系人手机号码
  getUpdateContactMobileSMSCodeApi: param => httpRequest(`${ serverBaseUrl }/v2/user/call/phone/code`, param, 'post'),
  // 更新联系人手机号码
  updateContactMobileApi: param => httpRequest(`${ serverBaseUrl }/v2/user/call/phone`, param, 'put'),
  // 获取服务过的律师
  getServedLawyerApi: param => httpRequest(`${ serverBaseUrl }/called/lawyer/page`, param),
  // 支付订单
  payOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/payment`, param, 'post'),
  // 获取 企业vip 套餐列表
  getVipEnterpriseServeApi: param => httpRequest(`${ serverBaseUrl }/v2/new/husbandman/enterprise/vip/list`, param),
  // 获取 企业vip 套餐评论列表
  getVipEnterpriseServeCommentApi: () => httpRequest(`${ serverBaseUrl }/v2/get/virtual/evaluate/data`),
  // 创建 企业vip 套餐支付订单
  postVipEnterpriseServeOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/create/husbandman/enterprise`, param, 'post'),
  // 创建销售分享 企业vip 套餐优惠表单
  sellerCreateShareVipEnterpriseServeFormApi: param => httpRequest(`${ serverBaseUrl }/v2/sales/share/vip/form`, param, 'post'),
  // 获取销售分享 企业vip/律师vip 套餐优惠表单详情
  getSellerShareFormDetailApi: param => httpRequest(`${ serverBaseUrl }/v2/get/sales/side/share`, param),
  // 获取 律师vip 套餐列表
  getVipLawyerServeApi: () => httpRequest(`${ serverBaseUrl }/v2/optimization/plan/list`),
  // 获取 案源vip 套餐列表（针对小程序）
  getVipLawyerServeMinipApi: () => httpRequest(`${ serverBaseUrl }/v2/optimization/plan/small/program/list`),
  // 创建销售分享 律师vip 套餐优惠表单
  sellerCreateShareVipLawyerServeFormApi: param => httpRequest(`${ serverBaseUrl }/v2/sales/share/optimization/form`, param, 'post'),
  // 创建 律师vip 套餐支付订单
  postVipLawyerServeOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/order/guarantee`, param, 'post'),
  // 获取 案源vip 套餐列表
  getVipCaseSourceServeApi: () => httpRequest(`${ serverBaseUrl }/v2/source/match/package/list`),
  // 创建销售分享 案源vip 套餐优惠表单
  sellerCreateShareVipCaseSourceServeFormApi: param => httpRequest(`${ serverBaseUrl }/v2/sales/share/source/match/form`, param, 'post'),
  // 创建 案源vip 套餐支付订单
  postVipCaseSourceServeOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/source/start/match`, param, 'post'),
  // 搜索律师
  searchLawyerApi: param => httpRequest(`${ serverBaseUrl }/v2/search/lawyer`, param),

  // 获取 客服创建案源订单详情
  getPayCauseOrderDetailApi: param => httpRequest(`${ serverBaseUrl }/v2/demand/order/share/get`, param),
  // 创建 客服创建案源 支付订单
  postPayCauseOrderApi: param => httpRequest(`${ serverBaseUrl }/v2/demand/order/share/create`, param, 'post'),

  // 发布 动态
  postDynamicApi: param => httpRequest(`${ serverBaseUrl }/question`, param, 'post'),
  // 获取首页 tab 标签导航列表
  getDynamicTabTagListApi: param => httpRequest(`${ serverBaseUrl }/question/tags`, param),
  // 获取首页动态列表
  getDynamicDataListApi: param => httpRequest(`${ serverBaseUrl }/question/page`, param),
  // 动态点赞
  postDynamicLikeApi: param => httpRequest(`${ serverBaseUrl }/like`, param, 'post'),
  // 动态取消点赞
  postDynamicUnLikeApi: param => httpRequest(`${ serverBaseUrl }/unlike`, param, 'post'),
  // 获取动态详情
  getDynamicDetailApi: param => httpRequest(`${ serverBaseUrl }/question`, param),
  // 获取动态一级评论 ids
  getDynamicCommentIdsApi: param => httpRequest(`${ serverBaseUrl }/question/comment/one/ids`, param, 'post'),
  // 获取动态评论列表
  getDynamicCommentListApi: param => httpRequest(`${ serverBaseUrl }/question/comments`, param, 'post'),
  // 发送动态的一级评论（父评论）
  postDynamicCommentApi: param => httpRequest(`${ serverBaseUrl }/question/comment`, param, 'post'),
  // 发送动态评论的二级评论（子评论）
  postDynamicSubCommentApi: param => httpRequest(`${ serverBaseUrl }/question/reply/comment`, param, 'post'),

  // 获取 tabbar find 律师列表
  getFindLawyerList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/index/page2`, param),
  // 获取 tabbar find 推荐律师列表
  getFindNearbyLawyerList: param => httpRequest(`${ serverBaseUrl }/v2/lawyer/nearby`, param),

  // 获取 律师广告位 数据
  getLawyerAdvertSeatData: param => httpRequest(`${ serverBaseUrl }/v2/common/get/advertisement`, param),
};
