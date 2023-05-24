<template>
	<view class="content absolute">
		<view :class="['bar',isTop?'backfff':'']">
			<view :style="{'width':'100%','height':statusBarHeight+'px'}"></view>
			<view class="barStatus flex hcenter">
				<image src="/static/images/nav_fh_icon.png" class="width48" @click="toBack" mode="widthFix"></image>
				<!-- <view class="flex hcenter left32" v-if="isTop">
					<image :src="info.avatar" class="minPhoto" mode="aspectFill"></image>
					<text class="left16">{{info.nickname}}｜{{info.lawyer_grade_chinese}}</text>
					<image src="/static/images/bzjh_icon.png" v-if="info.is_guarantee" class="width32 left8" mode="widthFix"></image>
				</view> -->
			</view>
			<!-- <view class="title" style="border-bottom: none;margin-bottom: 0;" v-if="scrollTop>=titleTop">全部好评</view> -->
		</view>
		<view class="userBg">
			<image class="widthAll" :src="info.avatar" mode="widthFix"></image>
		</view>
		<view class="cell relative">
			<view class="flex hcenter between">
				<image :src="info.avatar" class="photo" mode="aspectFill"></image>
				<button class="btn on width300"  @click="openShare">立即咨询</button>
				<!-- <view :class="['btn',!info.is_followed?'on':'off']" @click="onFollow()">{{!info.is_followed?'关注':'已关注'}}</view> -->
			</view>
			<view class="name flex hcenter">
				<text>{{info.nickname||''}}｜{{info.lawyer_grade_chinese||''}}</text>
				<image src="/static/images/bzjh_icon.png" v-if="info.is_guarantee" class="width48 left8" mode="widthFix"></image>
			</view>
<!-- 			<view class="bottom12">
				<text class="font36 bold">{{info.order_number}}</text>
				<text class="color6E7695 left4">咨询</text>
				<text class="font36 bold left48">{{info.praise_number}}</text>
				<text class="color6E7695 left4">好评</text>
			</view> -->
			<view class="bottom12">
				<view class="line1">
					<text class="bold">{{info.province||''}}-{{info.city||''}}</text>
					<text class="color6E7695">｜</text>
					<!-- @click="openMap" -->
					<text class="color6E7695 under" >{{info.lawyer_office}}</text>
				</view>
			</view>
			<view class="flex" v-if="info.lawyer_tags.length">
				<text class="bold right24">擅长</text>
				<text class="tag" v-for="(item,index) in info.lawyer_tags" :key="index">{{item}}</text>
			</view>
			<!-- <view :class="['flex between service',info.is_guarantee?'active':'']">
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
			</view> -->
		</view>
		<view class="imgs" v-if="info.honor_certificates.length">
			<view class="title">荣誉墙</view>
			<view class="flex between marlr32">
				<image v-for="(item,index) in info.honor_certificates" :key="index" :src="item.image" class="item" mode=""></image>
			</view>
		</view>
		<view class="intro" v-if="info.introduction">
			<view class="title">律师简介</view>
			<view class="relative">
				<view class="marlr32 hidden">
					<text class="text">{{info.introduction.length>78&&!showAll?info.introduction.slice(0,78)+'...':info.introduction}}</text>
				</view>
				<view class="mode font28 bold" @click="mode" v-if="info.introduction.length>78&&!showAll">显示全部</view>
			</view>
		</view>
		<!-- <view class="comment">
			<view class="title" id="commentTitle">全部好评</view>
			<view class="relative item" v-for="(item,index) in comments" :key="index">
				<view class="flex hcenter between">
					<view class="flex hcenter">
						<image :src="item.avatar" class="photo" mode="width"></image>
						<view class="left16">
							<view class="font28">{{item.nickname}}</view>
							<text class="font24 color6E7695">{{item.created_at}}</text>
						</view>
					</view>
					<view class="btn flex hcenter" v-if="item.evaluate_score==1">
						<image src="/static/images/my_icon.png" class="width30" mode="widthFix"></image>
						<text class="left4">满意</text>
					</view>
					<view class="btn flex hcenter" v-if="item.evaluate_score==2">
						<image src="/static/images/yb_icon.png" class="width30" mode="widthFix"></image>
						<text class="left4">一般</text>
					</view>
					<view class="btn flex hcenter" v-if="item.evaluate_score==3">
						<image src="/static/images/bmy_icon.png" class="width30" mode="widthFix"></image>
						<text class="left4">不满意</text>
					</view>
				</view>
				<view class="text">{{item.evaluate}}</view>
				<view class="flex" v-if="info.order_evaluate_reasons.length">
					<text class="tag" v-for="(item1,index1) in item.order_evaluate_reasons" :key="index1">{{item1}}</text>
				</view>
				<view class="">
					<text class="bold color6E7695">#{{item.order_type_chinese}}#</text>
				</view>
			</view>
			<view class="null center" v-if="comments.length<=0">
				<image src="/static/images/kym_qsy_image.png" mode=""></image>
				<view class="text">暂无数据</view>
			</view>
		</view> -->
<!-- 		<view class="foot">
			<view class="btn flex hcenter">
				<image src="/static/images/zf_dt.png" class="bg" mode=""></image>
				<view class="left50" @click="toInfoDetail()">咨询律师</view>
				<view class="flex hcenter flexcenter" @click="toPay">
					<image src="/static/images/zf_icon.png" class="width48" mode="widthFix"></image>
					<text class="left16 bold">律师费</text>
				</view>
			</view>
		</view> -->
		<!-- <view class="popBg flex hcenter flexcenter" @click="sharePop = false" v-if="sharePop">
			<view class="relative" @click.stop="">
				<image src="/static/images/fx_image.png" class="shareImg"></image>
				<image src="/static/images/xz_icon2.png" class="uploadImg" @click="saveImg()"></image>
			</view>
		</view> -->
		<!-- <payBox ref="pay" :userId="id"></payBox> -->
	</view>
</template>

<script>
	import {
		getLawyerPage,
		// setFollow,
		// setUnFollow,
		// getGroups,
		// getEvaluation
	} from "@/apis/apis.js"
	// import payBox from "@/components/pay.vue"
	export default {
		components: {
			// payBox
		},
		data() {
			return {	
				sharePop:false,
				id:'',
				info:{},
				showAll:false,
				comments:[],
				page:1,
				isTop:false,
				scrollTop:null,
				titleTop:null,
				statusBarHeight:0
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
		onPageScroll(e){
			this.scrollTop=e.scrollTop
			if(e.scrollTop>150){
				this.isTop = true
			}else{
				this.isTop = false
			}
		},
		onReachBottom(){
			console.log('加载更多')
		},
		onLoad(e) {
			console.log(e)
			this.id=e.id
			this.statusBarHeight=getApp().globalData.statusBarHeight
			this.getLawyer(e.id)
			// this.getComments()
			// this.getDivInfo('#commentTitle')
		},
		methods: {
			getLawyer(id){
				getLawyerPage({user_id:id},{"X-Source-App":"2"}).then(res=>{
					if(res.data.code==0){
						console.log(res.data.data)
						this.info=res.data.data
					}
				})
			},
			// getComments(){
			// 	var data={
			// 		user_id:this.id
			// 	}
			// 	if(this.page!=1) data.order_no=this.comments[this.comments.length-1].order_no
			// 	getEvaluation(data).then(res=>{
			// 		if(res.data.code==0){
			// 			this.comments=this.page==1?res.data.data:this.comments.concat(res.data.data)
			// 			if(res.data.data.length) this.page++
			// 		}
			// 	})
			// },
			// toInfoDetail(){
			// 	getGroups({user_id:this.id}).then(res=>{
			// 		if(res.data.code==0){
			// 			uni.navigateTo({
			// 				url:`/pages/message/infoDetails?info=${JSON.stringify(res.data.data)}`
			// 			})
			// 		}
			// 	})
			// },
			toBack(){
				uni.navigateBack()
			},
			// openMap(){
			// 	if(this.info.lawyer_office_point.lat&&this.info.lawyer_office_point.lng){
			// 		uni.openLocation({
			// 			latitude: this.info.lawyer_office_point.lat,
			// 			longitude: this.info.lawyer_office_point.lng,
			// 			success: function () {
			// 				console.log('success');
			// 			}
			// 		});
			// 	}else{
			// 		uni.$u.toast('坐标获取失败')
			// 	}
			// },
			// onFollow(){
			// 	if(this.info.is_followed){
			// 		setUnFollow({followed_user_id:this.id}).then(res=>{
			// 			if(res.data.code==0){
			// 				this.info.is_followed=0
			// 				uni.$u.toast('取消成功')
			// 			}
			// 		})
			// 	}else{
			// 		setFollow({followed_user_id:this.id}).then(res=>{
			// 			if(res.data.code==0){
			// 				this.info.is_followed=1
			// 				uni.$u.toast('关注成功')
			// 			}
			// 		})
			// 	}
				
			// },
			openShare(){
				// this.sharePop=true
				window.location.href='https://h5.lawkd.com:12229/empty?type=2'
			},
			toPay(){
				this.$refs.pay.status=true
			},
			// saveImg(){
			// 	uni.saveImageToPhotosAlbum({
			// 		filePath:'/static/images/fx_image.png',
			// 		success:res=> {
			// 			console.log('保存成功')
			// 			this.sharePop=false
			// 			uni.showToast({
			// 				title: '已保存至相册,请前往分享吧',
			// 				icon: 'none',
			// 				duration: 3000
			// 			})
			// 		},
			// 		fail(e){
			// 			console.log(e)
			// 		}
			// 	})
			// },
			// getDivInfo(obj){
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query.select(obj).boundingClientRect(data => {
			// 		console.log(data)
			// 		this.titleTop=data.top+176||null;
			// 	}).exec();
			// },
			mode(){
				this.showAll=true
			}
		}
	}
</script>

<style>
	page{
		padding-bottom: 180rpx;
	}
	.isTop{
		background-color: #fff;
	}
	.bar {
		position: fixed;
		top: 0;
	}
	.bar .minPhoto{
		width: 56rpx;
		height: 56rpx;
		border-radius: 100rpx;
	}
	.title{
		font-size: 34rpx;
		font-weight: 800;
		margin-left: 32rpx;
		margin-bottom: 24rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #ECEFF4;
	}
	.userBg {
		width: 100%;
		height: 500rpx;
		overflow: hidden;
		border-radius: 0rpx 0rpx 0rpx 80rpx;
		position: absolute;
		top: 0;
		z-index: -1;
	}
	.userBg image{
		filter: blur(20rpx);
	}
	.cell {
		// height: 434rpx;
		margin: 260rpx 32rpx 0;
		background: linear-gradient(180deg, #F7F7F9 0%, #FFFFFF 100%);
		box-shadow: 0rpx 16rpx 24rpx rgba(0, 88, 203, 0.13);
		border-radius: 20rpx;
		padding: 40rpx 40rpx 0 40rpx;
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}
	.cell .photo{
		width: 200rpx;
		height: 200rpx;
		margin-top: -100rpx;
		margin-bottom: 32rpx;
		border: 2rpx solid #FFFFFF;
		box-shadow: 0px 8rpx 16rpx rgba(0, 51, 146, 0.2);
		border-radius: 40rpx;
	}
	.cell .btn{
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
	}
	.cell .on{
		color: #FFFFFF;
		background: #3764FF;
		border: 2rpx solid #3764FF;
	}
	.cell .off{
		color: #FFFFFF;
		background: #B7BFD1;
		border: 2rpx solid #B7BFD1;
	}
	.cell .name{
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.cell .tag{
		color: #6E7695;
		height: 40rpx;
		font-size: 24rpx;
		padding: 3rpx 12rpx;
		background: #F7F7F9;
		border-radius: 8rpx;
		margin-right: 16rpx;
		margin-bottom: 12rpx;
	}
	.cell .service{
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
		margin: 24rpx -40rpx 0;
	}
	.cell .active{
		color: #3764FF;
		background: #EEF5FF;
	}
	.imgs .item{
		width: calc(50% - 7rpx);
		height: 200rpx;
		border-radius: 8rpx;
		margin-bottom: 40rpx;
	}
	.intro{
		font-size: 32rpx;
		font-weight: 500;
		line-height: 56rpx;
		margin-bottom: 40rpx;
	}
	.intro .mode{
		color: #6E7695;
		position: absolute;
		bottom: 0;
		right: 32rpx;
		background-color: #fff;
	}
	.intro .text{
		word-wrap: break-word;
	}
/* 	.comment{
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
	}
	.foot{
		width: 100%;
		height: 180rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99;
		background-color: #fff;
		padding-bottom:constant(safe-area-inset-bottom) ;
		.btn{
			color: #fff;
			font-size: 34rpx;
			height: 88rpx;
			line-height: 88rpx;
			background: #424864;
			border-radius: 100rpx;
			margin: 18rpx 32rpx 0;
			position: relative;
			text-align: center;
			.left50{
				padding-left: 50rpx;
			}
			view{
				height: 100%;
				flex: 1;
				z-index: +1;
			}
			.bg{
				width: 320rpx;
				height: 88rpx;
				position: absolute;
				right: 0;
			}
		}
	} */
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
</style>
