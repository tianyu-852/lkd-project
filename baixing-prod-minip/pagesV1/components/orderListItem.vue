<template>
	<view class="cell relative" @tap.stop="contentClick(item.type,item.order_no)">
		<view class="title flex hcenter">
			<text class="color14284A font34 bold">{{item.order_title}}</text>
			<view :class="['orderTag',item.status.style]" v-if="item.status.status">{{item.status.status}}</view>
<!-- 			<view class="orderTag blue" v-else-if="type==2">已完成</view>
			<view class="orderTag gary" v-else>已结束</view> -->
		</view>
		<view class="user flex hcenter between">
			<view class="flex hcenter">
				<image :src="item.user.avatar" class="photo" mode="aspectFill"></image>
				<view class="left8">
					<view class="color14284A ">{{item.user.nickname}}</view>
					<text class="font22">{{item.created_at}}</text>
				</view>
			</view>
			<view class="font32 bold colorFE5C5C">
				<!-- <text class="font30">￥</text> -->
				<text>{{item.order_money}}</text>
			</view>
		</view>
		<view class="" v-if="!corporate">
			<image src="/static/images/bxls_icon.png" v-if="item.source_type==0" class="icon" mode="widthFix"></image>
			<image src="/static/images/lfy_icon.png" v-else-if="item.source_type==1" class="icon" mode="widthFix"></image>
			<image src="/static/images/qyly_icon.png" v-else class="icon" mode="widthFix"></image>
		</view>
		<view class="icon color6E7695" style="line-height: 84rpx;" v-else>查看</view>
		<view class="">
			<!-- <view class="line3 top20 bold">三个孩子的爸爸已经危在旦夕，快去救助他吧助他吧助他吧助他吧助他吧助他吧他吧助他吧助他吧助他吧助他吧助他吧助他吧助...</view> -->
			<view class="flex hcenter martop20" v-for="item1 in item.fields">
				<text class="color6E7695">{{item1.title}}</text>
				<view class="color6E7695">
					<text class="color14284A bold left8">{{item1.value}}</text>
				</view>
			</view>
		</view>
		<view class="flex hcenter between martop20 foot" v-if="(!select&&item.buttons.length)||select">
			<view class="">
				<!-- <image src="/static/images/sj_icon.png" class="width25" mode="widthFix"></image> -->
				<!-- <text class="color6E7695 left4" v-if="!corporate">{{item.created_at}}</text> -->
			</view>
			<view class="flex" v-if="!select">
				<view v-for="(item1,index1) in item.buttons" :class="['btn left16',item1.style]" @click.stop="btnClick(item1.click,index1)">{{item1.name}}</view>
			</view>
			<view class="btn blue" v-else>选择律师</view>
		</view>
		<u-popup v-model="appeal.show" mode="bottom" border-radius="32">
			<view class="addBox font30">
				<image src="/static/images/nav_tj_icon.png" class="colse" @click="appeal.show=false" mode=""></image>
				<view class="font40 bold center bottom32">我要申诉</view>
				<view class="text flex martop24">
					<textarea v-model="appeal.value" placeholder="请输入您要申诉的理由" />
				</view>
				<view class="confirmBtn" @click="sendAppeal">申诉</view>
			</view>
		</u-popup>
		<!-- <u-picker v-model="dateInfo.status" mode="time" :params="dateInfo.params" @confirm="dateChange"></u-picker> -->
		<evaluate ref="evaluate" :orderNo="order_no" v-if="order_no" :isFrom="2"></evaluate>
	</view>
</template>

<script>
	import { getOrderCall, setOrderComplaint, setRemindlOrder, setCancelOrder, setSubmitOrder, setOrderComment, sendOrderTimeSubmit, getOrderListItem, sendImUserLawyerCall, } from "@/api/apis.js"
	import evaluate from "@/components/evaluate.vue"
	export default {
		// name:"lawyerListItem",
		components: {
			evaluate
		},
		props:{
			item:Object,
			select:Boolean,
			corporate:Boolean,
			show: {
				type: Boolean,
				default: false
			},
			appeal:{
				show:false,
				index:0,
				text:''
			},
			index: {
				type: [Number, String],
				default: ''
			}
		},
		data() {
			return {
				order_no:null,
				type: null,
				is_vip: null
			};
		},
		methods:{
			// 点击按钮
			btnClick(type,index1) {
				if(this.select){
					this.$emit('selectChange',id)
					return
				}
				switch (type) {
				    case 'cancelOrder': //取消订单
				        setCancelOrder({order_no:this.item.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('订单已取消，金额已返还钱包')
								this.refresh()
								// this.item.buttons[index1].click=""
								// this.item.buttons[index1].style="gray"
								// this.$emit('change',this.index,index1)
							}
						})
				        break;
					case 'lawyerCorporateOrderDetail'://跳转到律律合作详情
						uni.navigateTo({
							url:`/pages/order/detail?id=${this.item.order_no}`
						})
						break;
					case 'remindLawyerSubmit'://提醒律师确认交付
						setRemindlOrder({order_no:this.item.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								this.refresh()
								// this.item.buttons[index1].click=""
								// this.item.buttons[index1].style="gary"
							}
						})
						break;
					case 'lawyerSubmitOrder'://律师确认交付
						setSubmitOrder({order_no:this.item.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('交付成功')
								this.refresh()
							}
						})
						break;
					case 'userSubmitOrder'://用户确认订单
						setSubmitOrder({order_no:this.item.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('确认成功')
								this.refresh()
							}
						})
						break
					case 'remindUserSubmit'://提醒用户确认订单
						setRemindlOrder({order_no:this.item.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								this.refresh()
								// this.item.buttons[index1].click=""
								// this.item.buttons[index1].style="borderGray"
							}
						})
						break;
					case 'orderEvaluate'://评价订单
						this.order_no=this.item.order_no
						setTimeout(()=>{
							this.$refs.evaluate.show=true
						},300)
						break;
					case 'remindOrderEvaluate'://提醒评价订单
						setOrderComment({order_no:order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								this.refresh()
								// this.item.buttons[index1].click=""
								// this.item.buttons[index1].style="borderGray"
							}
						})
						break;
					case 'orderDetail'://去订单详情页面
						uni.navigateTo({
							url:'/pages/order/detail?id='+this.item.order_no
						})
						break;
					case 'orderEvaluateComplaint'://订单申诉
						this.appeal.show=true
						break;
					case 'customer'://客服
						uni.navigateTo({
							url:`/pagesV1/info/infoDetails?id=${this.item.user.user_id}&name=${this.item.user.nickname}`
						})
						break;
					case 'dueTimeSetting'://设置交付时间
						// this.dateInfo.status=true
						break;
					case 'orderCallPhone'://订单拨打电话
						getOrderCall({order_no:this.item.order_no,user_id:this.item.lawyer.user_id}).then(res=>{
							if(res.data.code==0){
								uni.makePhoneCall({
									phoneNumber: res.data.data.mobile
								})
							}
						})
						break;
					case 'userAgreeDueTime'://用户同意交付时间
						sendOrderTimeSubmit({order_no:this.item.order_no,is_agree:1}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('确认成功')
								this.refresh()
							}
						})
						break;
					case 'userDisagreeDueTime'://用户不同意交付时间
						sendOrderTimeSubmit({order_no:this.item.order_no,is_agree:0}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('拒绝成功')
								this.refresh()
							}
						})
						break;
					case 'demandOrderDetail'://跳转到需求订单详情
						uni.navigateTo({
							url:`/pagesV1/need/orderDetail?id=${this.item.demand_id}`
						})
						break;
					case 'lawyerList'://跳转律师列表
						uni.switchTab({
							url:`/pages/v1/find`
						})
						break;
				    default:
				        break;
				}
			},
			refresh(index){
				getOrderListItem({order_no:this.item.order_no}).then(res=>{
					if(res.data.code==0){
						// this.item=res.data.data
						this.$emit('change',res.data.data,this.index)
					}
				})
			},
			sendAppeal(){
				setOrderComplaint({order_no:this.item.order_no,reason:this.appeal.value}).then(res=>{
					if(res.data.code==0){
						this.appeal.show=false
						this.appeal.value=''
						// this.list[this.appeal.index].is_need_complaint=0
						uni.$u.toast('申诉成功')
					}
				})
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
				if(this.select){
					this.$emit('selectChange',id)
					return
				}
				// 点击内容时，如果当前为打开状态，收起组件
				if (this.status == true) {
					this.status = 'close';
					this.moveX = 0;
				}else{
					uni.navigateTo({
						url:'/my/client/orderDetail?id='+id
					})
				}
				this.$emit('content-click', this.index);
			}

		},
		created() {
			// this.type=uni.getStorageSync('type')
			// this.is_vip=uni.getStorageSync('is_vip')
		}
	}
</script>

<style lang="scss" scoped>
	.cell{
		margin: 0 32rpx 20rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 10rpx rgba(0, 17, 71, 0.1);
		border-radius: 16rpx;
		padding: 0 20rpx 18rpx;
		overflow: hidden;
		position: relative;
		.icon{
			width: 94rpx;
			height: 87rpx;
			position: absolute;
			right: 0;
			top: 0;
		}
		.title{
			line-height: 84rpx;
			border-bottom: 1rpx solid #ECEFF4;
			.orderTag{
				height: 36rpx;
				line-height: 36rpx;
				padding: 0 12rpx;
				border-radius: 8rpx;
				margin-left: 16rpx;
				color: #B7BFD1;
				background: #FCFCFC;
				border: 1rpx solid #B7BFD1;
			}
			.orange {
				color: #FF9237;
				background: #FFF4EA;
				border: 1rpx solid #FFD7B4;
			}
			.blue {
				color: #3764FF;
				background: #EAEFFF;
				border: 1rpx solid #B4C5FF;
			}
			.gary {
				color: #B7BFD1;
				background: #FCFCFC;
				border: 1rpx solid #B7BFD1;
			}
			.green{
				color: #26CA83;
				background: #E9FAF2;
				border: 1px solid #AEECD0;
			}
		}
		.user{
			font-size: 24rpx;
			color: #6E7695;
			margin: 20rpx 0;
			
			// .name{
			// 	font-size: 30rpx;
			// 	font-weight: bold;
			// 	color: #14284A;
			// }
			// .dot {
			// 	view{
			// 		width: 16rpx;
			// 		height: 16rpx;
			// 		border-radius: 50rpx;
			// 	}
			// }

		}
		.photo{
			width: 64rpx;
			height: 64rpx;
			border-radius: 12rpx;
		}
		.tag {
			margin-top: 20rpx;
			padding-top: 16rpx;
			border-top: 1rpx solid #ECEFF4;
			text{
				color: #6E7695;
				height: 40rpx;
				padding: 3rpx 12rpx;
				background: #F7F7F9;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}
		}
		.foot{
			// height: 66rpx;
			border-top: 1rpx solid #ECEFF4;
			padding-top: 16rpx;
			.btn{
				min-width: 100rpx;
				text-align: center;
				line-height: 56rpx;
				border-radius: 12rpx;
				color: #fff;
				font-size: 22rpx;
				padding: 0 12rpx;
			}
			.gray{
				color: #6E7695;
				background: #F3F5F8;
			}
			.borderGray{
				color: #B7BFD1;
				border: 2rpx solid #B7BFD1;
			}
			.blue{
				color: #FFFFFF;
				background: #3764FF;
			}
			.borderBlue{
				color: #3764FF;
				border: 2rpx solid #3764FF;
			}
			.borderRed{
				color: #FF6160;
				border: 2rpx solid #FF6160;
			}
		}
	}
	.addBox{
		padding: 36rpx 36rpx 80rpx;
		.colse{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 36rpx;
			right: 36rpx;
		}
		.text{
			height: 240rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 28rpx 32rpx;
			margin-bottom: 36rpx;
			textarea{
				width: 100%;
				height: 100%;
			}
		}
	}
	
</style>
