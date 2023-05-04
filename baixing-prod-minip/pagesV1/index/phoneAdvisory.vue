<template>
	<view>
		<u-sticky h5-nav-height="0">
			<view style="">
				<view class="flex between hcenter backfff">
					<view class="tabsbox">
						<u-tabs height="82" ref="tabs" :list="tab.tabList" :current="tab.index" name="lawyer_tag" 
							@change="setTabIndex"></u-tabs>
					</view>
					<view class="topBtn" @click="linkFabu">
						<u-icon name="edit-pen" color="#ffffff" size=""></u-icon>
						<text>发布</text>
					</view>
				</view>
				<view :class="['threeBox']">
					<view :class="['top','flex','hcenter',status?'isCall':'']" v-if="!is_vip">
						<view class="marlr32" v-if="status">
							已等待30秒，立即拨打享受免费咨询
						</view>
						<view class="marlr32" v-else>
							请耐心等待{{time}}秒,咨询前先浏览下相似问题吧
						</view>
					</view>
					<view class="bottom flex hcenter between">
						<view class="flex hcenter">
							<image :src="info.avatar" mode="aspectFill" class="photo1"></image>
							<view class="left20">
								<view class="flex hcenter">
									<view class="name1 line1">{{info.nickname}}</view>
									<view v-if="info.work_year" class="year center">执业{{info.work_year}}年</view>
								</view>
								<view class="office line1">{{info.lawyer_office}}</view>
							</view>
						</view>
						<view class="threeNum flex flexcenter hcenter" v-if="!status&&!is_vip" @click="clickTime">{{time}}s</view>
						<image :src="url+'/Comp_4.gif'" mode="widthFix" v-else class="callImg"@click="clickCall"></image>
					</view>
					<!-- <view v-if="lawyerStore " class="marlr32">
						<view class="navTitle" v-if="moreShow">
							<view class="flex-row hcenter between">
								<view class="Name">{{lawyerStore.product.name}}<text>￥{{lawyerStore.product.price}}</text></view>
								<view class="flex hcenter between">
								<view class="Time">服务时间: {{lawyerStore.service_time}}</view>
							</view>
							</view>
							<view class="Time" v-if="moreShow">{{lawyerStore.product.introduction}}</view>
						</view>
						
						<view class="flex serveBox" v-if="moreShow">
							<view class="serveItem center" v-for="(item,index) in lawyerStore.product_categories" :key="index" :style="{'background': item.color,'box-shadow': '0px 2upx 12upx '+item.shadow_color}" @click="showStore(index)">
								<view class="name">{{item.name}}</view>
								<view class="free">{{item.introduction}}</view>
							</view>
						</view>
						<view class="moreView flex-row" @click="changeMore">
							<text>收回内容</text>
							<image :class="[moreShow?'':'rotate']" src="/pagesV1/static/images/ic_ck_top.png"></image>
						</view>
					</view> -->
					<view  style="height: 32upx;"></view>
				</view>
				<view class="popover" v-if="!userLocation">
					<view class="relative">
						<!-- <image src="/static/images/ddwx_bg.png"></image> -->
						<view class="flex-row">
							<!-- <image class="adr" src="/static/images/dw_icon@3x.png"></image> -->
							<text class="content">开启定位咨询当地律师免等待</text>
							<button @click="authorize">开启</button>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="">
			<view v-for="(item1,index1) in tab.tabCon[tab.index]" :key="index1" class="listItem">
				<view class="flex hcenter">
					<image :src="item1.avatar" mode="" mode="aspectFill" class="photo"></image>
					<view class="name">
						{{item1.nickname}}
					</view>
				</view>
				<view @click="linkAskDetails(item1.question_id)">
					<view class="conText">
						<text class="lawyer_tag">{{item1.lawyer_tag}}</text>
						<text class="conTitle">{{item1.title}}</text>
					</view>
					<view class="more">
						阅读全文
					</view>
				</view>
				<view class="flex imgbox">
					<view :class="[tab.tabList.length > 3?'avtiveImg':'','relative']" v-for="(item2,index2) in item1.question_images_thumbnail
				" v-if="index2 < 3" :key="index2">
						<image :src="item2" mode="widthFix" class="itemImage" @click="clickBigImage(index1,index2)"></image>
						<view class="avtiveImgbox flex flexcenter hcenter"
							v-if="index2 == 2&&item1.question_images_thumbnail.length > 3">
							{{item1.question_images_thumbnail.length}}
						</view>
					</view>
				</view>
				<view class="flex between">
					<view class="flex hcenter">
						<image src="../../static/images/fx_icon.png" mode="widthFix" class="width36"></image>
						<text>分享</text>
					</view>
					<view class="flex hcenter">
						<image src="../../static/images/pl_icon.png" mode="widthFix" class="width36"></image>
						<text>{{item1.comment_number}}</text>
					</view>
					<view class="flex hcenter" @click="clickLike(item1.question_id,item1.is_like,index1)">
						<image
							:src="item1.is_like?'../../static/images/dz_icon_sel.png':'../../static/images/dz_icon.png'"
							mode="widthFix" class="width36"></image>
						<text>{{item1.like_number}}</text>
					</view>
				</view>
			</view>
		</view>
		<timeOuter ref="timeOuter" :name="info.nickname" @call="getCall"></timeOuter>
		<VIP ref="vip" @is="setVip"></VIP>
		<lawyerStore ref="lawyerStore" :orderPop="orderPop" :info="lawyerStore" @change="orderPopChange" ></lawyerStore>
		<evaluate ref="evaluate" @clickEvaluateLabie="clickEvaluateLabie"></evaluate>
		<bigBanner :question_images="big" ref="bigBanner" @small="small"></bigBanner>
		<pop2001Box v-model="pop2001Show"></pop2001Box>
	</view>
</template>

<script>
	import { getIndexTabList, getIndexCon, getUnlike, getLike, getPhone, getThirtyTime, getNoComment, getLawyerStore } from "@/api/apis.js"
	
	import pop2001Box from "../components/pop2001Box.vue"
	import lawyerStore from "../components/lawyerStore.vue"
	import timeOuter from "../components/timeOuter.vue";
	import VIP from "../components/payVIP.vue"
	import evaluate from "../../components/evaluate.vue"
	import bigBanner from "../components/bigBanner.vue"
	
	export default {
		components: {
			timeOuter,
			VIP,
			evaluate,
			bigBanner,
			lawyerStore,
			pop2001Box
		},
		data() {
			return {
				userLocation:true,
				pop2001Show:false,
				moreShow:true,
				orderPop:false,
				lawyerStore:null,
				big: {
					list: [],
					index: null
				},
				url:'',
				orderInfo: {},
				is_vip: 0,
				info: {},
				time: 30,
				status: false,
				Interval: null,
				phoneNum: null,
				pop2001info: {},
				tab: {
					tabList: [],
					index: 0,
					tabCon: [],
					page: []
				},
			}
		},
		methods: {
			authorize(){
				uni.openSetting({
					success:res=>{
						console.log(res)
						this.userLocation = res.authSetting['scope.userLocation']
						
						uni.authorize({
							scope:'scope.userLocation',
							success:res=>{
								console.log(res)
								setTimeout(()=>{
									this.getAddress()
								},1000)
								
							},
							fail:res=>{
								console.log(res)
							}
						})
					}
				})
				
			},
			showStore(index){
				this.orderPop = true
				this.$refs.lawyerStore.serviceIndex = index
			},
			changeMore(){
				this.moreShow = !this.moreShow
			},
			orderPopChange(e){
				this.orderPop = e
				// this.meetPop = e
			},
			small() {
				this.$refs.bigBanner.status = false;
			},
			clickBigImage(index1, index2) {
				this.$refs.bigBanner.status = true;
				this.$refs.bigBanner.list = this.tab.tabCon[this.tab.index][index1].question_images;
				this.$refs.bigBanner.index = index2;
			},
			clickEvaluateLabie(index) { //点击评论组件
				this.orderInfo.reasons[index].status = !this.orderInfo.reasons[index].status
				this.$store.commit("setOrderInfo",this.orderInfo)
			},
			clickTime() { //点击剩余多少秒
				this.$refs.vip.show = true,
				this.$u.toast('请耐心等待倒计时，先浏览相似问题吧');
			},
			getCall() { //点击弹窗咨询
				getNoComment().then(res => {
					if (res.data.data.length) { //有未评论订单时
						this.getNoEvaluate();
					} else { //没有未评论订单时
						getPhone({
							lawyer_user_id: this.info.user_id
						}).then(res => {
							if (!res.data.code) {
								uni.makePhoneCall({
									phoneNumber: res.data.data.mobile,
									complete: res => {
										this.status = false;
										this.time = 30;
										this.time30();
										this.$refs.timeOuter.show = false;
									}
								});
								return
							}else if(res.data.code == 2001){
								this.pop2001info.show=true
								this.pop2001info.title=res.data.message
							}
							uni.showToast({
								icon: "none",
								title: res.data.message
							})
						})
					}
				})
			},
			clickCall() { //点击电话图片 
				this.$refs.timeOuter.show = true;
				this.$refs.timeOuter.time = 5;
				this.$refs.timeOuter.status = false;
				this.$refs.timeOuter.setInterval()
			},
			clickLike(id, islick, index) { //点赞
				if (islick) {
					getUnlike({
						type: 3,
						source_id: id
					}).then(res => {
						this.tab.tabCon[this.tab.index][index].is_like = 0;
						this.tab.tabCon[this.tab.index][index].like_number -= 1;
					})
					return
				}
				getLike({
					type: 3,
					source_id: id
				}).then(res => {
					this.tab.tabCon[this.tab.index][index].is_like = 1;
					this.tab.tabCon[this.tab.index][index].like_number += 1;
				})
			},
			linkAskDetails(e) { //跳转问答详情
				uni.navigateTo({
					url: `askDetails?id=${e}`
				})
			},
			setTabIndex(e) { //tablist点击
				this.tab.index = e;
				if (!this.tab.tabCon[e].length) {
					this.getIndexCon(this.tab.tabList[e].lawyer_tag_id, 1);
				}
			},
			getIndexCon(id, page) { //初始化con
				getIndexCon({
					type: 0,
					lawyer_tag_id: id,
					page: this.tab.page[this.tab.index],
				}).then(res => {
					let data = this.tab.tabCon[this.tab.index].concat(res.data.data)
					this.$set(this.tab.tabCon, this.tab.index, data)
					this.tab.page[this.tab.index] += 1;
					console.log(211)
				})
			},
			getIndexTabList() { //获取tablist
				getIndexTabList().then(res => {
					res.data.data.unshift({
						lawyer_tag: "推荐",
						lawyer_tag_id: 0
					})
					this.tab.tabList = res.data.data;
					res.data.data.forEach((item, index) => {
						this.tab.tabCon.push([])
						this.tab.page.push(1)
					})
					this.getIndexCon(res.data.data[this.tab.index].lawyer_tag_id);
				})
			},
			linkFabu() {
				uni.navigateTo({
					url: "/pagesV1/common/fabu"
				})
			},
			time30() {
				getThirtyTime().then(res => {

				})
				this.Interval = setInterval(() => {
					this.time -= 1;
					if (this.time == 0) {
						clearInterval(this.Interval);
						this.status = true
					}
				}, 1000)
			},
			setVip() {
				this.$set(this, "is_vip", uni.getStorageSync("is_vip"))
			},
			getNoEvaluate() {
				getNoComment().then(res => {
					if (res.data.data.length) {
						res.data.data[0].istop = true
						res.data.data[0].reasons.forEach((item, index) => {
							item.status = false
						})
						this.$set(this, "orderInfo", res.data.data[0])
						this.$store.commit("setOrderInfo",res.data.data[0])
						this.$store.commit("setOrderStatus", true)
					}
				})
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 1) {
				this.moreShow = false
			}
		},
		onLoad(e) {
			console.log(e.info)
			// #ifdef H5
			if(!uni.getStorageSync('mobile')){
				uni.navigateTo({
					url:'/pagesV2/h5/bind'
				})
			}
			// #endif
			this.url=this.$photoPath;
			this.$set(this, "info", JSON.parse(e.info))
			this.getIndexTabList();
			this.getNoEvaluate();
			getLawyerStore({
				user_id:this.info.user_id,
			}).then(res=>{
				if(res.data.code){
					// this.$u.toast(res.data.message)
				}else{
					this.lawyerStore = res.data.data
					// this.orderPop = true
				}
			})
			// #ifndef H5
			uni.getSetting({
				scope:'scope.userLocation',
				success:res =>{
					this.userLocation = res.authSetting['scope.userLocation']
					console.log(res.authSetting['scope.userLocation'])
					// if(res.authSetting['scope.userLocation'])
					// 	this.getAddress(); //获取当前城市
					// if(!this.userLocation){
					// 	this.showClientPop(1)
					// }
				}
			})
			// #endif
		},
		onShow() {
			this.time30();
			this.$set(this, "is_vip", uni.getStorageSync("is_vip"))
		},
		onHide() {
			clearInterval(this.Interval);
		},
		onUnload() {
			clearInterval(this.Interval);
		},
		onPullDownRefresh() {
			this.tab.tabCon[this.tab.index] = [];
			this.tab.page[this.tab.index] = 1;
			this.getIndexCon(this.tab.tabList[this.tab.index].lawyer_tag_id,1)
			uni.stopPullDownRefresh();
			uni.showToast({
				title:"刷新成功"
			})
		},
		onReachBottom(){
			this.getIndexCon(this.tab.tabList[this.tab.index].lawyer_tag_id,this.tab.page[this.tab.index])
		}
	}
</script>

<style lang="scss">
	.moreView{
		padding: 32upx 0 20upx 0;
		line-height: 40upx;
		font-size: 28upx;
		color: #CACBCF;
		justify-content:center;
		align-items:center;
		image{
			width: 22upx;
			height: 14upx;
			margin-left: 8upx;
		}
		.rotate{
			transform-origin:center center;
			transform:rotate(180deg);
			-webkit-transform:rotate(180deg);
			-moz-transform: rotate(180deg);
			-ms-transform: rotate(180deg);
			-o-transform: rotate(180deg);
			transition: transform 0.2s;//过度时间 可调
			-moz-transition:-moz-transform 0.2s;
			-moz-transition:-moz-transform 0.2s;
			-o-transition:-o-transform 0.2s;
			-ms-transition: -ms-transform 0.2s;
			}
	}
	.serveBox {
		.free {
			font-size: 24upx;
			line-height: 40upx;
			color: #FFFFFF;
			opacity: 0.8;
			margin-top: 5upx;
		}
	
		.name {
			font-size: 30upx;
			font-weight: 500;
			line-height: 48upx;
			color: #FFFFFF;
			text-shadow: 0px 3upx 4upx rgba(13, 0, 196, 0.3);
		}
	
		image {
			margin: 30rpx 0 20rpx 0;
		}
	
		.serveItem {
			width: 218upx;
			height: 100upx;
			border-radius: 16upx;
			margin-right: 16upx;
			&:last-child{
				margin-right: 0;
			}
		}
		.blue{
			background: #4B85FF;
			box-shadow: 0px 2upx 12upx rgba(58, 117, 219, 0.4);
		}
		.orange{
			background: #FF4B44;
			box-shadow: 0px 2upx 12upx rgba(219, 58, 58, 0.4);
		}
		.purple{
			background: #9038F5;
			box-shadow: 0px 2upx 12upx rgba(11, 0, 170, 0.3);
		}
		margin-top: 24rpx;
	}
	.tags{
		height: 60upx;
		line-height: 60upx;
		font-size: 24upx;
		margin: 32upx 0 36upx;
		.name{
			font-size: 26upx;
			padding: 0 15upx;
			border-radius: 0 32upx 32upx 0;
			background-color: #FEE7E7;
		}
	}
	.navTitle {
		padding-left: 7upx;
		margin-bottom: 12upx;
		.Name {
			font-size: 34upx;
			font-weight: bold;
			color: #FFFFFF;
			margin-bottom: 12upx;
			text{
				color: #FF4040;
				margin-left: 20upx;
			}
		}
		.Time{
			color: #CACBCF;
			font-size: 28upx;
			line-height: 40upx;
		}
		.edit{
			color: #CACBCF;
			font-size: 28upx;
		}
	}
	.popover{
		// position: absolute;
		// bottom: 166upx;
		// left: 0upx;
		// right: 0;
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
	.threeBox {
		.isCall {
			background: #E7F3FE !important;
			color: #0061FF !important;
		}

		.bottom {
			padding: 32rpx 32upx 0 32upx;
			.callImg {
				border-radius: 100px;
				background: linear-gradient(269deg, #4BA9F8 0%, #2D7CF7 100%);
				width: 100rpx;
				margin-right: 50rpx;
			}

			.threeNum {
				background-color: rgba(255, 41, 71, 1);
				width: 180rpx;
				height: 80rpx;
				color: #fff;
				font-size: 30rpx;
				border-radius: 100rpx;
			}

			.office {
				font-size: 28rpx;
				color: #FFFFFF;
				margin-top: 8rpx;
				width: 300rpx;
			}

			.year {
				width: 104rpx;
				height: 32rpx;
				// background: linear-gradient(270deg, #EBCDA1 0%, #E3C396 100%);
				border-radius: 4upx 4upx 4upx 4upx;
				font-size: 20rpx;
				font-weight: bold;
				border: 2upx solid #E4C497;
				color: #E4C497;
				margin-left: 12rpx;
			}

			.name1 {
				// width: 250rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #FFFFFF;
			}

			.photo1 {
				width: 96rpx;
				height: 96rpx;
				border-radius: 100px;
			}
		}

		.top {
			font-size: 28rpx;
			color: #FF3951;
			height: 64rpx;
			background: #FEE7E7;
			// border-radius: 0px 0px 8rpx 8rpx;
		}

		background: #4E5160;
		box-shadow: 0px 10upx 16upx rgba(0, 33, 112, 0.2);
		// border-radius: 0px 0px 24upx 24upx;
	}
	.borderRag{
		border-radius: 0px 0px 24upx 24upx;
	}

	.listItem {
		.width36 {
			width: 36rpx;
			margin-right: 8rpx;
		}

		.itemImage {
			width: 210rpx;

		}

		.avtiveImg:nth-child(3) .avtiveImgbox {

			background: rgba(27, 35, 52, 0.36);
			width: 210rpx;
			height: 210rpx;
			right: 0;
			top: 0;
			position: absolute;
			color: #fff;
		}

		.imgbox .relative:nth-child(2) {
			margin: 0 12rpx;
		}

		.more {
			text-align: right;
			font-size: 26rpx;
			font-weight: bold;
			color: #677592;
			margin-top: 10rpx;
			margin-bottom: 20rpx;
		}

		.conText {
			.conTitle {
				margin-left: 30rpx;
				font-weight: 500;
				color: #292929;
				font-size: 34rpx;
				line-height: 64rpx;
			}

			.lawyer_tag {
				font-size: 26rpx;
				font-weight: bold;
				text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.14);
				background: linear-gradient(270deg, #FF2B2B 0%, #FF4646 100%);
				border-radius: 4px;
				color: #FFFFFF;
				padding: 3rpx 6rpx;
			}

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}

		.photo {
			width: 90rpx;
			border-radius: 100px;
			height: 90rpx;
		}

		.name {
			margin-left: 20rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
		padding: 0 32upx 20upx 32upx;
		margin-top: 20rpx;
		border-bottom: 12upx solid #F5F7FA;
	}

	.tabposition {
		width: 100%;
		position: fixed;
		background-color: #fff;
		top: 0;
		z-index: 99;
	}

	.fabu {
		width: 158rpx;
	}
	
	.topBtn{
		width: 110upx;
		height: 48upx;
		line-height: 48upx;
		margin: 0 32upx 0 0;
		color: #FFFFFF;
		font-size: 24upx;
		text-align: center;
		background: linear-gradient(to right,#2D7CF7,#4BA9F8);
		border-radius: 100upx;
		box-shadow: 0 4upx 20upx rgba($color: #2D7CF7, $alpha: 0.2);
	}
	
	.tabsbox {
		height: 88upx;
		overflow: hidden;
		width: 75%;
	}
</style>
