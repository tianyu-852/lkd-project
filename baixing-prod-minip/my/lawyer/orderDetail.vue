<template>
	<view>
		<view class="marlr32">
			<view class="status">{{info.status==40?'订单已完成':(info.status==30?'订单未评价':'订单未完成')}}</view>
			<view class="backfff navbox">
				<view class="pad28 nav">
					<view class="title">
						感谢您对百姓律师的信任,期待再次光临
					</view>
					<view class="flex between martop20">
						<view v-for="(item,index) in nav.list" :key="index" class="item center">
							<image :src="item.icon" mode="widthFix"></image>
							<view class="">{{item.text}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="backfff martop20">
			<view class="marlr32 flex between NameBox hcenter">
				<view class="flex hcenter">
					<view class="relative">
						<image :src="info.avatar" mode="aspectFit" class="photo"></image>
						<image src="/static/images/rzbs_icon.png" mode="widthFix" class="v" v-if="info.type"></image>
					</view>
					<view class="name">{{info.nickname}}</view>
					<view class="year">执业{{info.work_year}}年</view>
				</view>
				<view class="flex chat hcenter flexcenter">
					<image src="/static/images/ll_icon.png" mode="widthFix"></image>
					<view class="text">私聊</view>
				</view>
			</view>
		</view>
		<view class="backfff martop12" style="padding-bottom: 32rpx;">
			<view class="marlr32 infoList" @click="copy(orderNum)">
				<view class="flex between orderNum">
					<view class="title">订单号</view>
					<view class="flex">
						<view class="num">{{orderNum}}</view>
						<view class="copy">复制</view>
					</view>
				</view>
			</view>
			<view class="marlr32 infoList">
				<view class="flex between orderNum">
					<view class="title">订单类型</view>
					<view class="flex">
						<view class="num">{{info.order_type}}</view>
					</view>
				</view>
			</view>
			<view class="marlr32 infoList">
				<view class="flex between orderNum">
					<view class="title">开始时间</view>
					<view class="flex">
						<view class="num">{{info.created_at}}</view>
					</view>
				</view>
			</view>
			<view class="marlr32 infoList">
				<view class="flex between orderNum">
					<view class="title">我的评价</view>
					<view class="flex hcenter" v-if="info.evaluate_score==1">
						<image src="/static/images/my_icon.png" mode="widthFix" class="emoji"></image>
						<view class="num">满意</view>
					</view>
					<view class="flex hcenter" v-else-if="info.evaluate_score==2">
						<image src="/static/images/yb_icon_sely.png" mode="widthFix" class="emoji"></image>
						<view class="num">一般</view>
					</view>
					<view class="flex hcenter" v-else>
						<image src="/static/images/bmy_icon_sel.png" mode="widthFix" class="emoji"></image>
						<view class="num">不满意</view>
					</view>
				</view>
				<view class="textarea">
					<textarea :value="info.evaluate" placeholder="暂无" disabled></textarea>
				</view>
			</view>
		</view>
		<view class="audioTitle">
			律师录音视频文件
		</view>
		<view class="audioItem backfff" v-for="(item,index) in info.records" :key="index">
			<view class="marlr32">
				<view class="header flex between hcenter">
					<view class="flex hcenter">
						<image :src="item.avatar" mode="aspectFill"></image>
						<view class="left16">
							<view class="name">{{info.nickname}}</view>
							<view class="year">{{info.work_year}}年执业律师</view>
						</view>
					</view>
					<view :class="[item.is_follow?'':'active','follow','flex','flexcenter','hcenter']" @click="setFollow(item.is_follow,item.user_id,index)">{{item.is_follow?'已关注':'关注'}}</view>
				</view>
				<view class="flex">
					<view :class="['audio','hcenter','flex',item.status?'active':'']" @click="clickAudio(item.status,index)">
						<image :src="item.status?url+'/audio.gif':'/static/images/ly_icon.png'" mode="widthFix"></image>
						<view class="time">{{item.duration}}</view>
					</view>
				</view>
				<view class="end">{{item.end_time}}</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		getOrderDetails,
		getOrderList,
		getAttention
	} from "../../api/apis.js"
	let audio = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				info: {},
				orderNum: null,
				url:'',
				nav: {
					list: [{
							icon: '/static/images/lxkf_icon.png',
							text: '联系客服'
						},
						{
							icon: '/static/images/pjls_icon.png',
							text: '评价律师'
						},
						{
							icon: '/static/images/zlyd_icon.png',
							text: '再次咨询'
						}
					]
				}
			}
		},
		methods: {
			clickAudio(status, index) {
				let audioApi = this.info.records[index]
				if (status) {
					audio.pause();
					audioApi.startTime = audio.currentTime
					audioApi.status = false
				} else {
					audio.src = audioApi.record_path;
					audio.seek(audioApi.startTime);
					audio.play()
					audioApi.status = true
					this.info.records.forEach((item1, index1) => {
						if (index1 != index) {
							item1.status = false
						}
					})
				}
			},
			setFollow(is, id, index) {
				getAttention({
					type: is,
					follow_user_id: id
				}).then(res => {
					if (!res.data.code) {
						this.$set(this.info.records[index], "is_follow", res.data.data.is_follow)
					}
				})
			},
			copy(id) {
				uni.setClipboardData({
					data: id,
					success: function() {
						console.log('success');
					}
				});
			},
			getOrderDetails(id) {
				getOrderDetails({
					order_no: id
				}).then(res => {
					res.data.data.records.forEach((item, index) => {
						this.$set(item, "status", false);
						this.$set(item, "startTime", 0);
					})
					this.$set(this, 'info', res.data.data);
					console.log(this.info.records)
				})
			}
		},
		onLoad(e) {
			//console.log(e.id)
			this.url=this.$photoPath
			this.orderNum = '202103091108262572136439';
			this.getOrderDetails('202103091108262572136439');

		}
	}
</script>

<style lang="scss">
	.audioItem {
		.end {
			font-size: 24rpx;
			color: #888D98;
			margin-top: 16rpx;
		}

		.active {
			.time {
				color: #FFFFFF !important;
			}

			background: #0061FF !important;
		}

		.audio {
			.time {
				color: #979EB3;
				margin-left: 16rpx;
			}

			image {
				width: 65rpx;
				margin-left: 20rpx;
			}

			margin-top: 40rpx;
			width: 240rpx;
			height: 60rpx;
			background: #F3F5F8;
			border-radius: 0px 24rpx 24rpx 24rpx;
		}

		.header {
			.active {
				box-sizing: border-box;
				border: 2rpx solid #0061FF;
				color: #0061FF !important;
				background-color: #FFFFFF !important;
			}

			.follow {
				width: 142rpx;
				height: 64rpx;
				background: #E8EEF6;
				border-radius: 100rpx;
				font-size: 28rpx;
				color: #AEB7C8;
			}

			.year {
				font-size: 28rpx;
				color: #222222;
			}

			.name {
				font-size: 34rpx;
				font-weight: bold;
				color: #222222;
			}

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100px;
			}
		}

		padding: 40rpx 0 32rpx 0;
		border-bottom: 12rpx solid #F5F7FA;
	}

	.audioTitle {
		padding: 12rpx 32rpx;
		font-size: 30rpx;
		color: #888D98;
	}

	.textarea {
		textarea {
			width: 100%;
			margin: 0 20rpx;
			padding: 20rpx 0;
		}

		width: 100%;
		height: 160rpx;
		background: #F3F5F8;
		border-radius: 8rpx;
	}

	.infoList:last-child {
		.orderNum {
			border-bottom: none;
		}
	}

	.infoList {
		.orderNum {
			.emoji {
				width: 34rpx;
				margin-right: 8rpx;
			}

			.copy {
				font-size: 32rpx;
				color: #0061FF;
				margin-left: 40rpx;
			}

			.num {
				font-size: 32rpx;
				color: #222222;
			}

			.title {
				font-size: 32rpx;
				color: #222222;
			}

			padding: 32rpx 0;
			border-bottom: 1px solid #ECEFF4;
		}
	}

	.NameBox {
		.chat {
			.text {
				font-size: 28rpx;
				color: #FFFFFF;
				margin-left: 12rpx;
			}

			image {
				width: 28rpx;
			}

			width: 152rpx;
			height: 64rpx;
			background: #0061FF;
			border-radius: 8rpx;
		}

		.year {
			background: linear-gradient(270deg, #EBCDA1 0%, #E3C396 100%);
			border-radius: 4rpx 4rpx 16rpx 4rpx;
			padding: 2rpx 11rpx;
			margin-left: 12rpx;
		}

		.name {
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
			margin-left: 16rpx;
		}

		.photo {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100px;
		}

		.v {
			width: 32rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}

		padding: 40rpx 0;
	}

	.navbox {
		.nav {
			.item {
				image {
					width: 60rpx;
				}
			}

			margin-top: 32rpx;

			.title {
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #ECEFF4;
			}
		}

		box-shadow: 0px 4rpx 20rpx rgba(155, 162, 185, 0.2);
		border-radius: 8rpx;
	}


	.pad28 {
		padding: 28rpx;
	}

	.status {
		font-size: 40rpx;
		font-weight: bold;
		color: #222222;
	}

	page {
		background-color: #F5F7FA;
	}
</style>
