<template>
	<view>
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
				is_force:null,
				show:false
			}
		},
		onLoad(e) {
			this.promotion_channel_tag = e.promotion_channel_tag
			if(this.promotion_channel_tag){
				sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
				sendStatisticsDownload({promotion_channel_tag:this.promotion_channel_tag})
			}
			this.is_force = e.is_force
		},
		onReady() {
			if(this.is_force){	
				window.location.href='http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/daisuanbao_app.apk'
				return
			}
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
			
			// uni.setClipboardData({
			// 	data: 'https://h5.lawkd.com:12229/empty',
			// 	success: res=> {
			// 		uni.showToast({title:'已复制链接到剪贴板，请在浏览器中打开',duration:1500,icon:'none'})
			// 		// this.$u.toast('已复制链接到剪贴板，请在浏览器中打开');
			// 	},
			// 	fail:res=>{
			// 		console.log(res)
			// 	}
			// });
			
		},
		methods: {
			is_weibo(){
				var ua = navigator.userAgent; 
				if(ua.indexOf('Weibo') > -1) {
					return true; 
				} else {
					return false; 
				}
			}
		}
	}
</script>

<style>
.mask{
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	position: fixed;
	background: rgba(0, 0, 0, 0.64);
	z-index: 99;
}
.download{
	position: absolute;
	top: 20rpx;
}
</style>
