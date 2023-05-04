<template>
	<view>
		<view class="marlr32">
			<view v-for="(item,index) in list" :key="index" class="item" @click="toOrderDetail(item.order_no)">
				<view class="marlr32">
					<view class="top flex between">
						<view class="name">{{item.type_chinese}}</view>
						<view class="" v-if="item.status==40">
							<view class="flex hcenter" v-if="item.evaluate_score==1">
								<image src="/static/images/my_icon.png" mode="widthFix" class="emoji"></image>
								<view class="status">满意</view>
							</view>
							<view class="flex hcenter" v-if="item.evaluate_score==2">
								<image src="/static/images/yb_icon_sely.png" mode="widthFix" class="emoji"></image>
								<view class="status">一般</view>
							</view>
							<view class="flex hcenter" v-if="item.evaluate_score==3">
								<image src="/static/images/bmy_icon_sel.png" mode="widthFix" class="emoji"></image>
								<view class="status">不满意</view>
							</view>
						</view>
						<view class="" v-else-if="item.status==30">
							立即评价
						</view>
						<view class="" v-else>
							未完成
						</view>
					</view>
					<view class="content flex between hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="left20">
								<view class="name">{{item.nickname}}</view>
								<view class="workYear">{{item.work_year||0}}年执业律师</view>
							</view>
						</view>
						<view class="zixun flex hcenter flexcenter" @click.stop="clickAdvisory(item.user_id)">立即咨询</view>
					</view>
					<view class="bottom flex hcenter between">
						<image src="/static/images/gd_icon.png" mode="widthFix" class="more"></image>
						<view class="">{{item.created_at}}</view>
					</view>
				</view>
			</view>
			<view class="center null" v-if="!list.length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
				<view class="text">暂无数据</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getOrderList,
		getLawyerPage
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				list: [],
				page: 1
			}
		},
		methods: {
			toOrderDetail(id){
				uni.navigateTo({
					url:`orderDetail?id=${id}`
				})
			},
			clickAdvisory(id){//点击立即咨询
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
			getOrderList() {//获取列表数据
				getOrderList({
					page: this.page,
					type: uni.getStorageSync('type')
				}).then(res => {
					let data = this.list.concat(res.data.data.data)
					this.$set(this, "list", data)
					console.log(this.list)
				})
			}
		},
		onLoad() {
			this.getOrderList();
		}
	}
</script>

<style lang="scss">
	.item {
		.bottom {
			margin-top: 24rpx;

			.more {
				width: 36rpx;
			}
		}

		.content {
			.zixun {
				width: 148rpx;
				height: 60rpx;
				background: #0061FF;
				border-radius: 100rpx;
				font-size: 28rpx;
				color: #FFFFFF;
			}

			.workYear {
				margin-top: 8rpx;
				font-size: 24rpx;
				color: #222222;
			}

			.name {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}

			.photo {
				width: 88rpx;
				height: 88rpx;
				border-radius: 100px;
			}

			padding: 32rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
		}

		.top {
			.status {
				font-size: 32rpx;
				color: #222222;
				margin-left: 8rpx;
			}

			.name {
				font-size: 34rpx;
				font-weight: bold;
				color: #222222;

			}

			.emoji {
				width: 34rpx;
			}

			border-bottom: 1rpx solid #ECEFF4;
			padding-bottom: 20rpx;
		}

		border-radius: 16rpx;
		box-shadow: 0px 4rpx 40rpx rgba(155, 162, 185, 0.06);
		background:#FFFFFF;
		padding:32rpx 0 36rpx 0;
		margin-top: 18rpx;
	}

	page {

		background: #F5F7FA;
	}
</style>
