<template>
	<view class="">
		<u-popup v-model="servicePop" mode="bottom" border-radius="32" height="80%" @open="popUp" @close="popDown">
			<view class="serviceBox" v-if="info">
				<view class="tab">
					<u-tabs v-if="servicePop" height="60" :list="info.products" :current="productsIndex" :is-scroll="false" inactive-color="#888D98" active-color="#222222" font-size="32" @change="setProductsIndex" :bar-style='{"backgroundColor":"#FF4040","border-radius":"100rpx","marginBottom":"-6rpx"}'></u-tabs>
				</view>
				<view class="list">
					<scroll-view scroll-y style="max-height: 800upx;">
						<view class="time flex between" v-if="productsIndex==0">
							<!-- <text>设置服务时间:</text>
							<view class="input" @click="serviceTimePicker.m=true">
								{{timeStart||info.start_work_hour}}
							</view>
							<view class="input" @click="serviceTimePicker.a=true">
								{{timeEnd||info.end_work_hour}}
							</view> -->
							<!-- <input type="text" disabled @click="serviceTimePicker.m=true" v-model="timeSelector.m.text" /> -->
						</view>
						<view class="item" v-for="(item,index) in info.products[productsIndex].products" :key="index" v-if="!item.is_hidden">
							<view class="flex between hcenter">
								<view class="flex hcenter">
									<!-- <u-icon name="checkmark-circle-fill" :color="item.is_enable?'#0061FF':'#888D98'"></u-icon> -->
									<u-switch v-model="item.is_enable" size="38"></u-switch>
									<text style="margin-left: 8upx;">{{item.name}}</text>
								</view>
								<view class="flex hcenter">
									<text>设置金额:</text>
									<input type="digit" v-model="item.price" />
								</view>
							</view>
							<view v-if="item.is_enable&&productsIndex<=2">
								<textarea v-model="item.introduction" placeholder="请输入内容" />
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="subBtn" @click="submit">
					<text v-if="!is_lawyerStore">开通法律小铺</text>
					<text v-else>保存</text>
				</view>
			</view>
		</u-popup>
		<u-picker mode="multiSelector" v-model="serviceTimePicker.m" :range="timeStartSelector" @confirm="timeMChange"></u-picker>
		<u-picker mode="multiSelector" v-model="serviceTimePicker.a" :range="timeEndSelector" @confirm="timeAChange"></u-picker>
	</view>
</template>

<script>
	import {
		setLawyerServiceTime,
		setLawyerStore,
		getLawyerPage,
	} from '@/api/apis.js'
	export default {
		props:{
			servicePop: Boolean,
			userId: String,
			myId: String
		},
		data() {
			return {
				type: null,
				info:{},
				productsIndex: 0,
				serviceTimePicker: {
					m: false,
					a: false
				},
				timeStart:'',
				timeEnd:'',
				timeStartSelector: [[],[]],
				timeEndSelector: [[],[]],
				is_lawyerStore: false
			}
		},
		methods: {
			setProductsIndex(index){
				this.productsIndex = index
			},
			popDown(isOk){
				// this.attestPop=false
				this.$emit('servicePopDown',isOk)
			},
			popUp(){
				if(this.userId!=this.myId){
					this.getLawyerPage(1)
				}else{
					this.getLawyerPage(0)
				}
			},
			getLawyerPage(my) { //获取律师信息
				getLawyerPage({
					user_id: my?this.myId:this.userId,
					is_filter: 0,
					is_meet_time_periods:this.userId==this.myId ? 0 : 1
				}).then(res => {
					this.$set(this, "info", res.data.data)
				})
			},
			submit(){
				if(this.productsIndex==0){
					setLawyerServiceTime({
						start_work_hour:this.timeStart||this.info.start_work_hour,
						end_work_hour:this.timeEnd||this.info.end_work_hour
					}).then(res=>{
						if(res.data.code==0&&this.userId==this.myId){
							this.info.start_work_hour=this.timeStart
							this.info.end_work_hour=this.timeEnd
							// this.timePop=false
						}else{
							if(this.userId==this.myId) uni.$u.toast(res.data.message)
							return
						}
					})
				}
				setLawyerStore({products:JSON.stringify(this.info.products)}).then(res=>{
					if(res.data.code==0){
						uni.setStorageSync('is_lawyerStore',1)
						this.popDown(1)
						console.log(getCurrentPages()[getCurrentPages().length - 1].route)
						if(getCurrentPages()[getCurrentPages().length - 1].route=='pages/v1/index'){
							uni.navigateTo({
								url: `/pagesV1/index/lawyerPage?id=${this.myId}`
							})
						}else if(this.userId!=this.myId){
							uni.redirectTo({
								url: `/pagesV1/index/lawyerPage?id=${this.myId}`
							})
						}else{
							uni.$u.toast('保存成功')
						}
						
					}
				})
			},
			timeMChange(e){
				this.timeStart=this.timeStartSelector[0][e[0]].substring(0,2)+':'+this.timeStartSelector[1][e[1]].substring(0,2)
			},
			timeAChange(e){
				this.timeEnd=this.timeEndSelector[0][e[0]].substring(0,2)+':'+this.timeEndSelector[1][e[1]].substring(0,2)
			},
			getTimeList(){
				var list1=[],
					list2=[],
					list3=[];
				for (var i=7;i<10;i++){
					// var item={
					// 	name:(i<10?'0'+i:i)+'时',
					// 	val:(i<10?'0'+i:i)
					// }
					list1.push((i<10?'0'+i:i)+'时')
				}
				this.timeStartSelector[0]=list1
				for (var i=20;i<24;i++){
					// var item={
					// 	name:(i<10?'0'+i:i)+'时',
					// 	val:(i<10?'0'+i:i)
					// }
					list2.push((i<10?'0'+i:i)+'时')
				}
				this.timeEndSelector[0]=list2
				for (var i=0;i<60;i++){
					// var item={
					// 	name:(i<10?'0'+i:i)+'分',
					// 	val:(i<10?'0'+i:i)
					// }
					list3.push((i<10?'0'+i:i)+'分')
				}
				this.timeStartSelector[1]=list3
				this.timeEndSelector[1]=list3
			}
			// getBanner(){
			// 	getHomeBanner().then(res => {
			// 		if(res.data.code==0){
			// 			// this.banners=res.data.data.index_banners
			// 			// uni.setStorageSync('lawyer_store_price',res.data.data.lawyer_store_price)
			// 			this.info=res.data.data
			// 		}
			// 	})
			// },
		},
		created(){
			// this.getBanner();
			// this.myId = uni.getStorageSync('user_id');
			this.type = uni.getStorageSync('type');
			this.is_lawyerStore=uni.getStorageSync('is_lawyerStore')
			this.getTimeList();
			// this.price=uni.getStorageSync('lawyer_store_price')
		}
	}
</script>

<style scoped lang="scss">
	.serviceBox{
		height: 100%;
		padding: 32upx;
		.title{
			padding-bottom: 28upx;
			margin-bottom: 34upx;
			border-bottom: 1upx solid #ECEFF4FF;
		}
		.type{
			font-size: 28upx;
			line-height: 45upx;
			color: #FF4040;
			border: 2upx solid #FF4040;
			border-radius: 8upx;
			.right{
				background-color: #FF4040;
			}
			text{
				margin: 4upx 11upx ;
			}
		}
		.tab{
			border-bottom: 1upx solid #ECEFF4;
			margin-bottom: 32upx;
		}
		.list{
			.time{
				margin-bottom: 32upx;
				line-height: 56upx;
				.input{
					width: 223upx;
					height: 56upx;
					text-align: center;
					background: #F5F7FB;
					border-radius: 4upx;
				}
			}
			.item{
				font-size: 32upx;
				font-weight: 500;
				line-height: 48upx;
				padding-bottom: 28upx;
				margin-bottom: 34upx;
				border-bottom: 1upx solid #ECEFF4FF;
				input{
					width: 200upx;
					height: 56upx;
					color: #FF4040;
					background: #F5F7FB;
					border-radius: 4upx;
					text-align: center;
				}
				textarea{
					width: calc(100% - 40upx);
					height: 168upx;
					background: #F3F5F8;
					border-radius: 8upx;
					margin-top: 20upx;
					padding: 16upx 20upx;
				}
			}
		}
		.subBtn{
			width: calc(100% - 64upx);
			position: absolute;
			bottom: 32upx;
			color: #fff;
			margin-top: 72upx;
			padding: 19upx 0;
			background: #FF4040;
			border-radius: 16upx;
			font-size: 36upx;
			line-height: 54upx;
			text-align: center;
		}
	}
</style>
