<template>
	<view>
<!-- 		<view class="nav">
			<view class="nav-back" @click="toBack">
				<image src="../static/images/nav_fh_icon.png" mode="widthFix"></image>
			</view>
			<view class="nav-tabs">
				<u-tabs-swiper ref="uTabs" active-color="#222" :list="tabs" :current="current" @change="tabsChange" :is-scroll="false" gutter="50" swiperWidth="750" :bar-style='{"backgroundColor":"#0061FF","border-radius":"20rpx"}'></u-tabs-swiper>
			</view>
		</view> -->
		<view class="title">
			<text v-if="type==1">费用退还</text>
			<text v-else-if="type==2">订单费用</text>
			<text v-else>总收益</text>
			<text>: {{num}}元</text>
		</view>
		<view class="list">
			<!-- <swiper :current="current" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index"> -->
					<scroll-view scroll-y class="scroll" @scrolltolower="getList(1)">
						<view class="list-item flex hcenter" v-for="(item,index) in list" :key="index">
							<image :src="item.icon" class="list-item-img" mode="widthFix"></image>
							<view class="list-item-info">
								<text>{{item.title}}</text>
								<text>{{item.created_at}}</text>
							</view>
							<text class="list-item-num">{{item.money}}</text>
						</view>
						<view class="Con" v-if="list.length==0">
							<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
							<view>当前列表为空</view>
						</view>
					</scroll-view>
				<!-- </swiper-item>
			</swiper> -->
		</view>
		
	</view>
</template>

<script>
	
	import {
		getWalletIncomeList,
		getWalletIncomeNum
	} from "@/api/apis.js"
	// import moneyProgress from "../pages/components/moneyProgress.vue"
	export default {
		components: {
			// moneyProgress
		},
		data() {
			return {
				// tabs: [{
				// 	name: '收入明细'
				// }, {
				// 	name: '项目明细'
				// }],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				// current: 0, // tabs组件的current值，表示当前活动的tab选项
				// swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				num:0,
				page:1,
				oType: '',
				list:[]
			}
		},
		methods: {
			toBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
			getList(next){
				this.page=next?this.page:1
				getWalletIncomeList({page:this.page,type:this.oType}).then(res=>{
					if(res.data.code==0){
						if(next){
							this.list=this.list.concat(res.data.data.data)
						}else{
							this.list=res.data.data.data
						}
						if(res.data.data.data.length) this.page++
					}
				})
			},
			// tabs通知swiper切换
			// tabsChange(index) {
			// 	console.log()
			// 	this.current = index;
			// },
			// // swiper-item左右移动，通知tabs的滑块跟随移动
			// transition(e) {
			// 	let dx = e.detail.dx;
			// 	this.$refs.uTabs.setDx(dx);
			// },
			// // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// // swiper滑动结束，分别设置tabs和swiper的状态
			// animationfinish(e) {
			// 	let current = e.detail.current;
			// 	this.$refs.uTabs.setFinishCurrent(current);
			// 	this.swiperCurrent = current;
			// 	this.current = current;
			// },
			// scroll-view到底部加载更多
			onreachBottom() {
				
			}
		},
		onLoad(e) {
			this.oType=e.type
			this.getList(0);
			getWalletIncomeNum({type:e.type}).then(res=>{
				this.num=res.data.data.total_income
			})
		}
	}
</script>

<style lang="scss">
	/deep/.u-progress{
		display: block !important; 
	}
	page {
		background: #F5F7FA;
	}
	.Con{
		color: #B1BCD4;
		font-size: 30upx;
		text-align: center;
		image{
			width: 60%;
			margin: 100upx auto 30upx;
		}
	}
	.scroll{
		width: 100%;
		height: calc(100vh - 40upx);
	}
	.nav{
		width: 100%;
		padding: 40rpx 32upx 0;
		overflow: hidden;
		background-color: #fff;
		.nav-back{
			width: 40upx;
			float: left;
			padding-top: 26upx;
			image{
				width: 100%;
			}
		}
		.nav-tabs{
			width: 320upx;
			float: left;
		}
	}
	.title{
		height: 60upx;
		line-height: 60upx;
		margin: auto 32upx;
	}
	.list{
		padding: 0 32upx;
		background-color: #fff;
		.list-item{
			padding: 32upx 0;
			border-bottom: 1upx solid #ECEFF4;
			position: relative;
			.list-item-img{
				width: 72upx;
				height: 72upx;
				margin-right: 20upx;
			}
			.list-item-info{
				display: grid;
			}
			.list-item-num{
				color: #888D98;
				font-size: 40upx;
				font-weight: bold;
				position: absolute;
				right: 0;
			}
		}
	}
</style>
