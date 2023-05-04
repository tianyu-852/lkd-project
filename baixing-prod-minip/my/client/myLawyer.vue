<template>
	<view>
		<view class="marlr32">
			<view class="center noBox flex flexcenter" v-if="!list.length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
				<view class="text">暂时没有关注或服务过您的律师</view>
				<view class="button"@click="toIndex">赶紧去问答社区找寻律师朋友吧</view>
			</view>
			
			<lawyerListItem v-for="(item,index) in list" :key="index" :item="item" ></lawyerListItem>

		</view>

	</view>
</template>

<script>
	import {
		getServeLawyer,
		getLawyerPage
	} from "../../api/apis.js"
	export default {
		data() {
			return {
				list: [],
				page: 1
			}
		},
		methods: {
			toIndex(){
				uni.switchTab({
					url:'/pages/v1/index'
				})
			},
			toOrderList(){
				uni.navigateTo({
					url:"./orderForm"
				})
			},
			tophoneAdvisory(id){
				if(uni.getStorageSync('type') === 1){
					this.$u.toast('暂未开通律师咨询律师功能')
					return
				}
				getLawyerPage({
					user_id:id
				}).then(res=>{
					uni.navigateTo({
						url:`../../index/phoneAdvisory?info=${JSON.stringify(res.data.data)}`
					})
				})
			},
			getMyLawyer() {
				getServeLawyer({
					page: this.page,
				}).then(res => {
					let data = this.list.concat(res.data.data.data)
					this.$set(this, "list", data);
					console.log(this.list)
					this.page += 1;
				})
			}
		},
		onLoad() {
			this.getMyLawyer()
		},
		onReachBottom() {
			this.getMyLawyer()
		}
	}
</script>

<style lang="scss">
	.noBox {
		.button {
			background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
			border-radius: 100rpx;
			padding: 12rpx 28rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-top: 24rpx;
		}

		.text {
			font-size: 30rpx;
			color: #B1BCD4;
		}

		image {
			width: 380rpx;
		}
	}

	.item {
		.bottom {

			.lookAll {
				.text {
					font-size: 24rpx;
					color: #0061FF;
				}

				image {
					margin-left: 12rpx;
					width: 10rpx;
				}
			}

			.last {
				font-size: 24rpx;
				color: #888D98;
			}

			margin-top: 20rpx;
		}

		.top {
			.advisory {
				width: 156rpx;
				height: 60rpx;
				background: linear-gradient(270deg, #3E97F5 0%, #3183F4 100%);
				border-radius: 30rpx;
				color: #FFFFFF;
				font-size: 28rpx;
			}

			.time {
				font-size: 24rpx;
				color: #888D98;
				margin-top: 4rpx;
			}

			.year {
				margin-left: 12rpx;
				font-size: 20rpx;
				font-weight: bold;
				color: #594F42;
				padding: 1rpx 20rpx;
				background: url(/static/images/xx_bq_icon.png) no-repeat;
				background-size: 100% 100%;
			}

			.name {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}

			.photo {
				width: 80rpx;
				height: 80rpx;
				border-radius: 100rpx;
			}

			.v {
				width: 26rpx;
				position: absolute;
				right: 0;
				bottom: 0;
			}

			border-bottom: 1rpx solid #ECEFF4;
			padding-bottom: 20rpx;
		}

		background-color: #FFFFFF;
		box-shadow: 0px 4rpx 20rpx rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 24rpx;
		padding: 40rpx 0 24rpx 0;
	}

	page {
		background: #F5F7FA;
	}
</style>
