<template>
	<view class="customerBox" v-if="customer">
		<view class="flex between hcenter">
			<view class="flex" @click="toDetail()">
				<image :src="customer.avatar" class="photo" mode="aspectFill"></image>
				<view class="left24 martop12">
					<view class="flex hcenter">
						<view class="font28 bold name line1">{{customer.nickname}}</view>
						<image :src="token?'/static/images/kf_icon.png':'/static/images/fw_icon.png'" class="width138 left12" mode="widthFix"></image>
						<!-- <text class="left4" style="color: #5C71A7;">{{isVip?'售后专属':''}}法律管家</text> -->
					</view>
					<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022121-1669883708231-jh7iPA.png" class="width320 martop12" mode="widthFix"></image>
				</view>
			</view>
			<view class="blueBtn2 flex hcenter right24 relative" @click="toDetail()">
				<image src="/static/images/dh_icon2.png" class="width32" mode="widthFix"></image>
				<text class="left4">咨询</text>
				<view class="tag" v-if="unread">{{unread}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getEnterpriseCustomer, getCustomerPhone } from "@/api/apis.js"
	// #ifndef MP-KUAISHOU
	import { imKey, RongIMLib, } from "@/im/im.js";
	let im = imKey(); 
	// #endif

	export default {
		props:{
			// item:Object,
			// unread:Number
		},
		data() {
			return {
				customer: {},
				token:'',
				unread: 0
			};
		},
		methods:{
			/**
			 * 进入人工私聊/打电话
			 */
			toDetail(){
				// #ifdef MP-KUAISHOU | MP-TOUTIAO
				getCustomerPhone({ user_id: this.customer.user_id }).then(res=>{
					if(res.data.code == 0) {
						uni.makePhoneCall({ phoneNumber: res.data.data.mobile });
					}
				})
				// #endif

				// #ifdef MP-WEIXIN
				uni.navigateTo({ url: `/pagesV1/info/infoDetails?id=${this.customer.user_id}&name=${this.customer.nickname}` })
				// #endif
			},
			getUnreadCount(){
				// #ifndef MP-KUAISHOU
				console.log('获取未读消息')
				var conversation = im.Conversation.get({
					targetId: this.customer.user_id,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				})
				conversation.getUnreadCount().then(res=>{
					console.log('获取指定未读数成功',res); // im.watch conversation 将被触发
					this.unread=res
				});
				// #endif
			},
			getCustomer(){
				getEnterpriseCustomer().then(res=>{
					// console.log('客服:', res)

					if(res.data.code==0){
						this.customer=res.data.data
						uni.setStorage({
							key:'customer',
							data:res.data.data
						})
					}
				})
			},
		},
		mounted() {
			this.token=uni.getStorageSync('token')
			this.customer=uni.getStorageSync('customer')
			if(this.token && !this.customer) this.getCustomer()
			setTimeout(()=>{
				if(this.token) this.getUnreadCount()
			},500)
		}
	}
</script>

<style lang="scss" scoped>
	.customerBox{
		padding: 10rpx 16rpx;
		background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_kf_bg.png');
		background-size: 100% 100%;
		border-radius: 12rpx;
		margin: 0 32rpx;
		.tag{
			color: #FFFFFF;
			font-size: 24rpx;
			line-height: 32rpx;
			background: #FF4040;
			padding: 0 10rpx;
			border-radius: 100rpx 100rpx 100rpx 36rpx;
			position: absolute;
			right: -12rpx;
			top: -12rpx;
		}
		.name{
			max-width: 200rpx;
		}
		.photo{
			width: 100rpx;
			height: 100rpx;
			border: 2rpx solid #FFFFFF;
			box-shadow: 0px 16rpx 24rpx rgba(1, 23, 113, 0.2);
			border-radius: 12rpx;
		}
		.text{
			color: #6476A4;
			font-size: 24rpx;
			padding-top: 16rpx;
			border-top: 1rpx dotted #A8B7DB;
		}
		.hint{
			color: #fff;
			font-size: 20rpx;
			padding: 0 14rpx;
			line-height: 44rpx;
			margin-top: 15rpx;
			background: linear-gradient(121deg, #84A8FF 0%, #4A76FD 100%);
			border-radius: 18px;
			display: flex;
		}
		.btn{
			width: 140rpx;
		}
		.blueBtn2{
			height: 64rpx;
			line-height: 64rpx;
			padding: 0 26rpx;
			background: linear-gradient(310deg, #FD8C1D 0%, #FFBB59 100%);
			box-shadow: 0rpx 4rpx 16rpx rgba(220, 125, 0, 0.3);
			display: flex;
		}
	}
	
</style>
