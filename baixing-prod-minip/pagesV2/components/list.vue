<template>
	<view>
		<view class="flex-row head">
			<text class="left">法律援助</text>
			<text class="right">达到一定条件即可申请首页推荐</text>
		</view>
		<view class="list">
			<view class="item" v-for="item,index in list" :key="item" @click="toDetail(item.fundraising_id)">
				<view class="flex-row">
					<image class="img" :src="item.cover_image" mode="aspectFill"></image>
					<view style="padding: 8upx 20upx 0 23upx;flex: 1;">
						<view class="title">
							<text class="ellipsis"><text class="tag">立即帮助</text><text style="margin-left:15upx;">{{item.title}}</text></text>
						</view>
						<!-- 高度问题 -->
						<u-line-progress style="margin-top: 12upx;display:block;" :show-percent="false" :height="6" active-color="#4885FD" :percent="item.fundraise_progress"></u-line-progress>
						<text class="money">已筹<text class="blue">{{item.fundraise_money}}</text>元  ｜  目标<text class="blue">{{item.target_money}}</text> 元</text>
					</view>
				</view>
				<view class="flex-row user">
					<image class="icon" :src="item.avatar"></image>
					<text class="name">{{item.nickname}}</text>
					<text class="type">
						{{item.case_types}}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
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
	.list{
		margin-top: 16upx;
		.item{
			margin: 0 32upx 16upx 32upx;
			background: #FFFFFF;
			box-shadow: 0px 4upx 10upx rgba(0, 17, 71, 0.1);
			opacity: 1;
			border-radius: 16upx;
			height: 270upx;
			overflow: hidden;
			.user{
				margin:12upx 20upx 0 20upx;
				padding-top: 12upx;
				border-top: 1upx solid #ECEFF4;
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
				.type{
					height: 33upx;
					font-size: 24upx;
					 
					font-weight: 500;
					line-height: 36upx;
					color: #888D98;
					opacity: 1;
				}
			}
			.money{
				font-size: 28upx;
				color: #888D98;
				font-weight: Medium;
				.blue{
					color: #0061FF;
					font-weight: Bold;
				}
			}
			.img{
				width: 180upx;
				height: 180upx;
				background: #9AAAFF;
				opacity: 1;
			}
			.title{
				margin-top: 8upx;
				line-height: 42upx;
				height: 82upx;
				font-size: 28upx;
				 
				font-weight: 800;
				color: #222222;
				.tag{
					width: 96upx;
					background: linear-gradient(270deg, #FF9202 0%, #FFAF5C 100%);
					line-height: 28upx;
					opacity: 1;
					border-radius: 4upx;
					color: #fff;
					font-size: 20upx;
					padding:0 9upx;
				}
			}
		}
	}
	.head{
		margin-top: 40upx;
		padding: 0 32upx;
		.left{
			font-size: 36upx;
			 
			font-weight: 800;
			line-height: 54upx;
			color: #222222;
			opacity: 1;
		}
		.right{
			flex: 1;
			font-size: 22upx;
			 
			font-weight: 500;
			line-height: 54upx;
			color: #888D98;
			opacity: 1;
			text-align: end;
		}
	}
	
</style>
