<template>
	<view class="content">
		<image class="bg_img" src="/static/hd_1_iimage.png" mode="widthFix" ></image>
		<image class="bg_img" style="margin-top: 46rpx;" src="/static/hd_2_iimage.png" mode="widthFix" ></image>
		<image class="bg_img" style="margin-top: 52rpx;" src="/static/hd_3_iimage.png" mode="widthFix" ></image>
		<image class="bg_img" style="margin-top: 68rpx;" src="/static/hd_4_iimage.png" mode="widthFix" ></image>
		<view class="card flex-column">
			<image style="width: 360rpx;" src="/static/bt_txt.png" mode="widthFix"></image>
			<view class="input-box">
				<input v-model="phone" type="number" maxlength="11" placeholder-style="color: #34A482;" placeholder="请输入手机号"/>
			</view>
			<view class="input-box" style="margin-top:20rpx ;justify-content: space-between;">
				<input v-model="code" type="number" maxlength="6" placeholder-style="color: #34A482;" placeholder="请输入短信验证码"/>
				<view class="code-btn" v-if="time  == 0" @click="getCode" >获取验证码</view>
				<view class="code-btn" v-else>{{time}}s重新发送</view>
			</view>
			<image class="submit" @click="submit" src="/static/zc_button.png" mode="widthFix"></image>
		</view>
		<image class="bg_bottom" src="/static/hd_5_iimage.png" mode="widthFix" ></image>
		<view class="mask flex-column" v-if="show" >
			<view class="download" v-if="show == 2">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
			<view class="flex-column" v-else >
				<image style="width: 600rpx;" src="/static/zccg_image.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往百姓律师APP</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		sendLoginSms,
		sendLoginSmsCode,
		sendStatisticsDownloadPage,
		sendStatisticsDownload
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				show:false,
				title: '成为百姓律师',
				time:0,
				phone:'',
				code:'',
				promotion_channel_tag:''
			}
		},
		onLoad(e) {
			this.promotion_channel_tag = e.promotion_channel_tag
			if(this.promotion_channel_tag)
				sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
			const timer = setInterval(()=>{
				if(this.time)
					this.time = this.time - 1
				
			},1000,1000)
		},
		methods: {
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
				sendLoginSmsCode({mobile:this.phone}).then(res=>{
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
				sendLoginSms({
					mobile:this.phone,
					code:this.code
				}).then(res=>{
					if(res.data.code){
						
					}else{
						this.show = 1
						uni.showToast({title:'注册成功',duration:1500,icon:'none'})
					}
				})
				
			}
		}
	}
</script>

<style>
	.download{
		position: absolute;top:200rpx ;
	}
	.mask-btn{
		width: 528rpx;
		height: 90rpx;
		background: linear-gradient(90deg, #0DB46C 0%, #3ECC8F 100%);
		box-shadow: 0px 6rpx 16rpx rgba(0, 212, 35, 0.32);
		border-radius: 100px;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 90rpx;
		color: #FFFFFF;
		text-align: center;
		margin-top: -140rpx;
		z-index: 2;
	}
	.code-btn{
		width: 180rpx;
		height: 64rpx;
		background: #3AB68D;
		border-radius: 12rpx;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFang SC;
		line-height: 64rpx;
		color: #FFFFFF;
		margin-right: 16rpx;
	}
	.input-box{
		width: calc(100% - 64rpx);
		height: 88rpx;
		background: #EBFBF3;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		margin-top: 48rpx;
		/* justify-content: center; */
	}
	.input-box input{
		margin-left: 24rpx;
		height: 40rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 40rpx;
		color: #34A482;
	}

	.submit{
		width:calc(100% - 46rpx);
		margin-top: 72rpx;
	}
	.bg_img{
		width: calc(100vw - 64rpx);
	}
	.bg_bottom{
		width: 100%;margin-top:-391rpx;
	}
	page{
		background: #F8FCED;
	}
	.mask{
		top: 0;bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 37rpx;
	}

	.card {
		display: flex;
		justify-content: center;
		width: calc(100vw - 64rpx);
		padding-bottom: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 10rpx 20rpx rgba(0, 64, 16, 0.3);
		border-radius: 20rpx;
		margin-top: 40rpx;
		z-index: 2;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
