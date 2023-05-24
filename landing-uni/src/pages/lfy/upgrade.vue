<template>
	<view class="content">
		<image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/fly_up_bg.png" mode="widthFix" ></image>
		<view class="foot">
			<view class="hint">升级条件：同一律所达到5名律师入驻（1/5）</view>
			<image src="/static/fly_up_btn.png" class="bg_img" mode="widthFix"></image>
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
			getCode(){
				if(this.phone.length < 11){
					uni.showToast({title:'请输入手机号',duration:1500,icon:'none'})
					return
				}
				this.time=60
				sendRegisterSmsCode({mobile:this.phone}).then(res=>{
					if(res.data.code){
						this.time = 0
					}else{
						uni.showToast({title:'发送验证成功',duration:1500,icon:'none'})
					}
				})
			},
			timeup(){
				
			},
			submit(){
				if(this.phone.length < 11){
					uni.showToast({title:'请输入手机号',duration:1500,icon:'none'})
					return
				}else if(this.code.length < 6){
					uni.showToast({title:'请输入验证码',duration:1500,icon:'none'})
					return
				}
				// this.show = 'user'
				// this.show = 1
				sendRegisterSms({
					mobile:this.phone,
					code:this.code,
					lawyer_user_id:this.user_id||''
				}).then(res=>{
					if(res.data.code==0){
						// this.show = 1
						this.show='lawyer'
						uni.showToast({title:'注册成功',duration:1500,icon:'none'})
					}else{
						uni.showToast({title:res.data.message,duration:1500,icon:'none'})
					}
				})
				
			}
		}
	}
</script>

<style>
	page{
		background: #f9f9fb;
	}
	.bg_img{
		width: 100%;
	}
	.content {
/* 		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
		background: #f9f9fb;
	}
	.foot{
		width: 100%;
		position: fixed;
		bottom: -20rpx;
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
