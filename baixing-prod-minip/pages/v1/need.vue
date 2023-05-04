<template>
	<view :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar id="navbar" :is-back="false" :border-bottom="false" title="法律服务中心" title-size="36" title-color="#14284A" title-bold />
		<!-- #endif -->
		<!-- <image :src="banner.banners[0].banner" :style="{height:banner.height+'px'}" class="topBanner" @click="onJump(banner.banners[0])" mode="widthFix" v-if="banner.banners[0].banner"></image> -->

		<view :class="['bar', isTop ? 'fixed' : '']" id="tabTop" :style="{ top: isTop ? navBarHeight + 'px':''}">
			<view class="tab flex hcenter backfff">
				<view v-for="(item,index) in tab.list" :key="index" :class="['tab-item',tab.index==index?'on':'']" @click="onTab(index)">{{item}}</view>
			</view>

			<view class="Box flex marlr32">
				<view class="flex hcenter " @click="onSignUp">
					<image src="/static/images/sx_icon2.png" class="width26" mode="widthFix"></image>
					<text :class="['left8',signUp.index?'color3764FF':'']">{{signUp.index!=null?signUp.list[signUp.index]:'状态'}}</text>
				</view>
				<view class="flex hcenter relative left32" v-show="tab.index==0">
					<image src="/static/images/px_icon.png" class="width26" mode="widthFix"></image>
					<text class="left8" @click="onSequence">{{sequence.index!=null?sequence.list[sequence.index].demand_type:'类型'}}</text>
				</view>
				<view class="flex hcenter relative left32" v-show="tab.index==1">
					<image src="/static/images/px_icon.png" class="width26" mode="widthFix"></image>
					<text class="left8" @click="onCaseType">{{caseType.index!=null?caseType.list[caseType.index].demand_type:'类型'}}</text>
				</view>
					
				<view class="flex hcenter left32" @click="onAddress">
					<image src="/static/images/nav_dw_icon.svg" class="width18" mode="widthFix"></image>
					<text class="left8">{{ there.city || '全国' }}</text>
				</view>
			</view>
		</view>

		<view class="bar" v-if="isTop"></view>
			
		<view class="list relative">
			<view :class="['sequencePop',isTop?'fixed':'absolute']" :style="{'top':(isTop? (navBarHeight + 94) : 0)+'px'}" v-if="signUp.show">
				<image src="/static/images/sj_image.png" class="sequence-icon" mode="widthFix"></image>
				<view v-for="(item,index) in signUp.list" :key="index" :class="['sequence-item',signUp.index==index?'color3764FF':'']" @click="onSignUpItem(index)">{{item}}</view>
			</view>
			<view :class="['sequencePop',isTop?'fixed':'absolute']" :style="{'top':(isTop? (navBarHeight + 94): 0)+'px'}" v-if="sequence.show">
				<image src="/static/images/sj_image.png" class="sequence-icon" mode="widthFix"></image>
				<view v-for="(item,index) in sequence.list" :key="index" :class="['sequence-item',sequence.index==index?'color3764FF':'']" @click="onSequenceItem(index)">{{item.demand_type}}</view>
			</view>
			<view :class="['sequencePop',isTop?'fixed':'absolute']" :style="{'top':(isTop? (navBarHeight + 94):0)+'px'}" v-if="caseType.show">
				<image src="/static/images/sj_image.png" class="sequence-icon" mode="widthFix"></image>
				<view v-for="(item,index) in caseType.list" :key="index" :class="['sequence-item',caseType.index==index?'color3764FF':'']" @click="onCaseTypeItem(index)">{{item.demand_type}}</view>
			</view>
			<view class="sequenceBg" v-if="sequence.show||caseType.show||signUp.show" @click="popDown"></view>

			<view class="" v-if="list.length">
				<view style="height: 20rpx;"></view>
				<needListItem v-for="(item,index) in list" :key="index" :item="item" :type="tab.index"></needListItem>
				<view class="bottomH"></view>
			</view>
				
			<view class="null center" v-if="!list.length">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" class="width200" mode="widthFix"></image>
				<view class="text">暂无数据</view>
			</view>

			<view v-if="userInfo && userInfo.type === 0" class="footBox flex center marlr32">
				<view class="left" @click="show=true">平台保障</view>
				<view class="right flex hcenter flexcenter flex1 left16" @click="toLink('/pagesV1/need/release')">
					<image src="/static/images/sr_icon2.png" class="width28" mode="widthFix"></image>
					<text class="left12 font34">发布订单</text>
					<text class="left12 font24">(三大保障，安全放心)</text>
				</view>
			</view>
		</view>
		
		<u-popup v-model="appeal.show" mode="bottom" border-radius="32">
			<view class="addBox font30">
				<image src="/static/images/nav_tj_icon.png" class="colse" @click="appeal.show=false" mode=""></image>
				<view class="font34 bold center bottom60">填写合作意向</view>
				<view class="hint">发表下自己的合作意向，仅委托人可见</view>
				<view class="text flex top40 relative">
					<textarea v-model="appeal.value" placeholder="填写合作内容" />
					<view class="numLen font26">({{ appeal.value.length }}/300字)</view>
				</view>
				<view class="confirmBtn" @click="submit">确定报名</view>
			</view>
		</u-popup>

		<u-mask :show="show" @click="show = false">
			<view class="popBox flex hcenter flexcenter" @click.stop="">
				<view class="relative">
					<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_cxbz_image.png" class="bg" mode="widthFix"></image>
					<view class="btn center" @click.stop="show = false">我已知晓</view>
					<view class="hint flex hcenter" @click="toWebview">
						<text>如何识别</text>
						<u-icon name="play-right-fill" class="left12" color="#FF7639" size="16"></u-icon>
					</view>
				</view>
			</view>
		</u-mask>

		<!-- #ifdef MP-TOUTIAO -->
		<addressBox ref="address" type='1' @setTypes="setAddress" @openAdr="openAdr"></addressBox>
		<!-- #endif -->
		
		<!-- #ifndef MP-TOUTIAO -->
		<addressBox ref="address" :statusH="true" type='1' @setTypes="setAddress" @openAdr="openAdr"></addressBox>
		<!-- #endif -->

		<tab-bar :selected="2" />
	</view>
</template>

<script>
	let systemInfo = uni.getSystemInfoSync();
	import { addLawyerCorporateComment, getCaseType, getDemandConfig, getGrabOrderType, getGrabOrderList, getCaseList, getLocation } from "@/api/apis.js"
	import { jumpToUrl } from '@/common/util.js';
	import needListItem from "@/components/needListItem.vue"
	import addressBox from "@/components/address.vue"
	import { mapState, mapGetters } from 'vuex';
	
	export default {
		components: {
			needListItem,
			addressBox,
		},
		data() {
			return {
				search: {
					TextStatus: true,
					value: null,
				},
				tab:{
					list: ['快速抢单','案源信息'],
					index: 0
				},
				sequence:{
					show:false,
					list:['综合排序','只看律师','只看律所'],
					index:null,
				},
				caseType:{
					show:false,
					list:['综合排序','只看律师','只看律所'],
					index:null,
				},
				signUp:{
					show:false,
					list:['全部状态','已参加','未参加'],
					index:null,
				},
				appeal:{
					show:false,
					index:0,
					value:''
				},
				banner:null,
				isTop:false,
				tabTop:68,
				show:false,
				page:[1,1],
				isAdr:false,
				distance:0,
				positive:0,
				there:{},
				num:0,
				oType: '',
				list:[],
			}
		},
		computed: {
			...mapState('userModule', ['userInfo']),
			...mapGetters([ 'sysSafeAreaHeight' ]),
			navBarHeight() {
				// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
				// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
				let height = 0;
				// #ifndef MP-TOUTIAO
				height = systemInfo.statusBarHeight + (systemInfo.platform == 'ios' ? 44 : 48);
				// #endif
				return height;
			}
		},
		methods: {
			toLink(url){
				uni.navigateTo({
					url:url
				})
			},
			toWebview(){
				uni.navigateTo({
					url:`/pagesV1/common/webview?url=${encodeURIComponent('https://h5.lawkd.com/safeguard?show=1')}`
				})
				
			},
			toDetail(id){
				uni.navigateTo({
					url:`/pages/need/detail?id=${id}`
				})
			},
			onJump(data){
				jumpToUrl(data.jump_type,data.jump_id)
			},
			openRelease(){
				this.$refs.release.status=true
			},
			getList(){
				if(this.tab.index==1){
					getCaseList({
						page:this.page[this.tab.index],
						demand_type_id:this.caseType.index!=null?this.caseType.list[this.caseType.index].demand_type_id:0,
						city_id:this.there?this.there.city_id:0,
						is_join:this.signUp.index!=null?this.signUp.index:0
					}).then(res=>{
						if(res.data.code==0){
							this.list=this.page[this.tab.index]==1?res.data.data.items:this.list.concat(res.data.data.items)
							if(res.data.data.items.length>0) this.page[this.tab.index]++
						}
					})
				}else{
					getGrabOrderList({
						page:this.page[this.tab.index],
						demand_type_id:this.sequence.index!=null?this.sequence.list[this.sequence.index].demand_type_id:0,
						city_id:this.there?this.there.city_id:0,
						is_join:this.signUp.index!=null?this.signUp.index:0
					}).then(res=>{
						if(res.data.code==0){
							console.log(res.data.data)
							this.list=this.page[this.tab.index]==1?res.data.data.items:this.list.concat(res.data.data.items)
							if(res.data.data.items.length>0) this.page[this.tab.index]++
						}
					})
				}
			},
			getSequence(){
				getGrabOrderType().then(res=>{
					if(res.data.code==0){
						this.sequence.list=res.data.data
						return
					}
					uni.$u.toast('获取排序类型失败')
				})
			},
			getCaseType(){
				getCaseType().then(res=>{
					if(res.data.code==0){
						this.caseType.list=res.data.data
						return
					}
					uni.$u.toast('获取排序类型失败')
				})
			},
			onJoin(index){
				this.appeal.show=true
				this.appeal.index=index
			},
			getBanner(){
				getDemandConfig().then(res=>{
					if(res.data.code==0){
						this.banner=res.data.data
					}
				})
			},
			submit(){
				addLawyerCorporateComment({
					lawyer_corporate_order_id:this.list[this.appeal.index].lawyer_corporate_order_id,
					content:this.appeal.value
				}).then(res=>{
					if(res.data.code==0){
						this.list[this.appeal.index].is_can_join=0
						this.appeal.show=false
						this.appeal.value=false
						uni.$u.toast('报名成功')
					}
				})
			},
			popDown(){
				this.sequence.show=false
				this.caseType.show=false
				this.signUp.show=false
			},
			blurInput() { //失去焦点时
				this.search.TextStatus = true
			},
			getInput() { //获得焦点时
				this.search.TextStatus = false
			},
			onTab(index){
				this.popDown()
				this.tab.index=index
				this.page[this.tab.index]=1
				this.getList()
			},
			toDetail(id){
				uni.navigateTo({
					url:'/pages/need/detail?id='+id
				})
			},
			onSequence(){
				this.caseType.show=false
				this.signUp.show=false
				this.sequence.show=!this.sequence.show
			},
			onCaseType(){
				this.sequence.show=false
				this.signUp.show=false
				this.caseType.show=!this.caseType.show
			},
			onSignUp(){
				this.sequence.show=false
				this.caseType.show=false
				this.signUp.show=!this.signUp.show
			},
			onSignUpItem(index){
				this.signUp.index=index
				this.signUp.show=false
				this.page[this.tab.index]=1
				this.backTop()
				this.getList()
			},
			onSequenceItem(index){
				this.sequence.index=index
				this.sequence.show=false
				this.page[this.tab.index]=1
				this.backTop()
				this.getList()
			},
			onCaseTypeItem(index){
				this.caseType.index=index
				this.caseType.show=false
				this.page[this.tab.index]=1
				this.backTop()
				this.getList()
			},
			setAddress(e){
				console.log(e)
				this.there=e
				if(this.tab.index!=2){
					this.page[this.tab.index]=1
				}
				this.getList()
			},
			onAddress(){
				this.$refs.address.show=true
			},
			backTop(){
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				});
			},
			getAddress(){
				uni.getLocation({
				    type: 'wgs84',
				    success: res=> {
						this.position=res
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
						getLocation({lng:res.longitude,lat:res.latitude}).then(res=>{
							if(res.data.code==0){
								var there = {
									province_id:res.data.data.provinceId,
									city_id:res.data.data.cityId,
									city:res.data.data.city
								}
								this.there=there
								getApp().globalData.there=there
								this.$refs.address.city=there
								uni.setStorage({
									key: 'there',
									data: there,
								});
								if(this.tab.index==2){
									
								}else if(this.tab.index==1){
									this.page[1]=1
								}else{
									this.page[0]=1
								}
								this.getList();
							}
						})
				    }
				});
			},
			getAuthorize() { //获取授权
				uni.authorize({
					scope: "scope.userLocation",
					success: res => {
						this.isAdr = true;
						console.log('授权成功')
						this.getAddress()
					},
					fail: res => {
						this.isAdr = false;
						this.getList();
					}
				})
			},
			openAdr(){
				console.log(this.isAdr)
				if(this.isAdr){
					this.getAddress()
					return
				}
				uni.openSetting({
					success: res=> {
						if(res.authSetting){
							this.isAdr = true;
							console.log('授权成功')
							this.getAddress()
						}
					},
					complete: res => {
						console.log(res);
					}
				})
			},
			startScroll() {
				if (this._scrollPullStatus) return;
				this._scrollPullStatus = true;
				if (!this.scrollPullStatus)
					this.scrollPullStatus = true
				if(this.tab.index!=2)
					this.page[this.tab.index]=1
				this.getList()
				setTimeout(() => {
					this.scrollPullStatus = false; //触发onRestore，并关闭刷新图标
					this._scrollPullStatus = false;
				}, 500)
			},
			getDivInfo(obj){
				const query = uni.createSelectorQuery().in(this);
				query.select(obj).boundingClientRect(data => {
					console.log(data)
					if(obj=='#navbar'&&data.height)
						this.navBarHeight=data.height;
					// else if(obj=='#tabTop')
					// 	this.tabTop=data.bottom-data.height
				}).exec();
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
		onPageScroll(e){
			if(e.scrollTop>this.tabTop){
				this.isTop = true
			}else{
				this.isTop = false
			}
		},
		// #ifndef MP-KUAISHOU
		onPullDownRefresh() {
			this.page[this.tab.index] = 1
			this.getList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// #endif
		onLoad(e) {
			this.oType=e.type
			this.there=uni.getStorageSync('there')||null
			this.getBanner();
			this.getSequence();
			this.getCaseType();
		},
		onReady() {
			this.$nextTick(()=>{
				setTimeout(()=>{
					this.tabTop = this.navBarHeight+parseInt(this.banner.height)+10
				},2000)
			})
		},
		onShow() {
			// #ifndef MP-WEIXIN
			uni.hideTabBar()
			// #endif

			if(!this.list.length){
				if(!this.there) { //没地址
					this.getAuthorize();
				} else {
					this.getList()
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F9F9FB;
	}
	/deep/.u-progress{
		display: block !important; 
	}
	.maxWidth120{
		max-width: 120rpx;
	}
	
	.bottomH{
		// #ifdef MP-WEIXIN
		height: 300rpx;
		// #endif
		// #ifdef MP-TOUTIAO
		height: 150rpx;
		// #endif
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
		height: 100%;
	}
	.null{
		padding: 0;
	}
	.list{
		position: relative;
		.fixedBtn{
			width: 100%;
			position: fixed;
			bottom: 0;
			padding: 0 32rpx 32rpx;
			.popBtn{
				width: 190rpx;
				height: 88rpx;
				line-height: 88rpx;
				background: #E7F3FE;
				border-radius: 12rpx;
			}
			.btn{
				color: #fff;
				height: 88rpx;
				line-height: 88rpx;
				background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
				box-shadow: 0rpx 6rpx 16rpx rgba(0, 35, 212, 0.32);
				border-radius: 12rpx;
				flex: 1;
			}
		}
		
		.list-item{
			padding: 12upx 24rpx 20rpx;
			background: #FFFFFF;
			margin-bottom: 20rpx;
			box-shadow: 0px 4rpx 10rpx rgba(0, 17, 71, 0.1);
			border-radius: 16rpx;
			position: relative;
			.user{
				padding-bottom: 16rpx;
				border-bottom: 1rpx solid #ECEFF4;
			}
			.photo{
				width: 64upx;
				height: 64upx;
				border-radius: 20upx;
			}
			.info{
				padding: 20rpx 0;
			}
			.btn{
				height: 64rpx;
				color: #fff;
				line-height: 64rpx;
				background: #3764FF;
				border-radius: 8rpx;
			}
		}
		.button{
			width: calc(100% - 150rpx);
			height: 100rpx;
			line-height: 100rpx;
			background: #3764FF;
			color: #fff;
			box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
			border-radius: 20rpx;
			margin: 0 75rpx;
			position: fixed;
			bottom: 86rpx;
		}
	}
	.releaseBox{
		padding: 88rpx 58rpx 124rpx;
		.close{
			width: 30rpx;
			height: 30rpx;
			margin: 72rpx auto 0;
		}
	}
	.fixedBox{
		position: fixed;
		z-index: 999;
	}
	.bar{
		width: 100%;
		height: 90px;
		background-color: #fff;
		z-index: 9;
	}
	.topBanner{
		width: calc(100% - 64rpx);
		background-color: #fff;
		height: 120px;
		padding: 0 32rpx 10px;
		display: block;
	}
	.nav{
		width: 100vw;
		height: 120rpx;
		margin-bottom: 32rpx;
		.navBox{
			height: 100%;
			flex-wrap: nowrap;
			padding: 0 32rpx;
			
		}
		.nav-item{
			width: 120rpx;
			margin-right: 52rpx;
			display: table;
			&:last-child{
				margin-right: 32rpx;
			}
		}
	}
	.searchBox {
		margin: auto;
	}
	.searchabs {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.searchText {
		font-size: 26rpx;
		font-weight: 500;
		color: #B7BFD1;
		margin-left: 4rpx;
	}
	.searchIcon {
		width: 23rpx;
	}
	.searchInput {
		padding: 0 30rpx;
		background: #F1F3FB;
		border-radius: 100rpx;
		height: 72rpx;
	}
	.tab{
		height: 40px;
		background: #F5F5F9;
		border-radius: 12rpx;
		margin: 0 32rpx 10px;
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
		font-size: 28rpx;
		font-weight: bold;
		line-height: 49rpx;
		z-index: 99;
	}
	.sequencePop{
		width: 240rpx;
		font-size: 28rpx;
		text-align: center;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 32rpx;
		left: 32rpx;
		z-index: 9999;
	}
	.sequencePop .sequence-icon{
		width: 40rpx;
		height: 36rpx;
		position: absolute;
		top: -25rpx;
		left: 64rpx;
	}
	.sequencePop .sequence-item{
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #ECEFF4;
	}
	.sequencePop .sequence-item:last-child{
		border-bottom: none;
	}
	.sequenceBg{
		width: 100%;
		height: 100%;
		z-index: 99;
		position: absolute;
		top: 0;
		left: 0;
		background: #000000;
		opacity: 0.2;
	}
	.popBox{
		height: 100vh;
		.bg{
			width: 620rpx;
		} 
		.hint{
			color: #FF7639;
			padding: 0 10rpx;
			background: #FEEEE7;
			border-radius: 8rpx;
			line-height: 36rpx;
			position: absolute;
			right: 40rpx;
			top: 240rpx;
		}
		.btn{
			width: 360rpx;
			line-height: 90rpx;
			color: #fff;
			background: linear-gradient(180deg, #4686FC 0%, #2B69F9 100%);
			box-shadow: 0rpx 0rpx 20rpx rgba(0, 29, 122, 0.4);
			border-radius: 100rpx;
			margin: 0 auto;
			transform: translateY(-60rpx);
		}
	}
	.footBox{
		width: calc(100% - 64rpx);
		line-height: 88rpx;
		position: fixed;
		z-index: 98;
		bottom: 200rpx;
		.left{
			width: 190rpx;
			font-size: 34rpx;
			color: #0061FF;
			background: #E7F3FE;
			border-radius: 24rpx 12rpx 12rpx 24rpx;
		}
		.right{
			color: #fff;
			background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
			box-shadow: 0rpx 6rpx 16rpx rgba(0, 35, 212, 0.32);
			border-radius: 12rpx 24rpx 24rpx 12rpx;
		}
	}
	.addBox{
		padding: 36rpx 36rpx 64rpx;
		.colse{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 36rpx;
			right: 36rpx;
		}
		.hint{
			height: 36rpx;
			line-height: 36rpx;
			padding: 0 24rpx;
			background: #FEEEE7;
			border-radius: 8rpx;
			font-size: 24rpx;
			color: #FF7639;
			display: inline-block;
		}
		.text{
			height: 240rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 28rpx 32rpx;
			margin-bottom: 64rpx;
			textarea{
				width: 100%;
				height: 100%;
			}
		}
		.numLen{
			color: #B7BFD1;
			position: absolute;
			bottom: 28rpx;
			right: 32rpx;
		}
		.confirmBtn{
			border-radius: 8rpx;
			background: #3764FF;
			box-shadow: none;
		}
	}
</style>
