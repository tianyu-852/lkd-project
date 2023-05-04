<template>
	<view>
		<u-popup v-model="show" mode="bottom" border-radius="16" closeable>
			<view class="back">
				<view class="marlr32">
					<view class="power">
						<view class="title">会员权益</view>
						<view class="flex around martop18">
							<view v-for="(item,index) in info.power" :key="index" @click="onPower(index)">
								<image :src="item.icon" mode="widthFix" class="icon"></image>
								<view :class="['text',powerIndex==index?'on':'']">{{item.title}}</view>
								<view class="triangle" v-if="powerIndex==index"></view>
							</view>
							<view class="hint">{{info.introduction[powerIndex].content||''}}</view>
						</view>
					</view>
					<view class="select">
						<view class="title">VIP会员选择</view>
						<scroll-view scroll-x="true" class="martop48">
							<view v-for="(item,index) in info.vips" :key="index" :class="['item','center',index==active?'active':'']" @click="setActive(index)">
								<view class="label flex hcenter flexcenter" v-if="active == index">
									开通享受无障碍咨询
								</view>
								<view class="name">{{item.vip_name}}会员</view>
								<view class="flex priceBox flexcenter">
									<view class="symbol">￥</view>
									<view class="price">{{item.price}}</view>
								</view>
								<view class="introduction">{{item.introduction}}</view>
							</view>

						</scroll-view>
					</view>
				</view>
				<view class="footer">
					<view class="marlr32">
						<view class="flex text hcenter">
							<view class="">选择{{info.vips[active].vip_name}}</view>
							<view class="num">{{info.vips[active].price}}</view>
							<view class="">元</view>
						</view>
					</view>
					<view class="relative">
						<view class="absolute button flex hcenter flexcenter"  @click="pay(info.vips[active].vip_id)">
							立即开通
						</view>
					</view>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getVipList, getVipOrder, getPay } from "@/api/apis.js"

	export default {
		data() {
			return {
				show: false,
				powerIndex:0,
				info: {
					vips: [{
						vip_name: null
					}]
				},
				active: 0
			}
		},
		methods: {
			pay(orderId) {
				getVipOrder({
					vip_id: orderId
				}).then(order_no => {
					if(order_no.data.code != 0)
						return
					uni.navigateTo({
						url:`/pagesV2/pay/pay?id=${order_no.data.data.order_no}`
					})
					return
					getPay({
						// #ifdef MP-WEIXIN
						type: 1,
						// #endif
						//#ifdef MP-TOUTIAO
						type: 3,
						//#endif
						order_no: order_no.data.data.order_no
					}).then(res => {
						uni.requestPayment({
							provider: uni.getStorageSync('provider'),
							//#ifdef MP-TOUTIAO
							service:5,
							orderInfo:res.data.data,
							//#endif
							// #ifdef MP-WEIXIN
							timeStamp: res.data.data.timeStamp,
							nonceStr: res.data.data.nonceStr,
							package: res.data.data.package,
							paySign: res.data.data.paySign,
							signType: res.data.data.signType,
							// #endif
							success: res => {
								// #ifdef MP-TOUTIAO
								if(res.code != 0){
									return
								}
								// #endif
								uni.showToast({
									icon:"none",
									title:"开通会员成功"
								})
								uni.setStorage({
									key:"is_vip",
									data:1
								})
								this.$emit("setVip")
							}
						})
					})
				})
			},
			onPower(index){
				this.powerIndex=index
			},
			setActive(index) {
				this.active = index
			}
		},
		mounted() {
			getVipList().then(res => {
				this.$set(this, "info", res.data.data);
			})
		}
	}
</script>

<style lang="scss">
	.back {
		.footer {
			.button {
				width: 285rpx;
				height: 120rpx;
				background: linear-gradient(90deg, #FBDFC1 0%, #FACB9B 100%);
				position: absolute;
				bottom: -44rpx;
				right: 0;
				border-radius: 40rpx 0 0 0;
				font-size: 32rpx;
				font-weight: bold;
				color: #4D301E;
			}

			.text {
				color: #F9D7B4;
				font-size: 32rpx;
				align-items: baseline;

				.num {
					font-size: 48rpx;
				}
			}

			width: 100%;
			position: absolute;
			bottom: 0;
			padding: 7rpx 0 44rpx;
			background: linear-gradient(90deg, #41465A 0%, #313447 100%);
		}

		.select {
			.active {
				.label {
					width: 200rpx;
					height: 40rpx;
					position: absolute;
					background: #C99470;
					border-radius: 20rpx 2rpx 20rpx 2rpx;
					top: -18rpx;
					font-size: 20rpx;
					color: #FFFFFF;
				}

				background: linear-gradient(135deg, #FADCBD 0%, #F9C58F 100%) !important;
				color: #4C301B !important;
				position: relative;
			}

			.item {
				.introduction {
					font-size: 22rpx;
					margin-top: 20rpx;
				}

				.name {
					font-size: 28rpx;
					margin-top: 28rpx;
				}

				.priceBox {
					.price {
						font-size: 54rpx;
					}

					.symbol {
						font-size: 28rpx;
					}

					align-items:baseline;
					margin-top: 12rpx;
				}


				width: 208rpx;
				height: 240rpx;
				background: linear-gradient(135deg, #41465A 0%, #313447 100%);
				border-radius: 12rpx;
				display: inline-block;
				margin-right: 20rpx;
				color: rgba(251, 216, 188, 1);
				margin-top: 18rpx;
			}

			width: 100%;
			white-space: nowrap;
		}

		.power {
			.text {
				font-size: 28rpx;
				text-align: center;
				margin-bottom: 27rpx;
				color: #9496A4;
			}

			.icon {
				width: 148rpx;
			}
			
			.on{
			    color: #EFD1B5 !important;
			}
			
			.triangle{
			    width: 0;
			    height: 0;
			    border-left: 22rpx solid transparent;
			    border-right: 22rpx solid transparent;
			    border-bottom: 23rpx solid #3D3F52;
			    margin: auto;
			}
			
			.hint {
			    width: 100%;
			    font-size: 28rpx;
			    font-weight: 500;
			    line-height: 40rpx;
			    color: #9496A4;
			    background: linear-gradient(270deg, #3C3D4F 0%, #454A5E 100%);
			    border-radius: 12rpx;
			    padding: 35rpx 49rpx;
			}

			padding-bottom: 20rpx;
		}

		.header {
			padding-bottom: 32rpx;
			border-bottom: 1px dashed rgba(68, 73, 93, 1);
			margin-bottom: 24rpx;
		}

		.title {
			font-size: 32rpx;
			color: #EFD1B5;
		}

		padding-top: 48rpx;
		background: #252432;
		box-shadow: 0px 0px 30rpx rgba(155, 162, 185, 0.4);
		padding-bottom: 150rpx;
		position: relative;
	}
</style>
