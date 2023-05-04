<template>
	<view class="">
		<view class="card" v-for="(item,index) in list" :key="index">
			<view class="u-flex u-row-between" @click="toLink('/pagesV1/info/infoDetails?id='+item.user.user_id)">
				<view class="u-flex title">
					<image class="avatar" :src="item.user.avatar" mode=""></image>
					<text class="u-m-l-12"><text class="color0061FF">{{item.user.nickname}}</text>向您申请了电话联系</text>
				</view>
				<view class="hint u-flex" >
					<text class="u-m-r-4">私聊</text>
					<image style="width: 14rpx;" src="/pagesV2/static/images/ck@3x.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="u-flex u-border-top u-p-t-20 u-row-between u-m-t-20">
				<text class="time">时间:{{item.created_at}}</text>
				<view class="u-flex">
					<text class="card-btn shortBtn" @click="ignored(item.order_call_apply_id,index)">忽略</text>
					<text class="card-btn fillBtn" @click="callback(item.user.user_id)">回拨电话</text>
				</view>
			</view>
		</view>
		<view class="center null" v-if="!list.length">
			<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
			<view class="text">暂无数据</view>
		</view>
	</view>
</template>

<script>
	
	import {
		getCallPhonePage,
		getPhoneIgnored,
		getPhone
	} from "../api/apis.js"
	export default {
		data() {
			return {
				list:[],
				page:1
			}
		},
		methods: {
			toLink(url){
				uni.navigateTo({
					url:url
				})
			},
			getList(next){
				getCallPhonePage({page:this.page}).then(res=>{
					if(!res.data.code&&res.data.data.data.length>0){
						var data=next?this.list.concat(res.data.data.data):res.data.data.data
						this.$set(this,'list',data)
						this.page++
					}
				})
			},
			ignored(id,index){
				let list = this.list
				getPhoneIgnored({order_call_apply_id:id}).then(res=>{
					if(res.data.code==0){
						list.splice(index,1)
						this.$set(this,'list',list)
						uni.$u.toast('忽略成功')
					}
				})
			},
			callback(id,index){
				getPhone({user_id:id}).then(res=>{
					if(res.data.code==0){
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile
						})
					}
				})
			}
		},
		onLoad() {
			this.getList()
		}
	}
</script>
<style>
	page{
		background: #F5F7FA;
	}
</style>
<style scoped lang="scss">
	.card{
		margin: 20rpx 32rpx 0 32rpx;
		background: #FFFFFF;
		box-shadow: 0px 4rpx 20rpx rgba(80, 101, 151, 0.1);
		border-radius: 8rpx;
		padding: 32rpx 20rpx 20rpx;
		.avatar{
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
		}
		.title{
			line-height: 45rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #222222;
		}
		.hint{
			line-height: 37rpx;
			font-size: 26rpx;
			color: #0061FF;
		}
		.card-btn{
			height: 56rpx;
			font-size: 26rpx;
			line-height: 56rpx;
			border-radius: 100px;
			text-align: center;
		}
		.time{
			line-height: 40rpx;
			font-size: 28rpx;
			color: #888D98;
		}
		.shortBtn{
			width: 120rpx;
			border: 2rpx solid #0061FF;
			line-height: 52rpx;
			color: #0061ff;
			margin-right: 20rpx;
		}
		.fillBtn{
			width: 140rpx;
			background: #0061FF;
			color: #fff;
		}
	}
</style>
