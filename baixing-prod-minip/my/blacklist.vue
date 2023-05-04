<template>
	<view>
<!-- 		<u-sticky>
			<view class="backfff tabs">
				<view class="marlr32 lookAll flex flexend hcenter" @click="tabShow=true">
					<view class="text">{{tabs[tabIndex].title}}</view>
					<image src="/static/images/px_icon.png" mode="widthFix"></image>
				</view>
				<view class="link" v-if="tabShow">
					<view v-for="(item,index) in tabs" :key="index" v-if="tabIndex!=index" @click="onTabs(index)">{{item.title}}</view>
				</view>
			</view>
		</u-sticky> -->
		<view class="marlr32">
			<view class="center null" v-if="!list.length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
				<view class="text">暂时没有您拉黑的律师或者用户</view>
			</view>
			<view v-for="(item,index) in list" :key="index" class="backfff">
				<view class="larwerItem" v-if="item.type">
					<view class="flex between top hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="left20">
								<view class="flex hcenter">
									<view class="name">{{item.nickname}}</view>
									<!-- <view class="year">执业{{item.work_year}}年</view> -->
									<view class="lawyerTag">{{item.lawyer_grade_chinese}}</view>
								</view>
								<view class="city">
									<text v-if="item.work_year">执业{{item.work_year}}年丨</text>
									{{item.province}}-{{item.city}}
								</view>
								<view class="address">{{item.lawyer_office}}</view>
							</view>
						</view>
						<view :class="['attention','flex','flexcenter','hcenter',item.block?'':'noattention']" @click="getAttention(item,index)">{{item.block?'已拉黑':'拉黑'}}</view>
					</view>
				</view>
				<view class="larwerItem" v-else>
					<view class="flex between top hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="left20">
								<view class="flex hcenter">
									<view class="name">{{item.nickname}}</view>
								</view>
							</view>
						</view>
						<view :class="['attention','flex','flexcenter','hcenter',item.block?'':'noattention']" @click="getAttention(item,index)">{{item.block?'已拉黑':'拉黑'}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getBlackList,
		getBlack
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				tabs: [
					{
						title:'查看全部',
						value:-1
					},{
						title:'只看用户',
						value:0
					},{
						title:'只看律师',
						value:1
					}
				],
				tabIndex: 0,
				tabShow: false,
				list: null,
				page: null
			}
		},
		methods: {
			getAttention(item){
				getBlack({
					type:item.block,
					block_user_id:item.user_id
				}).then(res=>{
					console.log(res)
					if (!res.data.code) {
						item.block = res.data.data.is_blocked
					}
				})
			},
			getBlackList() {//拉黑列表
				console.log(this.page,this.tabs[this.tabIndex].value)
				getBlackList({
					page: this.page,
					type: this.tabs[this.tabIndex].value
				}).then(res => {
					res.data.data.data.forEach((item)=>{
						item.block = 1
					})
					let data = this.list.concat(res.data.data.data)
					this.$set(this, 'list', data)
					this.page += 1
				})
			},
			onTabs(index){
				this.tabIndex=index
				this.tabShow=false
				this.page=1
				this.getBlackList()
			}
		},
		onLoad() {

		},
		onShow() {
			this.$set(this, 'list', [])
			this.$set(this, 'page', 1)
			this.getBlackList();
		},
		onReachBottom() {
			this.getBlackList();
		}
	}
</script>

<style lang="scss">
	.null {
		.text {
			font-size: 30rpx;
			color: #B1BCD4;
			margin-top: 28rpx;
		}

		image {
			width: 380rpx;
		}

		// .button {
		// 	width: 320rpx;
		// 	height: 68rpx;
		// 	background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
		// 	opacity: 1;
		// 	border-radius: 100rpx;
		// 	font-size: 32rpx;
		// 	color: #FFFFFF;
		// 	margin-top: 24rpx;
		// }
	}

	.larwerItem {
		.top {
			.noattention {
				box-sizing: border-box;
				border: 1rpx solid #ff4040;
				background: #fff !important;
				color: #FF4040 !important;
			}

			.attention {
				width: 140rpx;
				height: 60rpx;
				background: #E8EEF6;
				border-radius: 100rpx;
				color: #AEB7C8;
				font-size: 28rpx;
			}

			.address {
				font-size: 24rpx;
				color: #222222;
				margin-top: 4rpx;
			}

			.city {
				font-size: 24rpx;
				color: #222222;
				margin-top: 8rpx;
			}

			.year {
				font-size: 20rpx;
				font-weight: bold;
				color: #5B86FF;
				background: url(/static/images/xx_bq_icon.png) no-repeat;
				background-size: 100% 100%;
				padding: 2rpx 20rpx;
				margin-left: 12rpx;
			}

			.name {
				font-size: 30rpx;
				font-weight: bold;
			}

			.photo {
				width: 130rpx;
				height: 130rpx;
				border-radius: 100%;
			}
		}

		box-shadow: 0px 4rpx 20rpx rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 20rpx;
		padding: 24rpx;
	}
	
	.tabs{
		.lookAll {
			image {
				width: 20rpx;
				margin-left: 8rpx;
			}
			.text {
				font-size: 26rpx;
				font-weight: bold;
				color: #888D98;
			}
			border-top: 1rpx solid #F5F7FA;
			padding: 16rpx 0;
		}
		.link{
			line-height: 40upx;
			border-radius: 16upx;
			margin-top: 10upx;
			padding: 16upx 32upx;
			background-color: #fff;
			position: fixed;
			right: 32upx;
			view{
				padding-bottom: 12upx;
				margin-bottom: 12upx;
				border-bottom: 1upx solid #f5f5f5;
				&:last-child{
					border-bottom: none;
					padding-bottom: 0;
					margin-bottom: 0;
				}
			}
		}
	}
	
	page {
		background: #F5F7FA;
	}
</style>
