<template>
	<view>
		<view style="height: 80rpx;"></view>
		<view class="fixedTop nav">
			<u-tabs :list="tab.nav" :is-scroll="false" :current="tab.index" @change="tabChange"></u-tabs>
		</view>
		<view class="" v-if="!tab.index">
			<view v-for="(item,index) in tab.list[0]" :key="index" class="item">
				<view class="marlr32 padtb32">
					<view class="flex first between hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="left20">
								<view class="name">{{item.nickname}}</view>
								<view class="work">{{item.work_year}}年执业律师</view>
							</view>
						</view>
						<view class="call-lawyer flex-row" @click.stop="clickPhone(item.user_id)">
							<image src="/static/images/ic_phone.svg">免费咨询
						</view>
						<!-- <image src="../../static/images/mfzx_icon.png" mode="widthFix" class="call" @click="clickPhone(item.user_id)"></image> -->
					</view>
					<view class="content line2" @click="linkasdDetails(item.question_id)"><text>{{!item.type?'原贴：':''}}</text>
						{{item.content}}</view>
					<view class="flexend flex look" v-if="!item.type">查看</view>
					<view class="flex between content1 hcenter" v-if="item.type">
						<view class="">原贴：{{item.question_comment}}</view>
						<image src="../../static/images/right.png" mode="widthFix" class="jt"></image>
					</view>
				</view>
			</view>
			<view class="kongBox" v-if="!tab.list[0].length">
				<image src="../../static/images/kym_qsy_image.png" mode="widthFix" class="kong"></image>
			</view>
		</view>
		<view class="" v-if="tab.index">
			<view v-for="(item,index) in tab.list[1]" :key="index" class="item1">
				<view class="marlr32 padtb32">
					<view class="flex first between hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="left20">
								<view class="name">{{item.nickname}}</view>
								<view class="work">{{item.created_at}}</view>
							</view>
						</view>
						<view class="flex flexcenter hcenter" v-if="item.score == 1">
							<image src="/static/images/my_icon.png" mode="widthFix" class="mood"></image>
							<view class="moodText">满意</view>
						</view>
						<view class="flex flexcenter hcenter" v-if="item.score == 2">
							<image src="/static/images/yb_icon_sel.png" mode="widthFix" class="mood"></image>
							<view class="moodText">一般</view>
						</view>
						<view class="flex flexcenter hcenter" v-if="item.score == 3">
							<image src="/static/images/bmy_icon.png" mode="widthFix" class="mood"></image>
							<view class="moodText">不满意</view>
						</view>
					</view>
					<view class="flex martop20">
						<view class="good" v-for="(item1,index1) in item.order_evaluate_reasons" :key="index1">
							{{item1}}
						</view>
					</view>
					<view class="line2">{{item.content}}</view>
				</view>
			</view>
			<view class="kongBox" v-if="!tab.list[1].length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix" class="kong"></image>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getItsAnswer,
		getEvaluation,
		getLawyerPage
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				tab: {
					nav: [{
						name: '他的回答'
					}, {
						name: '他的评价'
					}],
					index: 1,
					list: [
						[],
						[],
					],
					page:[1,1]
				},
				id: "5Kyra8ZL2kE3Yg6m4dJR"
			}
		},
		methods: {
			linkasdDetails(question_id) { //跳转文章详情
				uni.navigateTo({
					url: `../index/askDetails?id=${question_id}`
				})
			},
			clickPhone(id) { //跳转拨打电话
			if(uni.getStorageSync('type') === 1){
				this.$u.toast('暂未开通律师咨询律师功能')
				return
			}
				getLawyerPage({
					user_id: id
				}).then(res => {
					uni.navigateTo({
						url: `../index/phoneAdvisory?info=${JSON.stringify(res.data.data)}`
					})
				})
			},
			getItsAnswer(id) { //获取回答
				getItsAnswer({
					user_id: id,
					page: this.tab.page[0]
				}).then(res => {
					let data = this.tab.list[0].concat(res.data.data)
					this.$set(this.tab.list, 0, data)
					this.tab.page[0] +=1;
				})
			},
			getEvaluation(id) { //获取评价
				getEvaluation({
					user_id: id,
					page: this.tab.page[1]
				}).then(res => {
					let data = this.tab.list[1].concat(res.data.data.data)
					this.$set(this.tab.list, 1, data)
					this.tab.page[1] +=1;
				})
			},
			tabChange(index) {
				this.tab.index = index;
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getItsAnswer(this.id)
			this.getEvaluation(this.id);
		},
		onReachBottom(){
			if(!this.tab.index){
				this.getItsAnswer(this.id)
			}else{
				this.getEvaluation(this.id)
			}
		}
	}
</script>

<style lang="scss">
	.kongBox {
		text-align: center;
		margin-top: 180rpx;
	}

	.kong {
		width: 380rpx;
	}

	.item1 {
		.good {
			padding: 4rpx 20rpx;
			font-size: 28rpx;
			color: #222222;
			background: #F3F5F8;
			margin: 0 16rpx 16rpx 0;
			border-radius: 4rpx;
		}

		.first {
			.moodText {
				color: #222222;
				font-size: 32rpx;
				margin-left: 8rpx;
			}

			.photo {
				width: 88rpx;
				height: 88rpx;
				border-radius: 100px;
			}

			.name {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}

			.work {
				font-size: 24rpx;
				color: #222222;
				margin-top: 6rpx;
			}

			.mood {
				width: 34rpx;
			}
		}

		border-bottom: 1px solid #ECEFF4;
	}

	.item {
		.look {
			font-size: 32rpx;
			color: #5B6A91;
		}

		.jt {
			width: 14rpx;
		}

		.content1 {
			padding: 24rpx;
			background: #F3F5F8;
			border-radius: 8rpx;
		}

		.content {
			font-size: 34rpx;
			color: #222222;
			margin-top: 20rpx;
		}

		.first {
			.photo {
				width: 88rpx;
				height: 88rpx;
				border-radius: 100px;
			}

			.name {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}

			.work {
				font-size: 24rpx;
				color: #222222;
				margin-top: 6rpx;
			}

			.call {
				width: 140rpx;
			}
		}

		border-bottom: 12rpx solid #F5F7FA;
	}

	.nav {
		z-index: 99;
	}
</style>
