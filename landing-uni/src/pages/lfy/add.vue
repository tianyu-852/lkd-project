<template>
	<view class="content">
		<image class="bg_img" style="margin-top: 68rpx;" src="/static/txt1.png" mode="widthFix" ></image>
		<view class="card flex-column">
			<image style="width: 274rpx;" src="/static/bt_txt2.png" mode="widthFix"></image>
			<view class="input-box">
				<input v-model="phone" type="number" maxlength="11" placeholder-style="color: #34A482;" placeholder="请输入手机号"/>
			</view>
			<view class="input-box" style="margin-top:20rpx ;justify-content: space-between;">
				<input v-model="code" type="number" maxlength="6" placeholder-style="color: #34A482;" placeholder="请输入短信验证码"/>
				<view class="code-btn" v-if="time  == 0" @click="getCode" >获取验证码</view>
				<view class="code-btn" v-else>{{time}}s重新发送</view>
			</view>
			<view class="hint">
				已覆盖全国33个省份
			</view>
			<image class="submit" @click="submit" src="/static/ljrz_button@3x.png" mode="widthFix"></image>
		</view>
		<image class="bg_bottom" src="/static/hd_5_iimage.png" mode="widthFix" ></image>
		<view class="mask flex-column" v-if="show" >
			<view class="download" v-if="show == 2" @click="">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
			<!-- <view class="flex-column" v-else >
				<image style="width: 600rpx;" src="/static/zccg_image.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往百姓律师APP</view>
			</view> -->
			<view class="flex-column" v-else-if="show == 'zccg'" >
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_zccg_image.png" mode="widthFix"></image>
				<view class="mask-btn">
					<wx-open-launch-weapp id="launch-btn" username="gh_46c9d23f355a" @error="handleErrorFn" :path="`pages/index/payVip?token=${token}`" @launch="handleLaunchFn" style="width: calc(100% - 18px);height: 100%;display:flex;justify-content:space-between;align-items:center;float:right">
						<script type="text/wxtag-template">
							<style>
								.mask-btn{
									width: 100%;
									height: 45px;
									font-size: 17px;
									font-weight: bold;
									line-height: 45px;
									color: #FFFFFF;
									text-align: center;
								}
							</style>
							<div class="mask-btn">立即前往开通会员</div>
						</script>
					</wx-open-launch-weapp>
				</view>
			</view>
			<view class="flex-column" v-else-if="show == 'yzc'" >
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_yzc_image.png" mode="widthFix"></image>
				<view class="mask-btn">
					<wx-open-launch-weapp id="launch-btn" username="gh_46c9d23f355a" @error="handleErrorFn" :path="`pages/index/payVip?token=${token}`" @launch="handleLaunchFn" style="width: calc(100% - 18px);height: 100%;display:flex;justify-content:space-between;align-items:center;float:right">
						<script type="text/wxtag-template">
							<style>
								.mask-btn{
									width: 100%;
									height: 45px;
									font-size: 17px;
									font-weight: bold;
									line-height: 45px;
									color: #FFFFFF;
									text-align: center;
								}
							</style>
							<div class="mask-btn">立即前往开通会员</div>
						</script>
					</wx-open-launch-weapp>
				</view>
			</view>
			<view class="flex-column" v-else-if="show == 'ykt'">
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_ykt_image.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往企业律云</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getH5WeChatSDK,
		getLoginSms,
		sendLoginSms,
		sendRegisterSmsCode,
		sendStatisticsDownloadPage,
		sendStatisticsDownload
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				show:false,
				title: '成为百姓律师',
				time:0,
				token:'',
				phone:'',
				code:'',
				promotion_channel_tag:'',
				user_id:''
			}
		},
		onLoad(e) {
			this.promotion_channel_tag = e.promotion_channel_tag
			this.user_id=e.distribute_relationship_invite_user_id
			if(this.promotion_channel_tag)
				sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
			const timer = setInterval(()=>{
				if(this.time)
					this.time = this.time - 1
			},1000,1000)
			this.getWeChatSDK()
		},
		methods: {
			getWeChatSDK(){
				// window.location.href
				getH5WeChatSDK({url:window.location.href}).then(res=>{
					if(res.data.code==0){
						var data=res.data.data
						var wx = require('jweixin-module')
						wx.config({
							debug: data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开
							appId: data.appId, // 必填，公众号的唯一标识
							beta: data.beta,
							timestamp: data.timestamp, // 必填，生成签名的时间戳
							nonceStr: data.nonceStr, // 必填，生成签名的随机串
							url: data.url,
							signature: data.signature, // 必填，签名
							jsApiList: data.jsApiList, // 必填，需要使用的JS接口列表
							openTagList: data.openTagList
						}); 
						wx.ready(function() {
							console.log('---')
						  //config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
						});
						wx.error(function(res) {
							console.log('res',res);
						});
					}
				})
			},
			is_weibo(){
				var ua = navigator.userAgent; 
				if(ua.indexOf('Weibo') > -1) {
					return true; 
				} else {
					return false; 
				}
			},
			toLink(){
				window.location.href='https://h5.lawkd.com:12229/empty?type=2'
				return
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
			getCode(){
				if(this.phone.length < 11){
					uni.showToast({title:'请输入手机号',duration:1500,icon:'none'})
					return
				}
				this.time=60
				sendRegisterSmsCode({mobile:this.phone},{"X-Source-App":"2"}).then(res=>{
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
				}
				if(!this.code){
					uni.showToast({title:'请输入验证码',duration:1500,icon:'none'})
					return
				}
				getLoginSms({
					mobile:this.phone,
					code:this.code,
					// from_user_id:this.from_user_id||'',
					// promotion_channel_tag:this.promotion_channel_tag||'',
					// is_only_register:1,
					distribute_relationship_invite_user_id:this.user_id||'',
					invite_level:1,
					is_login:1
				},{
					"X-Source-App":"2"
				}).then(res=>{
					if(res.data.code){
						uni.showToast({title:res.data.message,duration:1500,icon:'none'})
					}else{
						// res.data.data.access_token='MGQ4NDFiNzVmZGIyNjIxYWQ0MjI2NzA0NzBkZjZkZTc1MDczYTFlOD09MTYzNTQ5NTYwOA=='
						this.token=encodeURIComponent(res.data.data.access_token)
						// console.log(this.token)
						if(res.data.data.type==0){
							this.show='zccg'
						}else if(res.data.data.type==1){
							this.show='yzc'
						}else if(res.data.data.type==2){
							this.show='ykt'
						}
						// this.show = 1
						// if(res.data.data.is_first_login){
						// 	uni.showToast({title:'注册成功',duration:1500,icon:'none'})
						// }else{
						// 	uni.showToast({title:'您已注册过',duration:1500,icon:'none'})
						// }
					}
				})
				
			}
		}
	}
</script>

<style>
	page{
		background: #F8FCED;
	}
	.download{
		position: absolute;top:200rpx ;
	}
	.mask-btn{
		width: 528rpx;
		height: 90rpx;
		background: linear-gradient(90deg, #0DB46C 0%, #3ECC8F 100%);
		box-shadow: 0px 6rpx 16rpx rgba(0, 212, 35, 0.32);
		border-radius: 100rpx;
		font-size: 34rpx;
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
	.hint{
		width: calc(100% - 64rpx);
		line-height: 48rpx;
		background: #FFF2E9;
		text-align: center;
		margin-top: 24rpx;
		border-radius: 8rpx;
		color: #FF6E57;
		font-size: 26rpx;
		font-weight: bold;
	}
	.submit{
		width:calc(100% - 46rpx);
	}
	.bg_img{
		width: calc(100vw - 64rpx);
	}
	.bg_bottom{
		width: 100%;margin-top:-391rpx;
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
		background: #F8FCED;
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
