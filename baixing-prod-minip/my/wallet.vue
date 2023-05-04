<template>
	<view>
		<view class="marlr32">
			<view class="frist">
				<view class="pad32">
					<view class="top flex between hcenter">
						<view class="text">我的钱包</view>
						<image :src="status?'/static/images/yc_icon.png':'/static/images/xs_icon.png'" mode="widthFix" @click="setStatus"></image>
					</view>
					<view class="bottom">
						<view class="text">资产总额(元)</view>
						<view class="num flex between">
							<text>{{ status ? '***' : info.total}}</text>
							<view class="btn" v-if="type" @click="toGetMoney(0)">全部提现</view>
						</view>
					</view>
				</view>
			</view>
			<view class="second">
				<view class="second-box" v-if="type==0">
					<view class="top flex between hcenter" @click="toLink('walletPay')">
						<view class="flex hcenter">
							<image src="/static/images/zf1_icon.png" mode="widthFix" class="icon"></image>
							<view class="text">充值</view>
						</view>
						<view class="flex hcenter">
							<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
						</view>
					</view>
					<!-- #ifndef MP-TOUTIAO || MP-KUAISHOU -->
					<view class="top flex between hcenter" @click="toGetMoney(0)">
						<view class="flex hcenter">
							<image src="/static/images/zf2_icon.png" mode="widthFix" class="icon"></image>
							<view class="text">提现</view>
						</view>
						<view class="flex hcenter">
							<view class="text1"></view>
							<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
						</view>
					</view>
					<!-- #endif -->
					<view class="top flex between hcenter" @click="toLink('settings/setPassword')">
						<view class="flex hcenter">
							<image src="/static/images/zfmm_icon.png" mode="widthFix" class="icon"></image>
							<view class="text">设置支付密码</view>
						</view>
						<view class="flex hcenter">
							<view class="text1"></view>
							<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
						</view>
					</view>
				</view>

				<view class="second-box" v-if="type==1">
					<view class="top flex between hcenter" @click="toLink('walletList?type=1')">
						<view class="flex hcenter">
							<image src="/static/images/zf1_icon.png" mode="widthFix" class="icon"></image>
							<view>
								<view class="text1">
									<text>费用退款</text>
									<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
								</view>
								<view class="text flex hcenter">
									<text>{{info.refund||'0.00'}}</text>
									<view class="tag">免提现费</view>
								</view>
							</view>
						</view>
						<view class="btn" @click.stop="toGetMoney(1)">提现</view>
					</view>
					<view class="top flex between hcenter" @click="toLink('walletList?type=2')">
						<view class="flex hcenter">
							<image src="/static/images/zf2_icon.png" mode="widthFix" class="icon"></image>
							<view>
								<view class="text1">
									<text>订单收费</text>
									<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
								</view>
								<view class="text">{{info.turnover||'0.00'}}</view>
							</view>
						</view>
						<view class="btn" @click.stop="toGetMoney(2)">提现</view>
					</view>
					<view class="top flex between hcenter" @click="toLink('walletList?type=3')">
						<view class="flex hcenter">
							<image src="/static/images/zf3_icon.png" mode="widthFix" class="icon"></image>
							<view>
								<view class="text1">
									<text>待完成订单</text>
									<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
								</view>
								<view class="text">{{info.pending_income||'0.00'}}</view>
							</view>
						</view>
						<view class="btn">查看</view>
					</view>
				</view>

				<view class="second-box" v-if="type==1">
					<view class="top flex between hcenter" @click="toLink('settings/setPassword')">
						<view class="flex hcenter">
							<image src="/static/images/zfmm_icon.png" mode="widthFix" class="icon"></image>
							<view class="text">设置支付密码</view>
						</view>
						<view class="flex hcenter">
							<view class="text1"></view>
							<u-icon name="arrow-right" color="#C9CED9" size="24"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="foot" @click="toLink('walletList?type=0')">查看明细</view>
		</view>
	</view>
</template>

<script>
import { getWalletDetail } from "@/api/apis.js"

export default {
	data() {
		return {
			status: false,
			info: {},
			type: 0
		}
	},
	methods: {
		toLink(src){
			uni.navigateTo({
				url: src
			})
		},
		toGetMoney(type){
			// #ifndef MP-TOUTIAO || MP-KUAISHOU
			uni.navigateTo({ url: 'getMoney?type=' + type });
			// #endif

			// #ifdef MP-TOUTIAO || MP-KUAISHOU
			uni.$u.toast('提现失败，请下载APP提现');
			// #endif
		},
		setStatus() {
			this.status = !this.status
		},
		getData(){
			getWalletDetail().then(res=>{
				if(res.data.code==0){
					this.info=res.data.data
				}
			})
		}
	},
	onLoad(e) {
		// this.$set(this,'num',uni.getStorageSync('balance'))
		// this.$set(this,'type',uni.getStorageSync('type'))
	},
	onShow(){
		this.getData();
	}
}
</script>

<style lang="scss">
	/deep/.u-progress{
		display: block !important; 
	}
	.second {
		.second-box{
			padding: 0 32upx;
			.top {
				.text1 {
					margin-right: 20rpx;
					font-size: 22rpx;
					color: #fff;
					padding: 0 14rpx;
					line-height: 36rpx;
					background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
					border-radius: 16rpx 2rpx 16rpx 4rpx;
				}

				.text {
					font-size: 34rpx;
					color: #222222;
					margin-left: 28rpx;
				}
				.tag {
					width: 125upx;
					height: 26upx;
					line-height: 26upx;
					font-size: 18upx;
					color: #47C7B6;
					margin-left: 11upx;
					padding: 0 4upx;
					background: linear-gradient(271deg, #FFFFFF 0%, #BFFFF7 100%);
					border-radius: 4upx;
				}
				.icon {
					width: 80rpx;
				}
				
				.btn {
					width: 120upx;
					height: 56upx;
					line-height: 56upx;
					border: 2upx solid #0061FF;
					border-radius: 91upx;
					font-size: 28upx;
					color: #0061FF;
					text-align: center;
				}
				border-bottom: 1rpx solid #ECEFF4;
				padding: 32upx 0;
			}
			
			.top:last-child {
				border-bottom: none;
			}
			box-shadow: 0px 4rpx 40rpx rgba(155, 162, 185, 0.06);
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 20rpx;
		}
		
	}
	.foot{
		width: calc(100% - 64upx);
		height: 100upx;
		line-height: 100upx;
		color: #fff;
		border-radius: 8upx;
		background-color: #0061FF;
		position: fixed;
		bottom: 68upx;
		text-align: center;
	}
	.frist {
		.bottom {
			.num {
				font-size: 56rpx;
				color: #222222;
			}

			.text {
				font-size: 28rpx;
				color: #888D98;
			}

			margin-top: 32rpx;
		}

		.top {
			.text {
				font-size: 34rpx;
				font-weight: bold;
				color: #222222;
			}

			image {
				width: 36rpx;
			}

			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #ECEFF4;
		}
		.btn{
			color: #FFFFFF;
			height: 64upx;
			line-height: 64upx;
			font-size: 26upx;
			padding: 0 18upx;
			background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
			border-radius: 100upx;
		}
		box-shadow: 0px 4rpx 40rpx rgba(155, 162, 185, 0.06);
		border-radius: 16rpx;
		background: #FFFFFF;
		margin-top: 20rpx;
	}

	page {
		background: #F5F7FA;
	}
</style>
