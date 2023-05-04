<template>
	<view class="flex-column" style="height: 100vh;background: #F3F5F8;">
		<view class="flex callLink" v-if="(youInfo.is_customer||youInfo.is_official) && youId != -1 && youId != -2">
			<view class="callLink-item flex-column hcenter flexcenter" @click="callCustomer">
				<image src="/pagesV1/static/images/yydh_icon.png" mode=""></image>
				<text>拨打电话</text>
			</view>
			<view style="height: 48rpx;width: 1rpx;background: #D1DBEC;margin-top: 22rpx;">	</view>
			<view class="callLink-item flex-column hcenter flexcenter" @click="toLink(`/pages/message/qrcode?user_id=${youId}`)">
			<!-- <view class="callLink-item flex-column hcenter flexcenter" @click="toLink(`/pages/message/qrcode?user_id=${ '-1' }`)"> -->
				<image src="/pagesV1/static/images/wx_icon.png" mode=""></image>
				<text>添加微信</text>
			</view>
		</view>
		<view class="callLink flex" v-if="youInfo.type == 1 && type==0">
			<view class="callLink-item2 flex-column hcenter flexcenter" @click="orderPopUp(0)">
				<image src="/pagesV1/static/images/flxp_icon.png" mode=""></image>
				<text>法律服务</text>
			</view>
			<view class="callLink-item2 flex-column hcenter flexcenter" @click="getPhoneNum">
				<image src="/pagesV1/static/images/dhzx_icon.png" mode=""></image>
				<text v-if="callInfo.status==1">电话咨询</text>
				<text v-else-if="callInfo.status==2">深度咨询</text>
				<text v-else-if="callInfo.status==3">继续咨询</text>
				<text v-else>电话咨询</text>
			</view>
			<view class="callLink-item2 flex-column hcenter flexcenter" @click="toPay">
				<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662693966128-mWNAWE.png"></image>
				<text>律师费</text>
			</view>
		</view>
		<view class="titleBox" v-if="youInfo.type == 1">
			<view class="flex between" v-if="callInfo&&callInfo.status==3&&callInfo.end_countdown_timestamp">
				<view class="flex hcenter">
					<text>{{callInfo.title}}倒计时丨</text>
					<u-count-down separator="zh" separator-size="22" separator-color="#FF6160 !important" :show-border="false" bg-color="none !important" color="#FF6160 !important" :timestamp="callInfo.end_countdown_timestamp"></u-count-down>
				</view>
				<view class="btn font26 center bold" @click="toCustomer" v-if="callInfo.is_can_customer_service_join">
					管家介入
				</view>
			</view>
			<text v-else>请使用平台内支付，后续若产生纠纷，平台将尽可能保障您的权益</text>
		</view>
		<view style="flex: 1;height: 200upx;">
			<scroll-view style="height: 100%;" scroll-y :scroll-into-view="srcollToId" :scroll-with-animation="true" @scrolltoupper="addMode" @click="setClose">
				<view v-for="(item,index) in list" :key="index" class="item " :id="'block'+ index">
					<view class="dateTitle" v-if="item&&list[index - 1]&&(item.sentTime - list[index - 1].sentTime > 3600000)||index == 0">
						{{item.date}}
					</view>
					<!-- {{JSON.stringify(item)}} -->
					<view v-if="item.messageDirection==2">
						<!-- 融云信息 -->
						<view class="flex" v-if="item.messageType.slice(0,2)=='RC'">
							<image :src="youInfo.avatar||'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_noavatar.png'" mode="aspectFill" class="photo" @click="toLawyerPage"></image>
							<view class="contentBox left20 hcenter">
								<view class="content" v-if="item.messageType == 'RC:TxtMsg'" @click="toAskDetail(item)">{{item.content.content}}</view>
								<image :src="item.content.imageUri" mode="widthFix" @click="previewImage([item.content.imageUri])" v-else-if="item.messageType == 'RC:ImgMsg'" class="contentImg"></image>
								<voicePlay noTranslate bgcolor="#fff" :url="item.content.remoteUrl" :time="item.content.duration" v-else-if="item.messageType == 'RC:HQVCMsg'"></voicePlay>
							</view>
						</view>
						<!-- 自定义信息 -->
						<view class="flex" v-else-if="msgType(0,item.messageType)">
							<image :src="youInfo.avatar||'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_noavatar.png'" mode="aspectFill" class="photo" @click="toLawyerPage"></image>
							<view class="contentBox left20">
								<view class="content oContent" v-if="item.messageType=='APP:ExchangeMobile'" style="padding: 0;">
									<view style="padding: 28rpx 28rpx 36rpx 28rpx;">
										<view class="bold flex font32 color222">
											{{item.content.extra.title}}
										</view>
										<view class="flex between martop16">
											{{item.content.extra.introduction}}
										</view>
									</view>
									
									<view class="exchange-btn" v-if="!item.content.extra.result">
										<text class="u-flex-1 center" style="border-right: 2rpx solid #ECEFF4;" @click="exchangeMobile(2,index)">不同意</text>
										<text class="color0061FF u-flex-1 center" @click="exchangeMobile(1,index)">同意</text>
									</view>
								</view>
								<view class="content oContent" v-else-if="item.messageType=='APP:LawyerShopOrderPaid'">
									<view class="font32 bold color14284A">{{item.content.extra.title}}</view>
									<view class="martop16 color6E7695">
										<view v-if="item.content.extra.service_time">服务时间：{{item.content.extra.service_time}}天</view>
										<view class="martop8">金额：<text class="colorFF6E57">{{item.content.extra.price}}</text></view>
									</view>
									<view class="martop16 hint center">请耐心等待，已为您通知律师接单</view>
									<u-line color="#F1F3F7" margin="16rpx 0"></u-line>
									<view class="color888D98 center" v-if="item.content.extra.is_accepted">已接单</view>
									<view class="color888D98 center" v-else-if="item.content.extra.is_canceled">已取消</view>
									<view class="colorFE5C5C center" v-else @click="cancelOrder(item.content.extra.order_no)">取消购买</view>
								</view>
								<view class="content oContent" v-else-if="item.messageType=='APP:LawyerTakenOrder'">
									<view class="font32 bold color14284A">{{item.content.extra.title}}</view>
									<view class="martop16 color6E7695">
										<view>订单号：{{item.content.extra.order_no}}</view>
										<view class="martop8">订单类型：{{item.content.extra.lawyer_product_name}}</view>
									</view>
									<view class="martop16 hint center">律师将在{{item.content.extra.auto_cancel_order_seconds/60}}分钟内联系您，请注意来电接听</view>
								</view>
								<view class="content oContent " v-else-if="item.messageType=='APP:VipOpener'">
									<view class="font32 color14284A">唤醒法律管家</view>
									<view class="font26 bold martop16 color14284A">
										·1对1梳理您的法律需求<br>
										·精准匹配适合您的律师，快速解决问题<br>
										·帮您全程监管服务流程，保障服务质量<br>
										还有更多会员特权等着您哦 
									</view>
									<view class="martop36 flex">
										<view class="garyBtn flex1" @click="toLink('/my/payVip')">查看</view>
										<view class="blueBtn left16 flex1" @click="toLink('/my/payVip')">开通会员</view>
									</view>
								</view>
								<view class="content oContent color14284A" v-else-if="item.messageType=='APP:InviteActivateVip'">
									<view class="flex between" style="margin: -24rpx -28rpx 32rpx;">
										<image :src="item.content.extra.title_icon" class="width64 left32 martop24" mode="widthFix"></image>
										<image :src="item.content.extra.top_right_icon" class="width138" mode="widthFix"></image>
									</view>
									<view class="bold font34">
										<text class="color14284A">{{item.content.extra.title}}</text>
										<text class="colorFE5C5C left12">{{item.content.extra.price+'/'+item.content.extra.duration_chinese}}</text>
									</view>
									<view class="martop24 flex">
										<view class="garyBtn flex1" @click="toLink('/my/payVip')">查看详情</view>
										<view class="blueBtn left16 flex1" @click="openVip(item.content.extra.vip_id)">立即开通</view>
									</view>
								</view>
								<view class="content oContent" v-else-if="item.messageType=='APP:VipExpired'">
									<view class="font32 bold color14284A">您的会员已到期，好不舍，赶紧唤醒您的法律管家吧</view>
									<view class="blueBtn martop36 flex1" @click="toLink('/my/payVip')">立即续费</view>
								</view>
								<view class="content oContent" v-else-if="item.messageType=='APP:Transfer'">
									<view class="font32 bold color14284A">{{item.content.extra.title}}</view>
									<view class="martop16 color6E7695">
										<view>支付费用共计<text class="colorFE5C5C">￥{{item.content.extra.money}}</text></view>
										<view class="martop8" v-if="item.content.extra.remark">备注：{{item.content.extra.remark}}</view>
									</view>
								</view>
								<view v-else class="content oContent" @click="orderDetailPopUp(item.content.extra)">
									<view class="title" v-if="item.content.extra.user_id==myUserId">{{item.content.extra.user_title}}</view>
									<view class="title" v-else>{{item.content.extra.lawyer_title}}</view>
									<view v-if="item.content.extra.type==7">
										<view>服务类型：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
										<view class="flex between">
											<view class="desc line1">服务时间：{{item.content.extra.lawyer_product.service_date_period}}</view>
											<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
										</view>
									</view>
									
									<view v-else-if="item.content.extra.type==8">
										<view>服务项目：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
										<view class="flex between">
											<view class="desc line1">服务时间：{{item.content.extra.lawyer_product.service_date}}</view>
											<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
										</view>
									</view>
									<view v-else-if="item.content.extra.type==9">
										<view>服务项目：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
										<view class="flex between">
											<view class="desc line1">发起时间：{{item.content.extra.lawyer_product.service_date}}</view>
											<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
										</view>
									</view>
									<view v-else-if="item.content.extra.type==10">
										<view>约见时间：{{item.content.extra.lawyer_product.appointment_time}}</view>
										<view class="flex between">
											<view class="desc line1">约见地点：{{item.content.extra.lawyer_product.lawyer_office}}</view>
											<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
										</view>
									</view>
									<u-line color="#ECEFF4" margin="20rpx 0"></u-line>
									<view class="flex between hcenter button" v-if="!item.content.extra.is_canceled&&!item.content.extra.is_accepted">
										<view @click.stop="orderBtnPopUp(item,0)">取消订单</view>
										<view class="blue" @click.stop="orderBtnPopUp(item,1)">确认接单</view>
									</view>
									<view class="button" @click.stop="" v-else-if="item.content.extra.is_canceled">已取消</view>
									<view class="button" @click.stop="getPhoneNum()" v-else-if="item.content.extra.is_accepted"><text class="blue">联系用户</text></view>
								</view>
							</view>
						</view>
						<view class="divMsg relative" @click="toDetail(item)" v-else-if="msgType(1,item.messageType)">
							<view v-if="item.messageType == 'APP:FundraiseInterview'||item.messageType == 'APP:FRInterviewNotice'||item.messageType == 'APP:OrderTimeOutNotice'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view>约定时间：{{item.content.extra.interview_at}}</view>
								<view class="line1">约见地址：{{item.content.extra.interview_address}}</view>
							</view>
							<view v-else-if="item.messageType == 'APP:QuestionComment'" class="questComment">
								<image :src="item.content.extra.user.avatar" mode=""></image>
								<view class="line2 divMsg-title">{{item.content.extra.user.nickname}}：{{item.content.extra.question_comment}}</view>
								<view class="question">
									<view class=" line1">原帖:{{item.content.extra.question.content}}</view>
									<u-icon style="float: right;margin-top: -51upx;" size="22" color="#C9CED9" name="arrow-right"></u-icon>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:DemandAppointLawyerAfter' || item.messageType == 'APP:DemandAppointLawyerCancel'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view class="line1" v-if="item.content.extra.order_no">订单号：{{item.content.extra.order_no}}</view>
								<view class="line1" v-if="item.content.extra.order_type">订单类型：{{item.content.extra.order_type}}</view>
							</view>
						
							
							<view v-else-if="item.messageType == 'APP:FundraiseQuote'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view class="line1">订单简介：{{item.content.extra.content}}</view>
							</view>
							<view v-else-if="item.messageType == 'APP:FRRejected' || item.messageType == 'APP:FundraiseWrite' || item.messageType == 'APP:FRAuth' || item.messageType == 'APP:FundraisePreview'">
								<view class="divMsg-title">{{item.content.extra.title}}</view>
								<view class="line1">{{item.content.extra.content}}</view>
							</view>
							<view v-else-if="item.messageType == 'APP:Card'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view class="flex hcenter">
									<image :src="item.content.extra.from.avatar" class="divMsg-avatar" mode=""></image>
									<view class="line1">{{item.content.extra.from.subtitle}}</view>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:FundraiseProxy'||item.messageType == 'APP:DueSubmitSuccess'||item.messageType == 'APP:OrderEvaluateComment'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view class="line1" v-if="item.content.extra.order_no">订单号：{{item.content.extra.order_no}}</view>
								<view class="line1" v-if="item.content.extra.order_type">订单类型：{{item.content.extra.order_type}}</view>
								<view class="line1" v-if="item.content.extra.due_at">交付时间：{{item.content.extra.due_at}}</view>
							</view>
							<view v-else-if="item.messageType == 'APP:Fundraise'">
								<view class="divMsg-title">{{item.content.content}}</view>
								<view class="flex between">
									<view class="divMsg-text line3">{{item.content.extra.content}}</view>
									<view class="divMsg-img">
										<image :src="item.content.extra.images[0]" mode="widthFix"></image>
										<image :src="item.content.extra.images[1]" mode="widthFix"></image>
									</view>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:Demand'">
								<view class="divMsg-title">{{item.content.extra.title}}</view>
								<view v-for="(field,index1) in item.content.extra.fields" :key="index1" class="line1">
									{{field.key + ' '}}<text class="color222">{{field.value}}</text>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:PreviewDemandOrder'">
								<view class="divMsg-title">{{item.content.extra.title}}</view>
							</view>
							<view v-else-if="item.messageType == 'APP:LawyerOrderClickCard'">
								<view class="divMsg-title">{{item.content.extra.title}}</view>
								<view v-for="(field,index1) in item.content.extra.fields" :key="index1" class="line1">
									{{field.key + ' '}}<text class="color222">{{field.value}}</text>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:LawyerOrderCard'">
								<view class="divMsg-title">{{item.content.extra.title}}</view>
								<view v-if="item.content.extra.type==0">
									<view class="line1">服务时间：{{item.content.extra.date}}</view>
								</view>
								<view v-if="item.content.extra.type==7">
									<view class="line1">服务项目：{{item.content.extra.type_chinese}}</view>
									<view class="line1">服务时间：{{item.content.extra.date}}</view>
								</view>
								<view v-if="item.content.extra.type==8">
									<view class="line1">服务项目：{{item.content.extra.type_chinese}}</view>
									<view class="line1">服务时间：{{item.content.extra.date}}</view>
								</view>
								<view v-if="item.content.extra.type==9">
									<view class="line1">服务项目：{{item.content.extra.type_chinese}}</view>
									<view class="line1">发起时间：{{item.content.extra.date}}</view>
								</view>
								<view v-if="item.content.extra.type==10">
									<view class="line1">约定日期：{{item.content.extra.date}}</view>
									<view class="line1">约见地址：{{item.content.extra.lawyer_office}}</view>
								</view>
							</view>
							<view v-else-if="item.messageType == 'APP:OrderCallNotice'">
								<view class="flex between">
									<text>试试发布图文咨询，问问路过的律师</text>
									<text class="color0061FF" @click="toLink('/pagesV1/common/fabu')">发布问答></text>
								</view>
								<view class="flex between martop20" v-if="!isVip">
									<text>开通会员，匹配在线律师</text>
									<text class="color0061FF" @click="toLink('/my/payVip')">开通会员></text>
								</view>
								<view class="divMsg-tips">咨询小妙招</view>
							</view>
							<view class="flex between hcenter" v-else-if="item.messageType == 'APP:AppliedOrderCallLawyer'">
								<view style="width:calc(100% - 275rpx)">{{item.content.content}}</view>
								<view class="flex" v-if="!item.content.extra.status">
									<view class="divMsg-btn divMsg-btn-white" @click="ignored(item.content.extra.order_call_apply_id,index)">忽略</view>
									<view class="divMsg-btn divMsg-btn-blue" @click="callback(item.content.user.id,index)">回拨电话</view>
								</view>
								<view class="flex" v-else-if="item.content.extra.status==1">
									<view class="divMsg-btn divMsg-btn-gray">已回拨</view>
								</view>
								<view class="flex" v-else-if="item.content.extra.status==2">
									<view class="divMsg-btn divMsg-btn-gray">已忽略</view>
								</view>
							</view>
							<view class="" v-else>
								<view class="divMsg-title">
									暂不支持此消息，请下载百姓律师app查看
								</view>
							</view>
							<u-line color="#ECEFF4" margin="20rpx 0" v-if="item.messageType != 'APP:QuestionComment'&& item.messageType != 'APP:OrderCallNotice'&&item.messageType != 'APP:AppliedOrderCallLawyer'&&item.messageType != 'APP:DemandAppointLawyerCancel'"></u-line>
							<view class="divMsg-pop" @click="" v-if="item.messageType != 'APP:QuestionComment'">
								<view class="flex between hcenter" v-if="item.messageType == 'App:Fundraise'">
									<text>立即邀请好友证实，更快完成筹款哦~</text>
									<button :id="index" class="shareBtn" open-type="share" @click.stop="">分享</button>
								</view>
								<view class="flex between hcenter" v-else-if="item.messageType == 'APP:FRInterviewNotice'||item.messageType == 'APP:OrderTimeOutNotice'">
									<text>已抵达请点击确定按钮</text>
									<button class="button" @click="comebtn(item)">我已抵达</button>
								</view>
								<view class="flex hcenter flexend" v-else-if="item.messageType == 'APP:DemandAppointLawyerAfter'">
									<button class="button2" @click="cancelOrder(item.content.extra.order_no,1)">取消订单</button>
								</view>
								<view v-else-if="item.messageType == 'APP:OrderCallNotice'||item.messageType == 'APP:AppliedOrderCallLawyer'||item.messageType == 'APP:DemandAppointLawyerCancel'">
								</view>
								<view class="flex between" v-else>
									<text>查看详情</text>
									<u-icon name="arrow-right"></u-icon>
								</view>
							</view>
						</view>
						<view class="flex flexcenter widthAll" v-else-if="msgType(2,item.messageType)">
							<view class="diyTips" v-if="item.messageType == 'APP:WechatNumber'">
								<u-icon name="weixin-circle-fill" color="#07C160" size="28"></u-icon>
								<text>{{item.content.content}}丨</text>
								<text class="blue" @click="copy(item.content.extra.wechat_number)">复制</text>
							</view>
							<view class="diyTips" v-if="item.messageType == 'APP:EnableCallNotice'">
								<text>{{item.content.content}}</text>
								<text class="blue left8" @click="toLawyerPage()">立即咨询</text>
								<u-icon name="arrow-right" color="#0061FF" size="28"></u-icon>
							</view>
							<view class="diyTips" v-if="item.messageType == 'APP:AppliedOrderCall'">
								<view>已申请律师回拨（<text class="blue">{{item.content.extra.mobile}}</text>），请耐心等待</view>
								<view>精准识别百姓律师来电</view>
							</view>
							<view class="diyTips" v-if="item.messageType == 'APP:GrayBar'">
								<image :src="item.content.extra.icon" v-if="item.content.extra.icon" mode=""></image>
								<text>{{item.content.extra.title}}</text>
							</view>
							<view class="diyTips" v-if="item.messageType == 'APP:Mobile'">
								<u-icon name="checkmark-circle-fill" size="28" color="#18c295" style="margin-right: 8rpx;"></u-icon>
								<text>{{item.content.extra.title}}</text>
							</view>
						</view>
						<view class="flex flexcenter widthAll" v-else>
							<view class="diyTips">
								当前版本暂不支持查看此类型消息
							</view>
						</view>
					</view>
					<view class="divMsg orderListCard" @click="toDetail(item)" v-else-if="item.messageType=='APP:OrderListCard'">
						<view class="flex-row between card-title">
							<text>{{item.content.extra.type_chinese}}</text>
							<view v-if="item.status == 40">
								<view class="flex hcenter" v-if="item.content.extra.evaluate_score==1">
									<image src="/static/images/my_icon.png" mode="widthFix" class="emoji"></image>
									<view class="status">满意</view>
								</view>
								<view class="flex hcenter" v-else-if="item.content.extra.evaluate_score==2">
									<image src="/static/images/yb_icon_sely.png" mode="widthFix" class="emoji"></image>
									<view class="status">一般</view>
								</view>
								<view class="flex hcenter" v-else="item.content.extra.evaluate_score==3">
									<image src="/static/images/bmy_icon_sel.png" mode="widthFix" class="emoji"></image>
									<view class="status">不满意</view>
								</view>
							</view>
							<view :class="[type?'color888D98':'color0061FF']" v-else-if="item.content.extra.status==30" style="font-size: 26rpx;">
								{{type?'用户还未进行评价':'立即评价'}}
							</view>
						</view>
						<view class="card-content">
							<view class="flex-row hcenter">
								<image :src="item.content.extra.avatar" mode="aspectFill"></image>
								<text class="name">{{item.content.extra.nickname}}</text>
								<text class="lawyerTag" v-if="item.content.extra.lawyer_grade_chinese">{{item.content.extra.lawyer_grade_chinese}}</text>
							</view>
							<view class="time">
								<text class="color888D98">服务时间</text>
								<text class="bold marl8">{{item.content.extra.product.service_time}}</text>
							</view>
						</view>
						<view class="card-bottom hcenter between flex-row">
							<text :style="'color:'+item.content.extra.product.status_text.color">{{item.content.extra.product.status_text.status_chinese}}</text>
						</view>
					</view>
					<view class="flex flexend" v-else>
						<view class="contentBox flex flexend hcenter" v-if="item.messageType!='APP:LawyerOrder'&&item.messageType!='APP:Transfer'">
							<view class="content active" v-if="item.messageType == 'RC:TxtMsg'">{{item.content.content}}</view>
							<image :src="item.content.imageUri" mode="widthFix" @click="previewImage([item.content.imageUri])" v-else-if="item.messageType == 'RC:ImgMsg'" class="contentImg"></image>
							<voicePlay noTranslate bgcolor="#fff" right :url="item.content.remoteUrl" :time="item.content.duration" v-else-if="item.messageType == 'RC:HQVCMsg'"></voicePlay>
						</view>
						<view class="contentBox left20" @click="orderDetailPopUp(item.content.extra)" v-else>
							<view class="content oContent" style="border-radius: 28rpx 0 28rpx 28rpx;" v-if="item.messageType=='APP:LawyerOrder'">
								<view class="title" v-if="item.content.extra.user_id==myUserId">{{item.content.extra.user_title}}</view>
								<view class="title" v-else>{{item.content.extra.lawyer_title}}</view>
								<view v-if="item.content.extra.type==7">
									<view>服务类型：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
									<view class="flex between">
										<view class="desc line1">服务时间：{{item.content.extra.lawyer_product.service_date_period}}</view>
										<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
									</view>
								</view>
								<view v-else-if="item.content.extra.type==8">
									<view>服务项目：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
									<view class="flex between">
										<view class="desc line1">服务时间：{{item.content.extra.lawyer_product.service_date}}</view>
										<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
									</view>
								</view>
								<view v-else-if="item.content.extra.type==9">
									<view>服务项目：{{item.content.extra.lawyer_product.lawyer_product_name}}</view>
									<view class="flex between">
										<view class="desc line1">发起时间：{{item.content.extra.lawyer_product.service_date}}</view>
										<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
									</view>
								</view>
								<view v-else-if="item.content.extra.type==10">
									<view>约见时间：{{item.content.extra.lawyer_product.appointment_time}}</view>
									<view class="flex between">
										<view class="desc line1">约见地点：{{item.content.extra.lawyer_product.lawyer_office}}</view>
										<view class="price">￥<text>{{item.content.extra.lawyer_product.price}}</text></view>
									</view>
								</view>
								<u-line color="#ECEFF4" margin="20rpx 0"></u-line>
								<view class="flex flexcenter hcenter button">
									<view @click.stop="orderBtnPopUp(item,0)" v-if="!item.content.extra.is_canceled&&!item.content.extra.is_accepted">取消订单</view>
									<view @click.stop="" v-else-if="item.content.extra.is_canceled">已取消</view>
									<view @click.stop="" v-else-if="item.content.extra.is_accepted">已接单</view>
								</view>
							</view>
							<view class="content oContent" style="border-radius: 28rpx 0 28rpx 28rpx;" v-else-if="item.messageType=='APP:Transfer'">
								<view class="font32 bold color14284A">{{item.content.extra.title}}</view>
								<view class="martop16 color6E7695">
									<view>支付费用共计<text class="colorFE5C5C">￥{{item.content.extra.money}}</text></view>
									<view class="martop8" v-if="item.content.extra.remark">备注：{{item.content.extra.remark}}</view>
								</view>
							</view>
						</view>
						<image :src="photo" mode="aspectFill" class="photo left20" v-if="item.messageType.slice(0,3)!='APP'||item.messageType=='APP:LawyerOrder'||item.messageType=='APP:Transfer'"></image>
					</view>
				</view>
				<!-- <view id="scrollBottom" style="height: 1upx;"></view> -->
			</scroll-view>
		</view>
		<view class="fixedBox" v-if="youId!=-1 && youId!=-2 && !popShow && !orderDetailPop && !orderBtnPop && !weChatPop">
			<view class="marlr32 flex between hcenter" style="padding-bottom: 22upx;">
				<image style="margin:0 32rpx 0 0rpx;" :src="speak?'/pagesV1/static/images/jp_icon.svg':'/pagesV1/static/images/yy_icon.svg'" mode="widthFix" class="uploadImg" @click="showSpeak"></image>
				<view class="u-flex-1" v-if="speak"><touchRecorder @recorder="recorderFile" type="aac"></touchRecorder></view>
				<textarea v-else v-model="val" placeholder="快来和TA说说吧~" auto-height confirm-type="send" @confirm="sendVal" :cursor-spacing="cursorSpacing" :show-confirm-bar="false" placeholder-style="color:#888D98;"></textarea>
				<view class="flex hcenter">
					<image class="marlr32 width56" :src="show.emoji?'/pagesV1/static/images/jp_icon.svg':'/static/images/bq_icon.svg'"
						mode="widthFix" @click="setStatus"></image>
					<image  class="width56" :src="show.file?'/static/images/xl_icon_sel.svg':'/static/images/xl_icon.svg'"
						mode="widthFix" @click="setfileStatus" v-if="val.length==0"></image>
					<view class="sendButton" @click="sendVal" v-else>
						发送
					</view>
				</view>
			</view>
			<view class="file" v-if="show.file || show.emoji">
				<view style="height: 100%;" v-if="show.emoji">
					<swiper class="swiper" indicator-dots>
						<swiper-item v-for="(item, key) in emojiData" :key="key" class="swiperItem" v-if="key <= 5">
							<view class="flex">
								<view v-for="(emoji, index) in item" :key="index" @click="selemoji(emoji)"
									style="font-size: 50rpx;width: 70rpx;height: 70rpx;text-align: center;">
									{{emoji}}
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="flex" v-if="show.file">
					<view class="fileItem center" @click="uploadImg">
						<image src="/static/images/sctp_icon1.png" mode="widthFix"></image>
						<text>上传照片</text>
					</view>
					<!-- <view class="fileItem center left80" @click="uploadInfo">
						<image src="/static/images/scwj_icon.svg" mode="widthFix"></image>
						<text>上传文档</text>
					</view> -->
					<view class="fileItem center left80" @click="orderListPop=true">
						<image src="/static/images/sctp_icon2.png" mode="widthFix"></image>
						<text>订单管理</text>
					</view>
					<view class="fileItem center left80" @click="weChatPop=true">
						<image src="/static/images/jhwx_icon.png" mode="widthFix"></image>
						<text>交换微信</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 彈窗 -->
		<u-popup v-model="popShow" mode="center" border-radius="32">
			<view class="divMsgPop">
				<view class="divMsgPop-photo flex hcenter">
					<image :src="interviewInfo.avatar" mode="aspectFill"></image>
					<view>
						<view class="flex">
							<text class="divMsgPop-title">{{interviewInfo.nickname}}</text>
							<u-tag :text="'执业'+interviewInfo.work_year+'年'" mode="plain" size="mini" v-if="interviewInfo.type==1"/>
						</view>
						<text v-if="interviewInfo.type==1">{{interviewInfo.lawyer_office}}</text>
					</view>
				</view>
				<view class="divMsgPop-box">
					<view class="divMsgPop-title">线下约谈</view>
					<text>线下时间 {{interviewInfo.interview_at}}</text>
					<u-line color="#F5F7FA" margin="24rpx 0"/>
					<view class="divMsgPop-title flex hcenter">
						<text>约见地址</text>
						<view class="divMsgPop-mapLink" @click="toMap">
							<u-icon name="map-fill" color="#0061FF"></u-icon>
							<text>查看地图</text>
						</view>
					</view>
					<text>{{interviewInfo.interview_address}}</text>
				</view>
				<view class="divMsgPop-btn" v-if="!interviewState">
					<u-button type="primary" @click="submit()">我已知晓</u-button>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="orderDetailPop" mode="center" border-radius="32">
			<view class="orderDetailBox" v-if="orderInfo.user">
				<view class="top flex between">
					<view class="user flex hcenter">
						<image :src="orderInfo.user.avatar" mode=""></image>
						<view>
							<view class="flex hcenter">
								<text>{{orderInfo.user.nickname}}</text>
								<text class="tag" v-if="!orderInfo.type&&orderInfo.user.work_year">执业{{orderInfo.user.work_year}}年</text>
							</view>
							<view class="h6" v-if="!orderInfo.type">{{orderInfo.user.lawyer_office}}</view>
						</view>
					</view>
					<view class="call" @click="getPhoneNum()">
						<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662694049872-3niYsJ.png"></image>
						<view>拨打电话</view>
					</view>
				</view>
				<view class="content">
					<view class="title flex between">
						<view class="flex hcenter">
							<view>{{orderInfo.lawyer_product_category_name}}</view>
							<view v-if="orderInfo.status==13" class="tag green">待接单</view>
							<view v-if="orderInfo.status==20" class="tag red">未完成</view>
							<view v-if="orderInfo.status==23" class="tag red">未交付</view>
							<view v-if="orderInfo.status==24" class="tag orange">已交付</view>
							<view v-if="orderInfo.status==25" class="tag orange">进行中</view>
							<view v-if="orderInfo.status==30" class="tag purple">待评价</view>
							<view v-if="orderInfo.status==40" class="tag blue">已完成</view>
						</view>
						<text>￥{{orderInfo.price}}</text>
					</view>
					<view class="decs">
						<text>服务类型</text> {{orderInfo.lawyer_product_name}}<text> 丨 服务时间 </text>{{orderInfo.service_time}}
						<view class="flex between hcenter" v-if="!orderInfo.type&&orderInfo.appointment_address">
							<view class="line1">
								<text>约见地址</text> {{orderInfo.appointment_address}}
							</view>
							<view class="icon" @click="toMap(1)">
								<u-icon name="map-fill" color="#0061FF"></u-icon>
								导航
							</view>
						</view>
					</view>
					<view class="line"></view>
					<view class="textarea">
						<rich-text :nodes="orderInfo.introduction"></rich-text>
					</view>
					<view class="button flex hcenter" v-if="orderInfo.status==13">
						<button :class="[!type?'max':'min']" @click="cancelOrder(orderInfo.order_no)">取消订单</button>
						<button class="min blue" v-if="type" @click="confirmOrder(orderInfo.order_no)">确认接单</button>	
					</view>
					<view class="close">
						<u-icon name="close" color="#C9CED9" @click="orderDetailPop=false"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="orderBtnPop" mode="center" border-radius="16">
			<view class="orderBtnBox">
				<view class="title">温馨提示</view>
				<view class="title">{{orderBtnState?'是否确认接单？':'是否确认取消订单？'}}</view>
				<view class="button flex hcenter">
					<button @click="orderBtnPop=false">我再想想</button>
					<button class="blue" @click="orderBtn(orderInfo.extra.order_no)">{{orderBtnState?'确认接单':'确认取消'}}</button>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="weChatPop" mode="center" border-radius="16">
			<view class="orderBtnBox">
				<view class="title">请输入您的微信号码</view>
				<view class="input flex between">
					<input type="text" v-model="weChatVal" placeholder="请输入您的微信号"/>
					<!-- <text>修改</text> -->
				</view>
				<view class="hint">
					将通过该微信号与律师交换电话信息
				</view>
				<view class="button flex hcenter">
					<button @click="weChatPop=false">取消</button>
					<button class="blue" @click="getWeChat">确认</button>
				</view>
			</view>
		</u-popup>
		<!-- <u-popup v-model="callBoxShow" mode="bottom" border-radius="32">
			<view class="flex-column hcenter flexcenter callBox">
				<view class="call-cell" @click="getPhoneNum">立即拨打</view>
				<view class="call-cell" @click="getPhoneNum(1)">复制手机号码</view>
				<u-icon name="close" size="35" color="#5E5E61" style="margin-top: 72rpx;" @click="callBoxShow = false"></u-icon>
			</view>
		</u-popup> -->
		<u-popup v-model="orderListPop" mode="bottom" border-radius="32">
			<view class="orderListBox" v-if="orderListPop">
				<u-icon name="close" class="icon" @click="orderListPop=false"></u-icon>
				<orderListBox :isFrom="0" :youId="youId"></orderListBox>
			</view>
		</u-popup>
		<pop2001Box v-model="pop2001info.show" :title="pop2001info.title"></pop2001Box>
		<lawyerStore :orderPop="orderPop" :serviceIndex="serviceIndex" :info="lawyerStore" @change="orderPopChange" ></lawyerStore>
		<payBox ref="pay" :userId="youId"></payBox>
	</view>
</template>

<script>
	import touchRecorder from "@/pagesV1/components/touchRecorder.vue"
	import { jumpToUrl } from "@/common/util.js"
	import { server } from "@/request.js"
	import orderListBox from "../components/orderForm.vue"
	import lawyerStore from "../components/lawyerStore.vue"
	import pop2001Box from "../components/pop2001Box.vue"
	import payBox from "../components/pay.vue"
	import emoji from "@/js_sdk/m-emoji/emoji.js"
	
	import {
		LawyerAutoReply,
		getInterviewState,
		setInterview,
		serveAutoReply,
		getPhoneIgnored,
		getUsers,
		getImCallDetail,
		setWeChat,
		sendWeChat,
		setServiceOrderSubmit,
		setServiceOrderCancel,
		setInterviewArrived,
		setServiceOrderArrived,
		getVipOrder,
		getPay,
		getCustomerPhone,
		getLawyerStore,
		getMessageCard,
		getImCardStatus,
		getCallPhoneStatus,
		setCancelOrder,
		// getServiceOrderList,
		sendImUserLawyerCall,
		sendOrderCallPhone,
		getPhone,
		sendImMessageConfirmSubmit,
		sendImMessageConfirmStatus,
		sendImExchangeMobile,
		getOrderPageFromOrders
	} from "@/api/apis.js"
	
	// #ifndef MP-KUAISHOU
	import { imKey, RongIMLib, } from "@/im/im.js";
	let im = imKey();
	// #endif

	export default {
		data() {
			return {
				voiceFile:null,
				speak:false,
				// callBoxShow:false,
				// detailOrderShow:false,
				pop2001info:{
					show:false,
					title:''
				},
				navbackground: {
					background: '#fff'
				},
				isVip:null,
				val: '',
				youId: null,
				youInfo: {},
				type: 0,
				is_customer: '',
				customer:{},
				list: null,
				emojiData: [],
				orderList: [],
				orderListPage: 1,
				show: {
					emoji: false,
					file: false
				},
				photo: null,
				title: '',
				weChatVal: '',
				myUserId: '',
				cursorSpacing: uni.upx2px(28),
				srcollToId: '',
				oldbottom: '',
				serviceIndex: 0,
				// serviceTypeIndex: 0,
				popShow: false,
				interviewInfo: {},
				interviewState: false,
				orderPop: false,
				orderListPop: false,
				orderDetailPop: false,
				orderBtnPop: false,
				weChatPop: false,
				orderBtnState: 0,
				lawyerStore:{},
				orderInfo:{},
				callInfo:{},
				msgList:[
					[
						'APP:LawyerOrder',
						'APP:ExchangeMobile',
						'APP:LawyerShopOrderPaid',
						'APP:LawyerTakenOrder',
						'APP:Transfer',
						'APP:VipExpired',
						'APP:VipOpener',
						'APP:InviteActivateVip'
					],
					[
						'APP:FundraiseInterview',
						'APP:FRInterviewNotice',
						'APP:OrderTimeOutNotice',
						'APP:QuestionComment',
						'APP:FundraiseQuote',
						'APP:FRRejected',
						'APP:FundraiseWrite',
						'APP:FundraisePreview',
						'APP:Card',
						'APP:FundraiseProxy',
						'APP:DueSubmitSuccess',
						'APP:OrderEvaluateComment',
						'APP:Demand',
						'APP:PreviewDemandOrder',
						'APP:LawyerOrderCard',
						'APP:OrderCallNotice',
						'APP:AppliedOrderCallLawyer',
						'APP:Fundraise',
						'APP:DemandAppointLawyerAfter',
						'APP:DemandAppointLawyerCancel'
					],
					[
						'APP:WechatNumber',
						'APP:EnableCallNotice',
						'APP:AppliedOrderCall',
						'APP:GrayBar',
						'APP:Mobile',
						'APP:Transfer',
						'APP:Transfer',
						'APP:Transfer'
					]
				],
				hasMore: true
			}
		},
		computed: {
			getNewInfo() {
				return this.$store.state.score.info
			}
		},
		components: {
			orderListBox,lawyerStore,pop2001Box,touchRecorder,payBox
		},
		watch: {
			getNewInfo() {
				let data = this.getNewInfo;
				if (this.youId == data.targetId) {
					// data.date = new Date(data.sentTime).toLocaleString()
					data.date = this.date(data.sentTime)
					if(data.isCounted) this.list.push(data)
					let conversation = im.Conversation.get({
						targetId: this.youId,
						type: RongIMLib.CONVERSATION_TYPE.PRIVATE
					});
					conversation.read()
					this.scrollToBottom(`block${this.list.length-1}`)
					console.log(data)
					if(typeof data.content.extra == 'string')
						data.content.extra=JSON.parse(data.content.extra)
					if(data.messageType=='APP:GrayBar'){
						getImCardStatus({order_nos:JSON.stringify([data.content.extra.order_no])}).then(res=>{
							if(!res.data.code){
								var info=res.data.data[0]
								var list=this.list
								for(var i=0;i<list.length;i++){
									if(list[i].content&&list[i].content.extra&&list[i].content.extra.order_no==data.content.extra.order_no){
										list[i].content.extra.is_accepted=info.is_accepted
										list[i].content.extra.is_arrived=info.is_arrived
										list[i].content.extra.is_canceled=info.is_canceled
										this.$set(this, 'list', list)
										console.log(list[i])
										return
									}
								}
							}else{
								uni.$u.toast(res.data.message)
							}
						})
					}
				}
			},
			// 'list': function(newVal, oldVal) {
			// 	this.$nextTick(function(){
			// 		setTimeout(()=>{
			// 			this.scrollToBottom(`block${newVal.length-1}`)
			// 		},100)
			// 	})
			// }
		},
		methods: {
			msgType(i,e){
				var list=this.msgList[i]
				for(var j=0;j<list.length;j++){
					if(list[j]==e){
						return true
					}
				}
			},
			previewImage(urls,index){
				uni.previewImage({
					current: index||0,
					urls: urls,
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			recorderFile(e){
				this.voiceFile = e
				uni.uploadFile({
					url: `${server}api/common/file`,
					filePath: e.tempFilePath,
					header: {
						"Authorization": uni.getStorageSync('token'),
					},
					name: "file",
					success: res => {
						const data = JSON.parse(res.data)
						let conversation = im.Conversation.get({
							targetId: this.youId,
							type: RongIMLib.CONVERSATION_TYPE.PRIVATE
						});
						conversation.send({
							messageType: RongIMLib.MESSAGE_TYPE.HQ_VOICE, // 'RC:ImgMsg'
							content: {
								duration:e.duration,
								remoteUrl: data.data.url // 上传到服务器的 url. 用来展示高清图片
							}
						}).then(message=> {
							// console.log('发送图片消息成功', message);
							this.setThisList(message)
							this.getAutoReply();
							this.scrollToBottom(`block${this.list.length-1}`)
						});
						/* this.uploadImg.push(data.data.url)
						console.log(this.uploadImg) */
					},
					fail:res=>{
						console.log(res)
					}
				})
				// this.send()
			},
			showSpeak(){
				this.speak = !this.speak
				this.show.emoji=false
			},
			// sendExchangeMobile(){
			// 	uni.showModal({
			// 		content:'是否确认交换电话?',
			// 		success:()=> {
			// 			sendImExchangeMobile({
			// 		recipient_id:this.youInfo.user_id
			// 	}).then(res=>{
			// 		this.$u.toast(res.data.message)
			// 	})
			// 		}
			// 	})
				
			// },
			exchangeMobile(result,index){
				let item = this.list[index]
				sendImMessageConfirmSubmit({
					result:result,
					message_confirm_id:item.content.extra.message_confirm_id
				}).then(res =>{
					if(res.data.code){
						this.$u.toast(res.data.message)
					}else{
						item.content.extra.result = result
						this.$set(this.list,index,item)
					}
				})
			},
			getWeChat(){
				if(!this.weChatVal) {
					uni.$u.toast('微信号不能为空')
					return
				}
				setWeChat({wechat_number:this.weChatVal}).then(res=>{
					if(res.data.code==0){
						uni.setStorage({
							key: "weChat",
							data: this.weChatVal,
						})
					}else{
						uni.$u.toast(res.data.message)
						return
					}
				})
				sendWeChat({user_id:this.youInfo.user_id}).then(res=>{
					if(res.data.code==0){
						this.weChatPop=false;
						uni.$u.toast('发送成功')
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			ignored(id,index){
				let item = this.list[index]
				getPhoneIgnored({order_call_apply_id:id}).then(res=>{
					if(res.data.code==0){
						item.content.extra.status = 2
						this.$set(this.list,index,item)
						uni.$u.toast('忽略成功')
					}
				})
			},
			callback(id,index){
				let item = this.list[index]
				getPhone({user_id:id}).then(res=>{
					if(res.data.code==0){
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile
						})
					}
				})
			},
			callCustomer(){
				getCustomerPhone({user_id:this.youId}).then(res=>{
					if(res.data.code==0){
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile
						})
					}
				})
			},
			getPhoneNum(){
				if(this.callInfo.status==1){
					sendImUserLawyerCall({
						user_id:this.youId
					}).then(res => {
						if(res.data.code==2003){
							uni.navigateTo({
								url: `/pagesV1/index/phoneAdvisory?info=${JSON.stringify(this.youInfo)}`
							})
						}else if(res.data.code == 2001){
							this.pop2001info.show=true
							this.pop2001info.title=res.data.message
						}else if(res.data.code==0){
							uni.makePhoneCall({
								phoneNumber: res.data.data.mobile
							})
						}else{
							uni.$u.toast(res.data.message)
						}
					})
				}else if(this.callInfo.status==2){
					this.orderPop=1
				}else{
					sendOrderCallPhone({
						user_id:this.youId,
						order_no:this.callInfo.order_no
					}).then(res => {
						if(res.data.code==2003){
							uni.navigateTo({
								url: `/pagesV1/index/phoneAdvisory?info=${JSON.stringify(this.youInfo)}`
							})
						}else if(res.data.code == 2001){
							this.pop2001info.show=true
							this.pop2001info.title=res.data.message
						}else if(res.data.code==0){
							uni.makePhoneCall({
								phoneNumber: res.data.data.mobile
							})
						}else{
							uni.$u.toast(res.data.message)
						}
					})
				}
				
			},
			copy(value){
				uni.setClipboardData({
					data: value, //要被复制的内容
					success: function() {
						uni.$u.toast('复制成功');
					},
					fail: function(err) {
						uni.$u.toast('复制失败');
					}
				});
			},
			comebtn(item){
				if(item.messageType=="APP:FRInterviewNotice"){
					setInterviewArrived({fundraising_interview_id:item.content.extra.fundraising_interview_id}).then(res=>{
						if(res.data.code==0){
							uni.$u.toast('已确认抵达');
						}
					})
				}else{
					setServiceOrderArrived({order_no:item.content.extra.order_no}).then(res=>{
						if(res.data.code==0){
							uni.$u.toast('已确认抵达');
						}
					})
				}
			},
			scrollToBottom(index) {
				// setTimeout(() => {
					this.srcollToId = index
					// this.$forceUpdate();
				// }, 1000)
			},
			toAskDetail(item){
				console.log(item)
				if (item.messageType == "APP:Card") {
					uni.navigateTo({
						url: `/pagesV1/index/askDetails?id=${item.content.extra.data.id}`
					})
				}
			},
			toCustomer(){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${this.customer.user_id}&name=${this.customer.nickname}`
				})
			},
			toLink(url) {
				uni.navigateTo({
					url: url
				})
			},
			toDetail(data){
				if(data.messageType=='APP:Fundraise'){
					uni.navigateTo({
						url: '/pagesV2/verify/tips?id='+ data.content.extra.fundraising_id
					})
				}else if(data.messageType=='APP:OrderListCard'){
					uni.navigateTo({
						url: `/my/client/orderDetail?id=`+data.content.extra.order_no
					})
				}else if(data.messageType=='APP:FundraiseInterview'){
					this.interviewInfo=data.content.extra
					this.popShow=true;
					this.getInterview(data.content.extra.fundraising_interview_id);
				}else if(data.messageType=='APP:FundraiseWrite'){
					var url=data.content.extra.type==0?`/pagesV2/detailEdit/detailEdit?id=`:`/pagesV2/funds/seekHelp/lawyerHelp?id=`
					uni.navigateTo({
						url: url+data.content.extra.fundraising_id
					})
				}else if(data.messageType=='APP:Card'){
					uni.navigateTo({
						url: `/pagesV1/index/askDetails?id=`+data.content.extra.data.id
					})
				}else if(data.messageType=='APP:FRAuth'){
					//引导到APP
					uni.$u.toast('请前往APP进行身份认证')
				}else if(data.messageType=='APP:FundraisePreview'){
					uni.navigateTo({
						url: `/pagesV2/index/detail/detail?isPreview=1&id=`+data.content.extra.fundraising_id
					})
				}else if(data.messageType=='App:FRRejected'){
					uni.navigateTo({
						url: `/pagesV2/mine/grantsList/detail/detail?id=`+data.content.extra.fundraising_registration_id
					})
				}else if(data.messageType=='APP:FundraiseQuote'){
					var url=data.content.extra.type==0?`/pagesV2/funds/register/lawyerOffer?id=`:`/pagesV2/funds/register/userOffer?id=`
					uni.navigateTo({
						url: url+data.content.extra.fundraising_quote_price_id
					})
				}else if(data.messageType=='APP:LawyerOrderCard'||data.messageType=='APP:OrderEvaluateComment'||data.messageType=='APP:DueSubmitSuccess'){
					uni.navigateTo({
						url: `/my/client/orderDetail?id=${data.content.extra.order_no}`
					})
				}else if(data.messageType=='APP:FundraiseProxy'){
					uni.navigateTo({
						url: `/pagesV2/index/detail/detail?isFrom=1&id=${data.content.extra.fundraising_id}`
					})
				}else if(data.messageType=='APP:Demand'){
					if(data.content.extra.jump_type){
						jumpToUrl(data.content.extra.jump_type,data.content.extra.order_no)
						return
					}
					uni.navigateTo({
						url: `/pagesV2/square/detail?id=${data.content.extra.demand_no}`
					})
				}else if(data.messageType=='APP:QuestionComment'){
					uni.navigateTo({
						url: `/pagesV1/index/askDetails?id=${data.content.extra.question.question_id}`
					})
				}else if(data.messageType=='APP:LawyerOrderClickCard'){
					uni.navigateTo({
						url: `/my/client/orderDetail?id=${data.content.extra.order_no}`
					})
				}else if(data.messageType=='APP:PreviewDemandOrder'){
					uni.navigateTo({
						url: `/pagesV1/need/release?edit=${JSON.stringify(data.content.extra)}`
					})
				}
			},
			orderPopUp(index){
				if(this.lawyerStore&&this.lawyerStore.product_categories){
					this.orderPop=true
					this.serviceIndex=index
				}else{
					uni.$u.toast('该律师未开通相关服务')
				}
			},
			openVip(id){
				getVipOrder({
					vip_id:id
				}).then(order_no=>{
					if(order_no.data.code==0){
						getPay({
							// #ifdef MP-WEIXIN
							type: 1,
							// #endif
							//#ifdef MP-TOUTIAO
							type: 3,
							//#endif
							order_no: order_no.data.data.order_no
						}).then(res => {
							uni.requestPayment({
								provider: uni.getStorageSync('provider'),
								//#ifdef MP-TOUTIAO
								service:5,
								orderInfo:res.data.data,
								//#endif
								// #ifdef MP-WEIXIN
								timeStamp: res.data.data.timeStamp,
								nonceStr: res.data.data.nonceStr,
								package: res.data.data.package,
								paySign: res.data.data.paySign,
								signType: res.data.data.signType,
								// #endif
								success: res => {
									if(res.code == 0){
										uni.$u.toast('开通会员成功')
										uni.setStorage({
											key: "is_vip",
											data: 1
										})
									}else{
										uni.$u.toast(res.data.message)
									}
									
								}
							})
						})
					}
				})
			},
			toPay(){
				this.$refs.pay.status=true
			},
			orderPopChange(e){
				this.orderPop = e
			},
			confirmOrder(order_no){
				setServiceOrderSubmit({order_no:order_no}).then(res=>{
					if(res.data.code==0){
						this.orderBtnPop=false
						this.orderDetailPop=false
						uni.$u.toast('确认成功')
						for(var i=0;i<this.list.length;i++){
							if(this.list[i].content.extra&&this.list[i].content.extra.order_no==order_no){
								this.list[i].content.extra.is_accepted=1
							}
						}
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			cancelOrder(order_no,int){
				if(!int)
					setServiceOrderCancel({order_no:order_no}).then(res=>{
						if(res.data.code==0){
							this.orderBtnPop=false
							this.orderDetailPop=false
							for(var i=0;i<this.list.length;i++){
								if(this.list[i].content.extra&&this.list[i].content.extra.order_no==order_no){
									this.list[i].content.extra.is_canceled=1
								}
							}
							uni.$u.toast('取消成功')
						}else{
							uni.$u.toast(res.data.message)
						}
					})
				else 
					setCancelOrder({order_no:order_no,is_appoint:1,is_lawyer:0}).then(res=>{
						if(res.data.code==0){
							// this.orderBtnPop=false
							// this.orderDetailPop=false
							// for(var i=0;i<this.list.length;i++){
							// 	if(this.list[i].content.extra&&this.list[i].content.extra.order_no==order_no){
							// 		this.list[i].content.extra.is_canceled=1
							// 	}
							// }
							uni.$u.toast('取消成功')
						}else{
							uni.$u.toast(res.data.message)
						}
					})
			},
			orderBtnPopUp(item,isConfim){
				this.orderInfo=item.content;
				this.orderBtnState=isConfim
				this.orderBtnPop=true;
			},
			orderBtn(){
				if(this.orderBtnState==0){
					this.cancelOrder(this.orderInfo.extra.order_no)
				}else{
					this.confirmOrder(this.orderInfo.extra.order_no)
				}
			},
			orderDetailPopUp(item){
				getMessageCard({order_no:item.order_no}).then(res=>{
					if(res.data.code==0){
						this.orderInfo=res.data.data;
						this.orderDetailPop=true;
						this.orderInfo.order_no=item.order_no;
					}else{
						uni.$u.toast(res.data.message)
					}
				})
				
			},
			toLawyerPage() {
				uni.navigateTo({
					url: this.youInfo.type?`/pagesV1/index/lawyerPage?id=${this.youId}`:`/my/client/heLookPage?id=${this.youId}`
				})
			},
			getInterview(id){
				getInterviewState({
					fundraising_interview_id: id
				}).then(res => {
					if (res.data.code == 0) {
						this.interviewState=res.data.data.is_submit
					} else {
						this.$u.toast(res.data.message);
					}
				})
			},
			submit(){
				setInterview({
					fundraising_interview_id: this.interviewInfo.fundraising_interview_id
				}).then(res => {
					if (res.data.code == 0) {
						this.popShow=false;
					} else {
						this.$u.toast(res.data.message);
					}
				})
			},
			toMap(){
				if(this.orderInfo.user.lawyer_office_location.lat&&this.orderInfo.user.lawyer_office_location.lng){
					uni.openLocation({
						latitude: parseFloat(this.orderInfo.user.lawyer_office_location.lat),
						longitude: parseFloat(this.orderInfo.user.lawyer_office_location.lng),
						scale: 18,
						name: this.orderInfo.user.lawyer_office,
						address: this.orderInfo.appointment_address
					})
				}else{
					uni.$u.toast('无法获取坐标数据')
				}
			},
			setThisList(data) { //添加后的修改视图
				data.date = this.date(data.sentTime)
				this.list.push(data)
			},
			uploadInfo() { //上传文档
				uni.chooseMessageFile({
					success: blob => {
						console.log(blob)
					}
				})
			},
			uploadImg() { //上传图片
				let that = this;
				uni.chooseImage({
					success: blob => {
						console.log(blob)
						blob.tempFilePaths.forEach((item, index) => {
							this.upload(blob,index,1)
						})
					}
				})
			},
			upload(blob,index,num){
				console.log(blob,index,num )
				uni.uploadFile({
					url: `${server}api/common/image`,
					filePath: blob.tempFilePaths[index],
					header: {
						"Authorization": uni.getStorageSync('token'),
					},
					name: "image",
					success: res => {
						console.log('成功：',res)
						let data = JSON.parse(res.data)
						console.log(data)
						if(data.code==0){
							uni.getFileSystemManager().readFile({
								filePath: blob.tempFiles[index].path, //选择图片返回的相对路径
								encoding: 'base64', //编码格式
								success: img => { //成功的回调
									let base64 = img.data //不加上这串字符，在页面无法显示的哦
									let conversation = im.Conversation.get({
										targetId: this.youId,
										type: RongIMLib.CONVERSATION_TYPE.PRIVATE
									});
									conversation.send({
										messageType: RongIMLib.MESSAGE_TYPE.IMAGE, // 'RC:ImgMsg'
										content: {
											content: base64, // 压缩后的 base64 略缩图, 用来快速展示图片
											imageUri: data.data.url // 上传到服务器的 url. 用来展示高清图片
										}
									}).then(message=> {
										console.log('发送图片消息成功', message);
										that.setThisList(message)
										that.getAutoReply();
										that.scrollToBottom(`block${this.list.length-1}`)
									});
									/* this.uploadImg.push(data.data.url)
									console.log(this.uploadImg) */
								},fail: (e) => {
									console.log("图片转换失败");
								}
							})
						}else{
							if(num<=3){
								num++
								this.upload(blob,index,num)
							}
						}
						
					},
					fail:res=>{
						console.log('失败：',res)
					}
				})
			},
			setClose(){
				if(this.show.file)
					this.show.file = false
				if(this.show.emoji)
					this.show.emoji = false
			},
			setStatus() {
				this.show.file = false
				this.speak = false
				this.show.emoji = !this.show.emoji;
			},
			setfileStatus() {
				this.show.emoji = false
				this.show.file = !this.show.file;
			},
			selemoji(emoji) {
				this.val = this.val + emoji
				console.log(emoji)
			},
			sendVal() { //发送消息
				if (this.val) {
					var conversation = im.Conversation.get({
						targetId: this.youId,
						type: RongIMLib.CONVERSATION_TYPE.PRIVATE
					});
					conversation.send({
						messageType: RongIMLib.MESSAGE_TYPE.TEXT,
						content: {
							content: this.val // 文本内容
						}
					}).then(res => {
						console.log('发送文字消息成功', res);
						this.setThisList(res);
						this.getAutoReply();
						this.val = '';
						this.scrollToBottom(`block${this.list.length-1}`)
					}, res => {
						this.$u.toast(res.msg)
						console.log(res)
					})
					return
				}
				uni.showToast({
					title: "请输入内容",
					icon: "none"
				})
			},
			setNavigationBarTitle(name) { //设置bar
				uni.setNavigationBarTitle({
					title: name
				});
			},
			getHistoryList(next) { //获取历史记录
				let that = this;
				var conversation = im.Conversation.get({
					targetId: this.youId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				var option = {
					timestrap: next?that.list[0].sentTime:+new Date(),
					count: 20
				};
				conversation.read().then(res=>{
					console.log('清除未读',res); // im.watch conversation 将被触发
				});
				conversation.getMessages(option).then(function(result) {
					console.log('获取历史消息成功', result);
					var list = result.list; // 历史消息列表
					that.hasMore = result.hasMore; // 是否还有历史消息可以获取
					list.forEach((item, index) => {
						// item.date = new Date(item.sentTime).toLocaleString()
						item.date = that.date(item.sentTime)
						
					})
					if(next){
						list=list.concat(that.list)
					}
					
					var order_nos=[];
					var callPhones=[];
					var indexs=[];
					var mobile_no=[]
					var mobile_index=[]
					var orderListNos = []
					var orderList_index = []
					var callPhones_index= []
					for(var i=0;i<list.length;i++){
						console.log(typeof list[i].content.extra)
						if(typeof list[i].content.extra=='string')
							list[i].content.extra=JSON.parse(list[i].content.extra)
						if(list[i].messageType=='APP:LawyerOrder'&&list[i].content.extra&&list[i].content.extra.order_no){
							order_nos.push(list[i].content.extra.order_no)
							indexs.push(i)
						}else if(list[i].messageType=='APP:LawyerShopOrderPaid'&&list[i].content.extra){
							order_nos.push(list[i].content.extra.order_no)
							indexs.push(i)
						}else if(list[i].messageType=='APP:ExchangeMobile'){
							mobile_no.push(list[i].content.extra.message_confirm_id)
							mobile_index.push(i)
						}else if(list[i].messageType=='APP:OrderListCard'){
							orderListNos.push(list[i].content.extra.order_no)
							orderList_index.push(i)
						}else if(list[i].messageType=='APP:AppliedOrderCallLawyer'){
							callPhones.push(list[i].content.extra.order_call_apply_id)
							callPhones_index.push(i)
						}
					}
					if(orderListNos.length){
						getOrderPageFromOrders({
							order_nos:JSON.stringify(orderListNos)
						}).then(res=>{
							if(res.data.code == 0){
								var data=res.data.data
								for(var i=0;i<orderList_index.length;i++){
									for(var j=0;j<data.length;j++){
										if(list[orderList_index[i]]&&list[orderList_index[i]].messageType=='APP:OrderListCard'&&list[orderList_index[i]].content.extra.order_no==data[j].order_no){
											list[orderList_index[i]].content.extra = {
												...data[j]
											}
											console.log(list[orderList_index[i]])
											continue
										}
									}
								}
								that.$set(that, 'list', list)
								console.log(list)
								if(list[list.length - 1].messageType=='APP:OrderListCard')
									that.clearUnreadMessageCount(that.youId,data);
							}
						})
					}
					if(mobile_no.length){
						sendImMessageConfirmStatus({
							message_confirm_ids:JSON.stringify(mobile_no)
						}).then(res=>{
							if(res.data.code == 0){
								let buf = res.data.data
								for(let i in buf){
									for(let j in mobile_index){
										if(list[mobile_index[j]].content.extra.message_confirm_id == buf[i].message_confirm_id){
											list[mobile_index[j]].content.extra.result = buf[i].result
											continue
										}
									}
								}
								that.$set(that, 'list', list)
							}
						})
					}
					if(order_nos.length){
						getImCardStatus({order_nos:JSON.stringify(order_nos)}).then(res=>{
							if(!res.data.code){
								var data=res.data.data
								for(var i=0;i<indexs.length;i++){
									for(var j=0;j<data.length;j++){
										if(list[indexs[i]]&&(list[indexs[i]].messageType=='APP:LawyerShopOrderPaid'||list[indexs[i]].messageType=='APP:LawyerOrder')&&list[indexs[i]].content.extra.order_no==data[j].order_no){
											list[indexs[i]].content.extra.is_accepted=data[j].is_accepted
											list[indexs[i]].content.extra.is_arrived=data[j].is_arrived
											list[indexs[i]].content.extra.is_canceled=data[j].is_canceled
										}
									}
								}
								console.log(list)
								that.$set(that, 'list', list)
								if(list[list.length - 1].messageType=='APP:LawyerOrder'||list[list.length - 1].messageType=='APP:LawyerShopOrderPaid')
									that.clearUnreadMessageCount(that.youId,data);
							}else{
								uni.$u.toast(res.data.message)
							}
						})
					}
					if(callPhones.length){
						getCallPhoneStatus({order_call_apply_ids:JSON.stringify(callPhones)}).then(res=>{
							if(!res.data.code){
								var data=res.data.data
								console.log(data)
								for(var i=0;i<callPhones_index.length;i++){
									for(var j=0;j<data.length;j++){
										if(list[callPhones_index[i]]&&list[callPhones_index[i]].messageType=='APP:AppliedOrderCallLawyer'&&list[callPhones_index[i]].content.extra.order_call_apply_id==data[j].order_call_apply_id){
											list[callPhones_index[i]].content.extra.status=data[j].status
										}
									}
								}
								console.log(list)
								that.$set(that, 'list', list)
							}else{
								uni.$u.toast(res.data.message)
							}
						})
					}
					that.$set(that, 'list', list)
				});
			},
			addMode(){
				if(this.hasMore) this.getHistoryList(true)
			},
			clearUnreadMessageCount(id,data) { //清除未读消息
				let conversation = im.Conversation.get({
					targetId: id,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				conversation.read().then(res => {
					conversation.send({
						messageType: 'RC:SRSMsg',
						content: {
							//从消息里获取服务器端时间，以最近一条已读 message 为准
							lastMessageSendTime: this.list.pop().sentTime
						}
					}).then(function(message) {
						console.log('发送同步消息成功', message);
					});
					var option={
						count: 30,
						startTime: 0,
						order: 0
					}
					const that=this;
					im.Conversation.getList(option).then(function(list) {
						list.forEach((item, index) => {
							if (item.targetId == that.youId) {
								// item.latestMessage.date = new Date(item.latestMessage.sentTime).toLocaleString()
								item.latestMessage.date = that.date(item.latestMessage.sentTime)
								if(item.latestMessage.messageType=='APP:LawyerOrder'){
									for(var i=0;i<data.length;i++){
										if(data[i].order_no==item.latestMessage.content.extra.order_no){
											item.latestMessage.content.extra.is_accepted=data[i].is_accepted
											item.latestMessage.content.extra.is_arrived=data[i].is_arrived
											item.latestMessage.content.extra.is_canceled=data[i].is_canceled
										}
									}
								}else if(item.latestMessage.messageType =='APP:OrderListCard'){
									item.latestMessage.content.extra = {...data.pop()}
								}
								item.latestMessage.content.extra=JSON.parse(item.latestMessage.content.extra)
								console.log(item.latestMessage)
								that.list.push(item.latestMessage)
								item.unreadMessageCount = 0
								return
							}
						})
					});
					// getApp().globalData.list.forEach((item, index) => {
					// 	if (item.targetId == this.youId) {
					// 		console.log(item, 266)
					// 		item.latestMessage.date = new Date(item.latestMessage.sentTime).toLocaleString()
					// 		console.log(item.latestMessage)
					// 		this.list.push(item.latestMessage)
					// 		item.unreadMessageCount = 0
					// 	}
					// })
				});
			},
			date(value){
				var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
				let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
				let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
				let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
				return Y+M+D+h+m+s;
			},
			getEmoji() {
				let num = 30
				var page = Math.ceil(emoji.length / num);

				for (let i = 0; i < page; i++) {
					this.emojiData[i] = [];
					for (let k = 0; k < num; k++) {
						emoji[i * num + k] ? this.emojiData[i].push(
							emoji[i * num + k]
						) : ''
					}
				}
				console.log(this.emojiData)
			},
			getAutoReply() {
				if (this.youId == "new_1"||this.youInfo.is_customer==1) {
					serveAutoReply({
						master_customer_id: this.youId
					});
					return
				}
				if (this.youInfo.type == 1) {
					LawyerAutoReply({
						user_id: this.youId
					})
				}
			},
			// onOTabs(index){
			// 	this.oTIndex=index;
			// 	this.getOrderList(0);
			// },
			// getOrderList(next){
			// 	this.orderListPage=!next?1:this.orderListPage
			// 	var data={
			// 		page:this.orderListPage,
			// 		type:this.type,
			// 		lawyer_user_id:this.youId
			// 	}
			// 	if(this.oTIndex!=0) data.status=this.oTabs[this.oTIndex].value
			// 	getServiceOrderList(data).then(res=>{
			// 		console.log(res.data)
			// 		if(res.data.code==0){
			// 			if(next){
			// 				this.orderList=this.orderList.concat(res.data.data.data)
			// 			}else{
			// 				this.orderListPage=1;
			// 				this.orderList=res.data.data.data
			// 			}
			// 			this.orderListPage++;
			// 		}
			// 	})
			// },
			getLawyerStoreInfo(){
				if(this.youInfo.type == 1 && this.type==0){
					getLawyerStore({user_id:this.youId}).then(res=>{
						if(res.data.code==0){
							this.lawyerStore=res.data.data
							console.log(this.lawyerStore)
						}
					})
				}
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				var data=this.list[res.target.id].content.extra.share.wechat_mini_program
				console.log(data.path)
				return {
					title: '案件详情',
					path: data.path,
				}
			}
		},
		onLoad(data) {
			// #ifdef H5
			if(!uni.getStorageSync('mobile')){
				uni.navigateTo({
					url:'/pagesV2/h5/bind'
				})
			}
			// #endif
			this.$set(this, "youId", data.id);
			this.$set(this, "photo", uni.getStorageSync('photo'))
			this.$set(this, "is_customer", uni.getStorageSync('is_customer'))
			this.$set(this, "type", uni.getStorageSync('type'))
			this.$set(this, "weChatVal", uni.getStorageSync('weChat'))
			this.$set(this, "myUserId", uni.getStorageSync('user_id'))
			this.$set(this, "customer", uni.getStorageSync('customer'))
			this.title = data.name
			this.setNavigationBarTitle(data.name);
			this.getHistoryList();
			// this.getOrderList(0)
			this.getEmoji();
			// this.toBottom();
			getUsers({user_ids:JSON.stringify([data.id])}).then(res=>{
				this.youInfo=res.data.data[0]
				// this.getAutoReply()
				this.getLawyerStoreInfo();
			})
			getImCallDetail({user_id:data.id}).then(res=>{
				this.callInfo=res.data.data
				// var time1 = new Date().getTime();
				// var time2 = this.callInfo.end_countdown_timestamp*1000;
				// if(time2>time1){
				// 	//计算时差
				// 	var runTime = ((time2 - time1) / 1000).toFixed(0); //开始得出时间差,.toFixed(0)保留小数点后0位## 标题
				// 	var h=parseInt(runTime/3600>1?runTime/3600:0)
				// 	var m=parseInt(runTime%3600/60>1?runTime%3600/60:(runTime/60>1?runTime/60:0))
				// 	var s=parseInt(runTime%60)
				// 	this.callInfo.end_countdown_timestamp=(h<10?'0'+h:h)+'时'+(m<10?'0'+m:m)+'分'+(s<10?'0'+s:s)+'秒'
				// }else{
				// 	//时间到期
				// 	this.callInfo.end_countdown_timestamp=null
				// }
				var time1 = new Date().getTime();
				var time2 = this.callInfo.end_countdown_timestamp*1000;
				if(time2>time1){
					//计算时差
					var runTime = ((time2 - time1) / 1000).toFixed(0); //开始得出时间差,.toFixed(0)保留小数点后0位## 标题
					this.callInfo.end_countdown_timestamp=runTime
				}else{
					//时间到期
					this.callInfo.end_countdown_timestamp=null
				}
			})
		},
		onReady() {
			this.$nextTick(function(){
				setTimeout(()=>{
					this.scrollToBottom(`block${(this.list||[]).length-1}`)
				},500)
			})
			// this.divMessage()
		},
		onShow() {
			this.isVip=uni.getStorageSync('is_vip')
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-mask-zoom{
		transform: none !important;
	}
	/deep/.sendPlaceholder{
		background: #EBEEF3;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #888D98;
	}
	.titleBox{
		color: #FF6160;
		font-size: 26rpx;
		padding: 16rpx 32rpx;
		background: #FFEFEF;
		.btn{
			width: 136rpx;
			line-height: 56rpx;
			color: #fff;
			background: linear-gradient(130deg, #FC6D6C 0%, #FB2D2D 100%);
			border-radius: 100rpx;
		}
	}
	.orderListCard{
		.card-title{
			line-height: 48rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
			image{
				width: 34rpx;
				margin-right: 8rpx;
			}
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid #ECEFF4;
		}
		.card-content{
			padding: 20rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
			image{
				width:64rpx ;
				height: 64rpx;
				border-radius: 50%;
			}
			.name{
				height: 42rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
				margin-left: 12rpx;
			}
			.time{
				height: 37rpx;
				font-size: 26rpx;
				line-height: 37rpx;
				color: #222;
				margin-top: 16rpx;
			}
		}
		.card-bottom{
			line-height: 40rpx;
			font-size: 28rpx;
			color: #888D98;
			padding-top: 16rpx;
		}
		.card-btn{
			width: 148rpx;
			line-height: 56rpx;
			background: #0061FF;
			border-radius: 100px;
			font-size: 26rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
	.uploadImg{
		width: 56rpx;
	}
	.callBox{
		.call-cell{
			width: 100%;
			font-size: 36rpx;
			line-height: 114rpx;
			color: #222222;
			border-bottom: 1rpx solid #ECEFF4;
			text-align: center;
		}
		padding-bottom: 119rpx;
	}
	.questComment{
		image{
			width: 44upx;
			height: 44upx;
			border-radius: 100px;
			float: left;
			margin-right: 12upx;
		}
		.question{
			width: 100% !important;
			line-height: 80upx;
			background: #F3F5F8;
			border-radius: 8upx;
			padding: 0 24upx;
			margin-top: 32upx;
			font-size: 28upx;
			color: #888D98;
		}
	}

	.tell {
		padding: 12upx 32upx;
		background: #fff;

		.img {
			width: 64upx;
			height: 64upx;
		}

		.text {
			line-height: 64upx;
			font-size: 28upx;
			 
			color: #888D98;
			margin-left: 20upx;
			flex: 1;
		}

		.button {
			width: 140upx;
			height: 64upx;
			margin-left: 12upx;
		}
	}
	.orderBtnBox{
		text-align: center;
		padding: 32upx 24upx 40upx;
		.title{
			font-size: 34upx;
			font-weight: bold;
			line-height: 68upx;
			margin-bottom: 48upx;
		}
		.input{
			font-size: 30upx;
			height: 64upx;
			line-height: 64upx;
			color: #888D98;
			background: #F5F7FB;
			border-radius: 4upx;
			margin-bottom: 20upx;
			padding: 0 32upx;
			text{
				font-size: 24upx;
				color: #0061FF;
			}
			input{
				height: 100%;
				text-align: left;
			}
		}
		.hint{
			font-size: 22upx;
			line-height: 44upx;
			color: #18C295;
			padding: 0 32upx;
			text-align: left;
			background: #EFFAF7;
			border-radius: 8upx;
			margin-bottom: 56upx;
		}
		.button{
			// margin: 72upx 0;
			button{
				width: 240upx;
				height: 88upx;
				background: #F3F5F8;
				border-radius: 8upx;
			}
			.blue{
				color: #fff;
				background-color: #0061FF;
				margin-left: 16upx;
			}
		}
	}
	.orderDetailBox{
		max-width: 686upx;
		min-width: 600upx;
		.top{
			padding: 32upx 32upx 20upx;
			border-bottom: 12upx solid #F5F7FA;
			.user{
				font-size: 32upx;
				font-weight: bold;
				line-height: 48upx;
				.h6{
					font-size: 24upx;
					font-weight: 500;
					line-height: 36upx;
				}
				image{
					width: 130upx;
					height: 130upx;
					margin-right: 20upx;
					border-radius: 50%;
				}
			}
			.call{
				color: #0061FF;
				font-size: 24upx;
				font-weight: bold;
				line-height: 36upx;
				text-align: center;
				image{
					width: 80upx;
					height: 80upx;
					margin-bottom: 8upx;
				}
			}
			.tag{
				border: 2upx solid #5B86FF;
				margin-left: 12upx;
				padding: 1upx 8upx 1upx 8upx;
				border-radius: 4upx;
				font-size: 20upx;
				line-height: 30upx;
				font-weight: bold;
				color: #5B86FF;
			}
		}
		.content{
			padding: 28upx 32upx 40upx;
			
			.title{
				font-size: 36upx;
				font-weight: bold;
				line-height: 50upx;
				text{
					color: #FF4040;
					font-size: 40upx;
				}
			}
			.tag{
				height: 36upx;
				margin-left: 12upx;
				padding: 0 14upx;
				border-radius: 8upx;
				font-size: 24upx;
				line-height: 36upx;
			}
			.red{
				color: #FF3951;
				background-color: #FEE7E7;
			}
			.blue{
				color: #0061FF;
				background-color: #E7F3FE;
			}
			.purple{
				color: #516EBC;
				background-color: #DFE9FF;
			}
			.green{
				color: #18C295;
				background-color: #BBF1E2;
			}
			.orange{
				color: #FF7639;
				background-color: #FEEEE7;
			}
			.line{
				margin: 28upx 0;
			}
			.decs{
				margin-top: 20upx;
				text{
					color: #888D98;
					margin-right: 8upx;
				}
				.line1{
					width: calc(100% - 120upx);
				}
				.icon{
					width: 100upx;
					color: #677592;
					font-size: 24upx;
				}
			}
			.button{
				margin: 40upx 0;
				button{
					height: 88upx;
					background: #F3F5F8;
					border-radius: 12upx;
				}
				.blue{
					color: #fff;
					background-color: #0061FF;
				}
				.max{
					width: 100%;
				}
				.min{
					width: calc(50% - 8upx);
				}
			}
			.close{
				margin-top: 20upx;
				text-align: center;
			}
		}
	}
	.orderListBox{
		background-color: #F5F7FA;
		position: relative;
		height: 80vh;
		.icon{
			position: absolute;
			left: 32upx;
			top: 40upx;
		}
	}
	.file {
		padding: 0 48upx;
		border-top: 1upx solid #F1F4FB;

		.fileItem {
			margin-top: 45upx;

			image {
				width: 88upx;
			}

			text {
				font-size: 24upx;
				font-weight: bold;
			}

			width: 100upx;
		}

		height: 370upx;
	}

	.slider {
		.swiperItem {
			width: 100%;
		}

		position: relative;
	}

	.sendButton {
		background-color: #0061FF;
		color: #FFFFFF;
		padding: 6rpx 20rpx;
		border-radius: 10rpx;
	}

	.fixedBox {
		.hint {
			background: #E7F3FE;
		}

		textarea {
			flex: 1;
			background:#EBEEF3;
			padding: 14rpx 18rpx 14rpx 44rpx;
			border-radius: 18rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			height: 64rpx;
		}

		.icon {
			width: calc(100% - 520upx);
			image {
				width: 54rpx;
			}
			margin-left: 32rpx;
		}

		width: 100%;
		// bottom: 0rpx;
		background-color: #fff;
		padding: 28rpx 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.divMsgPop{
		min-width: 650upx;
		overflow: hidden;
		height: 100%;
		.divMsgPop-title{
			font-size: 32upx;
			font-weight: bold;
			margin: 0 8upx 20upx 0;
		}
		.divMsgPop-mapLink{
			color: #888D98;
			font-size: 24upx;
		}
		.divMsgPop-photo{
			padding: 32upx 32upx 20upx 32upx;
			border-bottom: 12upx solid #F5F7FA;
			image{
				width: 130upx;
				height: 130upx;
				margin-right: 20upx;
				border-radius: 12rpx;
			}
		}
		
		.divMsgPop-box{
			padding: 32upx 32upx 64upx;
		}
		.divMsgPop-btn{
			margin: 0 32upx 32upx;
		}
	}
	.diyTips{
		color: #888D98;
		font-size: 28upx;
		line-height: 48upx;
		padding: 7upx 28upx;
		background-color: #E6E9F1;
		border-radius: 8upx;
		display: inline-block;
		.blue{
			color: #0061FF;
		}
		
		image{
			width: 28upx;
			height: 28upx;
			margin: 0 8upx -4upx 0;
		}
	}
	.item {
		.dateTitle {
			color: #C9CED9;
			font-size: 24upx;
			text-align: center;
			margin-bottom: 20upx;
		}

		.contentImg {
			max-width: 200rpx;
			max-height: 200rpx;
		}

		.photo {
			width: 94rpx;
			height: 94rpx;
			border-radius: 12rpx;
		}
		.divMsg{
			width: 100%;
			color: #888D98;
			font-size: 26upx;
			padding: 24upx 36upx;
			border-radius: 20upx;
			background-color: #fff;
			box-shadow: 0 4upx  16upx 0 rgba($color: #0041A2, $alpha: 0.1);
			.line1{
				width: calc(100% - 44upx);
			}
			.divMsg-tips{
				font-size: 22rpx;
				font-weight: 500;
				line-height: 36rpx;
				color: #FFFFFF;
				background: linear-gradient(226deg, #FF4E4E 0%, #FF2929 100%);
				border-radius: 16rpx 4rpx 16rpx 4rpx;
				padding: 0 9rpx;
				position: absolute;
				top: -28rpx;
				left: 0;
			}
			.divMsg-title{
				color: #222;
				font-size: 32upx;
				font-weight: bold;
				margin-bottom: 20upx;
			}
			.divMsg-text{
				width: calc(100% - 224upx);
			}
			.divMsg-img{
				image{
					width: 100upx;
					height: 100upx;
					border-radius: 8upx;
					margin-left: 12upx;
				}
			}
			.divMsg-avatar{
				width: 32upx;
				height: 32upx;
				border-radius: 12rpx;
				margin-right: 12upx;
			}
			.divMsg-btn{
				width: 120rpx;
				height: 56rpx;
				border-radius: 100rpx;
				font-size: 26rpx;
				font-weight: 500;
				line-height: 56rpx;
				text-align: center;
			}
			.divMsg-btn-blue{
				width: 140rpx;
				background: #0061FF;
				color: #FFF;
				margin-left: 12rpx;
			}
			.divMsg-btn-white{
				color: #0061FF;
				border: 2rpx solid #0061FF;
			}
			.divMsg-btn-gray{
				color: #888D98;
				background: #EEF0F3;
			}
			.divMsg-pop{
				color: #C9CED9;
				font-size: 28upx;
				.button{
					height: 56upx;
					line-height: 56upx;
					margin: 0;
					color: #FFFFFF !important;
					font-size: 24upx;
					border-radius: 100upx;
					background-color: #0061FF;
				}
				.button2{
					height: 56upx;
					line-height: 56upx;
					margin: 0;
					color: #3764FF !important;
					font-size: 24upx;
					border-radius: 100upx;
					background-color: #EFF1FF;
				}
			}
		}
		.contentBox {
			.exchange-btn{
				width: 100%;
				font-size: 30rpx;
				line-height: 80rpx;
				display: flex;
				color: #888D98;
				border-top: 2rpx solid #ECEFF4;
			}
			.content {
				width: 100%;
				word-wrap:break-word;
				background-color: #FFFFFF;
				font-size: 32rpx;
				color: #222222;
				padding: 24rpx 28rpx;
				border-radius: 0px 28rpx 28rpx 28rpx;
				.garyBtn{
					color: #3764FF;
					text-align: center;
					line-height: 72rpx;
					background: #EFF1FF;
					border-radius: 16rpx;
				}
			}
			.oContent{
				min-width: 360rpx;
				font-size: 26upx;
				font-weight: 500;
				line-height: 40upx;
				color: #888D98;
				.title{
					color: #222222;
					font-size: 32upx;
					font-weight: bold;
					margin-bottom: 8upx;
				}
				.hint{
					
					color: #FF6160;
					font-size: 20rpx;
					line-height: 40rpx;
					background: #FFEFEF;
					border: 1rpx solid #FFD2D2;
					border-radius: 8rpx;
				}
				.desc{
					max-width: calc(100% - 130upx);
				}
				.price{
					color: #FF6E57;
					text{
						font-size: 40upx;
						text-align: right;
					}
					
				}
				.button{
					font-size: 28upx;
					text-align: center;
					view{
						width: 50%;
						// &:last-child{
						// 	color: #0061FF;
						// 	border-left: 1upx solid #F1F3F7;
						// }
					}
					.blue{
						color: #0061FF;
						border-left: 1upx solid #F1F3F7;
					}
				}
			}
			.active {
				background-color: #0061ff;
				color: #FFFFFF;
				border-radius: 28rpx 0 28rpx 28rpx;
			}
			max-width: 520rpx;

		}
		padding-bottom: 28rpx;
		margin: 0 32rpx ;
	}

	.callLink{
		font-size: 22upx;
		line-height: 35upx;
		text-align: center;
		padding: 12rpx 0 16rpx 0;
		border-top: 1upx solid #ECEFF4;
		border-bottom: 1upx solid #ECEFF4;
		background-color: #fff;
		
		.line{
			border-bottom: 1upx solid #ECEFF4;
		}
		.callLink-item{
			width: calc(50% - 1upx);
			image{
				width: 48upx;
				height: 48upx;
				margin: 0 4upx 8rpx 0;
			}
		}
		.callLink-item2{
			width: 33.33%;
			image{
				width: 48upx;
				height: 48upx;
			}
		}
		.callLink-item3{
			width: 33.33%;
			padding-top: 16upx;
			text{
				padding: 8upx 26upx;
				background: #EEF0F3;
				border-radius: 8upx;
				line-height: 40upx;
			}
		}
	}
	
	page {

		background: #F3F5F8;
	}
</style>
