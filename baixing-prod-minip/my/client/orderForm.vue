<template>
	<view>
		<!-- <u-navbar :border-bottom="false">
			<view class="flex between widthAll">
				<text class="left32 font32 bold">全部订单</text>
			</view>
		</u-navbar> -->
		<view class="bar">
			<!-- <view class="tab flex hcenter backfff">
				<view v-for="(item,index) in tab.list" :key="index" :class="['tab-item',tab.index==index?'on':'']" @click="onTab(index)">{{item}}</view>
			</view> -->
			<view class="Box flex between">
				<view class="flex">
					<view class="flex hcenter relative" @click="onTypes">
						<image :src="on?'/static/images/sx_icon2.png':'/static/images/sx_icon2.png'" class="width25" mode="widthFix"></image>
						<text class="left8">{{types.list[types.index].title||'订单类型'}}</text>
					</view>
					<!-- <view class="flex hcenter relative" v-else>
						<image :src="on?'/static/images/sx_icon_sel.png':'/static/images/sx_icon.png'" class="width25" mode="widthFix"></image>
						<text class="left8" @click="onDate">{{date.text||'时间筛选'}}</text>
					</view> -->
					<view class="flex hcenter left32" @click="onStatus">
						<image :src="on?'/static/images/sx_icon2.png':'/static/images/sx_icon2.png'" class="width25" mode="widthFix"></image>
						<text class="left8">{{status.list[status.index].title||'完成状态'}}</text>
					</view>
				</view>
				<view class="flex hcenter" @click="onTime">
					<image src="/static/images/px_icon.png" class="width25" mode="widthFix"></image>
					<text class="left8">时间{{timeStatus?'倒':'正'}}序</text>
				</view>
				<!-- <view class="flex hcenter" @click="onRelease" v-else>
					<image :src="releaseStatus?'/static/images/xx_icon_sel.png':'/static/images/xx_icon.png'" class="width25" mode="widthFix"></image>
					<text :class="['left8',releaseStatus?'color3764FF':'']">我发布的合作</text>
				</view> -->
			</view>
		</view>
		<view class="list">
			<view class="listPop" v-if="types.show">
				<image src="/static/images/sj_image.png" class="list-icon" mode="widthFix"></image>
				<view v-for="(item,index) in types.list" :class="['list-item',types.index==index?'color3764FF':'']" @click="onTypesItem(index)">{{item.title}}</view>
			</view>
			<view class="listPop left180" v-if="status.show">
				<image src="/static/images/sj_image.png" class="list-icon" mode="widthFix"></image>
				<view v-for="(item,index) in status.list" :class="['list-item',status.index==index?'color3764FF':'']" @click="onStatusItem(index)">{{item.title}}</view>
			</view>
			<view class="blackBg" v-if="types.show||status.show" @click="popDown"></view>
			<!-- <swiper :current="current" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index"> -->
			<orderListItem v-for="(item,index) in list" :key="index" :item="item" :index="index" :corporate="tab.index==4?1:0" :select="select" @selectChange="onSelect" @change="onOrder"></orderListItem>
				<!-- </swiper-item>
			</swiper> -->
			<view class="null center" v-if="!list.length">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" class="width200" mode="widthFix"></image>
				<view class="text">暂无数据</view>
			</view>
		</view>
		<!-- <u-picker v-model="date.show" mode="time" @confirm="dateChange"></u-picker> -->
	</view>
</template>

<script>
	import { getOrderStatus, getOrderTypes, getOrderList, } from "@/api/apis.js"
	import orderListItem from "../components/orderListItem.vue"

	export default {
		components: {
			orderListItem
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
				// swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的v

				tab:{
					list: ['全部','百姓律师','律付云','企业律云','律律合作'],
					index: 0
				},
				types:{
					show:false,
					list:['全部','电话咨询','在线咨询','线下约谈','合同文书','诉讼委托'],
					index:null
				},
				date:{
					show:false,
					text:''
				},
				status:{
					show:false,
					list:['全部','待评价','未完成','已完成'],
					index:null
				},
				timeStatus:1,
				releaseStatus:0,
				oType: '',
				select:0,
				statusBarHeight:0,
				lastDate:null,
				lastId:null,
				list:[]
			}
		},
		methods: {
			toBack(){
				uni.navigateBack({
				    delta: 1
				});
			},
			toLink(url){
				uni.navigateTo({
					url:url
				})
			},
			onSelect(id){
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('over',id);
				uni.navigateBack()
			},
			getStatus(){
				getOrderStatus().then(res=>{
					if(res.data.code==0){
						this.status.list=res.data.data
					}
				})
			},
			getTypes(){
				getOrderTypes().then(res=>{
					if(res.data.code==0){
						this.types.list=res.data.data
					}
				})
			},
			onOrder(data,index){
				console.log(data,index)
				this.list[index]=data
				this.$set(this.list,index,data)
				// this.list[index].buttons[index1].click=""
				// this.list[index].buttons[index1].style="gray"
			},
			getList(){
				// if(this.tab.index==0){
				// 	var source_type=''
				// }else if(this.tab.index==1){
				// 	var source_type=0
				// }else if(this.tab.index==2){
				// 	var source_type=1
				// }else if(this.tab.index==3){
				// 	var source_type=2
				// }else{
				// 	var source_type=99
				// }
				// var data={}
				// if(this.tab.index==4){
				// 	data={
				// 		order_no:this.list.length?this.list[this.list.length-1].order_no:'',
				// 		order_status:this.status.index!=null?this.status.list[this.status.index].value:'',
				// 		sort_type:this.timeStatus?1:0,
				// 		is_creator:this.tab.index==4?this.releaseStatus:'',
				// 		start_date:this.tab.index==4?this.date.text:''
				// 		// end_date:this.tab.index==4?this.date.text:''
				// 	}
				// }else{
				// 	data={
				// 		order_no:this.list.length?this.list[this.list.length-1].order_no:'',
				// 		order_type:this.types.index!=null?this.types.list[this.types.index].order_type:'',
				// 		order_status:this.status.index!=null?this.status.list[this.status.index].value:'',
				// 		demand_type_id:this.types.index!=null?this.types.list[this.types.index].demand_type_id:'',
				// 		sort_type:this.timeStatus?1:0,
				// 		source_type:source_type,
				// 	}
				// }
				getOrderList({
						order_no:this.list.length?this.list[this.list.length-1].order_no:'',
						order_type:this.types.index!=null?(this.types.list[this.types.index].order_type||''):'',
						order_status:this.status.index!=null?this.status.list[this.status.index].value:'',
						demand_type_id:this.types.index!=null?(this.types.list[this.types.index].demand_type_id||''):'',
						sort_type:this.timeStatus,
						source_type:0,
					}).then(res=>{
					console.log(res.data)
					if(res.data.code==0){
						if(this.list.length){
							this.list=this.list.concat(res.data.data)
						}else{
							this.list=res.data.data
						}
						// console.log(res.data.data)
						// this.list.forEach((item,index) => {
						// 	if(item.type){
						// 		this.lastDate=item.date
						// 	}else{
						// 		this.lastId=item.balance_detail_id
						// 	}
						// })
					}
				})
			},
			popDown(){
				this.types.show=false
				this.status.show=false
			},
			onTab(index){
				this.tab.index=index
				this.list=[]
				this.getList()
			},
			onTypes(){
				this.status.show=false
				this.types.show=!this.types.show
			},
			onStatus(){
				this.types.show=false
				this.status.show=!this.status.show
			},
			onDate(){
				this.types.show=false
				this.status.show=false
				this.date.show=!this.date.show
			},
			dateChange(e){
				console.log(e)
				this.date.text=e.year+'-'+e.month+'-'+e.day
				this.page=1
				this.backTop()
				this.list=[]
				this.getList()
			},
			onTypesItem(index){
				this.types.index=index
				this.types.show=false
				this.page=1
				this.backTop()
				this.list=[]
				this.getList()
			},
			onStatusItem(index){
				this.status.index=index
				this.status.show=false
				this.page=1
				this.backTop()
				this.list=[]
				this.getList()
			},
			onTime(){
				this.types.show=false
				this.status.show=false
				this.timeStatus=this.timeStatus?0:1
				this.page=1
				this.backTop()
				this.list=[]
				this.getList()
			},
			onRelease(){
				this.types.show=false
				this.status.show=false
				this.releaseStatus=this.releaseStatus?0:1
				this.page=1
				this.backTop()
				this.list=[]
				this.getList()
			},
			backTop(){
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				});
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
			
		},
		onReachBottom(){
			this.getList()
		},
		onLoad(e) {
			this.oType=e.type
			this.select=e.select?1:0
			// this.statusBarHeight=getApp().globalData.statusBarHeight
			this.getStatus();
			this.getTypes();
			this.getList();
			// getWalletIncomeNum({type:e.type}).then(res=>{
			// 	this.num=res.data.data.total_income
			// })
		}
	}
</script>

<style lang="scss">
	/deep/.u-progress{
		display: block !important; 
	}
	page {
		background: #F9F9FB;
	}
	.tag{
		height: 40rpx;
		background: #FFEFEF;
		border: 1rpx solid #FFD2D2;
		border-radius: 8rpx;
		font-size: 26rpx;
		line-height: 40rpx;
		color: #FF6160;
		padding: 0 12rpx;
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
	// .title{
	// 	height: 66upx;
	// 	line-height: 66upx;
	// 	padding: 0 32upx;
	// 	background: #F9F9FB;
	// }
	.list{
		// padding: 0 32upx;
		// background-color: #fff;
		min-height: 100vh;
		// margin-top: 98px;
		padding-top: 100rpx;
		position: relative;
		// .list-item{
		// 	padding: 32upx 0;
		// 	border-bottom: 1upx solid #ECEFF4;
		// 	position: relative;
		// 	.list-item-img{
		// 		width: 72upx;
		// 		height: 72upx;
		// 		margin-right: 20upx;
		// 	}
		// 	.list-item-info{
		// 		font-size: 26rpx;
		// 		display: grid;
		// 		.time{
		// 			color: #B7BFD1;
		// 			font-size: 24rpx;
		// 			margin-left: 12rpx;
		// 		}
		// 	}
		// 	.list-item-num{
		// 		font-size: 40rpx;
		// 		font-weight: bold;
		// 		position: absolute;
		// 		right: 32rpx;
		// 	}
		// 	.green{
		// 		color: #26CA83;
		// 	}
		// 	.red{
		// 		color: #FF6160;
		// 	}
		// }
	}
	.bar{
		width: 100%;
		position: fixed;
		background-color: #fff;
		z-index: 100;
		// .barStatus{
		// 	padding-right: 200rpx;
		// }
	}
	.tab{
		height: 40px;
		background: #F5F5F9;
		border-radius: 12rpx;
		margin: 8px 32rpx 10px;
		padding: 4px;
		text-align: center;
		.tab-item{
			height: 64rpx;
			border-radius: 12rpx;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 64rpx;
			color: #14284A;
			flex: 1;
		}
		.on{
			font-weight: bold;
			color: #3764FF;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 8rpx rgba(0, 36, 178, 0.2);
		}
	}
	.Box{
		height: 40px;
		line-height: 40px;
		color: #14284A;
		padding: 0 32rpx 0 0;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 49rpx;
		border-top: 1px solid #ECEFF4;
		margin: 0 0 0 18rpx;
		z-index: 99;
	}
	.left180{
		left: 180rpx !important;
	}
	.listPop{
		min-width: 240rpx;
		max-width: 280rpx;
		font-size: 28rpx;
		text-align: center;
		background: #FFFFFF;
		border-radius: 20rpx;
		position: fixed;
		left: 32rpx;
		z-index: 999;
	}
	.listPop .list-icon{
		width: 40rpx;
		height: 36rpx;
		position: absolute;
		top: -25rpx;
		left: 64rpx;
	}
	.listPop .list-item{
		height: 104rpx;
		padding: 0 20rpx;
		line-height: 104rpx;
		border-bottom: 1rpx solid #ECEFF4;
	}
	.listPop .list-item:last-child{
		border-bottom: none;
	}
	.blackBg{
		width: 100%;
		height: 100%;
		z-index: 99;
		position: absolute;
		top: 0;
		left: 0;
		background: #000000;
		opacity: 0.2;
	}
</style>
