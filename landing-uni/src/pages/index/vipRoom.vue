<template>
	<view class="content">
		<image class="widthAll" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_tovip_bg.png" mode="widthFix"></image>
		<view class="flex foot bold">
			<view class="flex hcenter flexcenter btn gray" @click="onServiceChat">
				<image src="/static/wd_kf_icon.png" class="width44" mode="widthFix"></image>
				<text>官方客服</text>
			</view>
			<view class="btn blue flex1" @click="onVipRights">了解更多会员权益</view>
		</view>
	</view>
</template>

<script>
	import {
		getEnterpriseUser
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				token:'',
				platform:'',
			}
		},
		onLoad(e) {
			this.platform=uni.getSystemInfoSync().platform
			if(e.invite_user_id){
				this.invite_user_id=e.invite_user_id
			}
		},
		onShow() {
			
		},
		onPageScroll(e){
			console.log(e.scrollTop)
			// this.scrollTop=e.scrollTop
			// setTimeout(()=>{
			// 	this.newScrollTop=e.scrollTop
			// },500)
			if(e.scrollTop>this.navBoxTop && !this.isTop){
				this.isTop = true
			}
			if(e.scrollTop<this.navBoxTop && this.isTop){
				this.isTop = false
			}
		},
		methods: {
			onServiceChat(){
				if(this.platform == 'ios'){
					prompt('onGotoServiceChat')
				}else{
					AppProxyClick.onGotoServiceChat();
				}
			},
			onVipRights(){
				if(this.platform == 'ios'){
					prompt('onGotoVipRights')
				}else{
					AppProxyClick.onGotoVipRights();
				}
			}
		}
	}
</script>

<style>
	.foot{
		padding: 16rpx 20rpx 56rpx;
	}
	.btn{
		width: 280rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 24rpx;
		text-align: center;
		font-size: 32rpx;
	}
	.blue{
		color: #fff;
		background: linear-gradient(135deg, #509AFF 0%, #2878FE 100%);
	}
	.gray{
		color: #14284A;
		background: #F3F5F8;
		margin-right: 16rpx;
	}
	
</style>
