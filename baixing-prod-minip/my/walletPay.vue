<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar back-icon-color="#333" title="充值" :border-bottom="false" />
		<!-- #endif -->

		<view class="recharge-module">
			<view class="recharge-title">充值金额</view>
			<!-- 自定义输入框 -->
			<view class="recharge-input">
				<text>￥</text>
				<input class="custom-input" v-model="customRechargeMoney" type="number" @focus="activeSysRechargeMoneyIndex = -1" maxlength="6" placeholder="请输入金额" placeholder-style="color: #D8D8D8; font-size: 50rpx;" />
			</view>

			<!-- 系统充值金额列表 -->
			<view class="sys-money-wrap">
				<view v-for="(mItem, mIndex) in sysRechargeMoneyList" :key="mIndex" class="sys-money-item" :class="{ 'sys-money-item-active': activeSysRechargeMoneyIndex === mIndex }" @click="activeSysRechargeMoneyIndex = mIndex">{{ mItem.payment_money }}元</view>
			</view>

			<view class="recharge-btn" @click="submitRecharge">立即充值</view>
			<view class="recharge-protocol">
				<text>充值即代表您已同意</text>
				<text style="color: #0085FF;" @click="toWebView">《百姓律师钱包规则》</text>
			</view>
		</view>

		<view class="divide-ver" />

		<view class="explain-module">
			<view class="explain-item">
				<view class="explain-title">1.关于充值</view>
				<view class="explain-desc">1.1 充值金额为人民币元</view>
				<view class="explain-desc">1.2 充值金额为100的倍数，最低金额不低于100元</view>
				<view class="explain-desc">1.3 充值金额仅支持在平台支付律师费</view>
			</view>
			<view class="explain-item">
				<view class="explain-title">2.账户和信息安全</view>
				<view class="explain-desc">2.1 您应自行设置账号的登录密码和支付密码，予以妥善保管不得外借，并承担由此带来的风险</view>
			</view>
		</view>
	</view>
</template>

<script>
import * as apis from '@/api/apis.js';

export default {
	data() {
		return {
			multiple: 100,
			share: null,

			sysRechargeMoneyList: [], // 系统充值金额列表
			activeSysRechargeMoneyIndex: 0, // 激活的系统充值金额下标 
			customRechargeMoney: '', // 自定义充值金额
		}
	},
	onLoad() {
		this._getSysActivityPayList()
	},
	onShareAppMessage(e) {
		if (e.from === 'button' && this.share) {
			return {
				title: this.share.title,
				path: this.share.wechat_mini_program.path,
				imageUrl:this.share.wechat_mini_program.cover_image
			}
		} else {
			return {
				title:'一站式普惠法律服务',
				imageUrl:'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png?324324324'
			}
		}
	},
	methods: {
		/**
		 * 获取系统提供充值金额列表
		 */
		async _getSysActivityPayList() {
			// 获取充值活动列表
			const res = await apis.getActivityPay();
			if (res.data.code !== 0) return;
			this.sysRechargeMoneyList = res.data.data
		},
		/**
		 * 进入钱包规则 webview
		 */
		toWebView(type){
			const url = getApp().globalData.config.wallet;
			uni.navigateTo({ url:'/pagesV1/common/webview?url='+ url });
		},
		/**
		 * 提交充值
		 */
		async submitRecharge() {
			// 充值金额
			const rechargeMoney = this.activeSysRechargeMoneyIndex < 0 ? this.customRechargeMoney : this.sysRechargeMoneyList[this.activeSysRechargeMoneyIndex].payment_money

			// 测试输入金额规则
			if (this.activeSysRechargeMoneyIndex < 0) {
				if (!rechargeMoney.trim()) return this.$u.toast('请输入充值金额');
				// 判断字符串是否为正整数数字
				const numRegExp = /^[1-9]+[0-9]*]*$/;
				const testResult = numRegExp.test(rechargeMoney.trim());
				if (!testResult) return this.$u.toast('请输入整数金额');
				// 判断金额是否为 100 的倍数
				if (parseInt(rechargeMoney.trim(), 10) % this.multiple !== 0) return this.$u.toast('充值金额需为100的倍数');
			}

			try {
				// 获取支付订单号
				const orderRes = await apis.getCreateOrder({ payment_money: Number(rechargeMoney) });
				if (orderRes.data.code !== 0) return;
				// 获取支付信息
				const payRes = await apis.getPay({
					// #ifdef MP-WEIXIN
					type: 1,
					// #endif
					//#ifdef MP-TOUTIAO
					type: 3,
					//#endif
					order_no: orderRes.data.data.order_no
				});

				if (payRes.data.code !== 0) return;

				// 微信充值 api
				uni.requestPayment({
					provider: uni.getStorageSync('provider'),
					//#ifdef MP-TOUTIAO
					service: 5,
					orderInfo: payRes.data.data,
					//#endif
					
					// #ifdef MP-WEIXIN
					timeStamp: payRes.data.data.timeStamp,
					nonceStr: payRes.data.data.nonceStr,
					package: payRes.data.data.package,
					paySign: payRes.data.data.paySign,
					signType: payRes.data.data.signType,
					// #endif
					success: res => {
						console.log(res)
						// #ifdef MP-TOUTIAO
						if(res.code != 0) return
						// #endif
						this.$u.toast('充值成功')
					},
					fail: res => {
						console.log(res.errMsg)
					}
				})
			} catch(error) {
				console.log(error)
			}
		},
	},
}
</script>

<style lang="scss">
.divide-ver {
	height: 16rpx;
	background: #F5F5F5;
}

.recharge-module {
	padding: 24rpx;
	.recharge-title {
		@include font-style(32rpx, 500);
		margin-bottom: 30rpx;
	}
	.recharge-input {
		@include flex-xy-layout(flex-start);
		@include font-style(40rpx);
		margin-bottom: 50rpx;
		.custom-input {
			@include font-style(50rpx);
			flex: 1;
			margin-left: 10rpx;
		}
	}
	.sys-money-wrap {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 24rpx;
		.sys-money-item {
			@include flex-xy-layout;
			@include font-style(32rpx, 500);
			height: 138rpx;
			border-radius: 24rpx;
			border: 2rpx solid #F5F5F5;
			&.sys-money-item-active {
				color: #0085FF;
				border-color: #0085FF;
				background: #EEF7FF;
			}
		}
	}
	.recharge-btn {
		@include element-size(auto, 88rpx, 45rpx);
		@include flex-xy-layout;
		@include font-style(30rpx, 500);
		color: #fff;
		background: #0085FF;
		margin: 30rpx 0;
		margin-bottom: 20rpx;
	}
	.recharge-protocol {
		@include font-style(28rpx);
		text-align: center;
		color: #666;
	}
}

.explain-module {
	padding: 24rpx;
	.explain-item {
		margin-bottom: 40rpx;
		&:last-child { margin-bottom: 0; }	
		.explain-title {
			@include font-style(32rpx, 500);
			margin-bottom: 20rpx;
		}
		.explain-desc {
			@include font-style(28rpx);
			color: #666;
			margin-bottom: 18rpx;
			&:last-child { margin-bottom: 0; }
		}
	}
}
</style>
