<template>
	<view class="flex-column" style="padding-top:48rpx;" @click="toLink">
		<image class="bg_img" src="/static/user_bg_image.png"></image>
		<image style="width: 516rpx;" mode="widthFix" src="/static/user_1_txt.png"></image>
		<image style="width: 658rpx; margin-top: 40rpx;" mode="widthFix" src="/static/user_2_txt.png"></image>
		<image style="width: 538rpx;margin-top: 28rpx;" mode="widthFix" src="/static/user_3_txt.png"></image>
		<image style="width: 360rpx;margin-top:48rpx ;" mode="widthFix" src="/static/user_4_txt.png"></image>
		<image style="width: 565rpx;margin-top: 28rpx;" mode="widthFix" src="/static/user_5_txt.png"></image>
		<image style="width: 553rpx;margin-top: 90rpx;" mode="widthFix" src="/static/user_zx_button.png"></image>
		<image style="width: 298rpx;margin-top: 58rpx;" mode="widthFix" src="/static/user_6_txt.png"></image>
		<image style="width: 616rpx;margin-top: 22rpx;" mode="widthFix" src="/static/user_7_txt.png"></image>
		<image style="width: 368rpx;margin-top: 25rpx;" mode="widthFix" src="/static/user_8_txt.png"></image>
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
					this.show=2
			        console.log('微信浏览器') 
					return
			    }else{
			        console.log('普通浏览器')
			    }
				window.location.href="bxls://open/raiseLaunchByCertify?raiseRegId="+ this.id
				const info = uni.getSystemInfoSync()
				console.log(JSON.stringify(info))
				if(info.platform == 'ios'){
					if(this.is_weibo()){
						this.show=2
						return
					}
					window.location.href='https://apps.apple.com/cn/app/%E5%BE%8B%E5%B8%88%E5%BF%AB%E7%AD%94/id1513531987'
				}else{
					// setTimeout(res=>{
						window.location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.cnsunrun.lawyer&g_f=1000047'
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
</style>
