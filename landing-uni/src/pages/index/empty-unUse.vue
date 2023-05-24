<template>
	<view class="flex-column " >
		<view class="page" v-if="type==0"  @click="toLink">
			<!-- <image class="bg_img" src="/static/user_bg_image.png"></image>
			<image style="width: 516rpx;" mode="widthFix" src="/static/user_1_txt.png"></image>
			<image style="width: 658rpx;margin-top: 40rpx;" mode="widthFix" src="/static/user_2_txt.png"></image>
			<image style="width: 538rpx;margin-top: 28rpx;" mode="widthFix" src="/static/user_3_txt.png"></image>
			<image style="width: 360rpx;margin-top:48rpx ;" mode="widthFix" src="/static/user_4_txt.png"></image>
			<image style="width: 565rpx;margin-top: 28rpx;" mode="widthFix" src="/static/user_5_txt.png"></image>
			<image style="width: 553rpx;margin-top: 90rpx;" mode="widthFix" src="/static/user_zx_button.png"></image>
			<image style="width: 298rpx;margin-top: 58rpx;" mode="widthFix" src="/static/user_6_txt.png"></image>
			<image style="width: 616rpx;margin-top: 22rpx;" mode="widthFix" src="/static/user_7_txt.png"></image>
			<image style="width: 368rpx;margin-top: 25rpx;" mode="widthFix" src="/static/user_8_txt.png"></image> -->
			<image class="marlr24" mode="widthFix" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_upLoad_bg.png"></image>
		</view>
		<view class="widthAll flex" v-if="type==2" @click="toLink">
			<image class="widthAll" mode="widthFix" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_download_bg.png"></image>
		</view>
		<view class="mask flex-column" v-if="show" >
			<view class="download" v-if="show == 2">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { sendStatisticsDownloadPage, sendStatisticsDownload } from "@/apis/apis.js"
	
	export default {
		name: 'EmptyPage',
		data() {
			return {
				promotion_channel_tag:'',
				is_force:null,
				show:false,
				type:''
			}
		},
		onLoad(e) {
			this.type=e.type
			this.promotion_channel_tag = e.promotion_channel_tag
			if(this.promotion_channel_tag){
				sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
				sendStatisticsDownload({promotion_channel_tag:this.promotion_channel_tag})
			}
			this.is_force = e.is_force
		},
		onReady() {
			this.toLink()
		},
		methods: {
			toLink(){
				const info = uni.getSystemInfoSync()
				if(this.is_force){
					if(this.type==0){
						window.location.href='https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'
					}else if(this.type==1){
						window.location.href='https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'
					}else if(this.type==2){
						window.location.href='http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
					}else{
						window.location.href='https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'
					}
					return
				}
				// #ifdef H5
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger") {
					console.log('微信浏览器') 
					this.show=2
					// return
				}else{
					console.log('普通浏览器')
				}
				if(this.type==0)
					window.location.href="bxls://open/raiseLaunchByCertify?raiseRegId="+ this.id
				
				console.log(JSON.stringify(info))
				if(info.platform == 'ios'){
					if(this.type==0){
						window.location.href='https://apps.apple.com/cn/app/id1513531987'
					}else if(this.type==1){
						window.location.href='https://apps.apple.com/cn/app/id1581048689'
					}else if(this.type==2){
						window.location.href='https://apps.apple.com/cn/app/id1589660816'
					}else{
						// window.location.href='itms-apps://itunes.apple.com/cn/app/id1581048858?mt=8'
						window.location.href= 'https://apps.apple.com/cn/app/id1513531987'; // 百姓律师
					}
					
				}else{
					console.log(this.type)
					if(this.type==0) {
						window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.cnsunrun.lawyer&g_f=1000047'
					} else if(this.type==1) {
						
					} else if(this.type==2) {
						window.location.href = 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
					} else {
						// window.location.href='https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/lawyer.apk'
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'; // 百姓律师
					}
				}
				// #endif
			}
		}
	}
</script>

<style>
	.download{
		position: absolute;
		top: 20rpx;
	}
	.page{
		width: 100vw;
		height: calc(100vh - 100rpx);
		text-align: center;
		padding-top: 100rpx;
		background-color: #5780ff;
		background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_register_bg.png') 100%;
	}
	.page image{
		width: calc(100% - 48rpx);
	}
	.mask{
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
	}
	.bg_img{
		width: 100vw;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}
</style>
