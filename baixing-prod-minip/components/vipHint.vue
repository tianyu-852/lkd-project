<template>
	<view class="vipBox flex hcenter between" v-if="isVip!=2">
		<view class="flex hcenter" v-if="!num">
			<image src="/static/images/hy_icon.png" class="width40" mode="widthFix"></image>
			<view class="left8 flex1 line1 font26">{{title||"会员立享首充20%补贴"}}</view>
		</view>
		<view class="flex1 font26" v-else>
			<view>{{title||"会员立享首充20%补贴"}}</view>
			<view class="bold">限时特惠: 仅需{{num}}元</view>
		</view>
		<view class="flex hcenter left20" @click="toVip" v-if="!num">
			<text class="bold font28">{{isVip?'升级会员':'开通会员'}}</text>
			<u-icon name="play-right-fill" class="left8" color="#FC384C" size="16"></u-icon>
		</view>
		<view class="openBtn" @click="toVip" v-else>立即开通</view>
	</view>
</template>

<script>
	export default {
		props:{
			title: String,
			num: Number
		},
		data() {
			return {
				isVip:null
			}
		},
		methods: {
			toVip(){
				uni.navigateTo({ url:'/my/payVip' })
			}
		},
		created() {
			this.isVip=uni.getStorageSync('is_vip')
		}
	}
</script>

<style scoped lang="scss">
	.openBtn{
		padding: 0 22rpx;
		color: #fff;
		font-size: 26rpx;
		line-height: 54rpx;
		background: linear-gradient(134deg, #FF4C64 0%, #FC3845 100%);
		box-shadow: 0px 6rpx 12rpx rgba(255, 9, 9, 0.2);
		border-radius: 27rpx;
	}
	.vipBox{
		color: #FC384C;
		padding: 14rpx 20rpx;
		background: #FFEFF0;
		border: 1rpx solid #FEC0C0;
		border-radius: 8rpx;
	}
</style>
