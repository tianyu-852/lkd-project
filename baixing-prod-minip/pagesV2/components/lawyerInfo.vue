<template>
	<view class="flex-row lawyer">
		<image :src="user.avatar" mode=""></image>
		<view class="info">
			<view class="flex-row">
				<text class="name">{{user.nickname}}</text>
				<text class="tag">执业{{user.work_year}}年</text>
			</view>
			<view v-if="type == 1 && user.lawyer_tags.length" class="flex-row goods hcenter">
				<text style="margin-right: 4upx;">擅于:</text><view v-for="item in user.lawyer_tags" class="good">{{item}}</view>
			</view>
			<text class="address"v-else >{{user.lawyer_office}}</text>
		</view>
	</view>
	
</template>

<script>
	export default {
		props:{
			type:{
				type:Number,
				default:0
			},
			user:{
				type:Object,
				default:()=>({
					nickname:'',
					work_year:0,
					lawyer_office:'',
					avatar:'',
				})
			},
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.goods{
		line-height: 33upx;
		font-size: 24upx;
		color: #888D98;
		.good{
			padding: 0 10upx;
			line-height: 28upx;
			font-size: 20upx;
			color: #99A0AC;
			border: 1upx solid #C9CED9;
			border-radius: 8upx;
			margin-left: 8upx;
		}
	}
	.lawyer {
		image {
			width: 100upx;
			height: 100upx;
			border-radius: 50upx;
			margin-right: 16upx;
		}
	
		.name {
			margin-top: 9upx;
			line-height: 42upx;
			font-size: 30upx;
			 
			font-weight: bold;
			color: #222222;
			opacity: 1;
		}
	
		.tag {
			border: 2upx solid #5B86FF;
			color: #5B86FF;
			border-radius: 4upx;
			line-height: 30upx;
			font-size: 20upx;
			 
			font-weight: bold;
			display: block;
			height: 34upx;
			padding: 0 10upx;
			margin: 13upx 8upx;
		}
	
		.address {
			line-height: 33upx;
			font-size: 24upx;
			 
			line-height: 36upx;
			color: #222222;
			opacity: 1;
			display: block;
		}
	
	}
</style>
