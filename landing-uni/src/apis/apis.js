import { request } from '../request.js'

//短信验证码注册
export function getLoginSms(data,header) {
	return request("api/v2/register/sms", data, 'POST',header)
}
//短信验证码登录
export function sendLoginSms(data,header) {
	return request("api/login/sms", data, 'POST',header)
}
//
export function sendLoginSmsCode(data,header) {
	return request('api/login/sms/code', data,'POST',header)
}
//打开下载页
export function sendStatisticsDownloadPage(data,header) {
	return request('api/statistics/download/page', data,'POST',header)
}
//下载app
export function sendStatisticsDownload(data,header) {
	return request('api/statistics/download', data,'POST',header)
}
//v2短信验证码登录
export function sendRegisterSms(data,header) {
	return request("api/v2/login/sms", data, 'POST',header)
}
//v2注册登录
export function sendRegisterSmsCode(data,header) {
	return request("api/v2/login/sms/code", data, 'POST',header)
}
//获取用户信息
export function getUser(data,header) {
	return request("api/v2/user", data,'',header)
}
//创建保障计划订单
export function getGuaranteeOrder(data,header) {
	return request("api/v2/order/guarantee", data, 'POST',header)
}
//保障计划退款
export function getRefundGuarantee(data,header) {
	return request("api/v2/order/guarantee/refund", data, 'POST',header)
}
//企业端获取vip信息
export function getVipPrice(data,header) {
	return request("api/v2/enterprise/vip", data,'GET',header)
}
//创建企业会员订单
export function getVipOrder(data,header) {
	return request("api/v2/order/enterprise/vip", data,'POST',header)
}
//获取推荐律师列表
// export function getRecommendLawyers(data,header){
// 	return request("api/v2/recommend/lawyers", data,'GET',header)
// }
//H5微信登录
export function getH5WeChatSDK(data,header) {
	return request("api/config/wechat/js-sdk", data,'GET',header)
}
//获取律师详情页
export function getLawyerPage(data,header) {
	return request('api/v2/lawyer', data,'GET',header)
}
//获取企业端用户信息
export function getEnterpriseUser(data,header) {
	return request("api/v2/user/enterprise", data,'GET',header)
}

// 获取模板协议信息
export function getProtocolTmpApi(data,header) {
	return request("api/v2/web/agreement/detail", data, 'GET', header)
}

// 获取用户信息
export function getUserInfoApi(data,) {
	return request("api/v2/user", data, 'GET')
}

// 律师报名案源合作
export function signupCauseSourceUnionApi(data,header) {
	return request("api/v2/common/adv/lawyer/click", data, 'POST', header)
}
