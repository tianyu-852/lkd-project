<template>
	<view>
		<u-navbar back-icon-color="#fff" background="{background:transparent}" :border-bottom="false"></u-navbar>
		<view class="page">
			<view class="head">
					<text class="text">零钱提现</text>
				<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662693816053-dYi7D5.png" mode="widthFix"></image>
			</view>
			<view class="marlr32 martop28">
				<view class="title bottom8">
					<view class="font32">
						<text class="color14284A">提现金额</text>
						<text class="color6E7695 left12">({{info.balance}}元)</text>
					</view>
					<!-- <text @click="hintPop=true">提现说明</text> -->
				</view>
				<view class="flex between hcenter borderB">
					<view class="">
						<!-- <view class="symbol">￥</view> -->
						<input v-model="val" type="digit" placeholder="输入金额" class="input" @input="oninput" :maxlength="moneyMaxLeng" />
					</view>
					<view class="martop36 allGetNum" @click="setVal">全部提现</view>
				</view>
				<view class="martop20">
		<!-- 			<view class="flex between hcenter bottom16">
						<view class="flex hcenter" @click="hintPop=true">
							<text class="color6E7695">可提现金额</text>
							<image src="/static/images/yw_icon.png" class="width30 left12" mode="widthFix"></image>
						</view>
						<text>{{info.withdrawable_balance}}元</text>
					</view>
					<view class="flex between hcenter bottom16">
						<text class="color6E7695">补贴余额(不可提现)</text>
						<text>{{info.subsidy_balance}}元</text>
					</view>
					<view class="flex between hcenter">
						<text class="color6E7695">可用余额</text>
						<text>{{info.balance}}元</text>
					</view> -->
					<text class="color6E7695 lineH40">{{info.rule_text}}</text>
				</view>
				<view class="foot center color6E7695">
					<view class="">
						提现即代表您已同意
						<text class="color0061FF" @click="toWebView(2)">钱包使用规则</text>
						<!-- <text class="color0061FF" @click="toWebView(0)">百姓律师用户协议</text>、 -->
						<!-- <text class="color0061FF" @click="toWebView(1)">隐私协议</text> -->
					</view>
					<view class="button" @click="getMoney">提现</view>
				</view>
			</view>
		</view>
		<u-popup mode="center" v-model="password.status" border-radius="56" v-if="password.status">
			<view class="passwordBox relative">
				<image src="/static/images/nav_tj_icon.png" class="close" mode="widthFix" @click="password.status=false"></image>
				<view class="passWordText center" v-if="is_set_deal_password==0">{{password.code1?'请再次输入密码':'请设置支付密码'}}</view>
				<view class="passWordText center" v-if="is_set_deal_password==1">请输入支付密码</view>
				<view class="passWordNum center" v-if="is_set_deal_password==1">￥<text>{{val}}</text></view>
				<u-message-input :value="password.value" dot-fill :maxlength="6" :focus="true" @finish="setCode"></u-message-input>
				<view class="passWordHint" v-if="is_set_deal_password==0">{{passWordHint}}</view>
				<view class="passWordLink font30 bold" v-if="is_set_deal_password==1" @click="toLink('/pages/wallet/setPassword')">忘记密码？</view>
			</view>
		</u-popup>
		<u-popup mode="center" v-model="hintPop" border-radius="56">
			<view class="hintBox">
				<view class="title">提现说明</view>
				<view class="text">
					1.仅支持剩余本金全部提现，剩余未使
					用补贴即时清零<br>
					2.收款的微信账号必须已实名认证，否
					则体现不成功。每笔提现微信将收取提
					现金额<text>千分之六</text>的手续费，不足1元按1
					元收取提现金额小于1000元时，另外加
					收1元/笔手续费
				</view>
				<!-- <view class="hint">版权归百姓律师所有</view> -->
				<view class="btn" @click="hintPop=false">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		setTransactionPassword,
		getWithdrawConfig,
		getUserProtocol,
		getWithdraw
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				val: '',
				type: 0,
				info: '',
				passWordHint:'请输入六位不同数字的密码',
				moneyMaxLeng: 5,
				is_set_deal_password: 0,
				hintPop: false,
				password: {
					status: false,
					inputStatus: false,
					code1: null,
					code2: null,
					value: ''
				}
			}
		},
		methods: {
			toLink(e){
				uni.navigateTo({
					url:e
				})
			},
			/**
			 * 提现 & 设置密码
			 */
			setCode(e) {
				console.log(e)
				if(this.is_set_deal_password){//有设置过密码
					getWithdraw({
						money:this.val,
						deal_password:e
					}).then(res=>{
						this.password.status = false;
						if(res.data.code==0){
							uni.$u.toast('申请成功，请等待审核',1000)
							this.getBalance();
						}else{
							uni.$u.toast(res.data.message)
						}
						
					})
					return
				}
				if (!this.password.code1) {
					console.log('再次输入')
					this.password.status=false
					this.password.code1 = e;
					this.passWordHint='请再次输入密码'
					// this.password.value=e.slice(0,3)
					setTimeout(()=>{
						this.password.status=true
					},300)
					return
				}
				this.password.status = false;
				if (this.password.code1 == e) {
					setTransactionPassword({
						deal_password:e
					}).then(res => {
						console.log(res)
						this.is_set_deal_password = true;
						uni.setStorage({
						    key: 'is_set_deal_password',
						    data: 1,
						    success: function () {
						        uni.showToast({
						        	title: "设置成功",
						        })
						    }
						});
					})
					this.password.code1 = null
					return
				}
				
				this.password.code1 = null
				this.passWordHint='两次密码不一致'
				uni.showToast({
					icon: "none",
					title: "两次密码不一致"
				})
			},
			toWebView(type){
				// var url=!type?getApp().globalData.protocol.user_service:getApp().globalData.protocol.privacy_policy
				uni.navigateTo({
					url:'/pagesV1/common/webview?url='+getApp().globalData.config.wallet
				})
			},
			getMoney() {
				console.log(this.val)
				if(!this.val){
					uni.$u.toast('请输入提现金额')
					return
				}
				if(this.val<=0){
					uni.$u.toast('提现金额不能少于0元')
					return
				}
				uni.getStorage({
					key: 'is_set_deal_password',
					complete: res => {
						this.is_set_deal_password = res.data;
						this.password.status = true;
						setTimeout(() => {
							this.getBalance();
							this.password.inputStatus = true;
						}, 100)
						if (res.data) { //有交易密码
							
							return
						}
					}
				});

			},
			oninput(e) {
				this.$nextTick(() => {
					let val = e.target.value.toString();
					val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
					val = val.replace(/^0+\./g, '0.');
					val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
					val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''

					if (val.includes(".")) {
						let numDian = val.toString().split(".")[1].length;
						if (numDian === 2) {
							this.moneyMaxLeng = val.length;
						}
					} else {
						this.moneyMaxLeng = 8;
					}
					this.val = val;
				});
			},
			getBalance() {
				// console.log(uni.getStorageSync('balance'))
				// this.$set(this, "Balance", uni.getStorageSync('balance'))
				getWithdrawConfig().then(res=>{
					if(res.data.code==0){
						this.info=res.data.data
						uni.setStorage({
							key: "balance",
							data: res.data.data.balance
						})
					}
				})
			},
			setVal() {
				this.$set(this, "val", this.info.withdrawable_balance||0)
				// if(this.wType==0){
				// 	this.$set(this, "val", this.info.total||0)
				// }else if(this.wType==1){
				// 	this.$set(this, "val", this.info.refund||0)
				// }else{
				// 	this.$set(this, "val", this.info.turnover||0)
				// }
			},
			
			
		},
		onLoad(e) {
			// this.$set(this, "type", uni.getStorageSync('type'))
			this.getBalance();
		},
		onShow() {
			if(uni.getStorageSync('token')) this.getBalance();
			
		}
	}
</script>

<style lang="scss">
	.page{
		width: 100%;
		position: absolute;
		top: 0; 
	}
	.head{
		width: 100%;
		height: 320rpx;
		position: relative;
		background: linear-gradient(316deg, #4576FB 0%, #6995FE 100%);
		border-radius: 0px 0px 0px 80rpx;
		z-index: -1;
		.text{
			font-size: 48rpx;
			font-weight: bold;
			line-height: 60rpx;
			color: #FFFFFF;
			text-shadow: 0px 3rpx 6rpx rgba(0, 35, 212, 0.1);
			letter-spacing: 20rpx;
			position: absolute;
			bottom: 48rpx;
			left: 48rpx;
		}
		image{
			width: 380rpx;
			position: absolute;
			right: 0;
			top: 0;
			z-index: +11;
			
		}
	}
	.lineH40{
		font-size: 26rpx;
		line-height: 40rpx;
	}
	.passwordBox {
		padding: 32rpx 36rpx 42rpx;
		.close{
			width: 48rpx;
			position: absolute;
			top: 32rpx;
			left: 24rpx;
		}
		.passWordText {
			font-size: 34rpx;
			font-weight: bold;
			margin-bottom: 80rpx;
			color: #14284A;
		}
		.passWordHint{
			font-size: 30rpx;
			font-weight: bold;
			color: #5B6A91;
			margin: 80rpx 0;
			text-align: center;
		}
		.passWordNum{
			font-size: 50rpx;
			font-weight: 800;
			padding-bottom: 80rpx;
			border-bottom: 1rpx solid #ECEFF4;
			margin-bottom: 40rpx;
			text{
				font-size: 80rpx;
				font-weight: 500;
			}
		}
		.passWordLink{
			color: #5B6A91;
			text-align: right;
			margin-top: 50rpx;
		}
	}
	.hintBox{
		width: 620upx;
		text-align: center;
		padding: 36upx 36upx 40upx;
		font-size: 30upx;
		font-weight: bold;
		line-height: 58upx;
		color: #6E7695;
		.title{
			color: #222;
			margin-bottom: 36upx;
		}
		.hint{
			color: #8994B1;
			font-size: 28upx;
		}
		.text{
			text-align: left;
			text{
				color: #FF6E57;
			}
		}
		.btn{
			color: #fff;
			height: 88upx;
			line-height: 88upx;
			background: #0061FF;
			box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
			border-radius: 20upx;
			margin-top: 40upx;
		}
	}
	.foot{
		margin-top: 100rpx;
		.button {
			width: 600rpx;
			margin: 32rpx auto 0;
			line-height: 100rpx;
			background: #3764FF;
			font-size: 36rpx;
			box-shadow: 0rpx 12rpx 32rpx rgba(9, 58, 255, 0.4);
			border-radius: 100rpx;
			color: #fff;
		}
	}
	

	.borderB {
		border-bottom: 1px solid #ECEFF4;
		padding-bottom: 28rpx;
	}

	.allGetNum {
		font-size: 28rpx;
		color: #0061FF;
		font-weight: bold;
		// margin-left: 40rpx;
	}

	.BalanceNum {
		font-size: 28rpx;
	}
	.agreement{
		margin: 45rpx auto 32rpx;
		text-align: center;
	}
	.input {
		height: 69rpx;
		font-size: 56rpx;
		font-weight: bold;
		width: 500rpx;
	}

	.symbol {
		height: 97upx;
		font-size: 50rpx;
		color: #222222;
		text-align: end;
		line-height: 124upx;
	}

	page {
		color: #222222;
	}

	// .title {
	// 	// font-size: 34rpx;
	// 	// font-weight: bold;
	// 	text{
	// 		font-size: 30upx;
	// 		font-weight: 500;
	// 		line-height: 48upx;
	// 		color: #888D98;
	// 	}
	// }
</style>
