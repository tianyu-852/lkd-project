<template>
	<view class="martop20" @click="clearInput">
		<view class="marlr32">
			<view class="flex between">
				<view class="flex hcenter">
					<view class="relative">
						<image :src="info.avatar" mode="aspectFill" class="photo"
							@click="toLawyerPage(info.user_id,info.type)"></image>
						<image class="followImg"
							:src="!info.is_follow?'../../static/images/gz_icon.png':'../../static/images/ygz_icon.png'"
							mode="widthFix" @click.stop="setFollow(info.is_follow,info.user_id)"></image>
					</view>
					<view class="flex hcenter left20">
						<view class="name">{{info.nickname}}</view>
					</view>
				</view>
				<view class=""></view>
			</view>
			<view class="content">{{info.question_comment}}</view>
			<view class="created_at">{{info.created_at}}{{info.city}}</view>
		</view>
		<view class="height12"></view>
		<view class="marlr32 commentList1" v-for="(item,index) in comment" :key="index">
			<view class="flex hcenter" v-if="item.type==0">
				<image :src="item.avatar" mode="aspectFill" class="width78"
					@click.stop="toLawyerPage(item.user_id,item.type)"></image>
				<view class="left16 name1"
					@click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					{{item.nickname}}</view>
			</view>
			<view class="flex hcenter between" v-if="item.type==1">
				<view class="flex">
					<image :src="item.avatar" mode="aspectFill" class="width78"
						@click.stop="toLawyerPage(item.user_id,item.type)"></image>
					<view class="left16"
						@click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
						<view class="flex hcenter">
							<view class="name1">{{item.nickname}}</view>
							<view class="workYear">执业{{item.work_year}}年</view>
						</view>
						<view class="workName">{{item.lawyer_office}}</view>
					</view>
				</view>
				<!-- <image src="/static/images/mfzx_icon.png" mode="widthFix" class="callIcon"
					@click.stop="toPhoneAdvisory(item)"></image> -->
				<view class="call-lawyer flex-row" @click.stop="toPhoneAdvisory(item)">
					<image src="/static/images/ic_phone.svg">免费咨询
				</view>
			</view>
			<view class="rightbox">
				<view class="content1"
					@click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					{{item.question_comment}}</view>
				<view class="flex hcenter martop20 between"
					@click.stop="clickReply(item.nickname,item.question_comment_id,item.comment_number,item)">
					<view class="time1 line1">{{item.created_at}}{{item.city?"·":""}}{{item.city}}</view>
					<view class="flex">
						<view class="Reply flex hcenter flexcenter">回复</view>
						<view class="flex hcenter">
							<image
								:src="item.is_like?'../../static/images/dz_icon_sel.png':'../../static/images/dz_icon.png'"
								mode="widthFix" class="width44"
								@click.stop="setDz(item.is_like,item.question_comment_id,0)"></image>
							<view class="left10">{{item.like_number}}</view>
						</view>
					</view>
				</view>
				<view v-for="(item1,index1) in item.comments" :key="index1" class="commentList2">
					<view class="flex hcenter">
						<image :src="item1.avatar" mode="aspectFill" class="width64"></image>
						<view class="name2">{{item1.nickname}}1</view>
						<view class="flex hcenter" v-if="item1.reply_user_id">
							<image src="/static/images/dj_icon.png" mode="widthFix" class="jtIcon"></image>
							<view class="name2">{{item1.reply_nickname}}</view>
						</view>
					</view>
					<view class="left80">
						<view class="content2">{{item1.question_comment}}</view>
						<view class="flex hcenter martop20 between">
							<view class="time2 line1">{{item1.created_at}}{{item1.city?"·":""}}{{item1.city}}</view>
							<view class="flex">
								<view class="Reply flex hcenter flexcenter"
									@click.stop="clickReply(item1.nickname,item1.question_comment_id,item1.comment_number,item1)">
									回复</view>
								<view class="flex hcenter">
									<image
										:src="item1.is_like?'../../static/images/dz_icon_sel.png':'../../static/images/dz_icon.png'"
										mode="widthFix" class="width44"
										@click.stop="setDz(item1.is_like,item1.question_comment_id,0)"></image>
									<view class="left10">{{item1.like_number}}</view>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed fixedBox flex  " v-if="!reply.inputStatus">
			<view class="marlr32 flex around col100 hcenter">
				<view class=" flex inputbox hcenter" @click.stop="setInputStatus">
					<image src="../../static/images/sr_icon.png" mode="widthFix" class="width24"></image>
					<view class="left16">畅所欲言...</view>
				</view>
			</view>
		</view>
		<u-popup mode="bottom" v-model="reply.inputStatus" duration="0">
			<view class="marlr32 ">
				<textarea :disable-default-padding="false" :fixed="true" :placeholder="reply.placeholder"
					confirm-type="send" v-model="reply.value" @confirm="send" :focus="textarea.focus" @click.stop=""
					:show-confirm-bar="false" :adjust-position="false" @focus="showTextarea" @blur="hideTextarea"
					:hold-keyboard="true"></textarea><!--  -->
			</view>
			<view class="" v-if="reply.inputStatus" :style="{'height':`${textarea.height}px`}">

			</view>
		</u-popup>
		<view class="" style="height: 200rpx;"></view>
	</view>
</template>

<script>
	import {
		getQuestion,
		getAttention,
		getComment,
		getOneId,
		getTwoId,
		getReply,
		getPublish,
		getLike,
		getUnlike,
		getFavorites,
		getUnFavorites,
		getCommentD
	} from "../../api/apis.js"
	export default {
		data() {
			return {
				textarea: {
					height: null,
					focus: false
				},
				id: 2949, //788
				info: {},
				comment: [],
				reply: {
					inputStatus: false,
					placeholder: '...',
					value: null,
					replyId: 4, //回复ID
					isReply: false, //是否为回复
				}
			}
		},
		methods: {
			hideTextarea(e) {
				this.$set(this.textarea, "focus", false);
				this.$set(this.reply, "inputStatus", false)
			},
			showTextarea(e) {
				this.$set(this.textarea, "height", e.detail.height)
				console.log(e)
			},
			toLawyerPage(id, type) {
				console.log(id, type)
				if (type) {
					uni.navigateTo({
						url: `lawyerPage?id=${id}`
					})
					return
				}

				uni.navigateTo({
					url: `/my/client/heLookPage?id=${id}`
				})

			},
			setSC(isSc) { //修改收藏
				if (isSc) {
					getUnFavorites({
						question_id: this.id
					}).then(res => {
						if (!res.data.code) {
							this.info.is_collect = 0
						}
					})
					return
				}
				getFavorites({
					question_id: this.id
				}).then(res => {
					if (!res.data.code) {
						this.info.is_collect = 1
					}
				})
			},
			setDz(isLike, id, type, index) { //修改评论点赞
				if (isLike) {
					getUnlike({
						type: type,
						source_id: id
					}).then(res => {
						if (!res.data.code) {
							uni.showToast({
								icon: "none",
								title: "取消点赞成功"
							})
							this.getTwoId()
						}
					})
					return
				}
				getLike({
					type: type,
					source_id: id
				}).then(res => {
					uni.showToast({
						icon: "none",
						title: "点赞成功"
					})
					if (!res.data.code) {
						this.getTwoId()
					}
				})
			},
			clearInput() {
				this.reply.inputStatus = false;
			},
			send() { //发送评论内容

				getReply({
					question_comment_id: this.reply.replyId,
					question_comment: this.reply.value
				}).then(res => {
					this.getTwoId();
					this.reply.value = null
				})

			},
			clickReply(name, id, num, item) { //点击回复按钮时
				this.reply.inputStatus = true;
				this.reply.placeholder = `回复   ${name}`;
				this.reply.isReply = true
				this.reply.replyId = id;
				setTimeout(() => {
					this.$set(this.textarea, "focus", true)
				}, 100)
			},
			setInputStatus() { //点击弹出input框
				this.reply.replyId = this.id
				this.reply.inputStatus = true
				this.reply.isReply = false;
				this.reply.placeholder = `发表`;
				setTimeout(() => {
					this.$set(this.textarea, "focus", true)
				}, 100)
			},
			getTwoId() { //获取二级ID
				getTwoId({
					question_comment_id: this.id,
					order_type: 1
				}).then(res => {
					console.log(res)
					getComment({
						question_id: res.data.data.question_id,
						question_comment_ids: JSON.stringify(res.data.data.question_comment_ids),
						is_sub_more: 1,
						is_more_from_all: 1
					}).then(res => {
						this.$set(this, "comment", res.data.data)
						console.log('评论', res.data.data)
					})
				})
			},

			setFollow(e, id) { //是否关注
				console.log(e, id)
				/* getAttention({
					type: e ? 1 : 0,
					follow_user_id: id
				}).then(res => {
					this.info.is_follow = res.data.data.is_follow
				}) */
			},
			getQuestionDetails() { //获取评论详情
				getCommentD({
					question_comment_id: this.id
				}).then(res => {
					this.$set(this, 'info', res.data.data)
					console.log('详情', res.data.data)
				})
			},
		},
		onLoad(e) {
			this.id = e.id;
			this.getQuestionDetails();
			this.getTwoId();
		}
	}
</script>

<style lang="scss">
	.zixun {
		width: 100rpx;
		font-size: 18rpx;
		font-weight: bold;
		color: #222222;
		left: 48rpx;
	}

	.likeNum {
		top: 0;
		left: 48rpx;
	}

	.inputbox {
		width: 100%;
		height: 64rpx;
		background: #EBEEF3;
		border-radius: 100rpx;
		padding-left: 36rpx;
		font-size: 28rpx;
		color: #888D98;
	}

	.fixedBox {
		width: 100%;
		background-color: #fff;
		bottom: 0rpx;
		padding: 30rpx 0 91rpx 0 ;
		border-top: 1rpx solid #F1F4FB;
	}



	.commentList1 {
		.surplus {
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #0061FF;
		}

		.commentList2 {
			.jtIcon {
				width: 20rpx;
				margin-left: 16rpx;
			}

			border-top: 1rpx solid #ccc;
			padding-top: 20rpx;
			margin-top: 20rpx;
		}

		.callIcon {
			width: 140rpx;
		}

		.workName {
			font-size: 24rpx;
			color: #888D98;
		}

		.workYear {
			background: url(../../static/images/xx_bq_icon.png) no-repeat;
			background-size: 100% 100%;
			margin-left: 12rpx;
			padding: 1rpx 8rpx 1rpx 20rpx;
			font-size: 20rpx;
			font-weight: bold;
			color: #5B86FF;
		}

		.name1 {
			font-size: 28rpx;
			font-weight: bold;
			color: #222222;
		}

		padding: 32rpx 0;
		border-bottom: 1rpx solid #ccc;
	}

	.content2 {
		color: #222222;
		font-size: 28rpx;
	}

	.name2 {
		font-size: 28rpx;
		font-weight: bold;
		color: #222222;
		margin-left: 16rpx;
	}

	.width64 {
		width: 64rpx;
		height: 64rpx;
		border-radius: 100px;
	}

	.width44 {
		width: 44rpx;
		margin-left: 80rpx;
	}

	.Reply {
	
		margin-right: 64rpx;
		font-size: 26rpx;
		color: #677592;
		border: 2rpx solid #677592;
		border-radius: 100rpx;
	}

	.time1 {
		width: 271rpx;
		font-size: 24rpx;
		color: #888D98;
	}

	.time2 {
		width: 199rpx;
		font-size: 24rpx;
		color: #888D98;
	}

	.content1 {
		font-size: 32rpx;
		font-weight: 500;
		color: #222222;
		line-height: 48rpx;
	}

	.rightbox {
		margin-left: 94rpx;
	}

	.name1 {
		font-size: 30rpx;
		font-weight: bold;
		color: #222222;
	}

	.width78 {
		width: 78rpx;
		height: 78rpx;
		border-radius: 100px;
	}

	.allReply {
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
		padding: 32rpx 0 20rpx 0;
		border: 1rpx solid #ECEFF4;
	}

	.height12 {
		height: 12rpx;
		background: #F5F7FA;
		margin-top: 20rpx;
	}

	.created_at {
		font-size: 24rpx;
		color: #888D98;
		margin: 38rpx 0 28rpx 0;
	}

	.content {
		margin: 20rpx 0 15rpx 0;
		font-size: 32rpx;
		color: #222222;
	}

	.name {
		margin-right: 12rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
	}

	.followImg {
		position: absolute;
		width: 44rpx;
		right: 0;
		bottom: 0;
	}

	.item2 {
		margin: 12rpx 0;
		padding: 24rpx 0;
	}

	.photo {
		width: 110rpx;
		height: 110rpx;
		border-radius: 100rpx;
	}
</style>
