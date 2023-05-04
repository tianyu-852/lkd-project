<template>
	<view>
		<u-popup v-model="show" mode="bottom" border-radius="32">
			<view class="orderBox">
				<view class="flex between" style="margin-bottom: 32upx;">
					<view class="h1 bold">
						<!-- <text v-if="isVip">会员折扣价</text>
						<text v-else>{{info[serviceIndex].name}}-{{info[serviceIndex].products[serviceTypeIndex||0].name}}</text>
						<text class="left20 colorFF6E57">￥{{isVip?info[serviceIndex].products[serviceTypeIndex].vip_price:info[serviceIndex].products[serviceTypeIndex].price}}</text> -->
						<text>{{ info[serviceIndex].name }} - {{ info[serviceIndex].products[serviceTypeIndex||0].name }}</text>
						<text class="left20 colorFF6E57">￥{{ info[serviceIndex].products[serviceTypeIndex].price }}</text>
					</view>
					<u-icon name="close" @click="show = false"></u-icon>
				</view>
				<!-- <view class="" v-if="!isVip">
					<view class="" v-if="serviceIndex!=0">
						<vipHint :title="`会员折扣价￥${info[serviceIndex].products[serviceTypeIndex].vip_price}`"></vipHint>
					</view>
					<view class="" v-else>
						<vipHint title="开通会员,立享30天免费优质咨询"></vipHint>
					</view>
				</view> -->
				<view class="line3 martop32">
					{{info[serviceIndex].products[serviceTypeIndex].introduction}}
				</view>
				<view class="line"></view>
				<view class="h2">服务项目</view>
				<view class="flex hcenter">
					<view v-for="(item,index) in info" :key="index" :class="['typeitem',serviceIndex==index?'on':'']" v-if="item.is_enable" @click="toggleService(index)">{{item.name}}</view>
				</view>
				<view class="line"></view>
				<view class="h2">服务类型</view>
				<view class="flex hcenter">
					<view class="typeitem" v-for="(item,index) in info[serviceIndex].products" :key="index" :class="['typeitem',serviceTypeIndex==index?'on':'']" v-if="item.is_enable" @click="toggleServiceType(index)">{{item.name}}</view>
				</view>
				
				<!-- #ifndef MP-KUAISHOU -->
				<view class="flex between martop80">
					<view class="grayBtn flex hcenter flexcenter" @click="toInfoDetail">
						<image src="/static/images/sl_icon.png" class="width40" mode="widthFix"></image>
						<text class="left4">私聊</text>
					</view>
					<view class="subBtn flex hcenter flexcenter" @click="orderSave">
						<image src="/static/images/zf_icon.png" class="width40" mode="widthFix"></image>
						<text class="left4">立即购买</text>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { getLawyerServiceOrder } from "@/api/apis.js";
	
	export default {
		props: {
			info: Array,
			userId:String,
			name:String
		},
		data() {
			return {
				show:0,
				serviceIndex:0,
				serviceTypeIndex:0,
				isVip:0,
				// serviceDateIndex: 0,
				// serviceDateIndexOld: 0,
				// serviceTimeIndex: null,
				// datePop:0
			}
		},
		watch:{
			// show(newVal, oldVal){
			// 	if(newVal == false)
			// 		this.$emit('change',false)
			// }
		},
		methods: {
			orderSave(){
				getLawyerServiceOrder({
					lawyer_product_map_id:this.info[this.serviceIndex].products[this.serviceTypeIndex].lawyer_product_map_id
				}).then(order_no=>{
					if(order_no.data.code==0){
						uni.navigateTo({
							url:`/pagesV2/pay/pay?id=${order_no.data.data.order_no}`,
							events:{
								over:res=>{
									this.show=false;
									setTimeout(()=>{
										uni.navigateTo({
											url:`/pagesV1/info/infoDetails?id=${this.userId}&name=${this.name}`
										})
									},300)
									// getGroups({user_id:this.userId}).then(res=>{
									// 	if(res.data.code==0){
									// 		uni.navigateTo({
									// 			url:`/pages/message/infoDetails?isGroup=1&info=${JSON.stringify(res.data.data)}`
									// 		})
									// 	}
									// })
							    }
							}
						})
					}else{
						uni.$u.toast(order_no.data.message)
					}
				})
			},
			toInfoDetail(){
				uni.navigateTo({
					url: `/pagesV1/info/infoDetails?id=${this.userId}&name=${this.name}&type=1`
				})
			},
			toVip(){
				uni.navigateTo({
					url:'/my/payVip'
				})
			},
			toggleService(index){
				this.serviceTypeIndex=0
				this.serviceIndex=index
				this.$emit('change',0,index)
				this.$emit('change',1,0)
			},
			toggleServiceType(index){
				this.serviceTypeIndex=index
				this.$emit('change',1,index)
			},
			
		},
		mounted() {
			this.isVip=uni.getStorageSync('is_vip')
		}
	}
</script>

<style scoped lang="scss">
	.subBtn{
		width: 440rpx;
		line-height: 88upx;
		color: #fff;
		background: #3764FF;
		border-radius: 16upx;
		font-size: 32upx;
	}
	.grayBtn{
		width: 231rpx;
		color: #14284A;
		line-height: 88rpx;
		background: #EFF1FF;
		border-radius: 16rpx;
	}
	.orderBox{
		height: 100%;
		padding: 46upx 32upx 64upx;
		.h1{
			font-size: 40upx;
			line-height: 60upx;
		}
		.h2{
			font-size: 34upx;
			line-height: 54upx;
			margin: 48upx 0 20upx;
		}
		.line{
			margin: 32upx 0;
		}
		.typeitem{
			width: calc(33.33% - 14upx);
			height: 80upx;
			line-height: 80upx;
			background: #EEF0F3;
			border-radius: 8upx;
			text-align: center;
			font-size: 34upx;
			margin: 0 14upx 14upx 0;
			&:last-child{
				margin-right: 0;
			}
		}
		.on{
			color: #fff;
			background-color: #3764FF;
		}
		.dateBox{
			max-height: 400upx;
			overflow-y: scroll;
			.typeitem{
				width: calc(33.33% - 15upx);
				height: 172upx;
				margin-bottom: 16upx;
			}
		}
		.hourBox{
			.typeitem{
				width: calc(50% - 15upx);
			}
		}
		.addressBox{
			font-size: 32upx;
			color: #0061FF;
			.typeitem{
				width: auto;
				min-width: calc(50% - 15upx);
				max-width: calc(100% - 120upx);
			}
			image{
				width: 40upx;
				height: 40upx;
			}
		}
	}
</style>
