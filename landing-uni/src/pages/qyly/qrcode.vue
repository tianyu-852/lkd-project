<template>
	<view class="hidden">
		<view class="marlr32 top50">
			<view class="bottom16 font32">尊敬的企业律云用户：</view>
			<text class="color6E7695 font28">为保证服务及时性，您可添加法律管家微信</text>
		</view>
		<!-- <u-navbar :is-back="false" :is-fixed="false" background="{background:transparent}" :border-bottom="false"></u-navbar> -->
		<image class="bg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_image.png" mode="widthFix"></image>
		<view class="cell flex" @click="toLink(token?'/pages/lawyer/lawFirmEdit':'/pages/login/index')">
			<view class="">
				<view class="flex hcenter">
					<image src="/static/d_icon.png" class="width32" mode="widthFix"></image>
					<text class="left20 font30 bold">1.长按下方二维码，添加法律管家微信</text>
				</view>
				<view class="border_l"></view>
				<view class="flex hcenter">
					<image src="/static/d_icon.png" class="width32" mode="widthFix"></image>
					<text class="left20 font30 bold">2.扫描下方二维码，添加法律管家微信</text>
				</view>
			</view>
			<view class="qrcodeBox" @click="onCode">
				<image src="/static/zccg_image.png" mode=""></image>
				<view class="">长按添加法律管家微信</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import {
		getMyData,
		getGroups,
		getMyConfig,
		getEnterpriseCustomer,
		getEnterpriseUser,
		getCustomerGroup
	} from "@/apis/apis.js";
	export default {
		data() {
			return {
				title: '我的',
				token: '',
				info: {},
				config: {},
				customer:{},
				isVip:false,
				level:'',
				nav:[{
					id:1,
					url:'/pages/order/list',
					icon:'/static/images/ddgl_qb_icon.png',
					name:'订单'
				},
				// {
				// 	id:2,
				// 	url:'',
				// 	icon:'/static/images/ddgl_dzf_icon.png',
				// 	name:'子账号'
				// },
				{
					id:3,
					url:'/pages/index/payVip',
					icon:'/static/images/ddgl_jxz_icon.png',
					name:'权益'
				},{
					id:4,
					url:'/pages/partner/index',
					icon:'/static/images/ddgl_ywc_icon.png',
					name:'合伙人'
				}],
				mode:[{
					id:1,
					url:'share',
					icon:'/static/images/fx_icon.png',
					name:'分享'
				},{
					id:2,
					url:'/pages/my/setting',
					icon:'/static/images/sz_icon.png',
					name:'设置'
				},{
					id:2,
					url:'/pages/index/webview?url='+encodeURIComponent('https://apps.apple.com/cn/app/id1513531987'),
					icon:'/static/images/sz_icon.png',
					name:'设置'
				}]
			}
		},
		onLoad() {
			// this.getMyConfig()
		},
		onShow() {
			// this.isVip=uni.getStorageSync('is_vip')
			// this.token=uni.getStorageSync('token')
			// this.level=uni.getStorageSync('level')
			// this.customer=uni.getStorageSync('customer')
			// if(this.token) this.getUserInfo()
			// if(this.token && !this.customer) this.getCustomer()
		},
		methods: {
			onCode(){
				// uni.previewImage({  
				// 	urls: '/static/d_icon.png',  
				// 	longPressActions: {  
				// 	itemList: ['发送给朋友', '保存图片', '收藏'],  
				// 		success: function (res) {  
				// 			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');  
				// 		},  
				// 		fail: function (res) {  
				// 			console.log(res.errMsg);  
				// 		}      
				// 	}  
				// });
			},
			toLink(e){
				if(!this.token) e='/pages/login/index'
				uni.navigateTo({
					url:e
				})
			},
			toDetail(id){
				getGroups({user_id:id}).then(res=>{
					if(res.data.code==0){
						uni.navigateTo({
							url:`/pages/message/infoDetails?info=${JSON.stringify(res.data.data)}`
						})
					}
				})
			},
			toCustomer(){
				getCustomerGroup().then(res=>{
					console.log(res)
					if(res.data.code==0){
						uni.navigateTo({
							url:`/pages/message/infoDetails?info=${JSON.stringify(res.data.data)}`
						})
					}
				})
			},
			getCustomer(){
				getEnterpriseCustomer().then(res=>{
					if(res.data.code==0){
						this.customer=res.data.data
						uni.setStorage({
							key:'customer',
							data:res.data.data
						})
					}
				})
			},
			openCamera(){
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
				    }
				});
			},
			getServePhone() { //获取客服电话号码
				getServePhone().then(res => {
					this.assistant.phone = res.data.data.mobile;
					this.assistant.time = res.data.data.operating_hours;
				})
			},
			getUserInfo() { //获取个人信息
				// getMyData().then(res => {
				// 	this.$set(this, "info", res.data.data)
				// })
				getEnterpriseUser().then(res=>{
					if(res.data.code==0){
						this.info=res.data.data
					}
				})
			},
			getMyConfig(){
				getMyConfig().then(res => {
					this.$set(this, "config", res.data.data)
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
	.bg{
		width: 100%;
		position: absolute;
		top: 0;
		z-index: -1;
	}
	.cell{
		border-radius: 56rpx 56rpx 0rpx 0rpx;
		padding: 48rpx 32rpx;
		margin-top: 32rpx;
		background-color: #fff;
	}
	.border_l{
		height: 44rpx;
		border-left: 2rpx dotted #0061FF;
		margin-left: 16rpx;
	}
	.qrcodeBox{
		width: 400rpx;
		height: 400rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 40rpx rgba(3, 30, 119, 0.2);
		border-radius: 16rpx;
		padding: 20rpx;
		margin: 214rpx auto;
		font-size: 32rpx;
		font-weight: 800;
		line-height: 45rpx;
		color: #14284A;
		text-align: center;
	}
	.qrcodeBox image{
		width: 100%;
		height: 100%;
		margin-bottom:  50rpx;
	}
</style>
