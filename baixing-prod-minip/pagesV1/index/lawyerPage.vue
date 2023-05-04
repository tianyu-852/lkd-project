<template>
	<view v-if="info">
		<!-- #ifndef MP-TOUTIAO -->
		<u-navbar :border-bottom="false" :background="{background:isTop?'#fff':'none'}" z-index="999" id="navbar">
			<view :class="['flex hcenter left32',isTop?'show':'hide']">
				<image :src="info.avatar" class="minPhoto" mode="aspectFill"></image>
				<text class="left16">{{info.nickname}}｜{{info.lawyer_grade_chinese}}</text>
				<image src="/static/images/bzjh_icon.png" v-if="info.is_guarantee" class="width32 left8" mode="widthFix"></image>
			</view>
		</u-navbar>
		<!-- #endif -->

		<view class="userBg">
			<image class="widthAll" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_office_sy_bg.png" mode="widthFix"></image>
		</view>

		<scroll-view scroll-y="true" class="srcollBox" scroll-with-animation="true" @scrolltolower="lower" :scroll-into-view="topId" @scroll="scroll" :style="{height:'calc(100vh - '+(navData.height+44)+'px)'}">
			<view class="userBg" :style="{top: (-navData.bottom)+'px'}" v-if="navData">
				<image class="widthAll" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_office_sy_bg.png" mode="widthFix"></image>
			</view>
			
			<view class="cell relative">
				<view class="flex hcenter between">
					<image :src="info.avatar" class="photo" @click="previewImage([info.avatar])" mode="aspectFill"></image>
					<button class="btn width300" open-type="share" :data-data="info.share" @click="openShare">分享律师</button>
					<view :class="['btn flex hcenter flexcenter',!info.is_follow?'on':'off']" @click="onFollow()">
						<image src="/static/images/gz_icon2.png" class="width24" v-if="!info.is_follow" mode="widthFix"></image>
						<text :class="[!info.is_follow?'left8':'']">{{!info.is_follow?'关注':'已关注'}}</text>
					</view>
				</view>
				<view class="name flex hcenter">
					<text>{{info.nickname||''}}｜{{info.lawyer_grade_chinese||''}}</text>
					<image src="/static/images/bzjh_icon.png" v-if="info.is_guarantee" class="width48 left8" mode="widthFix"></image>
				</view>
				<view class="bottom12">
					<text class="font36 bold">{{info.statistics.order_number}}</text>
					<text class="color6E7695 left4">咨询</text>
					<text class="font36 bold left48">{{info.statistics.praise_number}}</text>
					<text class="color6E7695 left4">好评</text>
					<text class="font36 bold left48">{{info.statistics.fans_number}}</text>
					<text class="color6E7695 left4">粉丝</text>
				</view>
				<view class="bottom12" v-if="info.work_year">
					<view class="line1">
						<text class="bold">执业{{info.work_year}}年</text>
						<text class="color6E7695">｜</text>
						<text class="color6E7695 under" @click="openMap">{{info.lawyer_office}}</text>
					</view>
				</view>
				<view class="bottom12" v-if="info.license_number">
					<view class="line1">
						<text class="bold">执业证号</text>
						<text class="color6E7695">｜</text>
						<text class="color6E7695">{{info.license_number}}</text>
					</view>
				</view>
				<view class="flex" v-if="info.lawyer_tags.length">
					<text class="bold right24">擅长</text>
					<text class="tag" v-for="(item,index) in info.lawyer_tags" :key="index">{{item}}</text>
				</view>
				<view :class="['flex between service',info.is_guarantee?'active':'']" v-if="info.is_guarantee" @click="explainPop=true">
					<text>服务保障(已开通)丨</text>
					<text></text>
					<view class="flex hcenter">
						<image :src="info.is_guarantee?'/static/images/gx_icon_sel.png':'/static/images/gx_icon.png'" class="width24" mode="widthFix" />
						<text class="left4">诚信保障计划</text>
					</view>
					<view class="flex hcenter">
						<image :src="info.is_guarantee?'/static/images/gx_icon_sel.png':'/static/images/gx_icon.png'" class="width24" mode="widthFix" />
						<text class="left4">担保交易</text>
					</view>
				</view>
			</view>
			
			<view id="top0" class="marlr24 bottom32" v-if="!info.is_show_enable&&info.product">
				<view class="navTitle flex between hcenter">
					<view class="Name">
						<!-- <text v-if="isVip">会员折扣价</text> -->
						<text>{{ info.product.name  }}</text>
						<text v-if="info.product.price" class="colorFF6E57 left12">￥{{ info.product.price }}</text>
						<!-- <text class="colorFF6E57 left12">￥{{ isVip ? info.product.vip_price : info.product.price }}</text> -->
					</view>
				</view>
				<!-- <view class="bottom16" v-if="!isVip">
					<vipHint :title="`会员折扣价 ￥${info.product.vip_price}`"></vipHint>
				</view> -->
				<view class="line3">{{info.product.introduction}}</view>
				<view class="flex serveBox" v-if="info.products.length">
					<view class="serveItem center" v-for="(item,index) in info.products" :key="index" :style="{'background': item.color,'box-shadow': '0rpx 2rpx 12rpx '+item.shadow_color}" v-if="item.is_enable" @click="onService(index)">
						<view class="name">{{item.name}}</view>
						<view class="free">{{item.introduction}}</view>
					</view>
				</view>
			</view>
			
			<view class="comment" id="top2">
				<view class="tabsBox bottom32" id="tabs">
					<!-- #ifdef MP-KUAISHOU -->
					<u-tabs ref="tabs" height="80" active-color="#14284A" inactive-color="#6E7695" :show-bar="false" :list="tabs.list" :is-scroll="false" :current="tabs.index" @change="tabChange" :bar-style='{"backgroundColor":"#3764FF","marginBottom":"-4rpx"}'></u-tabs>
					<!-- #endif -->
					
					<!-- #ifndef MP-KUAISHOU -->
					<u-tabs ref="tabs" height="80" active-color="#14284A" inactive-color="#6E7695" :list="tabs.list" :is-scroll="false" :current="tabs.index" @change="tabChange" :bar-style='{"backgroundColor":"#3764FF","marginBottom":"-4rpx"}'></u-tabs>
					<!-- #endif -->
				</view>
				
				<view id="top1" class="intro" v-if="tabs.index==0">
					<view class="relative">
						<view class="marlr32 hidden">
							<text class="text">{{info.introduction.length>78&&!showAll?info.introduction.slice(0,78)+'...':info.introduction}}</text>
						</view>
						<view class="mode font28 bold" @click="mode" v-if="info.introduction.length>78">{{!showAll?'显示全部':'收起'}}</view>
					</view>
					<view class="null center" v-if="!info.introduction">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode=""></image>
						<view class="text">暂无数据</view>
					</view>
				</view>
				<view class="imgs" v-if="tabs.index==1">
					<view class="flex between marlr32">
						<image v-for="(item,index) in info.honor_certificates" :key="index" :src="item.image" @click="showImg(info.honor_certificates,index)" class="item2" mode="aspectFill"></image>
					</view>
					<view class="null center" v-if="!info.honor_certificates.length">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode=""></image>
						<view class="text">暂无数据</view>
					</view>
				</view>
				<view class="" v-if="tabs.index==2">
					<view class="relative item " v-for="(item,index) in comments" :key="index">
						<view class="flex hcenter between">
							<view class="flex hcenter" @click="toLink(`/my/client/heLookPage?id=${item.user_id}`)">
								<image :src="item.avatar" class="photo" mode="width"></image>
								<view class="left16">
									<view class="font28">{{item.nickname}}</view>
									<text class="font24 color6E7695">{{item.created_at}}</text>
								</view>
							</view>
							<view class="btn flex hcenter" v-if="item.score==1">
								<image src="/static/images/my_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">满意</text>
							</view>
							<view class="btn flex hcenter" v-else-if="item.score==2">
								<image src="/static/images/yb_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">一般</text>
							</view>
							<view class="btn flex hcenter" v-else-if="item.score==3">
								<image src="/static/images/bmy_icon.png" class="width30" mode="widthFix"></image>
								<text class="left4">不满意</text>
							</view>
						</view>
						<view class="text">{{item.content}}</view>
						<view class="flex" v-if="item.order_evaluate_reasons.length">
							<text class="tag" v-for="(item1,index1) in item.order_evaluate_reasons" :key="index1">{{item1}}</text>
						</view>
						<view class="">
							<text class="bold color6E7695">{{item.order_type}}</text>
						</view>
					</view>
					<view class="null center" v-if="comments.length<=0">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode=""></image>
						<view class="text">暂无数据</view>
					</view>
				</view>
				<view class="" v-else-if="tabs.index==3">
					<view v-for="(item,index) in answers" :key="index" class="item1" @click="toAskDetails(item.question_id)">
						<view class="marlr32">
							<view class="flex hcenter martop32" style="margin-bottom: 20rpx;">
								<image :src="item.avatar" mode="aspectFill" class="itemPhoto"></image>
								<view class="left20">
									<view class="itemName">{{item.nickname}}</view>
									<view class="time">{{item.created_at}}</view>
								</view>
							</view>

							<view class="pinglun">
								<view class="title line2">
									<text v-if="item.mode == 0">{{item.question_comment}}</text>
									<voicePlay noTranslate v-else :url="item.recording_file" :time="item.recording_duration" ></voicePlay>
								</view>
								<view class="article flex between hcenter ">
									<view class="content line1">原贴：{{item.question_title}}</view>
									<image src="/static/images/right.png" mode="widthFix" class="width14"></image>
								</view>
							</view>
						</view>

					</view>
					<view class="null center" v-if="answers.length<=0">
						<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" mode=""></image>
						<view class="text">暂无数据</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="bottom-btns">
			<!-- #ifndef MP-KUAISHOU -->
			<view class="icon" @click="toInfoDetail()">
				<image src="/static/images/sl_icon.png" class="width48" mode="widthFix"></image>
				<view class="bold">私聊</view>
			</view>
			<!-- #endif -->
			<view class="btn flex hcenter hidden">
				<view class="flex hcenter flexcenter flex1" @click="call">
					<image src="/static/images/zx_icon2.png" class="width48" mode="widthFix" />
					<text class="left16 bold" v-if="callInfo.status==1">免费咨询</text>
					<!-- #ifndef MP-KUAISHOU -->
					<text class="left16 bold" v-else-if="callInfo.status==2">深度咨询</text>
					<text class="left16 bold" v-else-if="callInfo.status==3">继续咨询</text>
					<text class="left16 bold" v-else>电话咨询</text>
					<!-- #endif -->
				</view>
				<!-- <view class="flex hcenter flexcenter flex1 blue" @click="toPay">
					<image src="/static/images/zf_icon.png" class="width48" mode="widthFix"></image>
					<text class="left16 bold">{{!isVip?'会员特价':'律师费'}}</text>
				</view> -->
			</view>
		</view>

		<u-popup v-model="explainPop" mode="bottom" border-radius="32">
			<view class="explainBox">
				<view class="title">该律师<text style="color: #FF4040;">{{info.is_guarantee?'已':'未'}}加入</text> 保障计划</view>
				<view class="text" v-for="(item,index) in explains" :key="index">
					<view class="h3 flex hcenter">
						<image :src="item.icon"></image>
						<text class="left12">{{item.title}}</text>
					</view>
					<text v-if="item.dec">{{item.dec}}</text>
					<text v-else>通过"百姓律师"与平台认证律师建立联系，后续产生任何法律服务交易<text style="color: #FF4040;">（不限于平台内或线下支付）</text>，经司法局、律协认定违规，平台将先行赔付已付律师费。\n仅限已加入<text style="color: #FF4040;">诚信保障计划</text>的律师，赔付上限不超过律师缴纳的保障金</text>
				</view>
				<view class="subBtn" @click="explainPop=false">我知道了</view>
			</view>
		</u-popup>
		<payBox ref="pay" :userId="id"></payBox>

		<storeBox ref="store" :info="info.products" :name="info.nickname" :userId="id" @change="setIndex"></storeBox>
	</view>
</template>

<script>
	import { getLawyerPage, getUserReplyList, getAttention, sendImUserLawyerCall, sendOrderCallPhone, getImCallDetail, getEvaluation } from "@/api/apis.js"
	import payBox from "../components/pay.vue" 
	import storeBox from "../components/lawyerStore2.vue"

	export default {
		components: {
			payBox,
			storeBox
		},
		data() {
			return {
				id:'',
				info:null,
				token:null,
				showAll:false,
				comments:[],
				answers:[],
				topId:'',
				tabs: {
					list: [
						{ name: '简介' }, 
						{ name: '荣誉墙' },
						{ name: 'ta的回答' },
						{ name: 'ta的回答' }
					],
					index:0
				},
				callInfo:null,
				page:[1,1],
				isTop:false,
				isVip:null,
				navData:null,
				shopIndex:0,
				shopTypeIndex:0,
				explainPop:false,
				explains:[{
						icon:'/static/images/bzj_icon.png',
						title:'诚信保障计划',
						dec:''
					},{
						icon:'/static/images/zzdb_icon.png',
						title:'资质担保',
						dec:'百姓律师通过严格的审查机制，承诺所有服务律师均拥有律师执业资质。'
					}
				],
				// scrollTop:null,
				// titleTop:null,
				// statusBarHeight:0
			}
		},
		onShareAppMessage(e) {
			return {
				title: this.info.share.title,
				path: this.info.share.wechat_mini_program.path,
				imageUrl:this.info.share.wechat_mini_program.cover_image
			}
			// if(e.from === 'button' && e.target.dataset.data){
			// 	const share = e.target.dataset.data
			// 	return {
			// 		title: share.title,
			// 		path: share.wechat_mini_program.path,
			// 		imageUrl:share.wechat_mini_program.cover_image
			// 	}
			// }else
			// 	return {
			// 		title:'百姓律师公益普法',
			// 		imageUrl:'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png'
			// 	}
			
		},
		// onPageScroll(e){
		// 	this.scrollTop=e.scrollTop
		// 	if(e.scrollTop>150){
		// 		this.isTop = true
		// 	}else{
		// 		this.isTop = false
		// 	}
		// },
		// onReachBottom(){
		// 	console.log('加载更多')
		// },
		onLoad(e) {
			console.log(e)
			this.id=e.id
			// this.$refs.tabs.init()
			// this.statusBarHeight=getApp().globalData.statusBarHeight
			// this.getLawyer(e.id)
			this.getComments();
			this.getAnswers();
		},
		onShow() {
			this.isVip=uni.getStorageSync('is_vip')
			this.token=uni.getStorageSync('token')
			if(!this.info)
				this.getLawyer(this.id)
			if(!this.callInfo&&this.token)
				this.getCallLawyer();
		},
		onReady() {
			// setTimeout(()=>{
			// 	this.getDivInfo()
			// },1500)
		},
		methods: {
			getLawyer(id){
				getLawyerPage({user_id:id}).then(res=>{
					if(res.data.code==0){
						console.log(res.data.data)
						this.info=res.data.data
						setTimeout(()=>{
							this.getDivInfo()
						},500)
					}
				})
			},
			getCallLawyer(){
				getImCallDetail({user_id:this.id}).then(res=>{
					if(res.data.code==0){
						this.callInfo=res.data.data
					}
				})
			},
			lower(){
				console.log('加载更多')
				if(this.tabs.index==2){
					this.getAnswers();
				}else if(this.tabs.index==3){
					this.getComments();
				}
			},
			scroll(e){
				// this.scrollTop=e.detail.scrollTop
				if(e.detail.scrollTop>150){
					this.isTop = true
				}else{
					this.isTop = false
				}
			},
			tabChange(e){
				console.log(e)
				this.tabs.index=e
				// this.$nextTick(()=>{
				// 	this.topId='top'+e
				// })
				// this.topId=''
			},
			getAnswers(){
				var data={
					user_id:this.id,
					page:this.page[0]
				}
				// if(this.page!=1) data.order_no=this.comments[this.comments.length-1].order_no
				getUserReplyList(data).then(res=>{
					if(res.data.code==0){
						this.answers=this.page[this.tabs.index]==1?res.data.data.data:this.answers.concat(res.data.data.data)
						if(res.data.data.data.length) this.page[this.tabs.index]++
					}
				})
			},
			getComments(){
				var data={
					user_id:this.id,
					page:this.page[1]
				}
				// if(this.page!=1) data.order_no=this.comments[this.comments.length-1].order_no
				getEvaluation(data).then(res=>{
					if(res.data.code==0){
						this.comments=this.page[this.tabs.index]==1?res.data.data.data:this.comments.concat(res.data.data.data)
						if(res.data.data.data.length) this.page[this.tabs.index]++
					}
				})
			},
			onService(index){
				this.shopIndex=index
				this.shopTypeIndex=0
				this.info.product=this.info.products[index].products[0]
				this.$refs.store.serviceIndex=index
				this.$refs.store.serviceTypeIndex=0
				this.$refs.store.show=true
			},
			showImg(urls,index){
				var list=[]
				for (var i = 0;i<urls.length;i++) {
					list.push(urls[i].image)	
				}
				this.previewImage(list,index)
			},
			previewImage(urls,index){
				uni.previewImage({
					current:index||0,
					urls: urls, 
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			setIndex(i,n){
				console.log(i,n)
				if(i==0){
					this.shopIndex=n
				}else{
					this.shopTypeIndex=n
				}
				this.info.product=this.info.products[this.shopIndex].products[this.shopTypeIndex]
			},
			toLink(e){
				uni.navigateTo({
					url:e
				})
			},
			call(){
				if(!this.callInfo)
					this.getCallLawyer();
				else
					this.callLawyer()
				
			},
			callLawyer(){
				if(!this.type) {
					if(this.callInfo.status==1){
						sendImUserLawyerCall({
							user_id:this.id
						}).then(res => {
							if(res.data.code==0){
								uni.makePhoneCall({ phoneNumber: res.data.data.mobile });
							}else{
								uni.$u.toast(res.data.message)
							}
						});
					} else if(this.callInfo.status==2){
						// this.shopIndex=0
						// this.shopTypeIndex=0
						// this.info.product=this.info.products[0].products[0]
						// this.$refs.store.serviceIndex=0
						// this.$refs.store.serviceTypeIndex=0
						this.$refs.store.show = true
					}else{
						// #ifndef MP-TOUTIAO
						sendOrderCallPhone({
							user_id:this.id,
							order_no:this.callInfo.order_no
						}).then(res => {
							if(res.data.code==0){
								uni.makePhoneCall({
									phoneNumber: res.data.data.mobile
								})
							}else{
								uni.$u.toast(res.data.message)
							}
						})
						// #endif

						// #ifdef MP-TOUTIAO
						uni.$u.toast('待开发')
						// #endif
					}
				}else{
					uni.$u.toast('律师不能咨询律师')
				}
			},
			toAskDetails(e) {
				console.log(e)
				uni.navigateTo({
					url: `/pagesV1/index/askDetails?id=${e}`
				})
			},
			toInfoDetail(){
				uni.navigateTo({
					url: `/pagesV1/info/infoDetails?id=${this.id}&name=${this.info.nickname}&type=${this.info.type}`
				})
				// if(this.isVip){
				// 	sendImDemandType({enterprise_demand_type_id:13}).then(res=>{
				// 		if(res.data.code==0){
				// 			uni.navigateTo({
				// 				url:`/pages/message/infoDetails?isGroup=1&info=${JSON.stringify(res.data.data)}`
				// 			})
				// 		}
				// 	})
				// }else{
				// 	getGroups({user_id:this.id}).then(res=>{
				// 		if(res.data.code==0){
				// 			uni.navigateTo({
				// 				url:`/pages/message/infoDetails?isGroup=1&info=${JSON.stringify(res.data.data)}`
				// 			})
				// 		}
				// 	})
				// }
				
			},
			// toBack(){
			// 	uni.navigateBack()
			// },
			
			openMap(){
				if(this.info.lawyer_office_point.lat&&this.info.lawyer_office_point.lng){
					uni.openLocation({
						latitude: this.info.lawyer_office_point.lat,
						longitude: this.info.lawyer_office_point.lng,
						success: function () {
							console.log('success');
						}
					});
				}else{
					uni.$u.toast('坐标获取失败')
				}
			},
			onFollow(){
				// if(this.info.is_followed){
				// 	setUnFollow({followed_user_id:this.id}).then(res=>{
				// 		if(res.data.code==0){
				// 			this.info.is_followed=0
				// 			uni.$u.toast('取消成功')
				// 		}
				// 	})
				// }else{
				// 	setFollow({followed_user_id:this.id}).then(res=>{
				// 		if(res.data.code==0){
				// 			this.info.is_followed=1
				// 			uni.$u.toast('关注成功')
				// 		}
				// 	})
				// }
				getAttention({
					type: this.info.is_follow ? 1 : 0,
					follow_user_id: this.id
				}).then(res => {
					if (!res.data.code) {
						this.info.is_follow = res.data.data.is_follow
						uni.$u.toast(res.data.data.is_follow?'关注成功':'取消关注成功')
					}
				
				})
			},
			openShare(){
				// this.sharePop=true
			},
			toPay(){
				console.log(this.isVip)
				if(this.isVip){
					this.$refs.pay.status=true
				}else{
					uni.navigateTo({
						url:'/my/payVip'
					})
				}
			},
			// getDivInfo(obj){
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query.select(obj).boundingClientRect(data => {
			// 		console.log(data)
			// 		this.titleTop=data.top+176||null;
			// 	}).exec();
			// },
			getDivInfo(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#navbar').boundingClientRect(data => {
				  console.log("得到布局位置信息" + JSON.stringify(data));
				  this.navData=data
				  console.log("节点离页面顶部的距离为" + data.top);
				}).exec();
			},
			mode(){
				this.showAll=!this.showAll
			}
		}
	}
</script>

<style lang="scss">
	.hide{
		opacity: 0;
		transition: 0.5s;
	}
	.show{
		opacity: 1;
		transition: 0.5s;
	}
	.srcollBox{
		height: calc(100vh - 180rpx);
		position: absolute;
		// top: 0;
		background-color: #fff;
		.h2{
			font-size: 34rpx;
			font-weight: 800;
			margin-left: 32rpx;
			margin-bottom: 24rpx;
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid #ECEFF4;
		}
	}
	.isTop{
		background-color: #fff;
	}
	.tabsBox{
		// width: 100%;
		// height: 80rpx;
		// position: fixed;
		// top: 68px;
		// left: 0;
		// z-index: 999;
		border-bottom: 1rpx solid #ECEFF4;
	}
	.minPhoto{
		width: 56rpx;
		height: 56rpx;
		border-radius: 100rpx;
	}
	// .bar {
	// 	position: fixed;
	// 	top: 0;
	// 	.minPhoto{
	// 		width: 56rpx;
	// 		height: 56rpx;
	// 		border-radius: 100rpx;
	// 	}
	// }
	
	.userBg {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		border-radius: 0rpx 0rpx 0rpx 80rpx;
		position: absolute;
		top: 0;
		// z-index: -1;
		image{
			// filter: blur(20rpx);
		}
	}
	
	.serveBox {
		margin-top: 24rpx;
		.free {
			font-size: 24upx;
			line-height: 36upx;
			color: #FFFFFF;
			opacity: 0.8;
			margin-top: 5upx;
		}
		.name {
			font-size: 30upx;
			font-weight: 500;
			line-height: 48upx;
			color: #FFFFFF;
			margin-top: 6upx;
			text-shadow: 0px 3upx 4upx rgba(13, 0, 196, 0.3);
		}
		image {
			margin: 30rpx 0 20rpx 0;
		}
		.serveItem {
			flex: 1;
			height: 100upx;
			border-radius: 16upx;
			margin-right: 16upx;
			&:last-child{
				margin-right: 0;
			}
		}
	}
	.navTitle {
		padding-left: 7upx;
		margin: 40upx 0 8rpx;
		.Name {
			font-size: 34upx;
			font-weight: bold;
			color: #222222;
			margin-bottom: 12upx;
			
		}
	}
	.cell {
		// height: 434rpx;
		margin: 60rpx 32rpx 0;
		background: linear-gradient(180deg, #F7F7F9 0%, #FFFFFF 100%);
		box-shadow: 0rpx 16rpx 24rpx rgba(0, 88, 203, 0.13);
		border-radius: 20rpx;
		padding: 40rpx 40rpx 12rpx 40rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
		.photo{
			width: 200rpx;
			height: 200rpx;
			margin-top: -100rpx;
			margin-bottom: 32rpx;
			border: 4rpx solid #FFFFFF;
			box-shadow: 0px 8rpx 16rpx rgba(0, 51, 146, 0.2);
			border-radius: 40rpx;
		}
		.btn{
			width: 160rpx;
			height: 72rpx;
			line-height: 72rpx;
			border: 2rpx solid #3764FF;
			border-radius: 100rpx;
			font-size: 30rpx;
			color: #3764FF;
			text-align: center;
			padding: 0;
			margin: 0;
			margin-bottom: 20rpx;
		}
		.on{
			color: #FFFFFF;
			background: #3764FF;
			border: 2rpx solid #3764FF;
		}
		.off{
			color: #FFFFFF;
			background: #B7BFD1;
			border: 2rpx solid #B7BFD1;
		}
		.name{
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.tag{
			color: #6E7695;
			height: 40rpx;
			font-size: 24rpx;
			padding: 3rpx 12rpx;
			background: #F7F7F9;
			border-radius: 8rpx;
			margin-right: 16rpx;
			margin-bottom: 12rpx;
		}
		.service{
			// width: 100%;
			height: 72rpx;
			line-height: 72rpx;
			font-size: 26rpx;
			color: #B7BFD1;
			// position: absolute;
			// bottom: 0;
			// left: 0;
			background: #F1F3FB;
			padding: 0 88rpx 0 40rpx;
			margin: 24rpx -40rpx -12rpx;
		}
		.active{
			color: #3764FF;
			background: #EEF5FF;
		}
		
	}
	.imgs .item2{
		width: calc(50% - 7rpx);
		height: 200rpx;
		border-radius: 8rpx;
		margin: 0 0 40rpx 0;
	}
	.intro{
		font-size: 32rpx;
		font-weight: 500;
		line-height: 56rpx;
		margin-bottom: 40rpx;
		.mode{
			color: #6E7695;
			position: absolute;
			bottom: 0;
			right: 32rpx;
			background-color: #fff;
		}
		.text{
			word-wrap: break-word;
		}
	}
	.comment{
		padding-bottom: 180rpx;
		.item{
			padding: 0 32rpx 28rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
			margin: 0 0 24rpx 32rpx;
		}
		.text{
			margin: 20rpx 0 16rpx;
		}
		.photo{
			width: 88rpx;
			height: 88rpx;
			border-radius: 12rpx;
		}
		.tag{
			color: #14284A;
			height: 48rpx;
			font-size: 28rpx;
			padding: 4rpx 18rpx;
			background: #F7F7F9;
			border-radius: 4rpx;
			margin-right: 16rpx;
			margin-bottom: 16rpx;
		}
		.null{
			padding-top: 80rpx;
		}
		
		
		.item1 {
			.pinglun {
				.article {
					.content {
						width: 80%;
						overflow: hidden;
					}
		
					background: #F3F5F8;
					border-radius: 8rpx;
					padding: 20rpx 24rpx;
					font-size: 28rpx;
					color: #888D98;
					margin: 20rpx 0 32rpx 0;
				}
		
				.title {
					font-size: 34rpx;
				}
		
			}
		
			.wenda {
				.imageBox {
					.image {
						width: 200rpx;
						height: 200rpx;
						margin-right: 12rpx;
						border-radius: 8rpx;
						margin-bottom: 12rpx;
					}
					
					margin-top: 28rpx;
				}
		
				.title {
					font-size: 34rpx;
				}
		
				margin-bottom: 32rpx;
			}
		
			.time {
				font-size: 24rpx;
				color: #888D98;
			}
		
			.itemPhoto {
				width: 88rpx;
				height: 88rpx;
				border-radius: 100rpx;
			}
		
			.itemName {
				font-size: 34rpx;
			}
			&:last-child{
				border-bottom: none;
			}
			border-bottom: 12rpx solid #f5f7fa;
		}
	}
	.explainBox{
		padding: 32upx 40upx 68upx;
		.title{
			text-align: center;
			margin-bottom: 36upx;
			font-size: 34upx;
			font-weight: bold;
			line-height: 54upx;
		}
		image{
			width: 50upx;
			height: 50upx;
		}
		.text{
			// width: calc(100% - 90upx);
			color: #888D98;
			font-size: 28upx;
			line-height: 36upx;
			margin-bottom: 30upx;
			margin-left: 4upx;
		}
		.h3{
			color: #222;
			font-size: 32upx;
			font-weight: bold;
			line-height: 42upx;
			margin-bottom: 14upx;
		}
		.subBtn{
			color: #fff;
			margin-top: 18upx;
			padding: 19upx 0;
			background: #FF4040;
			border-radius: 16upx;
			font-size: 36upx;
			line-height: 54upx;
			text-align: center;
		}
	}
	.foot {
		width: 100%;
		height: 180rpx;
		padding-bottom: 74rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		background-color: #fff;
		padding-bottom:constant(safe-area-inset-bottom) ;
		.icon{
			margin: auto;
			line-height: 28rpx;
		}
		.btn{
			width: 566rpx;
			color: #fff;
			font-size: 34rpx;
			height: 88rpx;
			line-height: 88rpx;
			background: #424864;
			border-radius: 16rpx;
			margin: auto 32rpx auto 0;
			position: relative;
			text-align: center;
			.blue{
				background: linear-gradient(135deg, #4F8FFF 0%, #2B69F9 100%);
			}
		}
	}
	.shareImg{
		width: 620rpx;
		height: 620rpx;
	}
	.uploadImg{
		width: 72rpx;
		height: 72rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		z-index: +1;
	}

	.bottom-btns {
		width: 100%;
		height: 180rpx;
		padding-bottom: 74rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		background-color: #fff;
		padding-bottom:constant(safe-area-inset-bottom) ;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 30rpx;
		.icon{
			margin: auto;
			line-height: 28rpx;
			margin-right: 30rpx;
		}
		.btn{
			flex: 1;
			color: #fff;
			font-size: 34rpx;
			height: 88rpx;
			line-height: 88rpx;
			background: #424864;
			border-radius: 16rpx;
			position: relative;
			text-align: center;
			.blue {
				background: linear-gradient(135deg, #4F8FFF 0%, #2B69F9 100%);
			}
		}
	}
</style>
