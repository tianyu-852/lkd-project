<template>
	<view class="flex-column" style="padding-top:48rpx;">
		<image class="bg_img" src="/static/bg_image.png"></image>
		<image style="width: 516rpx;" mode="widthFix" src="/static/qt1_image.png"></image>
		<image style="width: 100%;position: absolute;bottom:0;z-index: +1;" mode="widthFix" src="/static/qt2_image.png"></image>
		<view class="btn" @click="toLink">
			立即下载
		</view>
		<view class="mask flex-column" v-if="show" >
			<view class="download" v-if="show == 2" @click="">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		sendStatisticsDownloadPage,
		sendStatisticsDownload
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				promotion_channel_tag:'',
				show:false
			}
		},
		onLoad(e) {
			this.promotion_channel_tag = e.promotion_channel_tag
			if(this.promotion_channel_tag)
				sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
		},
		methods: {
			is_weibo(){ 
				var ua = navigator.userAgent; 
				if(ua.indexOf('Weibo') > -1) {
					return true; 
				} else {
					return false; 
				}
			},
			toLink(){
				sendStatisticsDownload({promotion_channel_tag:this.promotion_channel_tag})
				//#ifdef H5
				let status = navigator.userAgent.toLowerCase();
			    if (status.match(/MicroMessenger/i) == "micromessenger") {
					// this.show=2
			        console.log('微信浏览器') 
					// return
			    }else{
			        console.log('普通浏览器')
			    }
				// window.location.href="bxls://open/raiseLaunchByCertify?raiseRegId="+ this.id
				const info = uni.getSystemInfoSync()
				console.log(JSON.stringify(info))
				if(info.platform == 'ios'){
					if(this.is_weibo()){
						this.show=2
						return
					}
					window.location.href='https://apps.apple.com/cn/app/1530338468'
				}else{
					if (status.match(/MicroMessenger/i) == "micromessenger"||this.is_weibo()) {
						this.show=2
						return
					}
					// setTimeout(res=>{
						window.location.href='http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/daisuanbao_app.apk'
					// },2000)
				}
				//#endif
				//#ifndef H5
					uni.setClipboardData({
					    data: 'https://h5.lawkd.com:12229/empty',
					    success: res=> {
					        this.$u.toast('已复制链接到剪贴板，请在浏览器中打开');
					    }
					});
				//#endif
			},
		}
	}
</script>

<style>
	.download{
		position: absolute;
		top: 20rpx;
	}
	.mask{
		top: 0;bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
	}
	.bg_img{
		width: 100vw;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		height: 100%;
	}
	.title_img{
		
	}
	.btn{
		width: 600rpx;
		height: 100rpx;
		background: #FFFFFF;
		box-shadow: 0px 6rpx 20rpx rgba(0, 0, 0, 0.2);
		border-radius: 100rpx;
		font-size: 48rpx;
		font-weight: bold;
		line-height: 100rpx;
		color: #4A8DF6;
		position: absolute;
		bottom: 148rpx;
		left: 50%;
		margin-left: -300rpx;
		z-index: +2;
		text-align: center;
	}
</style>
