<template>
	<view>
		<u-popup v-model="show" mode="top" :mask-close-able="false" :mask="false">
			<view class="noticeBox flex-row" @click="close">
				<image :src="info.content.user.portrait" mode=""></image>
				<view class="noticeContent">
					<view class="notice-title flex between">
						<text class="line1">{{info.content.extra.title}} </text>
						<u-icon name="arrow-right" color="#C9CED9" size="28"></u-icon>
					</view>
					<view class="notice-content ellipsis">
						{{info.content.extra.subset ? info.content.extra.subset:'点击查看'}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import{jumpToUrl}from "@/common/util.js"
	export default {
		name:"imNotice",
		computed: {
			show: {
				get() {
					// return true
					return this.$store.state.notice.imshow
				},
				set() {}
			},
			info: {
				get() {
					return this.$store.state.notice.iminfo
				},
				set() {}
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			close(){
				this.$store.commit("setImNoticeShow",false)
				const data = this.info 
				if(data.messageType=='APP:Fundraise'){
					uni.navigateTo({
						url: '/pagesV2/verify/tips?id='+ data.content.extra.fundraising_id
					})
				// }else if(data.messageType=='APP:FundraiseInterview'){
				// 	this.interviewInfo=data.content.extra
				// 	this.popShow=true;
				// 	this.getInterview(data.content.extra.fundraising_interview_id);
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
				}else if(data.messageType=='APP:LawyerOrderCard'){
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
				}
				// that.$store.commit("setImNoticeInfo",message)
			}
		},
		mounted() {
			
		}
	}
</script>
<style scoped lang="scss">
	.noticeBox{
		flex-wrap: nowrap;
		width:calc(100vw - 40upx);
		height: 200upx;
		background: #FFFFFF;
		box-shadow: 0px 4upx 24upx rgba(0, 69, 206, 0.31);
		border-radius: 36upx;
		margin:auto;
		margin-top: 100rpx;
		margin-bottom: 20rpx;
		image{
			width: 80rpx;
			height: 80rpx;
			border-radius: 100px;
			margin-left: 32upx;
			margin-top: 32upx;
		}
		.notice-title{
			line-height: 42rpx;
			font-size: 30rpx;
			font-weight: bold;
			color: #222222;
			flex-wrap: nowrap;
		}
		.notice-content{
			font-size: 26upx;
			line-height: 48upx;
			color: #888D98;
			margin-top: 8rpx;
		}
		.noticeContent{
			margin:32upx 32upx 0 20upx;
			flex: 1;
			width: 0;
		}
	}
</style>
