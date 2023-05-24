<template>
	<view>
		<!-- <web-view src="https://oss.lawkd.com/document/web/lawyer-privacy-protocol.html"></web-view> -->
		<web-view src="https://h5.lawkd.com/protocol-tmp?name=lawyer_privacy_policy"></web-view>
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

<style lang="scss" scoped>
</style>
