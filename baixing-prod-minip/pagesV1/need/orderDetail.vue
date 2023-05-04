<template>
	<view class="info">
		<view class="marlr32">
			<view class="flex hcenter between bottom16" @click="toLink(`/my/client/heLookPage?id=${info.user.user_id}`)">
				<view class="flex hcenter">
					<view class="photo relative">
						<image :src="info.user.avatar" class="photo" mode=""></image>
					</view>
					<view class="left16">
						<text class="font30">{{info.user.nickname}}</text>
					</view>
				</view>
			</view>
			<view class="cell font32 flex hcenter between" v-if="info.is_lawyer_call_phone">
				<text class="color6E7695">电话沟通</text>
				<view class="btn flex hcenter" @click="call">
					<image src="/static/images/zx_icon2.png" class="width38" mode="widthFix"></image>
					<text class="left4 font30">拨打</text>
				</view>
			</view>
			<view class="cell font32 flex hcenter between" v-if="info.demand_type">
				<text class="color6E7695">需求类型</text>
				<view class="bold">{{info.demand_type||''}}</view>
			</view>
			<view class="cell font32 flex hcenter between">
				<text class="color6E7695">发布平台</text>
				<view class="bold">{{info.source_type_chinese}}</view>
			</view>
			<view class="cell font32 flex hcenter between">
				<text class="color6E7695">案件类型</text>
				<view class="bold">{{info.lawyer_tag}}</view>
			</view>
			<view class="cell font32 flex hcenter between">
				<text class="color6E7695">律师地域</text>
				<view class="bold">{{info.lawyer_address}}</view>
			</view>
			<view class="cell font32 flex hcenter between">
				<text class="color6E7695">期望报价</text>
				<view class="bold colorFE5C5C">{{info.price.value}}</view>
			</view>
			<view class="cell font32 flex hcenter between">
				<text class="color6E7695">发布时间</text>
				<view class="bold">{{info.created_at}}</view>
			</view>
			<view class="cell" style="height: auto;padding-bottom: 24rpx;" v-if="info.content||info.detention_slip_image">
				<view class="font32 relative flex hcenter martop24" v-if="info.content">
					<view class="hidden">
						<text class="color6E7695">需求说明:</text>
						<text class="text">{{info.content.length>78&&!showAll?info.content.slice(0,78)+'...':info.content}}</text>
					</view>
					<view class="mode font28 bold" @click="showAll=true" v-if="info.content.length>78&&!showAll">显示全文</view>
					<view class="mode font28 bold" @click="showAll=false" v-if="info.content.length>78&&showAll">收起</view>
				</view>
				<view class="imgBox flex hcenter martop24" v-if="info.detention_slip_image" @click="">
					<image :src="info.detention_slip_image" mode="aspectFill"></image>
				</view>
			</view>
			<view class="cell font32 flex between hcenter noborder" v-if="JSON.parse(info.case_money)">
				<text class="color6E7695">标的额</text>
				<text class="colorFE5C5C font32 bold">{{info.case_money}}元</text>
			</view>
		</view>
		<!-- <view class="fixedBox flex hcenter flexcenter" @click="toLink('/pagesV1/need/release')" v-if="userId!=info.user.user_id">
			<image src="/static/images/sr_icon2.png" class="width28" mode="widthFix"></image>
			<text class="left12 font34">发布订单</text>
		</view> -->
		
		<view class="list" v-if="info.process_type">
			<view class="title">律师报价</view>
			<view class="null center" v-if="!list.length">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" class="width200" mode="widthFix"></image>
				<view class="text">暂无律师参与报价</view>
				<!-- <view class="blueBtn width200 center" style="margin: 24rpx auto;" @click="appeal.show=true" v-if="info.process_type&&!info.is_creator">
					参与报价
				</view> -->
			</view>
			<view class="item" v-for="(item,index) in list">
				<view class="user flex hcenter between relative">
					<view class="flex hcenter">
						<view class="photoBox relative">
							<image :src="item.user.avatar" class="photo" mode="aspectFill"></image>
							<image src="/static/images/bzjh_icon.png" v-if="item.user.is_guarantee" class="icon" mode=""></image>
						</view>
						<view class="left16">
							<view class="flex hcenter">
								<text class="font30 bold">{{item.user.nickname}}</text>
								<view class="lawyerTag" v-if="item.user.work_year">执业{{item.user.work_year}}年</view>
							</view>
							<view class="color888D98 font24" v-if="item.user.lawyer_tags.length">
								擅于：<text class="tag left8" v-for="(item1, index1) in item.user.lawyer_tags" :key="index1">{{ item1 }}</text>
							</view>
						</view>
					</view>
					<view v-if="item.type!=2">
						<view class="" v-if="item.type==0">
							<view class="btn" v-if="item.status==0" @click="onLawyer(item.demand_lawyer_id,index,item.user.user_id)">选择</view>
							<view class="btn off" v-if="item.status==1">已选择</view>
						</view>
						<view class="" style="text-align: right;" v-if="item.type==1">
							<view class="colorFE5C5C font40">￥{{item.price}}</view>
							<text class="color888D98 font24">我的报价</text>
						</view>
					</view>
					<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662693632021-B0eSPr.png"  v-if="item.status==1" class="statusImg" mode="widthFix"></image>
					<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662693657422-wQYc37.png"  v-if="item.status==2" class="statusImg" mode="widthFix"></image>
				</view>
				<view class="text line3 relative" v-if="item.type!=2">
					<view class="hidden">
						<text class="">{{item.content.length>60&&!item.showAll?item.content.slice(0,60)+'...':item.content}}</text>
					</view>
					<view class="mode font26 bold" @click="mode(index)" v-if="item.content.length>60&&!item.showAll">显示全部</view>
					<view class="edit" v-if="item.type==1" @click="appeal.show=true">
						<image src="/static/images/sr_icon.png" class="width24" mode="widthFix"></image>
						<text class="left12 color6E7695">重新编辑</text>
					</view>
					 <!-- v-if="item.user.is_mine" -->
				</view>
				<view class="flex flexend link top20 color888D98" v-if="item.type!=2">
					
					<view class="flex between widthAll" v-if="item.type==0">
						<view class="">
							<text class="color888D98 font24">律师报价</text>
							<text class="colorFE5C5C bold">￥</text>
							<text class="colorFE5C5C font40">{{item.price}}</text>
						</view>
						<view class="flex">
							<view class="flex hcenter" @click="toImDetail(item.user.user_id)">
								<image src="/static/images/sx_icon4.png" class="width36" mode="widthFix"></image>
								<text class="left8">私信律师</text>
							</view>
							<view class="flex hcenter left48" @click="call(item.user.user_id)">
								<image src="/static/images/dh_icon3.png" class="width36" mode="widthFix"></image>
								<text class="left8">电话沟通</text>
							</view>
						</view>
					</view>
					<view class="flex hcenter between widthAll" v-if="item.type==1">
						<view class="flex hcenter" @click="">
							<image v-for="item1 in item.other_lawyers.avatars" :src="item1" class="avatar" mode="widthFix"></image>
						</view>
						<view class="flex hcenter left48" @click="">已有{{item.other_lawyers.number||0}}名律师参与竞标</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="foot font32 bold marlr32 center" v-if="list.length&&info.is_can_join&&info.process_type&&!info.is_creator" @click="appeal.show=true">
			<view class="">参与报价</view>
		</view>
		<u-popup v-model="appeal.show" mode="bottom" border-radius="32">
			<view class="addBox font30">
				<image src="/static/images/nav_tj_icon.png" class="colse" @click="appeal.show=false" mode=""></image>
				<view class="font34 bold center bottom60">输入竞标金额</view>
				<view class="inputBox flex">
					<text>￥</text>
					<input type="number" v-model="appeal.value" />
				</view>
				<view class="hint">发表下自己的观点吧，仅委托人可见</view>
				<view class="text flex top40 relative">
					<textarea maxlength="300" v-model="appeal.text" placeholder="填写合作内容" />
					<view class="numLen font26">({{appeal.text.length}}/300字)</view>
				</view>
				<view class="confirmBtn" @click="submit">确认发布</view>
			</view>
		</u-popup> -->
	</view>
		
</template>

<script>
	import {
		getNeedOrderDetail,
		getNeedOrderList,
		addNeedOrderList,
		sendLawyerChoose,
		sendOrderGrab,
		getOrderCall,
		// getGroups 
	} from "@/api/apis.js"
	import needListItem from "@/components/needListItem.vue"
	import addressBox from "@/components/address.vue"
	export default {
		components: {
			needListItem,
			addressBox
		},
		data() {
			return {
				id:'',
				info:{},
				list:[],
				userId:null,
				showAll:false,
				appeal:{
					show:false,
					index:0,
					value:'',
					text:''
				}
			}
		},
		methods: {
			toLink(url){
				uni.navigateTo({
					url:url
				})
			},
			getData(id){
				getNeedOrderDetail({demand_id:id}).then(res=>{
					if(res.data.code==0){
						this.info=res.data.data
					}else{
						uni.navigateBack()
						uni.$u.toast('获取数据失败')
					}
				})
			},
			getList(id){
				getNeedOrderList({demand_id:id}).then(res=>{
					if(res.data.code==0){
						this.list=!this.list.length?res.data.data:this.list.concat(res.data.data)
					}
				})
			},
			call(){
				getOrderCall({order_no:this.info.order_no,user_id:this.info.user.user_id}).then(res=>{
					if(res.data.code==0){
						uni.makePhoneCall({
							phoneNumber: res.data.data.mobile
						})
					}
				})
			},
			toImDetail(id,name){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${id}&name=${name}`
				})
				// getGroups({user_id:id}).then(res=>{
				// 	if(res.data.code==0){
				// 		uni.navigateTo({
				// 			url:`/pages/message/infoDetails?isGroup=1&info=${JSON.stringify(res.data.data)}`
				// 		})
				// 	}
				// })
			},
			grab(){
				sendOrderGrab({order_no:this.info.order_no}).then(res=>{
					if(res.data.code==0){
						uni.$u.toast('抢单成功')
						// this.getList(this.id);
						this.toInfoDetail()
					}
				})
			},
			toInfoDetail(){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${this.info.user.user_id}&name=${this.info.user.nickname}`
				})
			},
			// onLawyer(id,index,user){
			// 	sendLawyerChoose({demand_lawyer_id:id}).then(res=>{
			// 		if(res.data.code==0){
			// 			uni.$u.toast('选择成功')
			// 			this.list.map((item,idx)=>{
			// 				item.status=index==idx?1:2
			// 			})
			// 			this.toImDetail(user.user_id,user.nickname)
			// 			return
			// 		}
			// 		uni.$u.toast(res.data.message)
			// 	})
			// },
			submit(){
				addNeedOrderList({demand_id:this.id,price:this.appeal.value,content:this.appeal.text}).then(res=>{
					if(res.data.code==0){
						this.appeal.show=false
						if(this.list[0].type==2){
							this.list.unshift(res.data.data)
						}else{
							this.list[0]=res.data.data
						}
						uni.$u.toast('发布成功')
					}
				})
			}
			
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
		// onReachBottom(){
		// 	this.getList(this.id)
		// },
		onLoad(e) {
			this.id=e.id
			this.getData(e.id);
			this.getList(e.id);
		},
		onShow() {
			this.userId=uni.getStorageSync('user_id')
		}
	}
</script>

<style lang="scss">
	/deep/.u-progress{
		display: block !important; 
	}
	.null{
		padding-top: 20rpx;
	}
	.info{
		padding: 20rpx 0 28rpx;
		background-color: #fff;
		// border-bottom: 12rpx solid #F5F7FA;
		.photo{
			width: 80upx;
			height: 80upx;
			border-radius: 12rpx;
		}
		// .tag{
		// 	height: 36rpx;
		// 	background: #FFF4EA;
		// 	border: 1rpx solid #FFD7B4;
		// 	border-radius: 8rpx;
		// 	padding: 0 10rpx;
		// 	font-size: 26rpx;
		// 	line-height: 36rpx;
		// 	color: #FF9237;
		// }
		.cell{
			height: 93rpx;
			// padding-bottom: 24rpx;
			// margin-bottom: 24rpx;
			border-bottom: 1rpx solid #ECEFF4;
			.btn{
				padding: 0 21rpx;
				color: #fff;
				line-height: 64rpx;
				background: #3764FF;
				border-radius: 100rpx;
			}
		}
		.noborder{
			border-bottom: none;
		}
		.fixedBox{
			line-height: 88rpx;
			z-index: 999;
			// position: fixed;
			// bottom: 200rpx;
			margin: 8rpx 43rpx 0;
			color: #fff;
			background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
			box-shadow: 0rpx 6rpx 16rpx rgba(0, 35, 212, 0.32);
			border-radius: 44rpx;
			// image{
			// 	margin: auto;
			// }
			// .text{
			// 	color: #fff;
			// 	font-size: 24rpx;
			// 	padding: 0 15rpx;
			// 	line-height: 41rpx;
			// 	background: #3D6EFE;
			// 	border-radius: 100rpx;
			// }
		}
		.imgBox{
			image{
				width: 200rpx;
				height: 200rpx;
				border-radius: 8rpx;
			}
		}
		.foot{
			width: calc(100% - 64rpx);
			height: 88rpx;
			line-height: 88rpx;
			color: #FFFFFF;
			background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
			border-radius: 12rpx;
			position: fixed;
			bottom: 60rpx;
		}
		.mode{
			color: #6E7695;
			position: absolute;
			bottom: 0;
			right: 0;
			background-color: #fff;
		}
		.text{
			word-wrap: break-word;
		}
	}
	
	
	
	.list{
		background-color: #fff;
		border-top: 12rpx solid #F5F7FA;
		padding-bottom: 180rpx;
		.title{
			font-size: 36rpx;
			line-height: 50rpx;
			font-weight: bold;
			padding: 28rpx 0 20rpx 32rpx;
			border-bottom: 1rpx solid #ECEFF4;
		}
		.item{
			padding: 28rpx 32rpx 20rpx;
			border-bottom: 12rpx solid #F5F7FA;
			.text{
				height: 180rpx;
				line-height: 48rpx;
				padding: 20rpx;
				background: #F3F5F8;
				border-radius: 8rpx;
			}
			.mode{
				color: #677592;
				position: absolute;
				bottom: 20rpx;
				right: 20rpx;
				background-color: #F3F5F8;
			}
			.edit{
				width: calc(100% - 40rpx);
				text-align: center;
				position: absolute;
				bottom: 0;
			}
			.link{
				padding-top: 24rpx;
				border-top: 1rpx solid #ECEFF4;
			}
			.avatar{
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				margin-left: -15rpx;
				border: 1rpx solid #fff;
			}
		}
		.user{
			padding: 20rpx 0 16rpx;
			.photo{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}
			.tag{
				height: 28rpx;
				line-height: 28rpx;
				padding: 0 10rpx;
				color: #99A0AC;
				font-size: 20rpx;
				border: 1rpx solid #C9CED9;
				border-radius: 8rpx;
				margin-top: 4rpx;
			}
			.status{
				height: 36rpx;
				line-height: 36rpx;
				font-size: 26rpx;
				padding: 0 11rpx;
				border-radius: 8rpx;
			}
			.statusImg{
				width: 98rpx;
				height: 98rpx;
				position: absolute;
				right: 24rpx;
				z-index: +1;
			}
			.btn{
				height: 48rpx;
				font-size: 26rpx;
				line-height: 48rpx;
				color: #FFFFFF;
				background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
				border-radius: 100rpx;
				padding: 0 34rpx;
			}
			.off{
				color: #14284A;
				background: #F3F5F8;
			}
			.icon{
				width: 42rpx;
				height: 42rpx;
				position: absolute;
				right: -8rpx;
				bottom: -8rpx;
			}
			.yellow{
				color: #FF9237;
				background: #FFF4EA;
				border: 1rpx solid #FFD7B4;
			}
			.gray{
				color: #B7BFD1;
				background: #FCFCFC;
				border: 1rpx solid #B7BFD1;
			}
			.blue{
				color: #3764FF;
				background: #EAEFFF;
				border: 1rpx solid #B4C5FF;
			}
		}
	}
	// .addBox{
	// 	padding: 36rpx 36rpx 64rpx;
	// 	.colse{
	// 		width: 48rpx;
	// 		height: 48rpx;
	// 		position: absolute;
	// 		top: 36rpx;
	// 		right: 36rpx;
	// 	}
	// 	.hint{
	// 		height: 36rpx;
	// 		line-height: 36rpx;
	// 		padding: 0 24rpx;
	// 		background: #FEEEE7;
	// 		border-radius: 8rpx;
	// 		font-size: 24rpx;
	// 		color: #FF7639;
	// 		display: inline-block;
	// 	}
	// 	.text{
	// 		height: 240rpx;
	// 		background: #F5F7FA;
	// 		border-radius: 8rpx;
	// 		padding: 28rpx 32rpx;
	// 		margin-bottom: 64rpx;
	// 		textarea{
	// 			width: 100%;
	// 			height: 100%;
	// 		}
	// 	}
	// 	.numLen{
	// 		color: #B7BFD1;
	// 		position: absolute;
	// 		bottom: 28rpx;
	// 		right: 32rpx;
	// 	}
	// 	.inputBox{
	// 		height: 97rpx;
	// 		padding-bottom: 16rpx;
	// 		border-bottom: 1rpx solid #ECEFF4;
	// 		margin-bottom: 20rpx;
	// 		font-size: 50rpx;
	// 		line-height: 120rpx;
	// 		input{
	// 			width: calc(100% - 60rpx);
	// 			height: 97rpx;
	// 			font-size: 80rpx;
	// 			line-height: 97rpx;
	// 		}
	// 	}
	// 	.confirmBtn{
	// 		border-radius: 8rpx;
	// 		background: #3764FF;
	// 		box-shadow: none;
	// 	}
	// }
	
	// .box{
	// 	.cell{
	// 		padding: 24rpx;
	// 		margin-bottom: 28rpx;
	// 		background: #F1F4F9;
	// 		border-radius: 8rpx;
	// 		input{
	// 			height: 40rpx;
	// 			line-height: 40rpx;
	// 			padding: 0 12rpx;
	// 			border-left: 1rpx solid #B2C2DB;
	// 			margin-left: 24rpx;
	// 		}
	// 	}
	// 	.textBox{
	// 		height: 160rpx;
	// 		font-size: 32rpx;
	// 		margin: 28rpx 0;
	// 		background: #F1F4F9;
	// 		position: relative;
	// 		textarea{
	// 			width: 100%;
	// 			height: 100%;
	// 		}
	// 	}
	// }
	
	
	
	// .foot{
	// 	padding-bottom: 68rpx;
	// 	.btn{
	// 		height: 100rpx;
	// 		line-height: 100rpx;
	// 		border-radius: 32rpx;
	// 		color: #fff;
	// 		background: #0061FF;
	// 		box-shadow: 0rpx 12rpx 32rpx rgba(9, 58, 255, 0.4);
	// 		margin: 32rpx 75rpx 0;
	// 	}
	// }
</style>
