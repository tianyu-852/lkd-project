<template>
	<view>
		<view class="orderBox">
			<view class="flex-row item">
				<text class="u-flex-1">订单类型</text>
				<text>{{order.order_title}}</text>
			</view>
			<view class="flex-row item">
				<text class="u-flex-1">价格</text>
				<text>￥{{order.money_real}}</text>
			</view>
			<view class="flex-row item">
				<text class="u-flex-1">会员折扣价</text>
				<text class="colorFF6E57 bold">￥{{order.money_real}}</text>
			</view>
			<!-- <view class="vipBox flex hcenter between marlr32 bottom16" v-if="!isVip">
				<view class="flex hcenter">
					<image src="/static/images/hy_icon.png" class="width40" mode="widthFix"></image>
					<view class="left8 width400 line1">立享会员专属福利价</view>
				</view>
				<view class="flex hcenter" @click="toPay">
					<text class="bold">开通会员</text>
					<u-icon name="play-right-fill" class="left8" color="#FC384C" size="16"></u-icon>
				</view>
			</view> -->
		</view>
		<view class="pay">
			<view class="flex-row item" @click="payType = 2">
				<view class="u-flex-1">
					<view class="bottom16 flex hcenter">
						<image class="logo" src="/pagesV2/static/images/ic_pay_sum.png"></image>
						<text>余额支付</text>
						<text class="tag">平台百亿补贴</text>
					</view>
					<view class="">
						<!-- <text class="left40 font24" style="color: #C9CED9;">剩余{{order.balance}}元{{ order.balance < order.money_real ?'(余额不足)':'' }}</text> -->
						<text class="left40 font24" style="color: #C9CED9;">剩余{{order.balance}}元</text>
						<text class="color0061FF font26 left40 bold" @click="toLink('/my/walletPay')">立即充值</text>
					</view>
				</view>
				<u-icon :name="payType == 2? 'checkmark-circle-fill' : 'checkmark-circle'" size="36" :color="payType == 2?'#0061FF':'#888D98'"></u-icon>
			</view>
			<!-- <view class="martop20">
				<vipHint></vipHint>
			</view> -->
			<view class="flex hcenter item martop20" style="line-height: 98rpx;" @click="payType = 1">
				<!-- #ifdef MP-TOUTIAO -->
				<image class="logo" src="/pagesV2/static/images/ic_pay_dy.png"></image>
				<text class="u-flex-1">抖音支付</text>
				<!-- #endif -->
				<!-- #ifndef MP-TOUTIAO -->
				<image class="logo" src="/pagesV2/static/images/ic_pay_wx.png"></image>
				<text class="u-flex-1">微信支付</text>
				<!-- #endif -->
				<u-icon :name="payType == 1? 'checkmark-circle-fill' : 'checkmark-circle'" size="36" :color="payType == 1?'#0061FF':'#888D98'"></u-icon>
			</view>
		</view>
		<view class="foot flex between">
			<view class="left32 martop20">{{isVip?'会员折扣价':'原价'}}<text class="font40 bold">{{isVip?order.money_real:order.money_real}}</text>元</view>
			<view class="subBtn" @click="clickPay">立即支付</view>
		</view>
		<u-popup mode="top" v-model="password.status" duration="0">
			<view class="passwordBox">
				<view class="passWordText center" v-if="is_set_deal_password==0">{{password.code1?'请再次输入密码':'您还没有设置过密码,请设置密码'}}</view>
				<view class="passWordText center" v-if="is_set_deal_password==1">请输入密码</view>
				<u-message-input mode="bottomLine" :dot-fill="true" :maxlength="6" :focus="password.inputStatus" @finish="setCode"></u-message-input>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getPay,
		getPayOrder,
		setTransactionPassword,
		getWalletDetail
	}from '@/api/apis.js'
	export default {
		data() {
			return {
				payType: 1,
				order_no: null,
				order: null,
				moneyMaxLeng: 5,
				is_set_deal_password: null,
				hintPop: false,
				deal_password: null,
				fundraising_id: null,
				password: {
					status: false,
					inputStatus: false,
					code1: null,
					code2: null
				}
			}
		},
		methods: {
			toLink(e){
				uni.navigateTo({
					url:e
				})
			},
			getBalance() {
				// console.log(uni.getStorageSync('balance'))
				// this.$set(this, "Balance", uni.getStorageSync('balance'))
				getWalletDetail().then(res=>{
					if(res.data.code==0){
						this.info=res.data.data
					}
				})
			},
			setCode(e) {
				if(this.is_set_deal_password){//有设置过密码
					this.deal_password=e
					this.getPayment()
					this.password.status = false
					return
				}
				if (!this.password.code1) {
					this.password.code1 = e;
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
				uni.showToast({
					icon: "none",
					title: "两次密码不一致"
				})
			},
			clickPay(e){
				const {order,payType} =this
				if(payType == 0||!order){
					this.$u.toast('请选择支付方式')
					return
				}
				console.log(order.balance,order.money_real)
				if(payType == 2 && (parseFloat(order.balance) < parseFloat(order.money_real))){
					this.$u.toast('余额不足')
					return
				}
				if(payType == 2)
					uni.getStorage({
						key: 'is_set_deal_password',
						complete: res => {
							this.is_set_deal_password = res.data;
							this.password.status = true;
							setTimeout(() => {
								// this.getBalance();
								this.password.inputStatus = true;
							}, 100)
							if (res.data) { //有交易密码
								// this.getPayment()
							}
						}
					})
				else
					this.getPayment()	
			},
			getPayment(){
				const {order_no,payType,deal_password} = this
				getPay({
					// #ifdef MP-WEIXIN
					type: payType == 1? 1:0,
					// #endif
					//#ifdef MP-TOUTIAO
					type: payType == 1? 3:0,
					//#endif
					//#ifdef H5
					type: 1,
					//#endif
					deal_password:deal_password?deal_password:'',
					order_no:order_no
				}).then(res => {
					if(res.data.code){
						this.$u.toast(res.data.message)
						return
					}else if(payType == 1){
						const order = res.data.data
						// #ifndef H5
						uni.requestPayment({
							provider: uni.getStorageSync('provider'),
							//#ifdef MP-TOUTIAO
							service:5,
							orderInfo:order,
							//#endif
							// #ifdef MP-WEIXIN
							timeStamp: order.timeStamp,
							nonceStr: order.nonceStr,
							package: order.package,
							paySign: order.paySign,
							signType: order.signType,
							// #endif
							success: res => {
								// #ifdef MP-TOUTIAO
								if(res.code != 0){
									return
								}
								// #endif
								const eventChannel = this.getOpenerEventChannel()
								eventChannel.emit('over',true);
								uni.navigateBack()
							}
						})
						// #endif
						// #ifdef H5
						this.isWeixin = this.isWechat()
						if(this.isWeixin){
							this.paytoh5(res.data.data)
						}else{
							window.location.href=res.data.data.mweb_url+'&redirect_url=https://uni.lawkd.com/pagesV2/index/detail/feedBack/feedBack?id='+this.fundraising_id
						}
						// #endif
					}else if(payType == 2){
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('over',true);
						console.log('1111')
						uni.navigateBack()
						this.$u.toast('支付成功')
					}
				})
			},
			isWechat() {
				return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
			},
			paytoh5(data){
				console.log(data)
				var jweixin = require('jweixin-module');
				jweixin.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp:data.timeStamp, // 必填，生成签名的时间戳
					nonceStr:data.nonceStr, // 必填，生成签名的随机串
					signature:data.paySign, // 必填，签名，见附录1
					jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				jweixin.ready(function() {
					jweixin.checkJsApi({
						jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
						success: function(res) {
							console.log('checkjsapi Success')
							console.log(res);
						},
						fail:function(res) {
							console.log('res')
							console.log(res);
						}
					});
					jweixin.chooseWXPay({
						timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
						package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.paySign, // 支付签名
						success:function(res) {
							// 支付成功后的回调函数
							console.log('paysuccess')
							console.log(this.fundraising_id)
							if(this.fundraising_id){
								uni.navigateTo({
								    url: '/pagesV2/index/detail/feedBack/feedBack?id='+this.fundraising_id
								});
							}
							uni.navigateBack({
								
							})
							uni.showToast({
								icon:"none",
								title:"支付成功"
							})
							
						},
						cancel: function(r) {
						  
						},
						fail:function(res) {
							console.log('payfail')
							console.log(res)
						}
					});
				});
				 
				jweixin.error(function(res) {
					console.log('error')
					console.log(res)
					uni.showToast({
						icon: 'none',
						title: '支付失败了',
						duration: 4000
					});
						// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
						/*alert("config信息验证失败");*/
				})
			}
		},
		onLoad(e){
			this.order_no = e.id
			this.fundraising_id=e.fundraising_id||0
			getPayOrder({
				order_no:e.id
			}).then(res =>{
				if(res.data.code){
					this.$u.toast(res.data.message)
				}else{
					this.order = res.data.data
					console.log(this.order)
				}
				
			})
		}
	}
</script>

<style scoped lang="scss">
	/deep/.u-drawer-top{
		background: #fff !important;
	}
	.passwordBox {
		padding: 100rpx 0;
	}
	.orderBox{
		border-top: 20upx solid #F5F7FA;
		border-bottom:12upx solid #F5F7FA;
		.item{
			line-height: 109upx;
			margin:0 32upx;
			border-bottom: 1upx solid #ECEFF4;
			font-size: 32upx;
			color: #222222;
			&:last-child{
				border-bottom: none;
			}
		}
		.item:last-child{
			border-bottom:0;
		}
	}
	
	.pay{
		padding: 32rpx 20rpx 0;
		.item{
			height: 146rpx;
			// border-bottom: 1upx solid #ECEFF4;
			font-size: 32upx;
			color: #222222;
			background: #F5F7FA;
			border-radius: 20rpx;
			padding: 24rpx 36rpx 24rpx 24rpx;
			.logo{
				width: 32upx;
				height: 32upx;
				margin-right: 12upx;
			}
			.tag{
				color: #fff;
				font-size: 22upx;
				line-height: 36upx;
				padding: 3rpx 14rpx;
				margin-left: 20rpx;
				background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
				border-radius: 16upx 2upx 16upx 4upx;
			}
		}
	}
	.foot{
		width: 100%;
		height: 110rpx;
		color: #fff;
		position: fixed;
		bottom: 0;
		background: #424864;
		.subBtn{
			width: 285upx;
			height: 120upx;
			margin-top: -10rpx;
			line-height: 110upx;
			font-size: 32upx;
			font-weight: bold;
			text-align: center;
			background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_zf_bg.png');
			background-size: 100% 100%;
			
		}
	}
	
</style>
