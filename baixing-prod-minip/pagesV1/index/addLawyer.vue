<template>
	<view class="content">
		<u-navbar :border-bottom="false" background="background:#F8FCED;" title="智慧法律生态" title-size="36" title-bold></u-navbar>
		<!-- <image src="/static/images/nav_fh_icon.png" class="back" @click="goHome" mode="widthFix"></image> -->
		<image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_addlaw.png" mode="widthFix" ></image>
		<view class="card flex flexcenter">
			<image class="width360 bottom28" src="/static/images/bt_txt.png" mode="widthFix"></image>
			<view class="input-box ">
				<input v-model="phone" type="number" maxlength="11" placeholder-style="color: #34A482;" placeholder="请输入手机号"/>
			</view>
			<view class="input-box " style="justify-content: space-between;">
				<input v-model="code" type="number" maxlength="6" placeholder-style="color: #34A482;" placeholder="请输入短信验证码"/>
				<view class="code-btn" v-if="time  == 0" @click="getCode" >获取验证码</view>
				<view class="code-btn" v-else>{{time}}s重新发送</view>
			</view>
			<view class="hint bottom32">已覆盖全国33个省份</view>
			<image class="submit " @click="submit" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_zc_btn.png" mode="widthFix"></image>
		</view>
		<image class="bg_bottom" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/hd_5_iimage.png" mode="widthFix" ></image>
		<view class="mask flex hcenter flexcenter" v-if="show" >
			<!-- <view class="download" v-if="show == 2" @click="">
				<image style="width: 686rpx;" src="/static/images/xcx_icon.svg" mode="widthFix"></image>
			</view> -->
			<!-- <view class="flex-column" v-else >
				<image style="width: 600rpx;" src="/static/zccg_image.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往百姓律师APP</view>
			</view> -->
			<view class="flex-column">
				<image v-if="show == 'zccg'" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_zccg.png" mode="widthFix"></image>
				<image v-else-if="show == 'yzc'" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_yzc_image.png" mode="widthFix"></image>
				<image v-else src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_ykt_image.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即前往律师端</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		sendRegisterSms,
		sendRegisterSmsCode,
		// sendStatisticsDownloadPage,
		// sendStatisticsDownload
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				show:false,
				title: '成为百姓律师',
				time:0,
				phone:'',
				code:'',
				// promotion_channel_tag:'',
				user_id:''
			}
		},
		onLoad(e) {
			console.log('打印传参')
			console.log(e)
			// this.promotion_channel_tag = e.promotion_channel_tag
			this.user_id=e.distribute_relationship_invite_user_id
			// if(this.promotion_channel_tag)
			// 	sendStatisticsDownloadPage({promotion_channel_tag:this.promotion_channel_tag})
			const timer = setInterval(()=>{
				if(this.time)
					this.time = this.time - 1
			},1000,1000)
		},
		onShow() {
			// this.getUserInfo()
		},
		methods: {
			toLink(){
				this.show=false
				uni.navigateTo({
					url:'/my/equity/equity'
				})
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
				}
				sendRegisterSms({
					mobile:this.phone,
					code:this.code,
					// from_user_id:this.from_user_id||'',
					// promotion_channel_tag:this.promotion_channel_tag||'',
					// is_only_register:1,
					distribute_relationship_invite_user_id:this.user_id||'',
					invite_level:1
				}).then(res=>{
					if(res.data.code){
						uni.showToast({title:res.data.message,duration:1500,icon:'none'})
					}else{
						if(res.data.data.type==0){
							this.show='zccg'
						}else if(res.data.data.type==1){
							this.show='yzc'
						}else if(res.data.data.type==2){
							this.show='ykt'
							// uni.showToast({title:'已开通',duration:1500,icon:'none'})
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

<style lang="scss" scoped>
	page{
		background: #F8FCED;
	}
	.back{
		width: 40rpx;
		position: absolute;
		top: 72rpx;
		left: 32rpx;
	}
	.marginA{
		margin: auto;
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
		margin: -140rpx auto;
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
		margin-top: 20rpx;
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
		margin-top: 32rpx;
	}
	.bg_bottom{
		width: 100%;margin-top:-391rpx;
	}
	
	.mask{
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
		image{
			width: 600rpx;
		}
	}
	.content {
		background: #F8FCED;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.card {
		display: flex;
		justify-content: center;
		width: calc(100vw - 64rpx);
		padding-bottom: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px 10rpx 20rpx rgba(0, 64, 16, 0.3);
		border-radius: 20rpx;
		margin-top: 32rpx;
		z-index: 2;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
