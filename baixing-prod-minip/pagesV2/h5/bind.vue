<template>
	<view class="marlr32" style="padding-top: 216upx;">
		<text class="title">请绑定手机号码</text>
		<view class="cell">
			<u-input height="45" :clearable="false" type="number" maxlength="11" placeholder="请输入您的手机号"  placeholder-style="color:#222" class="center" v-model="mobile" />
			
			<u-verification-code start-text="发送验证码" ref="uCode" change-text="重新发送(Xs)" @change="codeChange">
			</u-verification-code>
		</view>
		<view class="cell flex-row">
			<u-input v-model="code" placeholder-style="color:#222" :clearable="false" height="45" type="number" maxlength="6" placeholder="请输入验证码" class="center" />
			<text :class="['right',tips=='发送验证码'||tips=='重新发送'?'':'disable']" @tap="getCode">{{tips}}</text>
		</view>
		<view class="submit" @click="submit">登录</view>
	</view>
</template>

<script>
	import {
		sendLoginSms,
		sendLoginSmsCode,
		getMyData
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				tips:'',
				mobile:'',
				code:''
			}
		},
		methods: {
			submit(){
				if (this.mobile.length < 11) {
					this.$u.toast('请填写正确手机号');
					return
				}else if(this.code.length !=6){
					this.$u.toast('请填写6位验证码');
					return
				}
				sendLoginSms({mobile:this.mobile,code:this.code}).then(res=>{
					if (!res.data.code) {
						uni.setStorage({
							key: "token",
							data: res.data.data.access_token
						})
						uni.setStorage({
							key: "rong_cloud_token",
							data: res.data.data.rong_cloud_token
						})
						uni.setStorage({
							key: "user_id",
							data: res.data.data.user_id
						})
						getApp().globalData.imF(this);
						getMyData().then(res => {
							uni.setStorage({
								key: "mobile",
								data: res.data.data.mobile
							})
							uni.setStorage({
								key: "is_vip",
								data: res.data.data.is_vip
							})
							uni.setStorage({
								key: "is_customer",
								data: res.data.data.is_customer
							})
							uni.setStorage({
								key: "photo",
								data: res.data.data.avatar,
							})
							uni.setStorage({
								key: "weChat",
								data: res.data.data.wechat_number,
							})
							uni.setStorage({
								key: "type",
								data: res.data.data.type,
								// data:1
							})
							uni.setStorage({
								key: "is_lawyerStore",
								data: res.data.data.is_lawyer_store,
							})
							uni.setStorage({
								key: "is_guarantee",
								data: res.data.data.is_guarantee,
							})
							uni.setStorage({
								key: "nickname",
								data: res.data.data.nickname
							})
							uni.setStorage({
								key: "balance",
								data: res.data.data.balance
							})
							uni.setStorage({
								key: "is_set_deal_password",
								data: res.data.data.is_set_deal_password
							})
						})
						setTimeout(()=>{
							uni.navigateBack()
						},500)
						return
					}
					uni.showToast({
						title:"登录失败",
						icon:"none"
					})
					
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.mobile.length < 11) {
					this.$u.toast('请填写正确手机号');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					sendLoginSmsCode({
						mobile: this.mobile
					}).then(res => {
						uni.hideLoading();
						if (res.data.code == 0) {
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						} else {
							this.$u.toast('验证码发送失败请重试');
							console.log(res)
						}
					}, res => {
						uni.hideLoading();
						this.$u.toast('验证码发送失败请重试');
					})
					// setTimeout(() => {
					// 	uni.hideLoading();
					// 	// 这里此提示会被this.start()方法中的提示覆盖
					// 	this.$u.toast('验证码已发送');
					// 	// 通知验证码组件内部开始倒计时
					// 	this.$refs.uCode.start();
					// }, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
		},
		onReady(){
			uni.setNavigationBarTitle({
				title: `短信登录`
			})
		}
	}
</script>

<style scoped lang="scss">
	
	.submit{
		height: 94upx;
		line-height: 94upx;
		background: #0061FF;
		color: #fff;
		opacity: 1;
		text-align: center;
		border-radius: 100upx;
		margin-top: 100upx;
		font-size: 36upx;
	}
	.title{
		line-height: 67px;
		font-size: 48upx;
		 
		font-weight: 500;
		color: #222222;
	}
	.cell{
		line-height: 45upx;
		padding: 46upx 0 29upx 0;
		font-size: 32upx;
		 
		font-weight: 500;
		color: #222222;
		opacity: 1;
		border-bottom: 1upx solid #ECEFF4;
		.center{
			font-size: 32upx;
			flex: 1;
		}
	}
	.right{
		border: 2upx solid #5B9BFB;
		padding: 9upx 12upx;
		opacity: 1;
		border-radius: 8upx;
		line-height: 33upx;
		font-size: 24upx;
		 
		text-align: center;
		color: #5B9BFB;
		
	}
	.disable{
		border: 2upx solid #CBD5E5;
		color: #CBD5E5;
	}
</style>
