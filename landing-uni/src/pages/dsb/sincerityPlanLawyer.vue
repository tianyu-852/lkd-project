<template>
	<view style="background: linear-gradient(#DEE9FF, #F0F6FF)">
		<view class="content">
			<view class="main-top">
				因在线法律服务的特殊性，迅速提升用户信任度，
				建议加入<text style="color:#FF4409 ;">诚信保障计划</text>
			</view>
			<view class="main-top">
				通过[百姓律师]与平台认证律师建立联系，后续产
				生任何法律服务交易(<text style="color:#FF4409 ;">不限于平台内或线下支付</text>)，
				经司法局、律协认定违规，平台将先行赔付已付
				律师费。
			</view>
			<view class="main-top" style="font-weight: 500;">
				仅限已加入<text style="color:#FF4409 ;">诚信保障计划</text>的律师，赔付上限不超
				过该服务律师缴纳的保障金
			</view>
			<view class="main-li">
				<view class="main-li-ring" />平台将优先向用户推荐加入诚信保障计划的律师
			</view>
			<view class="main-li">
				<view class="main-li-ring" />迅速提升曝光量
			</view>
			<view class="main-li">
				<view class="main-li-ring" />特殊身份标识 <image src="../../static/sincerityPlan/tb_icon@2x.png"
					mode="widthFix" style="width:32rpx;height: 32rpx;margin: 10rpx;"></image>
			</view>
			<view class="main-li">
				<view class="main-li-ring" />律师主页专属展示
			</view>
			<view class="main-li">
				<view class="main-li-ring" />保障金可随时申请退还
			</view>
			<view class="main-title">
				<view>诚信保障计划律师</view>
				<view class="main-title-label">特权展示</view>
			</view>
			<view class="main-bottom">
				<view style="margin: 16rpx 0; ">
					1.律师列表带有 <text style="color:#FF4409 ;">[诚信保障标识]</text>
				</view>

				<image src="../../static/sincerityPlan/lb_image@2x.png" mode="widthFix">
				</image>
			</view>
			<view class="main-bottom" style="margin-bottom:58rpx ;">
				<view style="margin: 16rpx 0;">
					2.律师主页带有 <text style="color:#FF4409 ;">[诚信保障标识]</text>
				</view>
				<image src="../../static/sincerityPlan/lszy_tc_icon@2x.png" mode="widthFix">
				</image>
			</view>
			<view class="bg_button" style="height: 200rpx;">
				<button type="default" class="bg_button_btn" @click="AddSincerityPlan()">加入诚信保障计划￥1000</button>
			</view>
		</view>
		<image src="../../static/sincerityPlan/bg3_image@2x.png" mode="widthFix"
			style="z-index: 2;position: absolute;top: 0;right: 0;width:303rpx;height:515rpx;" />
		<image src="../../static/sincerityPlan/bg_image@2x.png" mode="widthFix"
			style="z-index: 2;position: absolute;top: 520rpx;right: 0;width:162rpx;height:423rpx;" />
		<image src="../../static/sincerityPlan/bg1_image@2x.png" mode="widthFix"
			style="z-index: 2;position: relative;bottom:0;left: 0;width: 177rpx;height: 291rpx;" />
	</view>
</template>
<script>
	export default {
		data() {
			return {
				UserData: {}
			}
		},
		onLoad(e) {
			console.log(e)
			this.UserData = e
		},
		methods: {
			AddSincerityPlan() {
				let systemPhone = uni.getSystemInfoSync();
				let params = {}
				if (systemPhone.platform == 'ios') {
					console.log(systemPhone.platform)
					window.webkit.messageHandlers.sendData.postMessage(true);
				} else if (systemPhone.platform == 'android') {
					console.log(systemPhone.platform)
					window.android.sendData(true)
				} else {
					console.log(systemPhone.platform)

				}
			}
		}
	}
</script>
<style>
	.content {
		height: 100%;

		padding: 56rpx;
	}

	.main-top {
		width: 100%;
		height: auto;
		margin-top: 56rpx;
		font-size: 30rpx;
		color: #4F5667;
		font-weight: bold;
		line-height: 48rpx;

	}

	.main-li {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		margin: 24rpx;
		font-size: 32rpx;
		font-weight: 500;

		color: #4F5667;
		line-height: 54rpx;
	}

	.main-li-ring {
		width: 10rpx;
		height: 10rpx;
		background: #687085;
		border-radius: 50%;
		opacity: 1;
		margin-right: 40rpx;
	}

	.main-title {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		font-size: 32rpx;
		margin: 49rpx 0 63rpx 0;
		font-weight: 800;
		line-height: 0px;
		color: #222222;
	}

	.main-title-label {
		display: flex;
		align-items: center;
		flex-direction: row;
		width: auto;
		padding: 0 10rpx;
		height: 41rpx;
		background: linear-gradient(130deg, #FF8557 0%, #FF4409 100%);
		font-size: 28rpx;
		font-weight: bold;
		line-height: 0px;
		color: #ffffff;
		border-radius: 24rpx 4rpx 24rpx 4rpx;
		margin: 0 20rpx;
	}

	.main-bottom {
		margin-top: 32rpx;

	}

	.bg_button {
		display: flex;
		align-items: center;
		flex-direction: row;
	}

	.bg_button_btn {
		width: 600rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		font-size: 36rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 54rpx;
		color: #FFFFFF;
		background: linear-gradient(to right, #4C96FF 0%, #2B7AFE 100%);
		box-shadow: 0px 12px 32px rgba(9, 58, 255, 0.4);
		border-radius: 50rpx;
	}
</style>
