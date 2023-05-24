<template>
	<view>
		<view class="marlr32">
			<view class="center">
				<image src="/static/logo.png" mode="widthFix" class="logo"></image>
			</view>
			<!-- <view class="text">律付云是一支以打造高性价比法律服务为方向的互联网开发团队。</view>	 -->
			<view class="text">律付云律师端——智慧法律生态，同城案源精准覆盖。一次认证，共享三大平台资源。
专注互联网法律，携手律师共同发展。一站式律师智慧平台【智能律所服务平台+智慧律师云办案系统+客户自助案件系统】，为律师提升工作效率，提升核心竞争力。</view>
		</view>
		<view class="foot">温州律快答网络科技有限公司</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		},
		onLoad() {

		}
	}
</script>

<style>
	.logo {
		width: 148rpx;
		margin: 80rpx 0;
		box-shadow: 0px 4rpx 16rpx rgba(52, 76, 194, 0.26);
		border-radius: 30rpx;
	}

	.text {
		font-size: 28rpx;
		line-height: 58rpx;
		font-weight: bold;
		color: #222222;
		text-align: justify;
		margin-bottom: 28rpx;
	}
	
	.foot{
		width: 100%;
		position: absolute;
		bottom: 100rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
	}
</style>
