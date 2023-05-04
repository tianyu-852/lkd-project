<template>
	<view class="userInfo marlr32">
		<view class="user">
			<view class="user-photo">
				<image :src="info.avatar" class="image"></image>
			</view>
			<view class="user-info">
				<view class="user-info-name">{{info.nickname}}</view>
				<view class="user-info-num">爱心值：{{info.love_number}}</view>
			</view>
		</view>
		<view class="myData flex between">
			<view class="myData-item" v-for="(item,index) in info.myData" :key="index">
				<view><text>{{item.number}}</text>{{item.unit}}</view>
				<view>{{item.title}}</view>
			</view>
			<image src="/static/images/ll_bg.png" class="myData-bg"></image>
		</view>
		<view v-if="info.is_show_share==1" class="tips flex between hcenter">
			<text>邀请好友证实，即可申请首页推荐</text>
			<button type="default" open-type="share" class="shareBtn">分享</button>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			info: Object	
		},
		data() {
			return {
				
			}
		},
		methods: {

		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.userInfo{
		margin-top: 30rpx;
		.user{
			overflow: hidden;
			margin-bottom: 20upx;
			.user-photo{
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				display: inline-block;
				float: left;
				margin-right: 10upx;
				image{
					width: 90upx;
					height: 90upx;
				}
			}
			.user-info{
				padding-top: 10upx;
				float: left;
				.user-info-name{
					color: #222;
					font-size: 30upx;
					font-weight: bold;
				}
				.user-info-num{
					color: #888D98;
					font-size: 28upx;
				}
			}
		}
		.myData{
			height: 200upx;
			line-height: 50upx;
			color: #fff;
			border-radius: 20upx;
			padding: 0 60upx;
			text-align: center;
			align-items: center;
			margin-bottom: 20upx;
			position: relative;
			.myData-item{
				z-index: +1;
			}
			.myData-bg{
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
			text{
				font-size: 48upx;
				font-weight: bold;
			}
		}
		.tips{
			height: 80upx;
			padding: 0 24upx;
			color: #FF7639;
			font-size: 30upx;
			border-radius: 18upx;
			background-color: #FEEEE7;
			margin-bottom: 26upx;
			
		}
	}
	
</style>
