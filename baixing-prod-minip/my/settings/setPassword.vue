<template>
	<view>
		<view class="mobile">
			<view class="marlr32">
				当前登录手机号码:{{mobile}}
			</view>
		</view>
		<view class="marlr32 flex between item hcenter">
			<view class="flex hcenter codeInput">
				<view class="text">输入验证码</view>
				<input type="number" placeholder="请输入验证码" v-model="code.verificationCode"/>
			</view>
			<view class="codeBtn">
				<u-verification-code ref="uCode" @change="codeChange" @end="end"></u-verification-code>
				<view :class="['Countdown',timeStatus?'activeCountdown':'']" @click="startCode">{{tips}}</view>
			</view>
		</view>
		<u-gap height="12" bg-color="#F5F7FA"></u-gap>
		<view class="marlr32 flex between item item1 hcenter">
			<view class="flex hcenter">
				<view class="text">输入新密码</view>
				<input type="number" placeholder="请输入新密码" v-model="code.password"/>
			</view>
		</view>
		<view class="marlr32 flex between item item1 hcenter">
			<view class="flex hcenter">
				<view class="text">再次输入</view>
				<input type="number" placeholder="请在次输入密码" v-model="code.password1"/>
			</view>
		</view>
		<view class="marlr32 button center" @click="setPassword">修改</view>


	</view>
</template>

<script>
	import {
		sendSMS,
		setTransactionPassword
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				mobile: null,
				tips: null,
				timeStatus: false,
				code:{
					verificationCode:null,
					password:null,
					password1:null
				}
			}
		},
		methods: {
			setPassword() {
				if(this.code.verificationCode != null&&this.code.password != null&&this.code.password1 != null){
					if(this.code.password == this.code.password1){
						setTransactionPassword({
							code:this.code.verificationCode,
							deal_password:this.code.password
						}).then(res=>{
							if(!res.data.code){
								uni.showToast({
									title:"修改成功",
									success:()=>{
										uni.navigateBack({
											delta:1
										})
									}
								})
								return
							}
							uni.showToast({
								icon:"none",
								title:res.data.message
							})
						})
						return
					}
					uni.showToast({
						icon:"none",
						title:"两次密码不一致"
					})
					return
				}
				uni.showToast({
					icon:"none",
					title:"请填写完整"
				})
			},
			end() {
				this.timeStatus = false
			},
			codeChange(text) {
				this.tips = text;
			},
			startCode() {
				if (this.$refs.uCode.canGetCode) {
					this.$refs.uCode.start();
					this.timeStatus = true;
					sendSMS();
				}

			}
		},
		onLoad() {
			console.log(uni.getStorageSync("mobile"))
			this.mobile = uni.getStorageSync("mobile")

		}
	}
</script>

<style lang="scss">
	.button {
		line-height: 100rpx;
		background: #0061FF;
		border-radius: 8rpx;
		font-size: 36rpx;
		color: #FFFFFF;
		margin-top: 69rpx;
	}

	.item1 {
		border-bottom: 1rpx solid #ECEFF4;
	}

	.activeCountdown {
		color: #CBD5E5 !important;
		border: 2rpx solid #CBD5E5 !important;
	}

	.Countdown {
		font-size: 24rpx;
		color: #5B9BFB;
		border: 2rpx solid #5B9BFB;
		border-radius: 8rpx;
		padding: 8rpx 12rpx;
	}

	.item {
		padding: 32rpx 0;
		.codeInput{
			width: calc(100% - 160upx);
			input{
				width: calc(100% - 200upx);
			}
		}
		.codeBtn{
			max-width: 160upx; 
		}
	}

	.text {
		width: 170rpx;
		font-size: 34rpx;
		margin-right: 30rpx;
	}

	.mobile {
		background: #F5F7FA;
		font-size: 28rpx;
		color: #888D98;
		padding: 20rpx 0;
	}
</style>
