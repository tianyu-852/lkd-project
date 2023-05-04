<template>
	<view>
		<u-sticky h5-nav-height="0">
			<view style="border-top: 1rpx solid #F5F7FA;">
				<u-tabs :list="nav.list" :is-scroll="false" :current="nav.index" @change="setNav"></u-tabs>
			</view>
		</u-sticky>
		<view class="">
			<view class="center null marlr32" v-if="!CList[nav.index].length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
				<view class="text">暂时没有关注您的律师或者用户</view>
				<view class="flex flexcenter ">
					<text class="button flex hcenter flexcenter" @click="toCommunity">去问答社区看看吧</text>
				</view>
			</view>
			<view v-for="(item,index) in CList[nav.index]" :key="index">
				<view class="martop20" v-if="item.type">
					<!-- <view class="flex between top hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"
								@click="toUserPage(item.user_id,item.type)"></image>
							<view class="left20">
								<view class="flex hcenter">
									<view class="name">{{item.nickname}}</view>
									<view class="lawyerTag">{{item.lawyer_grade_chinese}}</view>
								</view>
								<view class="city">
									<text v-if="item.work_year">执业{{item.work_year}}年丨</text>
									{{item.province}}-{{item.city}}
								</view>
								<view class="address">{{item.lawyer_office}}</view>
							</view>
						</view>
						<view :class="['attention','flex','flexcenter','hcenter',item.is_follow?'':'noattention']"
							@click="getAttention(item,index)">{{item.is_follow?'已关注':'关注'}}</view>
					</view>
					<view class="itemTypes flex hcenter">
						<view class="typeName">经常服务:</view>
						<view class="typeItem hcenter flexcenter flex" v-for="(item1,index1) in item.lawyer_tags"
							:key="index1" v-if="index1<=3">{{item1}}</view>
					</view> -->
					<lawyer-list-item :item="item" :index="index" isAtt="true" @edit="change"></lawyer-list-item> 
				</view>
				<view class="larwerItem marlr32 backfff" v-else>
					<view class="flex between top hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"
								@click="toUserPage(item.user_id,item.type)"></image>
							<view class="left20">
								<view class="flex hcenter">
									<view class="name">{{item.nickname}}</view>
								</view>
							</view>
						</view>
						<view :class="['attention','flex','flexcenter','hcenter',item.is_follow?'':'noattention']"
							@click="getAttention(item,index)">{{item.is_follow?'已关注':'关注'}}</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import { getFollowList, getFaceList, getAttention } from "@/api/apis.js"
	import lawyerListItem from "@/components/lawyerListItem.vue"

	export default {
		components: {
			lawyerListItem
		},
		data() {
			return {
				nav: {
					id: '',
					list: [
						{ name: "粉丝" },
						{ name: "关注" }
					],
					index: 0
				},
				page: [1, 1],
				CList: [
					[],
					[]
				]
			}
		},
		methods: {
			toUserPage(id, type) {
				console.log(id, type)
				if (type) {
					uni.navigateTo({
						url: `/pagesV1/index/lawyerPage?id=${id}`
					})
					return
				}

				uni.navigateTo({
					url: `/my/client/heLookPage?id=${id}`
				})
			},
			change(index,is_follow){
				console.log(index,is_follow)
				this.CList[this.nav.index][index].is_follow=is_follow
			},
			toCommunity() {
				uni.navigateTo({
					url: "community"
				})
			},
			getAttention(item, index) { //取消关注或关注
				getAttention({
					type: item.is_follow,
					follow_user_id: item.user_id
				}).then(res => {
					console.log(res);
					if (!res.data.code) {
						item.is_follow = res.data.data.is_follow
					}
				})
			},
			getFollowList() { //获取关注列表
				getFollowList({
					page: this.page[1],
					user_id: this.id || ''
				}).then(res => {
					let data = this.CList[1].concat(res.data.data.data);
					this.$set(this.CList, 1, data);
					this.page[1] += 1;
				})
			},
			getFaceList() { //获取粉丝列表
				getFaceList({
					page: this.page[0],
					user_id: this.id || ''
				}).then(res => {
					let data = this.CList[0].concat(res.data.data.data);
					this.$set(this.CList, 0, data);
					this.page[0] += 1;
				})
			},
			setNav(index) { //修改tab
				this.nav.index = index
			}
		},
		onLoad(e) {
			console.log("onLoad")
			this.id=e.id;
			this.nav.index=e.index;
			this.$set(this.nav, "index", e.index ? e.index : 1)
		},

		onShow() {
			this.$set(this, "page", [1, 1]);
			this.$set(this, "CList", [
				[],
				[]
			])
			this.getFaceList();
			this.getFollowList();
		},

		onReachBottom() {
			if (this.nav.index) {
				this.getFollowList();
			} else {
				this.getFaceList();
			}
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

		.button {
			width: 320rpx;
			height: 68rpx;
			background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
			opacity: 1;
			border-radius: 100rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-top: 24rpx;
		}
	}

	.larwerItem {
		.itemTypes {
			border-top: 1rpx solid #ECEFF4;
			padding-top: 20rpx;
			margin-top: 20rpx;
			.typeName {
				font-size: 24rpx;
				color: #888D98;
				margin-right: 40rpx;
			}

			.typeItem {
				font-size: 22rpx;
				color: #99A0AC;
				border: 1rpx solid #C9CED9;
				border-radius: 8rpx;
				width: 101rpx;
				height: 40rpx;
				margin: 0 6rpx;
			}
		}

		.top {
			.noattention {
				background: #0061FF !important;
				color: #FFFFFF !important;
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
				border: 1rpx solid #5b86ff;
				padding: 1rpx 8rpx 1rpx 8rpx;
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

	page {
		background-color: #F5F7FA;
	}
</style>
