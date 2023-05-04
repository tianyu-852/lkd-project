<template>
	<view class="photo" :style="{'width': ' calc('+(100/num)+'% - 4px)'}">
		<view class="photo-box" :style="{'width': width+'px','height': height+'px'}">
			<image :src="src" mode="aspectFill"></image>
		</view>
		<text v-if="title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			src: String,
			title: String,
			num: {
				type:Number,
				required: false,
				default: 3
			},
			width: String,
			height: String,
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
	.photo{
		width: calc(50% - 8upx);
		color: #888D98;
		font-size: 28upx;
		text-align: center;
		line-height: 40upx;
		float: left;
		overflow: hidden;
		margin-right: 8upx;
		.photo-box{
			height: 160upx;
			display: flex;
			align-items: center;
			overflow: hidden;
			border-radius: 8upx;
			margin: 0 auto 10upx;
		}
		image{
			width: 100%;
			height: 240upx;
			background-color: #888D98;
		}
	}
	
	
</style>
