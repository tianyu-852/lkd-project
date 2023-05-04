<template>
	<view :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar :is-back="false" :border-bottom="false" title="找律师" title-size="36" title-color="#14284A" title-bold id="navbar" />
		<!-- #endif -->
		
		<scroll-view scroll-x="true" class="nav backfff">
			<view class="flex center navBox" style="">
				<view v-for="(item,index) in nav.list" :key="index" :class="['nav-item',nav.index==index?'on':'']" @click="onNav(index)">
					<image class="width64 bottom16" :src="item.icon_image" mode="widthFix"></image>
					<view class="">{{item.name}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="backfff" v-if="token">
			<customerBox ref="customer"></customerBox>
		</view>

		<view class="" :style="{'height': (tab.index?94:58)+'px'}">
			<view id="tabTop" :class="['backfff relative hidden',isTop?'fixedBox':'']" :style="{ top: (isTop ? navbarH : 0)+'px'}">
				<view class="tab flex hcenter backfff">
					<view v-for="(item,index) in tab.nav" :key="index" :class="['tab-item flex hcenter flexcenter',tab.index==index?'on':'']" @click="onTab(index)">
						<image src="/static/images/ye_icon.png" v-if="index==0" class="width28 right12" mode="widthFix"></image>
						<text>{{item.name}}</text>
					</view>
				</view>

				<view class="marlr32 flex hcenter between" v-if="tab.index">
					<view class="flex-row">
						<view class="flex-row hcenter problem" @click="pop.show=!pop.show">
							<image :src="pop.index?'/static/images/bottom2.png':'/static/images/sx_icon2.png'" class="width26" mode="widthFix"></image>
							<view :class="pop.index?'textA':'text'">{{pop.list[pop.index]}}</view>
						</view>
						<view class="flex-row hcenter problem left32" @click="clickTypes">
							<image :src="typesName?'/static/images/ck_icon_sel.png':'/static/images/px_icon.png'" class="width26" mode="widthFix"></image>
							<view :class="typesName?'textA':'text'">{{typesName?typesName:"问题类型"}}</view>
						</view>
						<view class="flex-row problem left32" @click="openAddress" v-if="tab.index">
							<image src="/static/images/nav_dw_icon.png" class="width18" mode="widthFix"></image>
							<text class="textA">{{there&&there.city?there.city : "全国"}}</text>
						</view>
					</view>
					<button class="flex hcenter share " open-type="share">
						<u-icon name="share-fill" color="#0061FF"></u-icon>
						<text class="color0061FF font28 left8">分享</text>
					</button>
				</view>
			</view>
		</view>
		<!-- </u-sticky> -->
		<view class="listbg relative">
			<lawyer-list-item v-for="(item,index) in tab.list[tab.index]" :key="index" :item="item"></lawyer-list-item> 
			<view class="center null" v-if="!tab.list[tab.index].length">
				<image src="/static/images/kym_qsy_image.png"></image>
				<view class="text">暂无数据</view>
			</view>
			<view class="popBg" v-if="pop.show" @click="pop.show=false">
				<view :class="['popBox',isTop?'fixed':'absolute']" :style="{'top':(isTop? (navbarH + 94) : 0)+'px'}">
					<image src="/static/images/sj_image.png" class="icon" mode="widthFix"></image>
					<view class="item" v-for="(item,index) in pop.list" :key="index" @click.stop="onPopItem(index)">{{item}}</view>
				</view>
			</view>
		</view>
		
		<popNotice></popNotice>
		<!-- #ifdef MP-TOUTIAO -->
		<types ref="types" @setTypes="setTypes"></types>
		<addressBox ref="address" @setTypes="setAddress" @openAdr="openAdr"></addressBox>
		<!-- #endif -->
		
		<!-- #ifndef MP-TOUTIAO -->
		<types ref="types" haveBar="1" @setTypes="setTypes"></types>
		<addressBox ref="address" statusH="1" @setTypes="setAddress" @openAdr="openAdr"></addressBox>
		<!-- #endif -->

		<tab-bar :selected="1" />
	</view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
import { getLawyerList, getLocation, getLawyerListBanner, getNoComment, getAttention, getMyData, getHomeLawyerList, getLawyerStoreType, getLawyerEnableCallPage } from "@/api/apis.js"
import customerBox from "@/components/customerBox.vue"
import types from "@/components/types.vue"
import popNotice from "@/components/popNotice.vue"
import addressBox from "@/components/address.vue"
import lawyerListItem from "@/components/lawyerListItem.vue"
import { mapGetters } from 'vuex';

export default {
	components: { types, customerBox, addressBox, popNotice, lawyerListItem, },
	data() {
		return {
			// isVip: uni.getStorageSync('is_vip'),
			token: null,
			isAdr:false,
			// clientStatus:false,
			userLocation:true,
			type: uni.getStorageSync('type'),
			banner: {},
			orderInfo: {},
			tab: {
				nav: [{
					name: "优选律师"
				}, {
					name: "百姓律师"
				}],
				index: 0,
				list: [
					[],
					[]
				],
				page: [1,1]
			},
			nav:{
				list:[],
				index:0
			},
			pop:{
				list:['综合排序','价格从低到高','价格从高到低'],
				index:0,
				text:'',
				show:false
			},
			isTop:false,
			tabTop:68,
			tabIndex: 1,
			typesName: null,
			typesId: 0,
			there: uni.getStorageSync('there'),
			navTopShow: false
		}
	},
	computed: {
		...mapGetters([ 'sysSafeAreaHeight' ]),

		navbarH() {
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			let height = 0;
			// #ifndef MP-TOUTIAO
			height = systemInfo.statusBarHeight + (systemInfo.platform == 'ios' ? 44 : 48);
			// #endif
			return height;
		}
	},
	onPageScroll(e) {
		if (e.scrollTop > this.tabTop) {
			this.isTop = true
		} else {
			this.isTop = false
		}
	},
	onLoad() {
		this.there = uni.getStorageSync('there')||null
		this.getNav()
		this.getFindBanner();
	},
	onShow() {
		// #ifndef MP-WEIXIN
		uni.hideTabBar()
		// #endif

		this.token=uni.getStorageSync('token')
		// #ifndef MP-KUAISHOU
		if(this.token&&this.$refs.customer) this.$refs.customer.getUnreadCount()
		// #endif
		if(!this.tab.list[this.tab.index].length){
			if(!this.there){//没地址
				this.getAuthorize()
			}else{
				this.getLawyerList()
			}
		}
	},
	onReady() {
		this.$nextTick(() => {
			setTimeout(() => {
				this.getDivInfo('#tabTop')
			}, 2000)
		})
	},
	onReachBottom() {
		this.getLawyerList()
	},
	// #ifndef MP-KUAISHOU
	onPullDownRefresh() {
		this.tab.page[this.tab.index] = 1
		this.getLawyerList()
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	// #endif
	methods: {
		onTab(index){
			this.pop.show=false
			this.tab.index=index
			// this.tab.page[this.tab.index]=1
			if(!this.tab.list[index].length)
				this.getLawyerList()
		},
		onNav(index){
			this.nav.index=index
			this.tab.page[this.tab.index]=1
			this.getLawyerList()
		},
		onPopItem(index){
			this.pop.index=index
			this.pop.show=false
			this.pop.text=this.pop.list[this.pop.index]
			this.tab.page[this.tab.index]=1
			this.getLawyerList()
		},
		// authorize(){
		// 	this.clientStatus = false
		// 	uni.openSetting({
		// 		success:res=>{
		// 			console.log(res)
		// 			this.userLocation = res.authSetting['scope.userLocation']
					
		// 			uni.authorize({
		// 				scope:'scope.userLocation',
		// 				success:res=>{
		// 					console.log(res)
		// 					setTimeout(()=>{
		// 						this.getAddress()
		// 					},1000)
							
		// 				},
		// 				fail:res=>{
		// 					console.log(res)
		// 				}
		// 			})
		// 		}
		// 	})
			
		// },
		// setFollow(item,index) {
		// 	getAttention({
		// 		type: item.is_follow,
		// 		follow_user_id:item.user_id
		// 	}).then(res => {
		// 		if (!res.data.code) {
		// 			item.is_follow = res.data.data.is_follow;
		// 			uni.showToast({
		// 				title: res.data.data.is_follow ? '关注成功' : '已取消关注'
		// 			})
		// 		}
		
		// 	})
		// },
		clickEvaluateLabie(index) { //点击评论组件
			this.orderInfo.reasons[index].status = !this.orderInfo.reasons[index].status
			this.$store.commit("setOrderInfo",this.orderInfo)
		},
		openAddress() {
			this.userLocation = true
			this.$refs.address.show = !this.$refs.address.show
		},
		setAddress(e){
			console.log(e)
			this.there=e
			getApp().there = e
			this.tab.page[this.tab.index]=1
			this.getLawyerList()
			// if(this.isVip)
			// 	this.getEnableCallLawyer(1,this.typesId)
		},
		getAuthorize() { //获取授权
			uni.authorize({
				scope: "scope.userLocation",
				success: res => {
					// this.isAdr = true;
					console.log('授权成功')
					this.getAddress()
				},
				fail: res => {
					// this.isAdr = false;
					// if(this.isVip)
					// this.getEnableCallLawyer(1,this.typesId)
					this.getLawyerList()
					// this.getServeLawyer(1, this.typesId)
				}
			})
		},
		// openAdr(){
		// 	console.log(this.isAdr)
		// 	if(this.isAdr){
		// 		this.getAddress()
		// 		return
		// 	}
		// 	uni.openSetting({
		// 		success: res=> {
		// 			if(res.authSetting){
		// 				this.isAdr = true;
		// 				console.log('授权成功')
		// 				this.getAddress()
		// 			}
		// 		},
		// 		complete: res => {
		// 			console.log(res);
		// 		}
		// 	})
		// },
		// typeChange(data){
		// 	this.there =data
		// 	getApp().there = data
			
		// 	this.getLawyerList(1, this.typesId, new Date().getSeconds())
		// 	if(this.isVip)
		// 		this.getEnableCallLawyer(1,this.typesId)
		// },
		// setAddress() {
		// 	const {provinceId,cityId,city} = this
		// 	uni.navigateTo({
		// 		url: "/pagesV1/common/districts?callback=true&city="+JSON.stringify({city_id:cityId,province_id:provinceId,city:city}),
		// 		events:{
		// 			setAddress:e=>{
		// 				console.log(e)
		// 				this.there = e
		// 				getApp().there = e
		// 				this.getLawyerList(1, this.typesId, new Date().getSeconds())
		// 			}
		// 		}
		// 	})
		// },
		setTypes(e) {
			console.log(e)
			let data = this.$refs.types;
			this.typesName = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag;
			this.typesId = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag_id;
			this.tab.page[this.tab.index] = 1
			// if(this.isVip)
			// this.getEnableCallLawyer(1,this.typesId)
			this.getLawyerList()
			console.log(this.typesId)
		},
		clickTypes() {
			this.$refs.types.props.status = !this.$refs.types.props.status
		},
		// linkSearch() { //跳转搜索页面
		// 	uni.navigateTo({
		// 		url: "/pagesV1/common/search?search_placeholder="+this.banner.search_placeholder
		// 	})
		// },
		// getEnableCallLawyer(page, lawyer_tag_id){
		// 	const {province_id,city_id} = this.there?this.there:{province_id:0,city_id:0}
		// 	getLawyerEnableCallPage({
		// 		page: page,
		// 		lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
		// 		province_id: province_id ? province_id : 0,
		// 		city_id: city_id ? city_id : 0,
		// 	}).then(res => {
		// 		if(res.data.code == 0){
		// 			let data
		// 			if(page == 1){
		// 				data = res.data.data.data
		// 			}else{
		// 				data = this.tab.list[0].concat(res.data.data.data)
		// 			}
		// 			this.$set(this.tab.list,0, data);
		// 			this.tab.page[0] = page;
		// 		}
				
		// 	})
		// },
		// getServeLawyer(page, lawyer_tag_id) { //服务过我的律师
		// 	const {province_id,city_id,isVip} = this.there?this.there:{province_id:0,city_id:0}
		// 	console.log(this.isVip)
		// 	getServeLawyer({
		// 		page: page,
		// 		lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
		// 		province_id: province_id ? province_id : 0,
		// 		city_id: city_id ? city_id : 0,
		// 	}).then(res => {
		// 		if(res.data.code == 0){
		// 			let data
		// 			if(page == 1){
		// 				data = res.data.data.data
		// 			}else{
		// 				if(this.isVip)
		// 					data = this.tab.list[2].concat(res.data.data.data)
		// 				else
		// 					data = this.tab.list[1].concat(res.data.data.data)
		// 			}
		// 			if(this.isVip){
		// 				this.$set(this.tab.list,2, data);
		// 				this.tab.page[2] = page;
		// 			}else{
		// 				this.$set(this.tab.list,1, data);
		// 				this.tab.page[1] = page;
		// 			}
					
		// 		}
				
		// 	})
		// },
		getLawyerList() { //获取律师列表
			// const {province_id,city_id,isVip} = this.there?this.there:{province_id:0,city_id:0}
			var data={
				sort_type:this.tab.index==0?0:this.pop.index,
				page: this.tab.page[this.tab.index],
				lawyer_product_id:this.nav.list.length?this.nav.list[this.nav.index].lawyer_product_id:'',
				lawyer_tag_id: this.tab.index?this.typesId:'',
				// province_id: this.tab.index&&this.there?this.there.province_id||0:'',
				city_id:this.tab.index&&this.there?this.there.city_id||0:'',
				is_guarantee:this.tab.index?0:1
			}
			// if(this.there&&this.there.province_id!=this.there.city_id) data.city_id=this.tab.index?this.there.city_id||0:''
			getHomeLawyerList(data).then(res => {
				if(res.data.code == 0){
					let data 
					if(this.tab.page[this.tab.index] == 1){
						uni.pageScrollTo({
							scrollTop:0
						})
						data = res.data.data.data
						this.$set(this.tab.list,this.tab.index, data)
					}else{
						data = this.tab.list[this.tab.index].concat(res.data.data.data)
						this.$set(this.tab.list,this.tab.index, data)
					}
					if(res.data.data.data.length) this.tab.page[this.tab.index]++;
				}else{
					uni.$u.toast(res.data.message)
				}
			})
		},
		getFindBanner() { //获取banner图
			getLawyerListBanner().then(res => {
				this.$set(this, "banner", res.data.data.banners)
			})
		},
		getAddress() { //默认城市获取
			const {there} = this
			uni.getLocation({
				success: res => {
					console.log(res);
				},
				fail: res => {
					console.log(res)
				},
				complete: res => {
					getLocation({
						lng: res.longitude,
						lat: res.latitude
					}).then(res => {
						// this.provinceId = res.data.data.provinceId;
						// this.cityId = res.data.data.cityId;
						// this.city = res.data.data.city
						// if(!there && res.data.data.cityId){
						// 	this.there = {
						// 		province_id:res.data.data.provinceId,
						// 		city_id:res.data.data.cityId,
						// 		city:res.data.data.city
						// 	}
						// 	getApp().there = there 
						// }
						var there = {
							province_id:res.data.data.provinceId,
							city_id:res.data.data.cityId,
							city:res.data.data.city
						}
						this.there=there
						this.$refs.address.city=there
						getApp().globalData.there=there
						uni.setStorage({
							key: 'there',
							data: there,
						});
						// if(this.isVip)
						// this.getEnableCallLawyer(1,this.typesId)
						this.getLawyerList()
						// this.getServeLawyer(1, this.typesId)
					})
				}
			})
		},
		getNav(){
			getLawyerStoreType().then(res=>{
				if(res.data.code==0){
					this.nav.list=res.data.data
				}
			})
		},
		getDivInfo(e){
			const query = uni.createSelectorQuery().in(this);
			query.select(e).boundingClientRect(data => {
				console.log("得到布局位置信息" + JSON.stringify(data));
				if(e=='#navbar'&&data.height)
					this.navbarH=data.height
				else if(e=='#tabTop')
					this.tabTop=data.bottom-data.height
			}).exec();
		},
		setTab(index) {
			this.tab.index = index;
		}
	},
}
</script>

<style lang="scss">
	.noLocation{
		width:calc(100vw - 64rpx);
		height: 98rpx;
		position: absolute;
		bottom:0rpx;
		left: 32rpx;
		z-index: 100;
		line-height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #0061FF;
		padding: 39rpx 0 19rpx 0;
		.close_btn{
			width:18rpx;
			padding:11rpx 12rpx 11rpx 20rpx;
		}
		.bg_image{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index:-1;
		}
	}
	
	.fixedBox{
		width: 100%;
		position: fixed;
		z-index: +2;
	}
	.nav{
		width: 100vw;
		// height: 120rpx;
		padding-bottom: 32rpx;
		.navBox{
			// height: 100%;
			display: inline-flex;
			flex-wrap: nowrap;
			padding: 0 2rpx;
			
		}
		.nav-item{
			width: 164rpx;
			// margin-right: 52rpx;
			display: table;
			font-weight: 500;
			opacity: 0.64;
			&:last-child{
				margin-right: 32rpx;
			}
		}
		.on{
			opacity: 1;
			font-weight: bold;
		}
	}
	.tab{
		height: 40px;
		background: #F5F5F9;
		border-radius: 12rpx;
		margin: 10px 32rpx 8px;
		padding: 4px;
		text-align: center;
		.tab-item{
			height: 64rpx;
			border-radius: 12rpx;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 64rpx;
			color: #6E7695;
			flex: 1;
		}
		.on{
			font-weight: bold;
			color: #14284A;
			background: #FFFFFF;
			box-shadow: 0px 2rpx 8rpx rgba(0, 36, 178, 0.2);
		}
	}
	.popover{
		position: fixed;
		bottom: 166upx;
		left: 0upx;
		right: 0;
		padding: 17upx 32upx;
		z-index: 100;
		background: #E7F3FE;
		// .adr{
		// 	width: 20upx;
		// 	height: 24upx;
		// 	margin-left: 20upx;
		// 	margin-top: 46upx;
		// 	position: relative;
		// }
		.content{
			line-height: 56upx;
			font-size: 28upx;
			color: #0061FF;
			z-index: 101;
			// margin: 39upx 126upx 0 8upx;
		}
		button{
			width: 120upx;
			height: 56upx;
			line-height: 56upx;
			background: #0061FF;
			border-radius: 100px;
			font-size: 28upx;
			color: #FFFFFF;
			margin-right: 0;
		}
	}
	/deep/.u-mode-center-box {
		border-radius: 90upx 40upx 90upx 90upx;
	}
	/deep/.u-drawer-top{
		background: none !important;
	}
	.background {
		width: 600rpx;
		line-height: 90rpx;
		position: relative;
		image{
			width: 100%;
		}
		.noadr{
			image{
				width: 30upx;
				height: 35upx;
			}
			text{
				line-height: 48upx;
				font-size: 34upx;
				font-weight: bold;
				color: #222222;
				flex: 1;
				margin-left: 8upx;
				text-align: left;
			}
			.switch{
				width: 80upx;
				height: 44upx;
				background: #D1D3DD;
				border-radius: 100px;
				display: flex;
				.circle{
					width: 40upx;
					height: 40upx;
					background: #FFFFFF;
					border-radius: 50%;
					margin-left: 2upx;
				}
			}
			position: absolute;
			left: 32upx;
			right: 32upx;
			bottom: 54upx;
		}
		.buttonText {
			left: 32upx;
			right: 32upx;
			bottom: 54upx;
			font-size: 34rpx;
			font-weight: bold;
			position: absolute;
			color: #FFFFFF;
			background: linear-gradient(90deg, #5074FD 0%, #299CFF 100%);
			box-shadow: 0px 6rpx 16rpx rgba(0, 35, 212, 0.32);
			border-radius: 100rpx;
		}
	}
	.banner{
		// border-bottom: 1upx solid #ECEFF4;
		
		background-color: #fff;
		padding: 0 32upx;
		image{
			// height: 300upx;
			border-radius: 20rpx;
		}
	}
	.typesBox {
		// margin-top: 44upx;
	}

	.listbg {
		background: #F5F7FA;
		// margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		z-index: 1;
		.popBg{
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: rgba(0,0,0,0.4);
		}
	}
	.popBox{
		width: 240rpx;
		margin: 32rpx 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
		line-height: 100rpx;
		text-align: center;
		.icon{
			width: 40rpx;
			position: absolute;
			top: -30rpx;
			left: 30rpx;
		}
		.item{
			border-bottom: 1rpx solid #f5f5f5;
			&:last-child{
				border-bottom: none;
			}
		}
	}
	// #ifdef MP-KUAISHOU
	.share{
		max-width: 96rpx;
		height: 72rpx;
	}
	// #endif
	
	.problem {
		height: 36px;
		line-height: 36px;
		overflow: hidden;
		// margin: auto;	
		image{
			margin: auto;
			display: block;
		}
		.text {
			font-size: 26rpx;
			font-weight: bold;
			color: #888D98;
			margin-left: 6rpx;
		}
		.textA {
			font-size: 28rpx;
			font-weight: bold;
			color: #14284A;
			margin-left: 8rpx;
			display: block;
			flex: 1;
			-webkit-line-clamp: 1;
		}
	}

	.search {
		.text {
			font-size: 26rpx;
			color: #C9CED9;
			margin-left: 12rpx;
		}

		image {
			width: 23upx;
			height: 23upx;
		}

		width: 0rpx;
		height: 64rpx;
		background: #F5F7FA;
		border-radius: 100rpx;
	}
</style>
