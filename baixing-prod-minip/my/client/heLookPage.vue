<template>
	<view>
		<view class="fixedBox flex-row"  v-if="!isMine">
			<!-- #ifndef MP-KUAISHOU -->
			<view class="btn flex-row" @click="toChat(userId,info.nickname)">
				<image src="/my/static/images/sl_icon.svg" ></image>
				私信
				</view>
			<!-- #endif -->
			<view class="btn blue flex-row" @click="setFollow(info.is_follow)">
				<image :src="!info.is_follow?'/my/static/images/gz_icon.svg':'/my/static/images/gz_icon_sel.svg'" ></image>
				关注
			</view>
		</view>

		<!-- <view class="page flex-column relative" :style="{'backgroundImage':`url(${info.background_image})`}"> -->
		<view class="page flex-column relative" :style="{'backgroundImage':`url(https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/background/6.jpg)`}">
			<view class="top relative overfHidden">
				<!-- #ifndef MP-TOUTIAO -->
				<view class="barStatus"></view>
				<image src="../../static/images/leftjt.png" mode="widthFix" class="width34 left32" @click="returnPage"></image>
				<!-- #endif -->
				
				<view class="flex marlr48 between hcenter" style="margin-top: 48rpx;">
					<image :src="info.avatar" @click="previewImage([info.avatar])" mode="aspectFill" class="photo"></image>
					<view class="">
						<view class="is_follow center" v-if="isMine" @click="toMyPage">编辑资料</view>
					</view> 
				</view>
				<view class="name">{{info.nickname}}</view>
				<view class="introduction ellipsis">
					简介:{{info.introduction||'暂无'}}
				</view>
				<view class="iconBox">
					<view class="marlr32 flex between">
						<view class="flex hcenter">
							<image src="/static/images/backIcon1.png" mode="widthFix" class="icon"></image>
							<view class="iconNum">{{info.statistics.fans_number}} 粉丝</view>
						</view>
						<view class="flex hcenter">
							<image src="/static/images/backIcon2.png" mode="widthFix" class="icon"></image>
							<view class="iconNum">{{info.statistics.follow_number}} 关注</view>
						</view>
						<view class="flex hcenter">
							<image src="/static/images/tz_icon.png" mode="widthFix" class="icon"></image>
							<view class="iconNum">{{info.statistics.question_number}} 帖子</view>
						</view>
					</view>
				</view>
			</view>
			<view :class="['bottom', !isMine?'padb180':'']" :style="{height:'calc(100vh - '+navbar+'px)'}">
				<!-- #ifdef MP-KUAISHOU -->
				<u-tabs :list="tab.nav" :is-scroll="false" :show-bar="false" :current="tab.index" @change="setNav"></u-tabs>
				<!-- #endif -->

				<!-- #ifndef MP-KUAISHOU -->
				<u-tabs :list="tab.nav" :is-scroll="false" :current="tab.index" @change="setNav"></u-tabs>
				<!-- #endif -->
				
				<scroll-view scroll-y="true" style="height: 90%" v-if="!tab.index">
					<view v-for="(item,index) in tab.list" :key="index" class="item" @click="toAskDetails(item.question_id)">
						<view class="marlr32">
							<view class="flex hcenter martop32" style="margin-bottom: 20rpx;">
								<image :src="item.avatar" mode="aspectFill" class="itemPhoto"></image>
								<view class="left20">
									<view class="itemName">{{item.nickname}}</view>
									<view class="time">{{item.created_at}}</view>
								</view>
							</view>
							<view class="wenda" v-if="item.source_type">
								<view class="title line2">原贴：{{item.content}}</view>
								<view class="imageBox flex-row" v-if="item.question_images.length">
									<image v-for="(item1,index1) in item.question_images" :key="index1" :src="item1" @click.stop="previewImage(item.question_images,index1)" mode="aspectFill" class="image" v-if="index < 3"></image>
								</view>
							</view>
							<view class="pinglun" v-else>
								<view class="title line2">
									<text v-if="item.mode == 0">{{item.question_comment}}</text>
									<voicePlay noTranslate v-else :url="item.recording_file" :time="item.recording_duration" ></voicePlay>
								</view>
								<view class="article flex between hcenter ">
									<view class="content line1">原贴：{{item.content}}</view>
									<image src="/static/images/right.png" mode="widthFix" class="width14"></image>
								</view>
							</view>
						</view>
						<!-- <u-gap height="12" bg-color="#f5f7fa"></u-gap> -->
					</view>
					<view class="center null" v-if="!tab.list.length">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode="widthFix"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>

				<scroll-view scroll-y="true" style="height: 90%;" @scrolltolower="scrolltolower" class="comment" v-else>
					<view class="relative item" v-for="(item,index) in tab.list1" :key="index">
						<view class="flex hcenter between">
							<view class="flex hcenter">
								<image :src="item.avatar" class="photo" mode="width"></image>
								<view class="left16">
									<view class="font28">{{item.nickname}}</view>
									<text class="font24 color6E7695">{{item.created_at}}</text>
								</view>
							</view>
							<view class="btn flex hcenter" v-if="item.score==1">
								<image src="/static/images/my_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">满意</text>
							</view>
							<view class="btn flex hcenter" v-if="item.score==2">
								<image src="/static/images/yb_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">一般</text>
							</view>
							<view class="btn flex hcenter" v-if="item.score==3">
								<image src="/static/images/bmy_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">不满意</text>
							</view>
						</view>
						<view class="text">{{item.evaluate}}</view>
						<view class="flex" v-if="info.order_evaluate_reasons && info.order_evaluate_reasons.length">
							<text class="tag" v-for="(item1,index1) in item.order_evaluate_reasons" :key="index1">{{item1}}</text>
						</view>
						<view class="">
							<text class="bold color6E7695">{{item.order_type}}</text>
						</view>
					</view>
					<view class="center null" v-if="!tab.list1.length">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode="widthFix"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { getLawyerPage, getAttention, getEvaluation, getItsAnswer } from "@/api/apis.js"

export default {
	components: {},
	data() {
		return {
			isMine:false,
			navbar:null,
			userId: "QdRoKNayAL52kVOPq6G0",
			info: null,
			tab: {
				nav: [
					{ name: 'TA的帖子' },
					{ name: 'TA的律师' }
				],
				index: 0,
				page: 1,
				list: [],
				list1: []
			}
		}
	},
	methods: {
		toMyPage(){
			uni.navigateTo({
				url:'/my/client/mypage'
			})
		},
		toAskDetails(e) {
			console.log(e)
			uni.navigateTo({
				url: `/pagesV1/index/askDetails?id=${e}`
			})
		},
		previewImage(urls,index){
			uni.previewImage({
				current:index||0,
				urls: urls, 
				longPressActions: {
					itemList: ['保存图片'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		getItsAnswer() {
			getItsAnswer({
				timestamp: this.tab.list.length ? this.tab.list[this.tab.list.length-1].timestamp : null,
				user_id: this.userId
			}).then(res => {
				let list = res.data.data;
				this.$set(this.tab, "list", this.tab.list.concat(list))
			})
		},
		getEvaluation() { //获取评价
			getEvaluation({
				user_id: this.userId,
				page: this.tab.page
			}).then(res => {
				let data = this.tab.list1.concat(res.data.data.data)
				// this.$set(this.tab, list1, data)
				this.tab.list1=data
				this.tab.page +=1;
			})
		},
		setNav(index) {
			this.$set(this.tab, "index", index)
		},
		toChat(id, name) { //私聊
			uni.navigateTo({
				url: `/pagesV1/info/infoDetails?id=${id}&name=${name}`
			})
		},
		setFollow(val) { //关注
			getAttention({
				type: val ? 1 : 0,
				follow_user_id: this.userId
			}).then(res => {
				if (!res.data.code) {
					this.info.is_follow = res.data.data.is_follow
				}
			})
		},
		returnPage() {
			uni.navigateBack({
				delta: 1
			})
		},
		/**
		 * 获取当前用户信息
		 */
		getLawyerPage() {
			getLawyerPage({ user_id: this.userId }).then(res => {
				this.$set(this, "info", res.data.data)
			})
		},
		getDivInfo(){
			const query = uni.createSelectorQuery().in(this);
			query.select('#navbar').boundingClientRect(data => {
				console.log("得到布局位置信息" + JSON.stringify(data));
				console.log("节点离页面顶部的距离为" + data.top);
				this.navbar=data.height
			}).exec();
		},
		initial() {
			this.tab.list = [];
			this.tab.list1 = [];
			this.tab.index = 0
		}
	},
	onLoad(e) {
		this.$set(this, "userId", e.id)
		// this.getDivInfo()
		if(uni.getStorageSync('user_id') == e.id)
			this.isMine = true
	},
	onShow() {
		this.getLawyerPage();
		// this.initial();
		this.getItsAnswer();
		this.getEvaluation()
	}
}
</script>

<style scoped lang="scss">
	.comment{
		.item{
			padding: 0 0 28rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
			margin: 0 32rpx 24rpx;
		}
		.text{
			margin: 20rpx 0 16rpx;
		}
		.photo{
			width: 88rpx;
			height: 88rpx;
			border-radius: 12rpx;
		}
		.tag{
			color: #14284A;
			height: 48rpx;
			font-size: 28rpx;
			padding: 4rpx 18rpx;
			background: #F7F7F9;
			border-radius: 4rpx;
			margin-right: 16rpx;
			margin-bottom: 16rpx;
		}
	}
	.fixedBox{
		padding: 20upx 32upx 60upx 32upx;
		position: fixed;
		bottom: 0;
		width: 100vw;
		z-index: 1000;
		.btn{
			flex: 1;
			text-align: center;
			line-height: 88upx;
			border-radius: 8upx;
			font-size: 32upx;
			font-weight: bold;
			color: #4B4B4D;
			background: linear-gradient(90deg, #F3F5F8 0%, #F3F5F8 100%);
			align-items: center;
			justify-items: center;
			justify-content: center;
			image{
				width: 40upx;
				height: 40upx;
				margin-right: 8upx;
			}
		}
		.blue{
			margin-left: 20upx;
			color: #fff;
			background: linear-gradient(90deg, #4F8FFE 0%, #2A68F9 100%);
		}
	}
	.page {
		.top {
			.iconBox {
				width: 100%;
				// position: absolute;
				margin-bottom:32upx ;
			}

			.icon {
				width: 40rpx;
			}

			.iconNum {
				font-size: 28rpx;
				color: #FFFFFF;
			}
			.introduction{
				margin:20upx 48upx 12upx 48upx ;
				height: 77upx;
				font-size: 26upx;
				line-height: 40upx;
				color: #FFFFFF;
			}
			.name {
				margin-left: 48rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #FFFFFF;
				margin-top: 32rpx;
			}

			.chat {
				width: 150rpx;
				line-height: 64rpx;
				background: #0061FF;
				box-shadow: 0px 4rpx 10rpx rgba(0, 0, 0, 0.16);
				border-radius: 100rpx;
				color: #fff;
				font-size: 28rpx;
				margin-top: 32rpx;
			}

			.is_follow {
				line-height: 50upx;
				font-size: 26upx;
				padding: 0 20upx;
				font-weight: bold;
				color: #222;
				background-color: #FFF;
				border-radius: 100upx;
			}

			

			.photo {
				width: 152rpx;
				height: 152rpx;
				border-radius: 32rpx;
				background: #fff;
				border: 4upx solid #fff;
			}
		}

		.bottom {
			flex: 1;
			// height: 60vh;
			
			background-color: #fff;
			border-radius: 32rpx 32rpx 0px 0px;
			overflow: hidden;
			.item {
				.pinglun {
					.article {
						.content {
							width: 80%;
							overflow: hidden;
						}

						background: #F3F5F8;
						border-radius: 8rpx;
						padding: 20rpx 24rpx;
						font-size: 28rpx;
						color: #888D98;
						margin: 20rpx 0 32rpx 0;
					}

					.title {
						font-size: 34rpx;
					}

				}

				.wenda {
					.imageBox {
						.image {
							width: 200rpx;
							height: 200rpx;
							margin-right: 12rpx;
							border-radius: 8rpx;
							margin-bottom: 12rpx;
						}
						
						margin-top: 28rpx;
					}

					.title {
						font-size: 34rpx;
					}

					margin-bottom: 32rpx;
				}

				.time {
					font-size: 24rpx;
					color: #888D98;
				}

				.itemPhoto {
					width: 88rpx;
					height: 88rpx;
					border-radius: 12rpx;
				}

				.itemName {
					font-size: 34rpx;
				}
				&:last-child{
					border-bottom: none;
				}
				border-bottom: 12rpx solid #f5f7fa;
			}
		}
		.padb180{
			padding-bottom: 180rpx;
		}
		height: 100vh;
		background-size: 100vw;
	}
</style>
