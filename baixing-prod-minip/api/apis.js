import { request } from '../request.js'

//comment
//经纬度转城市
export function getLocation(data) {
	return request('api/location', data)
}
//忽略电话通话
export function getPhoneIgnored(data) {
	return request("api/order/call-phone/ignored", data, 'POST')
}
//问答详情
export function getQuestion(data) {
	return request("api/question", data)
}
//获取地区
export function getDistricts(data) {
	return request("api/districts", data)
}
//认证第一步 上传免冠照
export function getCertificateOne(data) {
	return request("api/lawyer/auth/avatar", data, 'POST')
}
//支付
export function getPay(data) {
	return request("api/v2/payment", data,"POST")
}
//小程序获取openid
export function getOpenId(data) {
	return request("api/login/wechat/mini-program/openid", data, 'POST')
}
//抖音小程序登录
export function getTTLogin(data) {
	return request("api/login/bytedance/mini-program", data, 'POST')
}
//快手小程序登录接口
export function getksLogin(data) {
	return request("api/login/kuaishou/mini-program", data, 'POST')
}
//微信小程序登录接口
export function getwxLogin(data) {
	return request("api/login/wechat/mini-program", data, 'POST')
}

//#ifdef H5
//提交H5绑定手机号
export function sendH5Bind(data) {
	return request("api/bind-mobile", data, 'POST')
}
//获取H5绑定手机号验证码
export function getH5BindCode(data) {
	return request("api/bind-mobile/sms", data, 'POST')
}
//H5微信登录
export function getH5Login(data) {
	return request("api/login/wechat/h5", data, 'POST')
}

//H5微信登录
export function getH5WeChatSDK(data) {
	return request("api/config/wechat/js-sdk", data)
}
//#endif
//创建充值订单
export function getCreateOrder(data) {
	return request("api/v2/recharge/order", data, 'POST')
}
//创建VIP订单
export function getVipOrder(data) {
	return request("api/order/vip", data, 'POST')
}
//短信验证码登录
export function sendLoginSms(data) {
	return request("api/login/sms", data, 'POST')
}
//发送短信验证码
export function sendLoginSmsCode(data) {
	return request("api/login/sms/code", data, 'POST')
}
//需求订单详情
export function getNeedOrderDetail(data) {
	return request("api/v2/demand", data)
}
//获取律师报价列表
export function getNeedOrderList(data) {
	return request("api/v2/demand/lawyers", data)
}
//获取案源信息类型
export function getCaseType(data) {
	return request("api/v2/demand/case/source/types", data)
}
//获取抢单类型
export function getGrabOrderType(data) {
	return request("api/v2/demand/grab/order/types", data)
}
//获取抢单分页
export function getGrabOrderList(data) {
	return request("api/v2/demand/grab/order/page", data)
}
//获取案源分页
export function getCaseList(data) {
	return request("api/v2/demand/case/source/page", data)
}
//获取电话通话申请分页
export function getCallPhonePage(data) {
	return request("api/order/call-phone/page", data)
}
//申请电话通话
export function sendCallPhone(data) {
	return request("api/order/call-phone/apply", data,"POST")
}
//获取在线律师分页
export function getLawyerEnableCallPage(data) {
	return request("api/lawyer/enable-call/page", data,"GET")
}
//订单评价申诉
export function sendOrderEvaluateComplaint(data) {
	return request("api/order/evaluate/complaint", data ,"POST")
}
//切换是否开通电话咨询
export function putUserEnablecall(data) {
	return request("api/user/enable-call", data,"PUT")
}
//获取IM订单列表样式的卡片信息
export function getOrderPageFromOrders(data) {
	return request("api/order/page/from-orders", data,"GET")
}
//获取顶部私信回复率高的律师
export function getUserReplyhighLawyers(data) {
	return request("api/user/reply-high/lawyers", data,"GET")
}
//获取顶部未解答问答
export function getQuestionUnansweredRandom(data) {
	return request("api/question/unanswered/random", data,"GET")
}
//我的页面混合订单轮播列表
export function getUserMixedOrders(data) {
	return request("api/user/mixed/orders", data,"GET")
}
//获取设置标签
export function getQuestionTagSet(data) {
	return request("api/question/tag/set", data,"GET")
}
//设置问答标签
export function putQuestionTagSet(data) {
	return request("api/question/tag/set", data ,"PUT")
}
//发送交换电话消息
export function sendImExchangeMobile(data) {
	return request("api/im/exchange/mobile", data ,"POST")
}
//获取交换电话状态
export function sendImMessageConfirmStatus(data) {
	return request("api/im/message-confirm/status", data ,"POST")
}
//确认交换电话
export function sendImMessageConfirmSubmit(data) {
	return request("api/im/message-confirm/submit", data ,"POST")
}
//评论转文字
export function getRecordingToText(data) {
	return request("api/question/comment/recording/text", data,"GET")
}
//选择律师
export function sendDemandLawyerChoose(data) {
	return request("api/demand/lawyer/choose", data ,"POST")
}
//律师竞标/ 重新编辑
export function sendDemandLawyer(data) {
	return request("api/demand/lawyer", data ,"POST")
}
//需求竞标列表
export function getDemandLawyers(data) {
	return request("api/demand/lawyers", data,"GET")
}
//需求详情
export function getDemand(data) {
	return request("api/demand", data,"GET")
}
//需求分页
export function getDemandPage(data) {
	return request("api/demand/page", data,"GET")
}
//添加需求
export function sendDemand(data) {
	return request("api/demand", data ,"POST")
}
//需求类型列表
export function getDemandTypes(data) {
	return request("api/demand/types", data,"GET")
}
//获取在线律师列表
export function getLawyerEnableCallList(data) {
	return request("api/lawyers/enable-call", data,"GET")
}
//申请结案
export function sendFundraisingEndApply(data) {
	return request("api/fundraising/end/apply", data ,"POST")
}
//参与众筹分页
export function getFundraiseJoinPage(data) {
	return request("api/fundraise/join/page", data,"GET")
}
//众筹退款
export function sendFundraisingRefund(data) {
	return request("api/fundraising/refund", data ,"POST")
}
//获取众筹推荐位页面信息
export function getFundraiseRASv2(data) {
	return request("api/fundraising/recommend/auth/something/v2", data,"GET")
}
//放弃竞标
export function delFundraisingBid(data) {
	return request("api/fundraising/bid", data ,"DELETE")
}
//竞选/重新编辑
export function sendFundraisingBid(data) {
	return request("api/fundraising/bid", data ,"POST")
}
//获取竞标对话框信息
export function getFundraiseBidDialog(data) {
	return request("api/fundraising/bid/dialog", data,"GET")
}
//众筹竞选规则
export function getFundraiseBidRule(data) {
	return request("api/fundraising/bid/rule", data,"GET")
}
//投票
export function sendFundraisingBidVote(data) {
	return request("api/fundraising/bid/vote", data ,"POST")
}
//获取律师竞标分页
export function getFundraiseBidPage(data) {
	return request("api/fundraising/bid/page", data,"GET")
}
//获取众筹分页
export function getFundraisePageV2(data) {
	return request("api/fundraise/page/v2", data,"GET")
}
//生成转账订单
export function getPayLawOrder(data) {
	return request("api/v2/transfer/order", data,"POST")
}
//获取支付信息
export function getPayOrder(data) {
	return request("api/payment", data,"GET")
}
//提醒用户确认订单
export function sendOrderUserSubmitRemind(data) {
	return request("api/order/user/submit/remind", data ,"POST")
}
//提醒用户评价订单
export function sendOrderUserEvaluateRemind(data) {
	return request("api/order/user/evaluate/remind", data ,"POST")
}
//提醒律师交付订单
export function sendOrderLawyerSubmitRemind(data) {
	return request("api/order/lawyer/submit/remind", data ,"POST")
}
//确认订单
export function sendOrderSubmit(data) {
	return request("api/order/submit", data ,"POST")
}
//确认订单
export function sendDemandOrderSubmit(data) {
	return request("api/demand/user/submit", data ,"POST")
}
//用户与律师拨打电话
export function sendImUserLawyerCall(data) {
	return request("api/order/phone", data ,"POST")
}
//律师回拨
export function sendOrderCallback(data) {
	return request("api/order/callback", data ,"POST")
}
//根据订单拨打电话
export function sendOrderCallPhone(data) {
	return request("api/v2/call/phone", data ,"POST")
}
//获取订单录音列表
export function getOrderRecords(data) {
	return request("api/v2/order/records", data)
}
//客服介入
export function sendOCSIntervention(data) {
	return request("api/order/customer-service/intervention", data ,"POST")
}
//获取顶部订单数量提示
export function getOrderNumbers(data) {
	return request("api/order/numbers", data ,"GET")
}
//创建律师认证收费订单
export function sendLawyerAuthOrder(data) {
	return request("api/lawyer/auth/order", data ,"POST")
}
//律师认证收费列表
export function getLawyerAuthPrices(data) {
	return request("api/lawyer/auth/prices", data ,"GET")
}
//提交律师求助说明
export function sendFLawyerWrite(data) {
	return request("api/fundraising/lawyer/write", data ,"POST")
}
//获取律师求助说明
export function getFLawyerWrite(data) {
	return request("api/fundraising/lawyer/write", data ,"GET")
}
//获取审理阶段
export function getFTrialStage(data) {
	return request("api/fundraising/trial-stage", data ,"GET")
}
//获取案件类型树形结构
export function getFCaseType(data) {
	return request("api/fundraising/case-type/tree", data ,"GET")
}
//获取随机客服信息
export function getUserRandomCustomer(data) {
	return request("api/user/random/customer", data ,"GET")
}
//修改创建人手机号码
export function putFRCreatorMobile(data) {
	return request("api/fundraising-registration/creator/mobile", data ,"PUT")
}
//获取发起众筹首页轮播图
export function getFRIndexBanners(data) {
	return request("api/fundraising-registration/index/banners", data ,"GET")
}
//提交案件众筹申请
export function sendFProgressItemsAuth(data) {
	return request("api/fundraising/progress/items/auth", data ,"POST")
}
//获取案件众筹进度
export function getFRProgressItems(data) {
	return request("api/fundraising/progress/items", data ,"GET")
}
//我帮助过人的列表
export function getFRHistoryPage(data) {
	return request("api/fundraising/history/page", data ,"GET")
}
//众筹捐款历史头部
export function getFRHistoryHeader(data) {
	return request("api/fundraising/history/header", data ,"GET")
}
//生成退还众筹诉讼费订单
export function sendFRLitigationCosts(data) {
	return request("api/fundraising/refund/litigation-costs", data ,"POST")
}
//律师推荐当事人确认提交
export function sendFRLawyerLitigantSubmit(data) {
	return request("api/fundraising-registration/lawyer/litigant/submit", data ,"POST")
}
//律师推荐求助登记信息
export function getFRLawyerLitigant(data) {
	return request("api/fundraising-registration/lawyer/litigant", data ,"GET")
}
//众筹证实
export function sendFundraingConfirm(data) {
	return request("api/fundraising/confirm", data ,"POST")
}
//取消点赞
export function delFundraingConfirmLike(data) {
	return request("api/fundraising/confirm/like", data ,"DELETE")
}
//点赞证实
export function sendFundraingConfirmLike(data) {
	return request("api/fundraising/confirm/like", data ,"POST")
}
//获取证实分页
export function getFundraingConfirmPage(data) {
	return request("api/fundraising/confirm/page", data ,"GET")
}
//获取众筹证实页面基础信息
export function getFundraingConfirmBase(data) {
	return request("api/fundraising/confirm/base", data ,"GET")
}
//获取众筹分页列表
export function getFundraingPage(data) {
	return request("api/fundraising/page", data ,"GET")
}
//获取推荐众筹列表
export function getFundraingRecommend(data) {
	return request("api/fundraising/recommend", data ,"GET")
}
//获取推荐众筹详情
export function getFundraising(data) {
	return request("api/fundraising", data ,"GET")
}
//提交众筹详情分享次数+1
export function setShareNum(data) {
	return request("api/fundraising/share/count", data ,"POST")
}
//获取推荐众筹详情捐款订单 
export function getFundraisingOrder(data) {
	return request("api/fundraising/record", data ,"POST")
}
//获取众筹推荐位信息
export function getRecommendSomething(data) {
	return request("api/fundraising/recommend/auth/something", data ,"GET")
}
//提交申请众筹推荐位
export function setRecommendApply(data) {
	return request("api/fundraising/recommend/auth", data ,"POST")
}
//众筹banner
export function getFundraiseBanners(data) {
	return request("api/fundraise/banners", data ,"GET")
}
//获取平台公告轮播
export function getAnnouncements(data) {
	return request("api/announcements", data ,"GET")
}
//确认众筹报价
export function putFundraiseQuote(data) {
	return request("api/fundraising/quote", data ,"PUT")
}
//确认律师
export function putFundraiseLawyer(data) {
	return request("api/fundraising/lawyer/submit", data ,"PUT")
}
//获取报价单详情-律师
export function getFundraiseQuoteLawyer(data) {
	return request("api/fundraising/quote/lawyer", data ,"GET")
}
//获取报价单详情-用户
export function getFundraiseQuoteUser(data) {
	return request("api/fundraising/quote/user", data ,"GET")
}
//获取众筹列表详情的评论随机文案
export function getFundraiseCommentRandomText(data) {
	return request("api/fundraising/comment/random", data ,"GET")
}
//提交众筹列表详情的评论
export function setFundraiseComment(data) {
	return request("api/fundraising/comment", data ,"POST")
}
//获取众筹列表详情的评论列表分页
export function getFundraiseCommentList(data) {
	return request("api/fundraising/comment/page", data ,"GET")
}
//获取众筹列表详情的评论列表分页
export function getFundraiseReport(data) {
	return request("api/fundraising/report", data ,"POST")
}
//我的众筹列表
export function getFundraisePage(data) {
	return request("api/fundraise/page", data ,"GET")
}
//获取H5人脸识别验证码
export function getCVANumber(data) {
	return request("api/common/video-auth/number", data ,"GET")
}
//当事人H5视频人脸识别
export function sendFRLitigantPersonVideoVerify(data) {
	return request("api/fundraising-registration/litigant/person/video/verify", data ,"POST")
}
//律师推荐提交资料
export function sendFRLitigantCreatorLawyerSubmit(data) {
	return request("api/fundraising-registration/creator-lawyer/submit", data ,"POST")
}
//获取求助登记信息
export function getFRLitigantCreator(data) {
	return request("api/fundraising-registration/creator", data ,"GET")
}
//发送当事人手机验证码
export function sendFRLitigantCreatorSubmit(data) {
	return request("api/fundraising-registration/creator/submit", data ,"POST")
}
//发送创建人手机验证码
export function sendFRLitigantCreatorSMS(data) {
	return request("api/fundraising-registration/creator/sms", data ,"POST")
}
//获取众筹角色列表
export function getFRLitigantRoles(data) {
	return request("api/fundraising-registration/roles", data ,"GET")
}

//当事人提交资料
export function sendFRLitigantSubmit(data) {
	return request("api/fundraising-registration/litigant/submit", data ,"POST")
}

//获取当事人求助登记信息
export function getFRLitigant(data) {
	return request("api/fundraising-registration/litigant", data ,"GET")
}

//发送当事人手机验证码
export function sendFRLitigantSMS(data) {
	return request("api/fundraising-registration/litigant/sms", data ,"POST")
}

//获取轮播banner图
export function getFRbanners(data) {
	return request("api/fundraising-registration/banners", data ,"GET")
}

//轮询诉讼登记的头部轮播
export function getFRPoll(data) {
	return request("api/fundraising-registration/poll", data ,"GET")
}

//发送修改交易密码短信
export function sendSMS(data) {
	return request("api/user/deal-password/sms", data ,"POST")
}
//获取客服电话
export function getServePhone(data) {
	return request("api/common/customer-service/mobile", data )
}
//提现
export function getWithdraw(data){
	return request("api/withdraw", data,"POST")
}
//设置交易密码
export function setTransactionPassword(data){
	return request("api/user/deal-password", data,"PUT")
}
//律师自动回复
export function LawyerAutoReply(data){
	return request("api/im/auto-reply", data,"POST")
}
//客服自动回复
export function serveAutoReply(data){
	return request("api/v2/customers/reply", data)
}
//im列表
export function getUsers(data) {
	return request("api/im/users", data,"POST")
}
//im群聊列表
export function getGroupsList(data) {
	return request("api/v2/im/groups", data,"POST")
}
//拉黑 / 取消拉黑用户
export function getBlack(data) {
	return request("api/user/block", data,"POST")
}
//获取黑名单列表
export function getBlackList(data) {
	return request("api/user/block/page", data, )
}
//获取个人主页回复列表
export function getUserReplyList(data) {
	return request("api/user/home/reply/page", data, )
}
//获取关注列表
export function getFollowList(data) {
	return request("api/user/follow/page", data, )
}

//获取粉丝列表
export function getFaceList(data) {
	return request("api/user/fans/page", data, )
}
//悬赏问答分页
export function getBountyList(data) {
	return request("api/question/reward/page", data, )
}
//获取充值活动列表
export function getActivityPay(data) {
	return request("api/v2/recharge/activities", data, )
}
//我的律师
export function getMyLawyer(data) {
	return request("api/user/lawyer/page", data, )
}
//订单详情
export function getOrderDetails(data) {
	return request("api/v2/order", data, )
}
//删除我的评论
export function delComment(data) {
	return request("api/question/comment/delete", data, 'POST')
}
//获取我的评论列表
export function getMyComment(data) {
	return request("api/message/question/comment", data)
}
//获取我的回复列表
export function getMyReply(data) {
	return request("api/message/question/reply", data)
}
//获取我的点赞
export function getMyLike(data) {
	return request("api/message/question/like", data)
}
//删除我的问答
export function delQuestion(data) {
	return request("api/question/delete", data, 'POST')
}

//获取我的回答
export function getMyQuestion(data) {
	return request("api/message/question", data)
}
//获取我的收藏
export function getCollection(data) {
	return request("api/message/question/collection", data)
}
//获取最近浏览分页
export function getHistory(data) {
	return request("api/message/question/history", data)
}
//编辑律师个人信息
export function setLawyerInfo(data) {
	return request("api/user/lawyer", data, "PUT")
}
//编辑个人信息
export function setMyInfo(data) {
	return request("api/user/update", data, "POST")
}
//获取封面列表
export function getPageData(data) {
	return request("api/user/backgrounds", data)
}
//获取编辑个人信息
export function getUserInfo(data) {
	return request("api/user", data)
}
//获取隐私协议 用户协议 充值协议
export function getUserProtocol(data) {
	return request("api/common/document", data)
}
//提交反馈
export function getReaction(data) {
	return request("api/suggest", data, "POST")
}
//个人主页
export function getMyData(data) {
	return request("api/session", data)
}
//找律师bannner
export function getFindBanner(data) {
	return request("api/lawyer/config", data)
}
//条件匹配律师
export function getLawyerList(data) {
	return request("api/lawyer/hot/page", data)
}

//匹配服务过的律师
export function getServeLawyer(data) {
	return request("api/called/lawyer/page", data)
}

//匹配律师
export function getLawyer(data) {
	return request("api/lawyer/match/page", data)
}

//收藏问答
export function getFavorites(data) {
	return request("api/question/collect", data, "POST")
}
//取消收藏问答
export function getUnFavorites(data) {
	return request("api/question/uncollected", data, "POST")
}
//发表评论

export function getCommentD(data) {
	return request("api/question/comment", data, )
}
//发表评论

export function getPublish(data) {
	return request("api/question/comment", data, "POST")
}
//回复评论
export function getReply(data) {
	return request("api/question/reply/comment", data, "POST")
}
//获取一级评论ID
export function getOneId(data) {
	return request("api/question/comment/one/ids", data, "POST")
}
//获取二级评论ID
export function getTwoId(data) {
	return request("api/question/comment/two/ids", data, "POST")
}
//获取评论列表
export function getComment(data) {
	return request("api/question/comments", data, "POST")
}
//获取搜索结果
export function getSearchVal(data) {
	return request('api/search', data)
}
//点赞 
export function getLike(data) {
	return request('api/like', data, "POST")
}
//取消点赞 
export function getUnlike(data) {
	return request('api/unlike', data, "POST")
}
//关注或取消关注 
export function getAttention(data) {
	return request('api/user/follow', data, "POST")
}
//删除搜索历史记录
export function delHistorySearch(data) {
	return request('api/search/history/delete', data,"POST")
}
//获取搜索历史记录
export function getHistorySearch(data) {
	return request('api/search/history', data)
}
//获取热门搜索
export function getHotSearch(data) {
	return request('api/search/hot', data)
}
//获取首页tablist
export function getIndexTabList(data) {
	return request('api/question/tags',data)
}
//根据tablist获取tabcon
export function getIndexCon(data) {
	return request('api/question/page', data)
}
//发布所有标签
export function getFabuList(data) {
	return request('api/question/tags/detail',data)
}
//发布内容
export function getRelease(data) {
	return request('api/question', data, "POST")
}
//律师主页
export function getLawyerPage(data) {
	return request('api/user/home', data)
}
//获取未评级信息
export function getNoComment(data) {
	return request('api/order/no-evaluate', data)
}
//获取订单列表
export function getOrderList(data) {
	return request('api/v2/order/page', data)
}
//订单评价
export function getOrderEvaluate(data) {
	return request('api/order/evaluate', data, "POST")
}
//获取订单评价详情
export function getOrderEvaluateInfo(data) {
	return request('api/order/evaluate', data)
}
//取消订单
export function setCancelOrder(data) {
	return request("api/v2/order/cancel", data, "POST")
}
//获取电话号码
export function getPhone(data) {
	return request('api/order/phone', data, "POST")
}
//获取电话号码
export function sendPhone(data) {
	return request('api/order/lawyer/phone', data, "POST")
}
//倒计时30s
export function getThirtyTime(data) {
	return request('api/order/countdown', data, "POST")
}
//获取会员价格列表
export function getVipList(data) {
	return request('api/vip/detail', data)
}
//获取个人主页回复问题列表
export function getItsAnswer(data) {
	return request('api/user/home/question&reply/page', data)
}
//获取个人评价列表
export function getEvaluation(data) {
	return request('api/user/home/evaluation/page', data)
}
//获取众筹列表详情
export function getGrantsDetail(data) {
	return request('api/fundraising-registration', data)
}
//识别营业执证
export function upLoadLicense(data) {
	return request("api/v2/user/enterprise/business/license/ocr", data, "POST")
}
//获取用户基础信息
export function getEnterpriseInfo(data) {
	return request("api/v2/user/enterprise/base", data)
}
//修改企业基础信息
export function setEnterpriseInfo(data) {
	return request("api/v2/user/enterprise/base", data, "PUT")
}
//IM企业用户认证成功自动回复
export function getImUserEnterprise(data) {
	return request('api/v2/im/enterprise/user/auth/success',data)
}
//--消息--

//拨打号码给客服
export function getCustomerPhone(data) {
	return request('api/v2/call/phone/customer/service', data,'POST')
}
//获取聊天线下约谈是否确认状态
export function getInterviewState(data) {
	return request('api/fundraising-interview/submit', data)
}
//获取聊天线下约谈确认
export function setInterview(data) {
	return request('api/fundraising-interview/submit', data,'POST')
}
//提醒订单确认
export function setRemindlOrder(data) {
	return request("api/v2/order/submit/remind", data, "POST")
}
//获取聊天线下约谈确认抵达
export function setInterviewArrived(data) {
	return request('api/fundraising-interview/arrived/submit', data,'POST')
}
//--律师认证--
//律师认证提交表单退出最后一次信息
export function setLawyerType(data) {
	return request('api/lawyer/auth/lawyer-grade', data,'POST')
}
//
export function setLawyerSubmit(data) {
	return request('api/lawyer/auth/submit', data,'POST')
}
//律师认证获取表单未提交信息
export function getLawyerForm(data) {
	return request('api/lawyer/auth', data)
}
//律师认证提交表单信息
export function setLawyerForm(data) {
	return request('api/lawyer/auth/lawyer-tags&introduction', data,'PUT')
}
//律师认证获取学校列表
export function getSchoolList(data) {
	return request('api/school/search', data)
}
//律师认证身份信息修改
export function setLawyerIdCard(data) {
	return request('api/lawyer/auth/id-card', data,'POST')
}

//获取微信号
export function getWeChat(data) {
	return request("api/im/user/wechat", data)
}

//设置微信号
export function setWeChat(data) {
	return request("api/user/wechat-number", data,'PUT')
}

//发送自己的微信号
export function sendWeChat(data) {
	return request("api/im/me/wechat/send", data,'POST')
}

//提交求助说明-用户
export function setUserSeekHelp(data) {
	return request("api/fundraising/user/write", data,'POST')
}

//获取求助说明-用户
export function getUserSeekHelp(data) {
	return request("api/fundraising/user/write", data)
}

//获取首页众筹状态
export function getFundraiseStatus(data) {
	return request("api/fundraise/status", data)
}

//获取首页banner
export function getHomeBanner(data) {
	return request("api/question/index", data)
}

//生成入驻法律小铺订单
export function getLawyerStoreOrder(data) {
	return request("api/lawyer/store/order", data,'POST')
}

//获取律师法律小铺信息
export function getImCardStatus(data) {
	return request("api/im/card/status", data,'POST')
}
//获取多个电话申请的状态
export function getCallPhoneStatus(data) {
	return request("api/order/call-phone/status", data)
}
//获取客服微信二维码
export function getWeChatQrCode(data) {
	return request("api/v2/user/wechat/image", data)
}

//获取IM卡片状态
export function getLawyerStore(data) {
	return request("api/lawyer/store", data,'GET')
}

//修改法律小铺服务商品
export function setLawyerStore(data) {
	return request("api/lawyer/store/products", data,'PUT')
}

//修改法律小铺服务时间
export function setLawyerServiceTime(data) {
	return request("api/user/work-time", data,'PUT')
}

//创建法律小铺订单
export function getLawyerServiceOrder(data) {
	return request("api/order/lawyer/product", data,'POST')
}

//im消息确认订单
export function setServiceOrderSubmit(data) {
	return request("api/order/lawyer/submit", data,'POST')
}

//im消息取消订单
export function setServiceOrderCancel(data) {
	return request("api/order/cancel", data,'POST')
}

//im消息确认抵达
export function setServiceOrderArrived(data) {
	return request("api/order/user/arrived/submit", data,'POST')
}

//获取订单列表
export function getServiceOrderList(data) {
	return request("api/order/page", data)
}

//获取钱包收入明细列表
export function getWalletIncomeList(data) {
	return request("api/user/balance/detail/page", data)
}

//获取钱包收入总数
export function getWalletIncomeNum(data) {
	return request("api/user/balance/total-income", data)
}

//获取钱包详情
export function getWalletDetail(data) {
	return request("api/user/balance", data)
}

//im消息卡片详情
export function getMessageCard(data) {
	return request("api/im/card", data)
}

//获取banner
export function getBanner(data) {
	return request("api/banner", data)
}

//确认律师店铺通知
export function setBannerNotified(data) {
	return request("api/common/lawyer/store/notified", data, "POST")
}

//获取企业端需求类型列表
export function getEnterpriseDemand(data) {
	return request("api/v2/order/enterprise/demand/types", data)
}

// 充值页面配置
export function getRechargeConfig(data) {
	return request("api/v2/recharge/config", data)
}
// 获取客服信息
export function getEnterpriseCustomer(data) {
	return request("api/v2/enterprise/customer", data)
}
//获取主页列表V2
export function getHomeLawyerList(data) {
	return request("api/v2/lawyer/index/page2", data)
}
//获取
export function getLawyerStoreType(data) {
	return request("api/v2/lawyer/products", data)
}
//发布需求详情订单配置
export function getDisplayDemandTypes(data) {
	return request("api/v2/demand/tree/types", data)
}
//获取需求订单配置
export function getDemandConfig(data) {
	return request("api/v2/demand/config", data)
}
//创建需求订单
export function getDemandOrder(data) {
	return request("api/v2/demand/order", data, "POST")
}
//发布需求详情订单配置
export function getDemandOrderDisplay(data) {
	return request("api/v2/demand/display", data)
}
//律师列表配置
export function getLawyerListBanner(data) {
	return request("api/v2/lawyer/index/page/config", data)
}
//获取Vip活动详情
export function getVipDetail(data) {
	return request("api/vip/level/detail", data)
}
//获取聊天详情信息
export function getImCallDetail(data) {
	return request("api/v2/im/detail", data)
}
//快速抢单选择律师
export function sendLawyerChoose(data) {
	return request("api/v2/demand/choose/lawyer", data, "POST")
}
//根据订单拨打电话
export function getOrderCall(data) {
	return request("api/v2/call/phone", data, "POST")
}
//用户确认订单交付时间
export function sendOrderTimeSubmit(data) {
	return request("api/v2/order/due/time/user/submit", data, "POST")
}
//用户确认订单交付时间
export function getOrderListItem(data) {
	return request("api/v2/order/page/item", data)
}
//用户确认订单交付时间
export function getConfig(data) {
	return request("api/v2/baixing/config", data)
}
//开发票/合同通知
export function getCustomerService(data) {
	return request("api/v2/im/customer/service/reply/single", data)
}
//获取订单简单状态列表
export function getOrderStatus(data) {
	return request("api/v2/order/simple/status", data)
}
//获取订单类型列表
export function getOrderTypes(data) {
	return request("api/v2/order/types", data)
}
//获取提现配置
export function getWithdrawConfig(data){
	return request("api/v2/withdraw/config", data)
}
//v2短信验证码登录
export function sendRegisterSms(data,header) {
	return request("api/v2/register/sms", data, 'POST')
}
//v2注册登录
export function sendRegisterSmsCode(data,header) {
	return request("api/v2/register/sms/code", data, 'POST')
}


