<template>
	<view>
		<!-- url为要跳转外链的地址-->
		<web-view :src="url">
		</web-view>
    </view>
</template>

<script>

	export default {
		data() {
			return {
				url: '',
			}
		},
		methods: {

		},
		onLoad(e){
			if(e.color){
				uni.setNavigationBarColor({
					frontColor:'#ffffff',
					backgroundColor:e.color
				})
			}
			console.log(decodeURIComponent(e.url));
			this.url=decodeURIComponent(e.url)
		}

	}
</script>

<style lang="scss">
	
</style>
