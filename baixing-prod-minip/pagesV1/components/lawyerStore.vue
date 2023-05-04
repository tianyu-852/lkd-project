<template>
	<view>
		<u-popup v-model="orderPop" mode="bottom" border-radius="32" height="80%">
			<view class="orderBox">
				<view class="flex between" style="margin-bottom: 32upx;">
					<view class="title">
						{{info.product_categories[serviceIndex].products[serviceTypeIndex].name}}
						<text>￥{{info.product_categories[serviceIndex].products[serviceTypeIndex].price}}</text>
					</view>
					<u-icon name="close" @click="popDown"></u-icon>
				</view>
				<view class="line3">
					{{info.product_categories[serviceIndex].products[serviceTypeIndex].introduction}}
				</view>
				<view class="line"></view>
				<view class="h2">服务项目</view>
				<view class="flex hcenter">
					<view v-for="(item,index) in info.product_categories" :key="index" :class="['typeitem',serviceIndex==index?'on':'']" @click="toggleService(index)">{{item.name}}</view>
				</view>
				<view class="line"></view>
				<view class="h2">服务类型</view>
				<view class="flex hcenter">
					<view class="typeitem" v-for="(item,index) in info.product_categories[serviceIndex].products" :key="index" :class="['typeitem',serviceTypeIndex==index?'on':'']" @click="toggleServiceType(index)">{{item.name}}</view>
				</view>
				
				<view class="subBtn" @click="orderSave(0)">立即购买</view>
			</view>
		</u-popup>
		
		<u-popup v-model="meetPop" mode="bottom" border-radius="32" height="80%">
			<view class="orderBox" v-if="!datePop">
				<view class="flex between" style="margin-bottom: 32upx;">
					<view class="title">
						线下约见
						<text>￥{{info.meets.price}}</text>
					</view>
					<u-icon name="close" color="#C9CED9" @click="popDown()"></u-icon>
				</view>
				<view class="line"></view>
				<view class="h2">预约见面咨询日期</view>
				<view class="flex hcenter">
					<view v-for="(item,index) in info.meets.time_periods" :key="index" :class="['typeitem',serviceDateIndex==index?'on':'']" @click="toggleDate(index)" v-if="index<2">{{item.alias}}</view>
					<view :class="['typeitem',serviceDateIndex>1?'on':'']" @click="datePop=true">{{serviceDateIndex>1&&info.meets.time_periods[serviceDateIndex].alias||'其他时间'}}</view>
				</view>
				<view class="line"></view>
				<view class="h2">预约见面咨询时间</view>
				<view class="flex hcenter between hourBox">
					<view class="typeitem" v-for="(item,index) in info.meets.time_periods[serviceDateIndex].time_periods" :key="index" :class="['typeitem',serviceTimeIndex==index&&item.is_have?'on':'']" @click="toggleServiceTime(index)">{{item.is_have?item.name:'预约已满'}}</view>
				</view>
				<view class="h2">见面咨询地点:</view>
				<view class="flex hcenter addressBox">
					<view class="typeitem line1">{{info.lawyer_office}}</view>
					<view class="flex" @click="toMap">
						<image src="/static/images/fb_icon.png" mode="widthFix"></image>
						<text>导航</text>
					</view>
				</view>
				<view class="subBtn" @click="orderSave(1)">立即购买</view>
			</view>
			<view class="dateBox" v-else>
				<image src="/static/images/del.png" mode="widthFix" class="icon" @click="datePop=false"></image>
				<view class="title">预约见面咨询时间</view>
				<scroll-view scroll-y style="max-height: 800upx;">
					<view class="flex hcenter between">
						<view v-for="(item,index) in info.meet.time_periods" :key="index" :class="['item',serviceDateIndex==index?'on':'']" @click="toggleDate(index)">
							<view>{{item.alias}}</view>
							<view>{{item.week_alias}}</view>
						</view>
					</view>
				</scroll-view>
				<view class="subBtn" @click="onOrderTime">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getLawyerServiceOrder
	} from "@/api/apis.js"
	export default {
		props: {
			info: Object,
			orderPop:Boolean,
			meetPop:Boolean,
			lawyer:Object,
			// serviceIndex:Number
		},
		model: {
			prop:'orderPop',
		    event: 'change'
		},
		data() {
			return {
				serviceIndex:0,
				serviceTypeIndex:0,
				serviceDateIndex: 0,
				serviceDateIndexOld: 0,
				serviceTimeIndex: null,
				datePop:0
			}
		},
		watch:{
			orderPop(newVal, oldVal){
				if(newVal == false)
					this.$emit('change',false)
			},
			meetPop(newVal, oldVal){
				if(newVal == false)
					this.$emit('change',false)
			}
		},
		methods: {
			toMap(){
				const {info} = this
				if(info.lawyer_office_location.lat&&info.lawyer_office_location.lng){
					uni.openLocation({
						latitude: parseFloat(info.lawyer_office_location.lat),
						longitude: parseFloat(info.lawyer_office_location.lng),
						scale: 18,
						name: info.lawyer_office,
						address: info.lawyer_office
					})
				}else{
					uni.$u.toast('无法获取坐标数据')
				}
			},
			popDown(){
				this.$emit('change',false)
			},
			onOrderTime(){
				this.serviceDateIndex=this.serviceDateIndexOld
				this.datePop=false
			},
			orderSave(oType){
				var id=!oType?this.info.product_categories[this.serviceIndex].products[this.serviceTypeIndex].lawyer_product_map_id:this.info.meets.lawyer_product_map_id
				if(oType){
					if(this.serviceTimeIndex == null){
						this.$u.toast('请选择咨询时间')
						return
					}
					var data={
						lawyer_product_map_id:this.info.meets.lawyer_product_map_id,
						appointment_date:this.info.meets.time_periods[this.serviceDateIndex].date,
						appointment_period:this.info.meets.time_periods[this.serviceDateIndex].time_periods[this.serviceTimeIndex].value
					}
				}else{
					var data={
						lawyer_product_map_id:this.info.product_categories[this.serviceIndex].products[this.serviceTypeIndex].lawyer_product_map_id
					}
				}
				getLawyerServiceOrder(data).then(order_no=>{
					if(order_no.data.code==0){
						uni.navigateTo({
							url:`/pagesV2/pay/pay?id=${order_no.data.data.order_no}`,
							events:{
								over:res=>{
									setTimeout(res=>{
										this.orderPop=false;
										this.meetPop=false;
										if(this.lawyer){
											uni.navigateTo({
												url:`/pagesV1/info/infoDetails?id=${this.lawyer.user_id}&name=${this.lawyer.nickname}`
											})
										}
									},500)
							    }
							}

						})
						return
						
						
					}else{
						uni.$u.toast(order_no.data.message)
					}
				})
			},
			toggleService(index){
				if(this.info.product_categories[index].is_enable === 0){
					this.$u.toast('律师暂未开通服务')
					return
				}
				this.serviceTypeIndex=0
				this.serviceIndex=index
				this.info.product=this.info.product_categories[this.serviceIndex].products[this.serviceTypeIndex]
			},
			toggleServiceType(index){
				this.serviceTypeIndex=index
				this.info.product=this.info.product_categories[this.serviceIndex].products[this.serviceTypeIndex]
			},
			toggleServiceTime(index){
				this.serviceTimeIndex=index
			},
			toggleDate(index){
				this.serviceDateIndex=index
				this.datePop=false
			}
		}
	}
</script>

<style scoped lang="scss">
	.subBtn{
		color: #fff;
		margin-top: 72upx;
		padding: 19upx 0;
		background: #3764FF;
		border-radius: 16upx;
		font-size: 36upx;
		line-height: 54upx;
		text-align: center;
		width: calc(100% - 64upx);
		position: absolute;
		bottom: 32upx;
	}
	.orderBox{
		height: 100%;
		padding: 46upx 32upx 64upx;
		.title{
			font-size: 40upx;
			line-height: 60upx;
			text{
				color: #FF4040;
			}
		}
		.h2{
			font-size: 34upx;
			line-height: 54upx;
			margin: 48upx 0 20upx;
		}
		.line{
			margin: 42upx 0;
		}
		.typeitem{
			width: calc(33.33% - 14upx);
			height: 80upx;
			line-height: 80upx;
			background: #EEF0F3;
			border-radius: 8upx;
			text-align: center;
			font-size: 28upx;
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
	.dateBox{
		padding: 32upx;
		height: 100%;
		overflow-y: scroll;
		position: relative;
		.icon{
			width: 26upx;
			height: 26upx;
			position: absolute;
			right: 32upx;
			top: 42upx;
		}
		.title{
			text-align: center;
			font-size: 34upx;
			font-weight: bold;
			padding-bottom: 16upx;
			margin-bottom: 16upx;
			border-bottom: 1upx solid #ECEFF4;
		}
		.item{
			width: calc(33.33% - 15upx);
			height: 172upx;
			line-height: 80upx;
			background: #EEF0F3;
			border-radius: 8upx;
			text-align: center;
			font-size: 28upx;
			margin: 0 0 16upx 0;
			&:last-child{
				margin-right: 0;
			}
		}
		.on{
			color: #fff;
			background-color: #FF4040;
		}
		.subBtn{
			width: calc(100% - 64upx);
			position: absolute;
			bottom: 32upx;
		}
	}
</style>
