<template>
	<view>
		<view class="ItemBox backfff" v-for="(item,index) in list" :key="index" @click="clickBtn(index,-1)">
			<view class="flex padbot20 ">
				<!-- 头像 -->
				<view class="relative">
					<image :src="item.cover_image" mode="aspectFill" class="photo"></image>
				</view>
				<!-- 昵称、律所 -->
				<view class="ItemBox-info left20" >
					<view class="" >
						<view class="Name">{{item.title}}</view>
						<!-- <view class="Year flex flexcenter hcenter">执业{{item.work_year}}年</view> -->
					</view>
					<view class="tag flex">
						<view class="tag-item hcenter red" v-if="item.type==1">继续捐助</view>
						<button open-type="share" class="tag-item hcenter" v-if="item.type==1">帮忙转发</button>
						<!-- <view class="hcenter" v-if="item.type==2">已结案</view> -->
						<view class="hcenter" v-if="item.refund_status">当事人已退还诉讼费</view>
					</view>
				</view>
			</view>
			<view class="uLine">
				<view class="left">已筹<text>{{item.fundraise_money}}</text>元</view>
				<view class="right">目标<text>{{item.target_money}}</text>元</view>
				<u-line-progress :percent="item.fundraise_progress" height="6" :show-percent="false" active-color="#4885FD"></u-line-progress>
			</view>
			<!-- 服务标签 -->
			<view class="itemTypes hcenter flex-row" >
				<view class="type">
					<text>{{item.case_types}}</text>
				</view>
				<view class="time">
					<view v-if="item.is_can_refund == 0" style="height: auto;margin: auto;">
						<u-count-down ref="uCountDown" font-size="22" separator-size="20" :timestamp="item.expired_at" separator="zh"></u-count-down>
					</view>
					<text v-else-if="item.is_refund">{{item.refund_type == 0?'已返还诉讼费':'已返还'}}</text>
					<text v-else-if="item.is_can_refund" class="btn" @click.stop="clickBtn(index,0)">{{item.refund_type == 0?'诉讼费返还':'申请返还'}}</text>
				</view>
			</view>
		</view>
		<view class="center null" v-if="!list.length">
			<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
			<view class="text">暂无数据</view>
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
				tabs:[
					{
						text:'首页',
						src:'/pagesV1/index/index',
						active:0
					},{
						text:'找律师',
						src:'/pagesV1/find/find',
						active:1
					},{
						text:'我的',
						src:'/my/my',
						active:2
					}
				]
			}
		},
		methods: {
			clickBtn(index,type){
				this.$emit('clickBtn',index,type)
			},
			back(){
				uni.navigateBack({
				    delta: 1
				});
			},
			toLink(i,s){
				uni.redirectTo({
				    url: s
				});
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.ItemBox {
		.typeName {
			font-size: 24rpx;
			color: #888D98;
			margin-right: 40rpx;
		}
	
		.itemTypes {
			border-top: 1rpx solid #ECEFF4;
			padding: 10upx 0 0;
			line-height: 40upx;
			// .userImg {
			// 	width: 42upx;
			// 	height: 42upx;
			// 	border-radius: 42upx;
			// 	overflow: hidden;
			// 	margin-right: 10rpx;
			// 	float: left;
			// 	image{
			// 		width: 100%;
			// 	}
			// }
			.time{
				float: right;
				.btn{
					color: #fff;
					background-color: #FF7639;
					border-radius: 56upx;
					padding: 6rpx 18upx;
					font-size: 26upx;
				}
			}
			.type{
				// width: 400upx;
				flex: 1;
				width: 0;
				font-size: 24upx;
				color: #888D98;
				overflow: hidden;
			}
		}
		
		.ItemBox-info{
			width: calc(100% - 160upx);
			position: relative;
			.tag{
				position: absolute;
				bottom: 0;
				right: 0;
				.tag-item{
					height: 42upx;
					line-height: 42upx;
					color: #fff;
					font-size: 24upx;
					background: linear-gradient(to right, #FFAE5B , #FF9102);
					border-radius: 42upx;
					padding: 0 22upx;
					margin: 0 10upx;
				}
				.red{
					background: linear-gradient(to right, #FF6A6F , #FF3131);
				}
			}
		}
		
		
		.uLine{
			color: #888D98;
			overflow: hidden;
			.left{
				float: left;
			}
			.right{
				float: right;
			}
			text{
				color: #0061FF;
				font-weight: bold;
			}
		}
		
		.centerBox {
			width: 348rpx;
		}
	
		.call {
			width: 140rpx;
		}
	
		.address {
			font-size: 24rpx;
			color: #222222;
		}
	
		.Year {
			border: 1rpx solid #5b86ff;
			padding: 1rpx 8rpx 1rpx 8rpx;
			font-size: 20rpx;
			font-weight: bold;
			color: #5B86FF;
			margin-left: 12rpx;
		}
	
		.Name {
			font-size: 32rpx;
			font-weight: bold;
			color: #222222;
		}
	
		.photo {
			width: 140upx;
			height: 140upx;
			border-radius: 16upx;
			background-color: #888D98;
		}
	
		.guanzhu {
			width: 44rpx;
			right: 0;
			bottom: 6rpx;
			position: absolute;
		}
	
		padding: 24upx;
		box-shadow: 0px 4upx 10upx rgba($color: #001147, $alpha: 0.2);
		border-radius: 16upx;
		margin-top: 20rpx;
	}
	
</style>
