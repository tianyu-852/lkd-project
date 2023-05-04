<template>
	<view class="hint">
		<!-- <image src="/static/images/ygz_icon.png" mode="widthFix" class="icon"></image> -->
		<u-icon name="checkmark-circle-fill" color="#0061FF" :size="size*2"></u-icon>
		<text :style="{color:color,fontSize:size+'px'}">{{title}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			title: String,
			size: {
				type:Number,
				required: false,
				default: 14
			},
			color: {
				type:String,
				required: false,
				default: '#0061FF'
			}
		},
		data() {
			return {

			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.hint{
		font-size: 26upx;
		line-height: 50upx;
	}
	// .icon{
	// 	width: 32upx;
	// 	height: 32upx;
	// 	margin: 0 10upx -6upx 0;
	// }
	
</style>
