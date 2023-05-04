<template>
	<view>
		<scroll-view scroll-x="true"  class="scroll">
			<view :class="['card' ,index == 0?'frist':'']" v-for="item,index in list" :key="item" :style="'height:'+(from==='funds'?'386rpx':'486rpx')">
				<image class="img" :style="'height:'+(from==='funds'?'200rpx':'300rpx')" :src="item.cover_image" mode="aspectFill"></image>
				<view class="shadow flex-row" :style="'top:'+(from==='funds'?'100rpx':'200rpx')">
					<text class="text left">
						{{item.fundraise_money_text}}
					</text>
					<text class="text right">
						{{item.index_fundraise_money_text}}
					</text>
				</view>
				<view class="title ellipsis">
					{{item.title}}
				</view>
				<!-- 高度问题 -->
				<view class="progress">
					<u-line-progress style="height: 6upx;" :show-percent="false" :height="6" active-color="#4885FD" :percent="item.fundraise_progress"></u-line-progress>
				</view>
				<view class="flex-row user">
					<image class="icon" :src="item.avatar"></image>
					<text class="name">{{item.nickname}}</text>
					<view class="button" @click="toDetail(item.fundraising_id)">
						立即帮助
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			from: String,
			list: Array
		},
		data() {
			return {

			}
		},
		methods: {
			toDetail(id){
				uni.navigateTo({
				    url: '/pagesV2/index/detail/detail?id=' + id + '&from=' + 1
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.scroll{
		height:512upx;
		width: 100vw;
		white-space: nowrap;
		.card{
			display: inline-block;
			margin-top: 16upx;
			margin-right: 16upx;
			height: 486upx;
			width: 400upx;
			border-radius: 20upx;
			background: #FFFFFF;
			box-shadow: 0px 4upx 10upx rgba(0, 17, 71, 0.1);
			overflow: hidden;
			position: relative;
			.img{
				height: 300rpx;
				width: 100%;
				background: #9AAAFF;
			}
			.title{
				font-size: 28upx;
				font-weight: bold;
				line-height: 34upx;
				height: 74upx;
				padding: 12upx 16upx 12upx 20upx;
			}
			.progress{
				padding:0 20upx;
				width: 100%;
				margin-top: -6upx;
			}
			.shadow{
				background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
				opacity: 1;
				position: absolute;
				top: 200upx;
				left: 0px;
				width: 100%;
				z-index: 2;
				height: 100upx;
				padding: 0 20upx;
				.text{
					color: #fff;
					font-size: 24upx;
					display: block;
					line-height: 143upx;
				}
				.left{
					flex: 1;
				}
				.right{
					
				}
			}
			.user{
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				padding: 20upx;
				.icon{
					height: 42upx;
					width: 42upx;
					border-radius: 21upx;
				}
				.name{
					display: block;
					flex: 1;
					margin-left: 12upx;
					font-size: 24upx;
					line-height: 42rpx;
				}
				.button{
					width: 139upx;
					height: 42upx;
					background: linear-gradient(270deg, #FF9102 0%, #FFAE5B 100%);
					opacity: 1;
					border-radius: 100upx;
					text-align: center;
					color: #fff;
					font-size: 24upx;
					line-height: 42upx;
				}
			}
			
		}
		.frist{
			margin-left: 32upx;
		}
	}
	

</style>
