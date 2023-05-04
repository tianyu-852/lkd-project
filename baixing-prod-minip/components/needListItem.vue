<template>
	<view class="cell relative" @tap.stop="contentClick(item.type,item.demand_id)">
		<view class="user flex hcenter" @click.stop="toUserPage(item.user.user_id)">
			<view class="relative photo">
				<image :src="item.user.avatar" class="photo" mode="aspectFill"></image>
				<image src="/static/images/qy_icon.png" class="miniIcon" v-if="item.user.is_enterprise_auth" mode="widthFix"></image>
			</view>
			<view class="left16">
				<view class="flex hcenter">
					<text class="color14284A ">{{ item.user.nickname }}</text>
					<!-- <image :src="item.user.vip_icon" class="width92 left8" v-if="item.user.vip_icon" mode="widthFix"></image> -->
				</view>
				<view class="color6E7695 font24">{{ item.created_at }}</view>
			</view>
		</view>

		<view class="martop20">
			<view class="flex hcenter between">
				<view>
					<text class="font32 bold">{{item.demand_type}}</text>
				</view>
				<text :class="['colorFE5C5C',isText(item.price.value)?'font34 bold':'font38']" style="font-size: 30rpx;">{{item.price.value}}</text>
			</view>
			<view class="flex hcenter between martop8">
				<view class="">
					<text class="color888D98">发布平台</text>
					<text class="left12 btn blue" v-if="item.source_type==0">百姓律师</text>
					<text class="left12 btn red" v-else-if="item.source_type==1">律师推见</text>
					<text class="left12 btn orange" v-else>企业律云</text>
				</view>
				<!-- <text class="colorFE5C5C font24" style="margin-top: -22rpx;">{{item.price.title}}</text> -->
				<text v-if="[30, 40, 90, 93].includes(sItem.status)" class="colorFE5C5C font24" style="margin-top: -22rpx; color: #999;">已结束</text>
				<text v-else-if="sItem.process_type" class="colorFE5C5C font24" style="margin-top: -22rpx; color: #FE5F48;">进行中</text>
				<text v-else class="colorFE5C5C font24" style="margin-top: -22rpx; color: #FF9B00;">服务中</text>
			</view>
			<view class="martop4">
				<text class="color888D98">案件类型</text>
				<text class="left12 bold">{{item.lawyer_tag}}</text>
			</view>
			<view class="martop4">
				<text class="color888D98">律师地域</text>
				<text class="left12 bold">{{item.lawyer_area}}</text>
			</view>
			<view class="martop4" v-if="item.service_time">
				<text class="color888D98">服务时间</text>
				<text class="left12 bold">{{item.service_time}}小时</text>
			</view>
		</view>
		
		<view class="flex hcenter between martop16 foot relative" v-if="item.content">
			<view class="" v-if="!type">
				<text class="color888D98">需求说明:</text>
				{{item.content.length>62&&!showAll?item.content.slice(0,62)+'...':item.content}}
			</view>
			<view class="line3" v-else>
				<text class="color888D98">需求说明:</text>
				{{item.content}}
			</view>
			<view class="mode font28 bold" @click="mode" v-if="item.content.length>66&&!type">{{!showAll?'显示全部':'收起'}}</view>
		</view>

		<view class="flex martop20 height48" v-if="item.lawyer.user_id">
			<image :src="item.lawyer.avatar" class="miniPhoto" @click="toLawyerPage(item.lawyer.user_id)" mode="aspectFill"></image>
			<text class="left8 color6E7695">{{item.lawyer.nickname}}已完成该订单</text>
		</view>
	</view>
</template>

<script>
	import { sendImUserLawyerCall, setUnFollow, getGroups, sendOrderGrab } from "@/api/apis.js"

	export default {
		name: "lawyerListItem",
		props:{
			type: Number,
			item:Object,
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
				is_vip: null,
				showAll:false
			};
		},
		created() {},
		methods: {
			isText(e){
				var pattern = new RegExp("[\u4E00-\u9FA5]+");
				if (pattern.test(e)) {
					return true
				} else {
					return false
				}
			},
			// 点击按钮
			btnClick(index) {
				this.status = false;
				// this.index为点击的几个组件，index为点击某个组件的第几个按钮(options数组的索引)
				this.$emit('click', this.index, index);
			},
			call() {
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
			toUserPage(id){
				uni.navigateTo({ url:`/my/client/heLookPage?id=${id}` })
			},
			toLawyerPage(id){
				uni.navigateTo({ url:`/pagesV1/index/lawyerPage?id=${id}` })
			},
			grab(){
				sendOrderGrab({order_no:this.item.order_no}).then(res=>{
					if(res.data.code==0){
						uni.$u.toast('抢单成功')
						this.toInfoDetail()
					}
				})
			},
			toInfoDetail(){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${this.item.user.user_id}&name=${this.item.user.nickname}`
				})
			},
			mode() {
				this.showAll=!this.showAll
			},
			// 点击内容触发事件
			contentClick(type,id) {
				// 点击内容时，如果当前为打开状态，收起组件
				if(!this.type) return
				if (this.status == true) {
					this.status = 'close';
					this.moveX = 0;
				} else {
					uni.navigateTo({ url: '/pagesV1/need/orderDetail?id='+id })
				}
				this.$emit('content-click', this.index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cell{
		width: calc(100% - 64rpx);
		display: inline-block;
		margin: 0 32rpx 20rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 10rpx rgba(0, 17, 71, 0.1);
		border-radius: 16rpx;
		padding: 16rpx 20rpx 20rpx;
		overflow: hidden;
		position: relative;
		.user{
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid #ECEFF4;
		}
		.height48{
			line-height: 48rpx;
		}
		.miniPhoto{
			width: 48rpx;
			height: 48rpx;
			border-radius: 48rpx;
		}
		.photo{
			width: 64rpx;
			height: 64rpx;
			border-radius: 8rpx;
			
		}
		.miniIcon{
			width: 27rpx;
			position: absolute;
			right: -4rpx;
			bottom: -4rpx;
		}
		.foot{
			min-height: 58rpx;
			line-height: 42rpx;
			border-top: 1rpx solid #ECEFF4;
			padding-top: 16rpx;
			.mode{
				color: #6E7695;
				position: absolute;
				bottom: 0;
				right: 0;
				background-color: #fff;
			}
		}
		.btn{
			line-height: 36rpx;
			border-radius: 8rpx;
			color: #fff;
			font-size: 24rpx;
			font-weight: bold;
			padding: 0 18rpx;
		}
		.blue {
			background: linear-gradient(129deg, #5998FF 0%, #0061FF 100%);
		}
		.red {
			background: linear-gradient(123deg, #FD7574 0%, #FB2324 100%);
		}
		.orange {
			background: linear-gradient(129deg, #FD9267 0%, #FB6523 100%);
		}
		.orderBtn{
			line-height: 64rpx;
			background: #3764FF;
			border-radius: 8rpx;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			margin-top: 28rpx;
		}
	}
</style>
