<template>
	<view class="content">
		<image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/fly_link_bg.png" mode="widthFix" ></image>
		<view class="foot" @click="toLink">
			立即前往律师端
		</view>
	</view>
</template>

<script>
	import {
		// sendRegisterSms,
		// sendRegisterSmsCode,
		// sendStatisticsDownloadPage,
		// sendStatisticsDownload
		
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				show:false,
				title: '成为律师',
				time:0,
				phone:'',
				code:'',
				user_id:''
				// promotion_channel_tag:''
			}
		},
		onLoad(e) {
			this.user_id = e.user_id
			// if(this.promotion_channel_tag)
			// 	sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
			const timer = setInterval(()=>{
				if(this.time)
					this.time = this.time - 1
			},1000,1000)
		},
		methods: {
			toLink(){
				// sendStatisticsDownload({promotion_channel_tag:this.promotion_channel_tag})
				//#ifdef H5
				let status = navigator.userAgent.toLowerCase();
				const info = uni.getSystemInfoSync()
			    if (status.match(/MicroMessenger/i) == "micromessenger"&&info.platform == 'ios') {
					this.show=2
			        console.log('微信浏览器') 
					return
			    }else{
			        console.log('普通浏览器')
			    }
				if(status.match(/MicroMessenger/i) != "micromessenger"){
					window.location.href="bxls://open/raiseLaunchByCertify?raiseRegId="+ this.id
				}
				if(info.platform == 'ios'){
					window.location.href='https://apps.apple.com/cn/app/%E5%BE%8B%E5%B8%88%E5%BF%AB%E7%AD%94/id1513531987'
				}else{
					setTimeout(res=>{
						window.location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.cnsunrun.lawyer&g_f=1000047'
					},2000)
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
	.bg_img{
		width: 100%;
	}
	.content {
/* 		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
		background: #517aff;
		position: relative;
	}
	.foot{
		width: calc(100% - 150rpx);
		position: absolute;
		bottom: 102rpx;
		margin: 0 75rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: linear-gradient(152deg, #FF863B 0%, #FBA14E 100%);
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		border-radius: 100rpx;
		color: #fff;
		text-align: center;
	}
	.hint{
		height: 54rpx;
		line-height: 54rpx;
		background: #FFF2E9;
		border-radius: 8rpx;
		margin: 0 32rpx;
		font-size: 30rpx;
		font-weight: bold;
		padding: 0 38rpx;
		color: #FF6E57;
	}

	
</style>
