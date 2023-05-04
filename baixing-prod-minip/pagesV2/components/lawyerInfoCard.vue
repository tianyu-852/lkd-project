<template>
	<view class="businessCard relative">
		<image src="/static/images/qq_image.png" class="absImg"></image>
		<view class="top flex">
			<view class="marlr32 center">
				<view class="relative">
					<image :src="info.avatar" mode="aspectFill" class="photo"></image>
				</view>
				<view class="cardWorkyear">执业{{info.work_year}}年</view>
				<view class="flex-row registerInfo">
					<u-icon name="checkmark-circle-fill" color="#ffffff" size="20"></u-icon>
					资质已认证
				</view>
			</view>
			<view class="text">
				<view class="flex hcenter">
					<view class="name">{{info.nickname}}</view>
					<text class="tips">{{info.lawyer_grade_chinese}}</text>
				</view>
				<view class="city martop16">执业地区:{{info.city}}</view>
				<view class="city martop8">{{info.lawyer_office}}</view>
				<view class="city martop8">执业证号:{{info.license_number}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			info:Object
		},
		data(){
			return{
			}
		}
	}
</script>

<style lang="scss" scoped >
	.businessCard {
		.absImg {
			width: 134rpx;
			height: 170upx;
			position: absolute;
			top: 0;
			right: 0;
		}
		.top {
			.city {
				font-size: 28upx;
				line-height: 40upx;
				color: #C9CED9;
			}
			.tips{
				width: 128upx;
				height: 32upx;
				line-height: 32upx;
				color: #424a66;
				background: linear-gradient(229deg, #EBCDA1 0%, #E8C99C 43%, #E3C396 100%);
				text-align: center;
				font-size: 20upx;
				border-radius: 4upx;
				display: block;
				margin-left: 12upx;
			}
			.text{
				width: calc(100% - 192upx);
			}
			.registerInfo{
				line-height: 28upx;
				font-size: 20upx;
				 
				color: #FFFFFF;
				margin-top: 4upx;
				image{
					width: 20upx;
					height: 20upx;
					margin: auto;
				}
			}
			.cardWorkyear {
				font-size: 20rpx;
				font-weight: bold;
				color: #E4C497;
				border: 1upx solid #E4C497;
				padding: 1upx 10upx;
				margin-top: 12rpx;
				border-radius: 5upx;
				line-height: 30upx;
			}
			.name {
				font-size: 34rpx;
				font-weight: bold;
				color: #FFFFFF;
			}
			padding: 40rpx 0 30rpx 0;
		}
		.guanzhu {
			width: 44upx;
			height: 44upx;
			right: -4upx;
			bottom: 0;
			position: absolute;
		}
		.photo {
			width: 128rpx;
			height: 128rpx;
			border-radius: 100px;
			display: block;
		}
		background: linear-gradient(90deg, #515974 0%, #18213D 100%);
		border-radius: 16rpx;
		margin-top: 32rpx;
	}
</style>
