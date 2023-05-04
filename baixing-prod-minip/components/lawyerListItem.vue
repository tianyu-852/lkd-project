<template>
	<view class="hidden">
		<!-- 律师 -->
		<view :class="['cell marlr32',index==0?'martop20':'']" @tap.stop="contentClick(item.type,item.user_id)">
			<view class="title flex between hcenter">
				<view class="flex hcenter">
					<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662694188585-WbyFb8.png" class="width36" mode="widthFix"></image>
					<view class="left16 name line1">{{item.nickname}}</view>
					<text class="font30 bold color14284A">{{item.lawyer_grade_chinese}}</text>
				</view>
				
				<view class="colorFE5C5C bold font28" v-if="JSON.parse(item.lawyer_shop_price)">
					会员折扣价￥{{item.lawyer_shop_price}}
				</view>
			</view>
			<view class="flex hcenter between">
				<view class="flex hcenter color6E7695">
					<image :src="item.avatar" class="photo" mode="aspectFill"></image>
					<view class="info left20">
						<view class="bottom12 width360 line1">{{item.lawyer_office}}</view>
						<view class="width360 line1">
							<text v-if="item.work_year">执业{{item.work_year}}年｜</text>
							{{item.province||''}}-{{item.city||''}}
						</view>
					</view>
				</view>
				 <!-- @click.stop="call" -->
				<view class="btn flex hcenter" v-if="!isAtt">
					<image src="/static/images/dh_icon2.png" class="width30" mode="widthFix"></image>
					<text class="left4">咨询</text>
				</view>
				<view :class="['attention','flex','flexcenter','hcenter',item.is_follow?'':'noattention']"
					@click.stop="getAttention" v-else>{{item.is_follow?'已关注':'关注'}}</view>
			</view>
			<view class="tag flex" v-if="item.lawyer_tags.length">
				<text v-for="(item1,index1) in item.lawyer_tags" v-if="index1<4" class="font24">{{item1}}</text>
			</view>
			<view class="tag flex" v-else>
				<text>该律师暂未设置擅长内容</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		sendImUserLawyerCall,
		getAttention,
		setUnFollow
	} from "@/api/apis.js"
	export default {
		// name:"lawyerListItem",
		props:{
			item:Object,
			isAdr:Boolean,
			isDel:Boolean,
			isAtt: {
				type: Boolean,
				default: false
			},
			show: {
				type: Boolean,
				default: false
			},
			index: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				type: null,
				is_vip: null,
				moveX: 0, // movable-view元素在x轴上需要移动的目标移动距离，用于展开或收起滑动的按钮
				scrollX: 0, // movable-view移动过程中产生的change事件中的x轴移动值
				status: false, // 滑动的状态，表示当前是展开还是关闭按钮的状态
				showBtn: false, // 刚开始渲染视图时不显示右边的按钮，避免视图闪动
				allBtnWidth: 140
			};
		},
		watch: {
			show: {
				immediate: true,
				handler(nVal, oVal) {
					if (nVal) {
						this.open();
					} else {
						this.close();
					}
				}
			}
		},
		methods:{
			// 点击按钮
			btnClick(index) {
				this.status = false;
				// this.index为点击的几个组件，index为点击某个组件的第几个按钮(options数组的索引)
				this.$emit('click', this.index, index);
			},
			getAttention() { //取消关注或关注
				getAttention({
					type: this.item.is_follow,
					follow_user_id: this.item.user_id
				}).then(res => {
					console.log(res);
					if (!res.data.code) {
						this.item.is_follow = res.data.data.is_follow
						this.$emit('edit',this.index, res.data.data.is_follow);
					}
				})
			},
			// movable-view元素移动事件
			change(e) {
				this.scrollX = e.detail.x;
			},
			// 关闭按钮状态
			close() {
				this.moveX = 0;
				this.status = false;
			},
			// 打开按钮的状态
			open() {
				if (this.disabled) return;
				this.moveX = -this.allBtnWidth;
				this.status = true;
			},
			call(){
				sendImUserLawyerCall({lawyer_user_id:this.item.user_id}).then(res=>{
					if(res.data.code==0){
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile
						})
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			// 点击内容触发事件
			contentClick(type,id) {
				// 点击内容时，如果当前为打开状态，收起组件
				if (this.status == true) {
					this.status = 'close';
					this.moveX = 0;
				}else{
					uni.navigateTo({
						url:'/pagesV1/index/lawyerPage?id='+id
					})
				}
				this.$emit('content-click', this.index);
			},
			del(index){
				uni.showModal({
				    title: '温馨提示',
				    content: '是否移除该律师',
				    success:  res=>	 {
				        if (res.confirm) {
				            console.log('用户点击确定');
							setUnFollow({followed_user_id:this.item.user_id}).then(res=>{
								if(res.data.code==0){
									this.$emit('delItem',index)
								}else{
									uni.$u.toast(res.data.message)
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			},
			openAddress(){
				this.$emit('openAdr')
			},
			touchend() {
				this.moveX = this.scrollX;
				// 停止触摸时候，判断当前是展开还是关闭状态
				// 关闭状态
				// 这一步很重要，需要先给this.moveX一个变化的随机值，否则因为前后设置的为同一个值
				// props单向数据流的原因，导致movable-view元素不会发生变化，切记，详见文档：
				// https://uniapp.dcloud.io/use?id=%e5%b8%b8%e8%a7%81%e9%97%ae%e9%a2%98
				this.$nextTick(function() {
					if (this.status == false) {
						// 关闭状态左滑，产生的x轴位移为负值，也就是说滑动的距离大于按钮的四分之一宽度，自动展开按钮
						if (this.scrollX <= -this.allBtnWidth / 4) {
							this.moveX = -this.allBtnWidth; // 按钮宽度的负值，即为展开状态movable-view元素左滑的距离
							this.status = true; // 标志当前为展开状态
							this.emitOpenEvent();
							// 产生震动效果
							if (this.vibrateShort) uni.vibrateShort();
						} else {
							this.moveX = 0; // 如果距离没有按钮宽度的四分之一，自动收起
							this.status = false;
							this.emitCloseEvent();
						}
					} else {
						// 如果在打开的状态下，右滑动的距离X轴偏移超过按钮的四分之一(负值反过来的四分之三)，自动收起按钮
						if (this.scrollX > (-this.allBtnWidth * 3) / 4) {
							this.moveX = 0;
							this.$nextTick(() => {
								this.moveX = 101;
							});
							this.status = false;
							this.emitCloseEvent();
						} else {
							this.moveX = -this.allBtnWidth;
							this.status = true;
							this.emitOpenEvent();
						}
					}
				});
			},
			emitOpenEvent() {
				this.$emit('open', this.index);
			},
			emitCloseEvent() {
				this.$emit('close', this.index);
			},
		},
		created() {
			// this.type=uni.getStorageSync('type')
			// this.is_vip=uni.getStorageSync('is_vip')
		}
	}
</script>

<style lang="scss" scoped>
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
	.swipe-action {
		width: auto;
		height: initial;
		position: relative;
		overflow: hidden;
		.swipe-view {
			width: calc(100% + 120rpx);
			height: 296rpx;
			position: relative;
			margin-bottom: 20rpx;
			/* 这一句很关键，覆盖默认的绝对定位 */
			.swipe-content {
				width: calc(100% - 182rpx);
				// flex: 1;
				background: #FFFFFF;
				box-shadow: 0px 4px 20px rgba(194, 220, 238, 0.26);
				border-radius: 20px;
				padding: 20rpx 20rpx 16rpx 20rpx;
				overflow: hidden;
			}
			.swipe-del {
				width: 120rpx;
				height: 100%;
				background-color: #B7BFD1;
				position: relative;
				font-size: 30rpx;
				color: #ffffff;
				border-radius: 20rpx 0rpx 0rpx 20rpx;
				.btn-text {
					width: 36rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			}
		}
	}
	.cell{
		width: calc(100% - 64rpx);
		padding: 20rpx;
		// margin-bottom: 20rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx rgba(194, 220, 238, 0.26);
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		.close{
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}
	}
	// .paddingB{
	// 	padding-bottom: 16rpx;
	// }
	.title{
		font-size: 24rpx;
		font-weight: 500;
		color: #B7BFD1;
		padding-bottom: 16rpx;
		margin-bottom: 20rpx;
		border-bottom: 1rpx solid #ECEFF4;
		.name{
			// width: 320rpx;
			font-size: 30rpx;
			line-height: 30rpx;
			font-weight: bold;
			color: #14284A;
			border-right: 4rpx solid #222;
			padding-right: 16rpx;
			margin-right: 16rpx;
		}
		.dot {
			view{
				width: 16rpx;
				height: 16rpx;
				border-radius: 50rpx;
			}
		}
		.green {
			color: #18C295;
			view{
				background-color: #18C295;
			}
		}
		.gary {
			color: #9BA2B9;
			view{
				background-color: #9BA2B9;
			}
		}
	}
	.photo{
		width: 100rpx;
		height: 100rpx;
		border-radius: 12rpx;
	}
	.tag {
		margin-top: 20rpx;
		padding-top: 16rpx;
		border-top: 1px solid #ECEFF4;
		text{
			color: #6E7695;
			height: 40rpx;
			line-height: 36rpx;
			padding: 3rpx 22rpx;
			background: #F7F7F9;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}
	}
	.info{
		width: calc(100% - 120rpx);
		// color: $uni-text-color-grey2;
		font-size: 26rpx;
		// .lawTag{
		// 	color: #fff;
		// 	font-size: 24rpx;
		// 	line-height: 36rpx;
		// 	padding: 0 16rpx;
		// 	background: linear-gradient(139deg, #4AA1FD 0%, #2257FF 100%);
		// 	border-radius: 8rpx;
		// }
	}
	.btn{
		height: 64rpx;
		padding: 0 26rpx;
		background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
		box-shadow: 0rpx 4rpx 16rpx rgba(0, 44, 220, 0.3);
		border-radius: 100rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #FFFFFF;
	}
	.lawyers{
		height: 200rpx;
		// margin: 20rpx 0;
		white-space: nowrap;
		.lawyers-item{
			width: 172rpx;
			height: 192rpx;
			margin-right: 16rpx;
			border-radius: 12rpx;
			overflow: hidden;
			position: relative;
			display: inline-flex;
			.userImg{
				width: 100%;
				height: 100%;
			}
			.userName{
				width: 100%;
				height: 40rpx;
				line-height: 40rpx;
				text-align: center;
				background: #000000;
				opacity: 0.64;
				border-radius: 4rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				position: absolute;
				bottom: 0;
			}
			.userTag{
				width: 88rpx;
				height: 30rpx;
				background: linear-gradient(149deg, #4A89FE 0%, #2D6BF9 100%);
				border-radius: 0px 0 0px 12rpx;
				font-size: 18rpx;
				font-weight: 500;
				line-height: 30rpx;
				color: #FFFFFF;
				text-align: center;
				position: absolute;
				top: -4rpx;
				right: -4rpx;
			}
		}
		.on{
			border: 4rpx solid #3764FF;
		}
	}
	.banner{
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
	}
	.address{
		// color: $uni-text-color-grey2;
		font-size: 24rpx;
		height: 65rpx;
		line-height: 65rpx;
		margin-top: 20rpx;
		border-top: 1rpx solid #ECEFF4;
		position: relative;
		.share{
			width: 148rpx;
			height: 65rpx;
			font-size: 26rpx;
			line-height: 65rpx;
			color: #B8BFD1;
			border-radius: 0;
			background: #F1F3FB;
			position: absolute;
			right: -20rpx;
			bottom: 0;
		}
	}
</style>
