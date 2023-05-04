<template>
	<view>
		<view class="marlr32 bottom20">
			<view class="status">{{info.status_chinese}}</view>
			<view class="backfff navbox">
				<view class="pad28 nav">
					<view class="title">感谢您对百姓律师的信任,期待再次光临</view>
					<view class="martop20">
						<u-row gutter="16">
							<u-col span="3" v-for="(item,index) in info.buttons" :key="index" class="item" @click="btnClick(item.click,index)">
								<view class="center">
									<image :src="item.icon" mode="widthFix"></image>
									<view class="font24">{{item.name}}</view>
								</view>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
		</view>
		<view class="flex between NameBox hcenter backfff bottom12" v-if="info.user.user_id">
			<view class="flex hcenter">
				<view class="relative">
					<image :src="info.user.avatar || 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502222227-96HA03.png'" mode="aspectFit" class="photo"></image>
					<image src="/static/images/rzbs_icon.png" mode="widthFix" class="v" v-if="info.type"></image>
				</view>
				<view class="left16">
					<view class="name">{{info.user.nickname||'获取失败'}}</view>
					<view class="font24 colorFE5C5C">{{info.user.source_type_chinese||'获取失败'}}</view>
				</view>
			</view>
			<view class="flex chat hcenter flexcenter" @click="toImDetail(info.user.user_id,info.user.nickname)">
				<image src="/static/images/ll_icon.png" mode="widthFix"></image>
				<view class="text">私聊</view>
			</view>
		</view>
		<view class="backfff martop12 hidden" style="padding-bottom: 32rpx;">
			<view class="marlr32 infoList" v-for="(item, index) in info.fields" :key="index">
				<view v-if="(item.type!=2&&item.value)||(item.type==2&&item.value.value)" class="flex between orderNum">
					<view class="title">{{item.title}}</view>
					<view class="flex">
						<view class="num" :style="{color:item.value_color}">{{item.type==2?item.value.address:item.value}}</view>
						<view class="copy" v-if="item.type==1&&item.value" @click="copy(item.value)">复制</view>
						<view class="copy" v-if="item.type==2&&item.value.address" @click="toMap(item.value)">导航</view>
					</view>
				</view>
			</view>

			<view class="marlr32 infoList" v-if="info.related_images.length">
				<view class="orderNum">
					<view class="title">相关图片</view>
					<view class="imgBox martop32">
						<u-row gutter="16">
							<u-col span="3" v-for="(item,index) in info.related_images" :key="index" class="item">
								<image :src="item" class="widthAll" mode="widthFix" @click="previewImage(info.related_images,index)"></image>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view class="marlr32 infoList">
				<view class="flex between orderNum">
					<view class="title">用户评价</view>
					<view class="flex hcenter" v-if="info.evaluate.evaluate_score==0">
						<image src="/static/images/my_icon.png" mode="widthFix" class="emoji"></image>
						<view class="num">满意</view>
					</view>
					<view class="flex hcenter" v-else-if="info.evaluate.evaluate_score==1">
						<image src="/static/images/yb_icon_sely.png" mode="widthFix" class="emoji"></image>
						<view class="num">一般</view>
					</view>
					<view class="flex hcenter" v-else-if="info.evaluate.evaluate_score==2">
						<image src="/static/images/bmy_icon.png" mode="widthFix" class="emoji"></image>
						<view class="num">不满意</view>
					</view>
					<view class="flex hcenter" v-else>
						<view class="">未评价</view>
					</view>
				</view>
				<view class="textarea">
					<view>{{info.evaluate.evaluate||'暂无'}}</view>
				</view>
				<view class="textarea martop20" v-for="(item,index) in info.evaluate.comments" :key="index">
					<view>{{item.content}}</view>
				</view>
			</view>
			
		</view>
		<view class="audioTitle" v-if="records.length">律师录音视频文件</view>
		<view class="audioItem backfff" v-for="(item,index) in records" :key="index">
			<view class="marlr32">
				<view class="header flex between hcenter">
					<view class="flex hcenter">
						<image :src="item.user.avatar" mode="aspectFill"></image>
						<view class="left16">
							<view class="name">{{item.user.nickname}}</view>
							<view class="year">{{item.user.work_year}}年执业律师</view>
						</view>
					</view>
					<view :class="[item.user.is_follow?'':'active','follow','flex','flexcenter','hcenter']" @click="setFollow(item.user.is_follow,item.user.user_id,index)">{{item.user.is_follow?'已关注':'关注'}}</view>
				</view>
				<view class="flex">
					<voicePlay class="audio" :url="item.record.recording_file" :time="item.record.recording_duration"></voicePlay>
				</view>
				<view class="end">{{item.created_at}}</view>
			</view>
		</view>
		<u-popup v-model="appeal.show" mode="bottom" border-radius="32">
			<view class="addBox font30">
				<image src="/static/images/nav_tj_icon.png" class="colse" @click="appeal.show=false" mode=""></image>
				<view class="font40 bold center bottom32">我要申诉</view>
				<view class="text flex martop24">
					<textarea v-model="appeal.value" placeholder="请输入您要申诉的理由" />
				</view>
				<view class="confirmBtn" @click="sendAppeal">申诉</view>
			</view>
		</u-popup>
		<u-picker v-model="dateInfo.status" mode="time" :params="dateInfo.params" @confirm="dateChange"></u-picker>
		<evaluate ref="evaluate" :orderNo="order_no" :isFrom="2" @evaluateOver="evaluateOver" @clickEvaluateLabie="clickEvaluateLabie"></evaluate>
	</view>
</template>

<script>
	import {
		setOrderComment,
		getOrderCall,
		getOrderDetails,
		setCancelOrder,
		getOrderRecords,
		setRemindlOrder,
		setSubmitOrder,
		getOrderList,
		getAttention,
		getNoComment,
		getCustomerGroup,
		sendOrderTimeSubmit,
		getGroups
	} from "@/api/apis.js"
	let audio = uni.createInnerAudioContext();
	import{jumpToUrl}from "@/common/util.js"
	import evaluate from "@/components/evaluate.vue"
	
	export default {
		components: {
			evaluate
		},
		data() {
			return {
				info: {},
				url:'',
				records:[],
				order_no:'',
				dateInfo:{
					status:false,
					order_no:'',
					params: {
						year: true,
						month: true,
						day: true,
						hour: true,
						minute: false,
						second: false
					}
				},
				appeal:{
					show:false,
					index:0,
					text:''
				},
				nav: {
					list: [{
							icon: '/static/images/lxkf_icon.png',
							text: '联系客服'
						},
						{
							icon: '/static/images/pjls_icon.png',
							text: '评价律师'
						},
						{
							icon: '/static/images/zlyd_icon.png',
							text: '再次咨询'
						}
					]
				}
			}
		},
		methods: {
			evaluateOver(){
				this.getOrderDetails(this.order_no)
			},
			clickEvaluateLabie(index) { //点击评论组件
				this.orderInfo.reasons[index].status = !this.orderInfo.reasons[index].status
				this.$store.commit("setOrderInfo",this.orderInfo)
			},
			previewImage(urls,index){
				uni.previewImage({
					current: index||0,
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
			// clickAudio(status, index) {
			// 	let audioApi = this.records[index]
			// 	console.log(status,index)
			// 	if (status) {
			// 		audio.pause();
			// 		audioApi.startTime = audio.currentTime
			// 		audioApi.status = false
			// 	} else {
			// 		audio.src = audioApi.record.recording_file;
			// 		audio.seek(audioApi.record.recording_duration);
			// 		audio.play()
			// 		audioApi.status = true
			// 		this.records.forEach((item1, index1) => {
			// 			if (index1 != index) {
			// 				item1.status = false
			// 			}
			// 		})
			// 	}
			// },
			setFollow(is, id, index) {
				getAttention({
					type: is,
					follow_user_id: id
				}).then(res => {
					if (!res.data.code) {
						this.$set(this.records[index].user, "is_follow", res.data.data.is_follow)
					}
				})
			},
			copy(id) {
				uni.setClipboardData({
					data: id,
					success: function() {
						console.log('success');
					}
				});
			},
			toMap(e){
				if(e.lat&&e.lng){
					uni.openLocation({
						latitude: e.lat,
						longitude: e.lng,
						success: function () {
							console.log('success');
						}
					});
				}else{
					uni.$u.toast('坐标获取失败')
				}
			},
			toImDetail(id,name){
				// getGroups({user_id:this.info.user.user_id}).then(res=>{
				// 	if(res.data.code==0){
						uni.navigateTo({
							url:`/pagesV1/info/infoDetails?id=${id}&name=${name}`
						})
					// }
				// })
			},
			btnClick(type,index1) {
				switch (type) {
				    case 'cancelOrder': //取消订单
				        setCancelOrder({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('取消成功')
								this.info.buttons[index1].click=""
								this.info.buttons[index1].style="gray"
								// console.log(this.item.buttons[index1].click)
								// var item=this.item.buttons[index1]
								// item.click=""
								// this.$set(this.item.buttons,index1,item)
								// console.log(this.item.buttons[index1].click)
								this.$emit('change',this.index,index1)
							}
						})
				        break;
					case 'lawyerCorporateOrderDetail'://跳转到律律合作详情
						console.log(this.info)
						uni.navigateTo({
							url:`/pages/need/orderDetail?id=${this.info.demand_id}`
						})
						break;
					case 'remindLawyerSubmit'://提醒律师确认交付
						setRemindlOrder({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								// this.item.order_no
								this.info.buttons[index1].click=""
								this.info.buttons[index1].style="borderGray"
							}
						})
						break;
					case 'lawyerSubmitOrder'://律师确认交付
						setSubmitOrder({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('交付成功')
							}
						})
						break;
					case 'userSubmitOrder'://用户确认订单
						setSubmitOrder({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('交付成功')
							}
						})
						break
					case 'remindUserSubmit'://提醒用户确认订单
						setRemindlOrder({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								// this.info.order_no
								this.info.buttons[index1].click=""
								this.info.buttons[index1].style="borderGray"
							}
						})
						break;
					case 'orderEvaluate'://评价订单
						// getNoComment().then(res => {
						// 	if (res.data.data.length) {
						// 		res.data.data[0].istop = true
						// 		res.data.data[0].reasons.forEach((item, index) => {
						// 			item.status = false
						// 		})
						// 		this.$set(this, "orderInfo", res.data.data[0])
						// 		this.$store.commit("setOrderInfo",res.data.data[0])
						// 		this.$store.commit("setOrderStatus", true)
						// 	}
						// })
						// this.$store.commit("setOrderInfo",res.data.data[0])
						// this.$store.commit("setOrderStatus", true)
						this.$refs.evaluate.show=true
						break;
					case 'remindOrderEvaluate'://提醒评价订单
						setOrderComment({order_no:this.order_no}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('提醒成功')
								this.info.buttons[index1].click=""
								this.info.buttons[index1].style="borderGray"
							}
						})
						break;
					case 'orderDetail'://去订单详情页面
						uni.navigateTo({
							url:'/pages/order/detail?id='+this.info.order_no
						})
						break;
					case 'orderEvaluateComplaint'://订单申诉
						this.appeal.show=true
						break;
				
					case 'dueTimeSetting'://设置交付时间
						this.dateInfo.status=true
						break;
					case 'orderCallPhone'://订单拨打电话
						getOrderCall({order_no:this.order_no,user_id:this.info.user.user_id}).then(res=>{
							if(res.data.code==0){
								uni.makePhoneCall({
									phoneNumber: res.data.data.mobile
								})
							}
						})
						break;
					case 'userAgreeDueTime'://用户同意交付时间
						sendOrderTimeSubmit({order_no:this.order_no,is_agree:1}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('确认成功')
							}
						})
						break;
					case 'userDisagreeDueTime'://用户不同意交付时间
						sendOrderTimeSubmit({order_no:this.order_no,is_agree:0}).then(res=>{
							if(res.data.code==0){
								uni.$u.toast('拒绝成功')
							}
						})
						break;
					case 'demandOrderDetail'://跳转到需求订单详情
						uni.navigateTo({
							url:`/pagesV1/need/orderDetail?id=${this.info.demand_id}`
						})
						break;
					case 'lawyerList'://跳转律师列表
						uni.switchTab({
							url:`/pages/v1/find`
						})
						break;
				    default:
				        break;
				}
				jumpToUrl(type,this.info.demand_id)
				return
				
			},
			dateChange(e){
				console.log(e)
				sendOrderTime({
					order_no:this.dateInfo.order_no,
					due_at:e.year+'-'+e.month+'-'+e.day+' '+e.hour
				}).then(res=>{
					if(res.data.code==0){
						uni.$u.toast('设置成功')
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			sendAppeal(){
				setOrderComplaint({order_no:this.item.order_no,reason:this.appeal.value}).then(res=>{
					if(res.data.code==0){
						this.appeal.show=false
						this.appeal.value=''
						// this.list[this.appeal.index].is_need_complaint=0
						uni.$u.toast('申诉成功')
					}
				})
			},
			getOrderDetail(id) {
				getOrderDetails({
					order_no: id
				}).then(res => {
					if(res.data.code==0){
						this.info=res.data.data
					}else{
						uni.navigateBack()
						uni.$u.toast('获取数据失败')
					}
					// res.data.data.records.forEach((item, index) => {
					// 	this.$set(item, "status", false);
					// 	this.$set(item, "startTime", 0);
					// })
					// this.$set(this, 'info', res.data.data);
					// console.log(this.info.records)
				})
			},
			getOrderRecords(id){
				getOrderRecords({order_no:id,ali_hidden_call_id:this.records.length?this.records[this.records.length-1].ali_hidden_call_id:''}).then(res=>{
					if(res.data.code==0){
						this.records=res.data.data
					}
				})
			}
		},
		onLoad(e) {
			console.log(e.id)
			this.order_no=e.id
			this.url=this.$photoPath
			this.getOrderDetail(e.id)
			this.getOrderRecords(e.id)
			

		}
	}
</script>

<style lang="scss">
	.audioItem {
		.end {
			font-size: 24rpx;
			color: #888D98;
			margin-top: 16rpx;
		}

		.active {
			.time {
				color: #FFFFFF !important;
			}

			background: #0061FF !important;
		}

		.audio {
			.time {
				color: #979EB3;
				margin-left: 16rpx;
			}

			image {
				width: 65rpx;
				margin-left: 20rpx;
			}

			margin-top: 40rpx;
			width: 240rpx;
			height: 60rpx;
			background: #F3F5F8;
			border-radius: 0px 24rpx 24rpx 24rpx;
		}

		.header {
			.active {
				box-sizing: border-box;
				border: 2rpx solid #0061FF;
				color: #0061FF !important;
				background-color: #FFFFFF !important;
			}

			.follow {
				width: 142rpx;
				height: 64rpx;
				background: #E8EEF6;
				border-radius: 100rpx;
				font-size: 28rpx;
				color: #AEB7C8;
			}

			.year {
				font-size: 28rpx;
				color: #222222;
			}

			.name {
				font-size: 34rpx;
				font-weight: bold;
				color: #222222;
			}

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 100px;
			}
		}

		padding: 40rpx 0 32rpx 0;
		border-bottom: 12rpx solid #F5F7FA;
	}

	.audioTitle {
		padding: 12rpx 32rpx;
		font-size: 30rpx;
		color: #888D98;
	}

	.textarea {
		// textarea {
		// 	width: 100%;
		// 	margin: 0 20rpx;
		// 	padding: 20rpx 0;
		// }
		padding: 20rpx;
		width: 100%;
		height: 160rpx;
		background: #F3F5F8;
		border-radius: 8rpx;
	}

	.infoList:last-child {
		.orderNum {
			border-bottom: none;
		}
	}

	.infoList {
		.orderNum {
			.emoji {
				width: 34rpx;
				margin-right: 8rpx;
			}

			.copy {
				font-size: 32rpx;
				color: #0061FF;
				margin-left: 40rpx;
			}

			.num {
				font-size: 32rpx;
				color: #222222;
			}

			.title {
				font-size: 32rpx;
				color: #222222;
			}

			padding: 32rpx 0;
			border-bottom: 1px solid #ECEFF4;
		}
	}

	.NameBox {
		.chat {
			.text {
				font-size: 28rpx;
				color: #FFFFFF;
				margin-left: 12rpx;
			}

			image {
				width: 28rpx;
			}

			width: 152rpx;
			height: 64rpx;
			background: #0061FF;
			border-radius: 8rpx;
		}

		.year {
			background: linear-gradient(270deg, #EBCDA1 0%, #E3C396 100%);
			border-radius: 4rpx 4rpx 16rpx 4rpx;
			padding: 2rpx 11rpx;
			margin-left: 12rpx;
		}

		.name {
			font-size: 34rpx;
			font-weight: bold;
			color: #222222;
		}

		.photo {
			width: 100rpx;
			height: 100rpx;
			border-radius: 20rpx;
		}

		.v {
			width: 32rpx;
			position: absolute;
			right: 0;
			bottom: 0;
		}

		padding: 40rpx 32rpx;
	}

	.navbox {
		.nav {
			.item {
				image {
					width: 60rpx;
					margin: auto;
				}
			}

			margin-top: 32rpx;

			.title {
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #ECEFF4;
			}
		}

		box-shadow: 0px 4rpx 20rpx rgba(155, 162, 185, 0.2);
		border-radius: 8rpx;
	}


	.pad28 {
		padding: 28rpx;
	}

	.status {
		font-size: 40rpx;
		font-weight: bold;
		color: #222222;
	}

	page {
		background-color: #F5F7FA;
	}
	
	.addBox{
		padding: 36rpx 36rpx 80rpx;
		.colse{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 36rpx;
			right: 36rpx;
		}
		.text{
			height: 240rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 28rpx 32rpx;
			margin-bottom: 36rpx;
			textarea{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
