<template>
	<view>
		<u-tabs :list="nav.list" ref="tabs" :current="nav.index" @change="changeNav" active-color="#000000" class="top"></u-tabs>
		<view class="center null" v-if="!content[nav.index].length">
			<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
			<view class="flex-column flexcenter hcenter">
				<text class="hint">暂无数据~</text>
				<text class="button" @click="toFabu()" v-if="nav.index === 1">赶紧前往社区发布吧</text>
				<text class="button" @click="toHome()" v-else>前往问答社区看看吧</text>
			</view>
		</view>
		<view class="Con" v-if="nav.index==0||nav.index==1||nav.index==2">
			<view v-for="(item,index) in content[nav.index]" :key="index" class="item">
				<view class="marlr32">
					<view class="flex between header hcenter" @click="toQuestion(item.question_id)">
						<view class="flex hcenter">
							<image :src="item.avatar" mode="aspectFill" class="photo"></image>
							<view class="name">{{item.nickname}}</view>
							<view class="time">{{item.created_at}}</view>
						</view>
						<view class="del" v-if="nav.index==1">
							<image src="/static/images/del.png" mode="widthFix"
								@click.stop="clickDel(index,item.question_id)"></image>
						</view>
					</view>
					<view class="flex content hcenter " @click="toQuestion(item.question_id)">
						<view class="line3 contentTitle">
							<image :src="item.background_icon" mode="widthFix"></image>{{item.title}}
						</view>
					</view>
					<view class="images flex " @click="toQuestion(item.question_id)">
						<image :src="item1" mode="aspectFill" v-for="(item1,index1) in item.question_images"
							:key="index1"></image>
					</view>
					<view class="flex between color888D98">
						<button class="flex hcenter share" open-type="share" :data-data="item">
							<image src="/static/images/fx_icon.png" mode="widthFix" class="width36">
							</image>
							<text>分享</text>
						</button>
						<view class="flex hcenter" @click="toQuestion(item.question_id)">
							<image src="/static/images/pl_icon.png" mode="widthFix" class="width36"></image>
							<text >{{item.comment_number}}</text>
						</view>
						<view class="flex hcenter" @click="clickLike(item.question_id,item.is_like,index)">
							<image :src="item.is_like?'/static/images/dz_icon_sel.png':'/static/images/dz_icon.png'"
								mode="widthFix" class="width36"></image>
							<text>{{item.like_number}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="Con" v-else>
			<view v-for="(item,index) in content[nav.index]" :key="index" class="item1">
				<view class="marlr32" @click="toQuestion(item.question_id)">
					<view class="header flex between  hcenter">
						<view class="flex hcenter">
							<image :src="item.avatar?item.avatar:item.from_avatar" mode="aspectFill" class="photo">
							</image>
							<view class="">
								<view class="flex hcenter to" v-if="nav.index==3">
									<view class="">我</view>
									<view class="text">评论了</view>
									<view class="">{{item.to_user_nickname}}</view>
								</view>
								<view class="comment" v-if="nav.index==4">{{item.from_nickname}}回复了您的评论</view>
								<view class="comment" v-if="nav.index==5">{{item.nickname}}赞同了您的评论</view>
								<view class="time">{{item.created_at}}</view>
							</view>
						</view>
						<image v-if="nav.index==3" src="/static/images/del.png" mode="widthFix" class="del"
							@click.stop="delComment(index,item.question_comment_id)"></image>
					</view>
					<view class="content">
						<text v-if="item.mode == 0">{{nav.index==3?item.question_comment:(nav.index==4?item.content:item.question_content_simple)}}</text>
						<voicePlay noTranslate v-else :url="item.recording_file" :time="item.recording_duration" ></voicePlay>
						
					</view>
					<view class="sl flex between hcenter">
						<view class="text line1">
							{{nav.index==3?item.question_content_simple:(nav.index==4?item.question_content_simple:item.content)}}
						</view>
						<image src="/static/images/right.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getHistory,
		getCollection,
		getMyQuestion,
		getUnlike,
		getLike,
		delQuestion,
		getMyComment,
		getMyReply,
		getMyLike,
		delComment
	} from "../api/apis.js"
	
	export default {
		components: {
		},
		data() {
			return {
				nav: {
					list: [{
							name: '最近浏览'
						},
						{
							name: '我的问答'
						},
						{
							name: '收藏'
						},
						{
							name: '评论'
						},
						{
							name: '回复'
						},
						{
							name: '点赞'
						}
					],
					index: 0
				},
				content: [
					[],
					[],
					[],
					[],
					[],
					[]
				],
				page: [1, 1, 1, 1, 1, 1],
			}
		},
		onLoad(e) {
			this.getHistory();
			this.getMyQuestion();
			this.getCollection();
			this.getMyComment();
			this.getMyReply();
			this.getMyLike();
			// this.$set(this.nav, "index", e.index ? e.index : 4)
			setTimeout(()=>{
				this.$refs.tabs.init()
			},500)
		},
		onPullDownRefresh() { // 下拉监听事件
			this.page[this.nav.index] = 1;
			console.log(this.page[this.nav.index]);
			switch (this.nav.index) {
				case 0:
					this.getHistory();
					break;
				case 1:
					this.getMyQuestion();
					break;
				case 2:
					this.getCollection();
					break;
				case 3:
					this.getMyComment();
					break;
				case 4:
					this.getMyReply();
					break;
				case 5:
					this.getMyLike();
					break;
			}
		},
		onReachBottom() {
			switch (this.nav.index) {
				case 0:
					this.getHistory();
					break;
				case 1:
					this.getMyQuestion();
					break;
				case 2:
					this.getCollection();
					break;
				case 3:
					this.getMyComment();
					break;
				case 4:
					this.getMyReply();
					break;
				case 5:
					this.getMyLike();
					break;
			}
		},
		methods: {
			toHome(){
				uni.switchTab({
					url:'/pages/v1/index'
				})
			},
			toFabu(){
				uni.navigateTo({
					url:'/pagesV1/common/fabu'
				})
			},
			toQuestion(id) {
				uni.navigateTo({
					url: `/pagesV1/index/askDetails?id=${id}`
				})
			},
			delComment(index, id) { //删除评论
				uni.showModal({
					title: '您确定要删除么',
					success: res => {
						if (res.confirm) {
							delComment({
								question_comment_id: id
							}).then(res => {
								if (!res.data.code) {
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									})
								}
								this.content[3].splice(index, 1)
							})
						}
					}
				})
			},
			clickDel(index, id) { //删除问答
				uni.showModal({
					title: '您确定要删除么',
					success: res => {
						if (res.confirm) {
							delQuestion({
								question_id: id
							}).then(res => {
								if (!res.data.code) {
									uni.showToast({
										icon: 'none',
										title: '删除成功'
									})
								}
								this.content[1].splice(index, 1)
							})
						}
					}
				})
			},
			clickLike(id, islick, index) { //点赞
				if (islick) {
					getUnlike({
						type: 3,
						source_id: id
					}).then(res => {
						this.content[this.nav.index][index].is_like = 0
						this.content[this.nav.index][index].like_number -= 1
					})
					return
				}
				getLike({
					type: 3,
					source_id: id
				}).then(res => {
					this.content[this.nav.index][index].is_like = 1
					this.content[this.nav.index][index].like_number += 1
				})
			},
			changeNav(index) { //修改tab
				this.nav.index = index;
			},
			getHistory() { //获取最近浏览
				getHistory({
					page: this.page[0]
				}).then(res => {
					let data = this.content[0].concat(res.data.data.data)
					this.$set(this.content, 0, data);
					this.page[0] += 1;
				})
			},
			getMyQuestion() { //获取我的问答
				getMyQuestion({
					page: this.page[1]
				}).then(res => {
					let data = this.content[1].concat(res.data.data.data)
					this.$set(this.content, 1, data);
					this.page[1] += 1;
				})
			},
			getCollection() { //获取我的收藏
				getCollection({
					page: this.page[2]
				}).then(res => {
					let data = this.content[2].concat(res.data.data.data)
					this.$set(this.content, 2, data);
					this.page[2] += 1;
				})
			},
			getMyComment() { //获取我的评论
				getMyComment({
					page: this.page[3]
				}).then(res => {
					let data = this.content[3].concat(res.data.data.data)
					this.$set(this.content, 3, data);
					this.page[3] += 1;
					console.log(res.data.data.data)
				})
			},
			getMyReply() { //获取我的回复
				getMyReply({
					page: this.page[4]
				}).then(res => {
					let data = this.content[4].concat(res.data.data.data)
					this.$set(this.content, 4, data);
					this.page[4] += 1;
				})
			},
			getMyLike() { //获取我的回复
				getMyLike({
					page: this.page[5]
				}).then(res => {
					let data = this.content[5].concat(res.data.data.data)
					this.$set(this.content, 5, data);
					this.page[5] += 1;
				})
			},
		}
	}
</script>

<style lang="scss">
	.null{
		.hint{
			line-height: 42rpx;
			font-size: 30rpx;
			color: #B1BCD4;
		}
		.button{
			width: 440rpx;
			height: 68rpx;
			background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
			border-radius: 100px;
			font-size: 32rpx;
			line-height: 68rpx;
			color: #FFFFFF;
			text-align:center ;
			margin-top: 24rpx;
		}
	}
	.top{
		width: 100%;
		position: fixed;
		top: 0;
		z-index: +1;
	}
	.top40{
		top: 44px;
	}
	.Con{
		margin-top: 96upx;
	}
	.item1 {
		.sl {
			image {
				width: 14rpx;
			}

			.text {
				width: 515rpx;
				font-size: 28rpx;
				color: #888D98;
			}

			background: #F3F5F8;
			border-radius: 8rpx;
			padding: 20rpx 24rpx;
		}

		.content {
			margin: 20rpx 0;
			font-size: 34rpx;
			color: #222222;
		}

		.header {
			.del {
				width: 26rpx;
			}

			.time {
				margin-top: 4rpx;
				font-size: 26rpx;
				color: #888D98;
			}

			.photo {
				width: 88rpx;
				height: 88rpx;
				border-radius: 100px;
				margin-right: 20rpx;
			}

			.comment {
				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}

			.to {
				.text {
					margin: 0 8rpx;
					font-weight: 500;
					color: #5B6A91;
				}

				font-size: 30rpx;
				font-weight: bold;
				color: #222222;
			}
		}

		padding: 32rpx 0;
		border-bottom: 12rpx solid #F5F7FA;
	}

	.item {
		.width36 {
			width: 36rpx;
			margin-right: 8rpx;
		}

		.images {
			image {
				width: 218rpx;
				height: 144rpx;
				margin: 0 5rpx 10rpx;
			}

			margin-bottom: 24rpx;
		}

		.content {
			image {
				width: 52rpx;
				margin-right: 20rpx;
			}

			.content1 {
				font-size: 32rpx;
				line-height: 48rpx;
				color: #222222;
			}

			margin: 18rpx 0 24rpx 0;
		}

		.header {
			.photo {
				width: 28rpx;
				height: 28rpx;
				border-radius: 100px;
			}

			.name {
				font-size: 28rpx;
				color: #222222;
				margin-left: 8rpx;
			}

			.time {
				color: #888D98;
				margin-left: 12rpx;
			}

			.del {
				image {
					width: 26rpx;
				}
			}
		}

		padding: 24rpx 0;
		border-bottom: 12rpx solid #F5F7FA;
	}

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
</style>
