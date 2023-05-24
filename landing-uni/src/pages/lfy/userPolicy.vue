<template>
	<view>
		<web-view :webview-styles="webviewStyles" src="https://oss.lawkd.com/document/web/lawyer-user-protocol.html"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topId: null,
				scrollHeight: null
			}
		},
		methods: {
			toTop(id){
				console.log(id)
				this.topId=id
			}
		},
		onLoad() {
			let systemInfo = uni.getSystemInfoSync();
			this.scrollHeight = systemInfo.windowHeight;
		}
	}
</script>

<style scoped>
	.index{
		width: auto;
		padding: 0 32rpx;
	}
	text {
		font-size: 28rpx;
		line-height: 58rpx;
		color: #4F5667;
	}
	view {
		font-size: 28rpx;
		line-height: 58rpx;
		color: #4F5667;
	}
	.textblack {
		color: #222;
		font-size: 30rpx;
	}

</style>
