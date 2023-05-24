<template>
	<view class="content">
		<image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_register_top.png" mode="widthFix" ></image>

		<view class="card flex-column">
			<view class="bt_text">诚邀全国律师加盟</view>
			<view class="input-box">
				<input v-model="phone" type="number" maxlength="11" placeholder="请输入手机号"/>
			</view>
			<view class="input-box" style="margin-top:20rpx ;justify-content: space-between;">
				<input v-model="code" type="number" maxlength="6" placeholder="请输入短信验证码"/>
				<view class="code-btn" v-if="time  == 0" @click="getCode" >获取验证码</view>
				<view class="code-btn" v-else>{{time}}s重新发送</view>
			</view>
			<view class="submit mask-btn" @click="submit">立即入驻</view>
		</view>
		<view class="mask flex-column" v-if="show" >
			<view class="download" v-if="show == 2" @click="">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
			<view class="flex-column" v-else-if="show == 'user'" @click="">
				<image style="width: 686rpx;" src="/static/zccg_image.png" mode="widthFix"></image>
					<view class="mask-btn" @click="toLink">	立即前往{{type?'律师端':'企业律云'}}APP</view>
			</view>
			<view class="flex-column" v-else >
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_register_pop.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往{{type?'律师端':'企业律云'}}APP</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getLoginSms,
		// sendRegisterSms,
		sendRegisterSmsCode,
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
				source:3,
				type:0,
				user_id:''
				// promotion_channel_tag:''
			}
		},
		onLoad(e) {
			this.user_id = e.user_id
			if(e.type){
				this.type=e.type
			}
			// if(this.promotion_channel_tag)
			// 	sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
			const timer = setInterval(()=>{
				if(this.time)
					this.time = this.time - 1
			},1000,1000)
		},
		methods: {
			toLink(){
				if(this.type){
					window.location.href='https://h5.lawkd.com/upload'
				}else{
					window.location.href='https://h5.lawkd.com/empty?type=2'
				}
				return
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
					    data: 'https://h5.lawkd.com/empty?type=1',
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
				sendRegisterSmsCode({mobile:this.phone},{"X-Source-App":this.source}).then(res=>{
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
				getLoginSms({
					mobile:this.phone,
					code:this.code,
					distribute_relationship_invite_user_id:this.user_id||'',
					invite_level:0
				},{
					"X-Source-App":this.source
				}).then(res=>{
					if(res.data.code==0){
						// this.show = 1
						// this.show='lawyer'
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
	.download {
		position: absolute;
		top: 20rpx;
	}
	.mask-btn{
		width: 528rpx;
		height: 90rpx;
		background: #3764FF;
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
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
		background: #3764FF;
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
		background: #F2F5FF;
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
		font-weight: 500;
		line-height: 40rpx;
		color: #222;
	}

	.submit{
		width:calc(100% - 46rpx);
		margin-top: 72rpx;
	}
	.bg_img{
		width: calc(100vw - 64rpx);
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
		width: 100%;
		height: 100%;
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_register_bg.png') 100%;
		padding-bottom: 20rpx;
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
	.card .bt_text{
		width: calc(100% - 58rpx);
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		background: linear-gradient(270deg, #FE7936 0%, #FB2A54 100%);
		border-radius: 0px 0px 40rpx 40rpx;
		font-size: 34rpx;
		font-weight: bold;
		color: #FFFFFF;
		text-shadow: 0px 3rpx 0rpx #FF7A31;
		letter-spacing: 24rpx;
	}
</style>
