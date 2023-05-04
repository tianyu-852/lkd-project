<template>
	<view class="list">
		<view class="marbot40" v-for="(item,index) in list" :key="index">
			<view class="list-user flex hcenter">
				<view class="list-user-photo">
					<image :src="item.avatar" mode="aspectFill"></image>
				</view>
				<view>
					<view class="list-user-name">
						<text>{{item.nickname}}</text>
						<text v-if="from=='detail'" class="list-user-name-text">支持了</text>
						<text v-if="from=='detail'" class="list-user-name-num">{{item.donation_money}}元</text>
					</view>
					<view class="list-user-desc">
						<image src="/pagesV2/static/images/ax_icon@3x.png" v-if="from=='verify'" mode="widthFix"></image>
						<text v-if="from=='verify'">{{item.love_number}}枚爱心值</text>
						<text v-if="from=='verify'">·</text>
						<text>{{item.created_at}}</text>
					</view>
				</view>
				<!-- <view v-if="from=='detail'" class="list-user-btn borrad100" @click="reply()">回复</view> -->
				<view v-if="from=='verify'" class="list-user-btn borrad8">已实名</view>
			</view>
			<view class="list-content">
				<text>{{from=='verify'?item.content:item.comment}}</text>
				<view class="list-content-box" v-if="from=='detail'">
					<view><text>{{item.fundraising_reply_nickname}}：</text>{{item.fundraising_reply}}</view>
				</view>
				<view class="list-content-foot" v-if="from=='verify'">
					<view :class="[item.is_like?'on':'']" @click="clickLike(item,index)">
						<image :src="item.is_like?'/static/images/dz_icon_sel2.png':'/static/images/dz_icon2.png'" mode="widthFix"></image>
						<text>{{item.like_number}}</text>
					</view>
				</view>
			</view>
			<u-line color="#C6CDD9" margin="32rpx 0" border-style="dotted"/>
		</view>
		<u-empty text="暂无信息" mode="list" v-if="list.length<1"></u-empty>
		<!-- 弹窗 -->
		<!-- <u-popup v-model="commentPop" mode="bottom">
			<view class="comment-box flex between hcenter">
				<input class="comment-box-input" :value="commentText" type="text" />
				<view class="comment-box-btn" @click="submit">提 交</view>
			</view>
			<u-line color="#C6CDD9" margin="16rpx 0 0"/>
			<view class="comment-list marlr32">
				<view class="comment-list-item" v-for="(item,index) in commentList" :key="index" @click="commentText=item.title">
					<text>{{item.title}}</text>
				</view>
			</view>
		</u-popup> -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		props:{
			list: Array,
			from: String
		},
		data() {
			return {
				// commentPop: false,
				// commentText: '畅所欲言...',
				// commentList: [{title:'123123123'},{title:'123123123'},{title:'123123123'},{title:'123123123'},{title:'123123123'}]
			}
		},
		methods: {
			// reply(){
			// 	this.commentPop=true;
			// 	this.commentText=''
			// },
			// submit(){
			// 	this.commentPop=false;
			// 	this.$refs.uToast.show({
			// 		title: '提交成功'
			// 	})
			// },
			clickLike(item,index){
				this.$emit("clickLike",item,index)
			}
		}
	}
</script>

<style scoped lang="scss">
	.list{
		.list-user{
			position: relative;
			margin-bottom: 16upx;
			font-size: 28upx;
			.list-user-photo{
				width: 88upx;
				height: 88upx;
				margin-right: 16upx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.list-user-name{
				color: #222;
				font-size: 28upx;
				font-weight: bold;
				.list-user-name-num{
					color: #FF6E57;
				}
				.list-user-name-text{
					font-weight: 300;
					margin: 0 8upx;
				}
			}
			.list-user-desc{
				color: #888D98;
				font-size: 24upx;
				image{
					width: 26upx;
					margin-bottom: -4upx;
					margin-right: 4upx;
				}
			}
			.list-user-btn{
				width: 100upx;
				height: 44upx;
				line-height: 44upx;
				color: #0061FF;
				background-color: #E6F0FF;
				text-align: center;
				font-size: 24upx;
				position: absolute;
				right: 0;
			}
			.borrad100{
				border-radius: 100upx;	
			}
			.borrad8{
				border-radius: 8upx;	
			}
		}
		.list-content{
			margin-left: 104upx;
			.list-content-box{
				padding: 20upx 30upx;
				background-color: #F5F6F7;
				border-radius: 8upx;
				margin-top: 20upx;
				text{
					color: #222;
					font-weight: bold;
				}
			}
			.list-content-foot{
				color: #888D98;
				font-size: 24upx;
				text-align: right;
				image{
					width: 36upx;
					height: 36upx;
					margin: 0 6upx -6upx 0;
				}
				.on{
					color: #FF5757;
				}
			}
		}
		// .comment-box{
		// 	padding: 0 32upx;
		// 	height: 60upx;
		// 	line-height: 60upx;
		// 	margin-top: 16upx;
		// 	.comment-box-input{
		// 		width: 69%;
		// 		height: 100%;
		// 		background-color: #EBEEF3;
		// 		border-radius: 100upx;
		// 		padding: 0 32upx;
		// 	}
		// 	.comment-box-btn{
		// 		width: 19%;
		// 		height: 100%;
		// 		text-align: center;
		// 		color: #fff;
		// 		background: linear-gradient(to right,#476CFF,#5E99FF);
		// 		border-radius: 100upx;
		// 	}
		// }
		// .comment-list{
		// 	.comment-list-item{
		// 		padding: 16upx 0;
		// 		border-bottom: 2upx solid #ECEFF4;
		// 	}
		// }
	}
	
</style>
