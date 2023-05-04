<template>
	<view v-if="info">
		<u-popup v-model="show" mode="bottom" negative-top="100" closeable border-radius="32" safe-area-inset-bottom @close="onClose">
			<view style="height: auto;overflow: hidden;">
				<view class="evaluate marlr32">
					<view class="status center">{{info.istop?'请评价完上一个订单':'订单已完成,请评价服务'}}</view>
					<view class="flex between hcenter martop36">
						<view class="flex hcenter">
							<view class="relative">
								<image :src="info.avatar" mode="aspectFill" class="photo"></image>
								<image src="/static/images/rzbs_icon.png" mode="" class="v"></image>
							</view>
							<view class="left20">
								<view class="name">{{info.nickname}}</view>
								<view  v-if="info.type==11||info.order_type_number  ">
									<view class="orderNum flex">
										订单类型:<text class="bold" v-if="info.type!=11">{{info.product.lawyer_product_category}}-{{info.product.lawyer_product}}</text>
										<text class="bold" v-else>{{info.type_chinese}}</text>
									</view>
									<view class="orderNum flex">订单价格:<text class="bold orange">{{info.price?info.price:info.money}}</text></view>
								</view>
								<view v-else>
									<view class="orderNum flex">
										订单编号:<text class="bold">{{orderNo&&orderNo.length>15?orderNo.slice(0,14)+'...':orderNo}}</text>
									</view>
									<view class="orderNum flex">下单时间:<text class="bold">{{info.created_at}}</text></view>
								</view>
							</view>
						</view>
						<view class="flex hcenter" v-if="isFrom!==2">
							<view class="look">查看</view>
							<image src="../static/images/right.png" mode="widthFix" class="width14 left8"></image>
						</view>
					</view>
					<!-- <image src="../static/images/zxsf_txt.png" mode="widthFix" class="col100 martop24" v-if="!info.order_type_number && info.type != 11"></image>
					<view class="flex around" v-if="!info.order_type_number && info.type != 11">
						<view v-for="(item,index) in have.list" :key="index" :class="['have',index==have.index?'haveActive':'']" @click="clickHave(index)">
							{{item}}
						</view>
					</view> -->
				</view>
				<u-gap height="12" bg-color="#f5f7fa"></u-gap>
				<view class="marlr32">
					<view class="evaText center">您有一条电话订单已完成,请对律师的服务评价</view>
					<view class="flex around emoji">
						<view v-for="(item,index) in emoji.list" :key="index" class="center" @click="clickEmoji(index)">
							<image :src="index==emoji.index?item.imageA:item.image" mode="widthFix"></image>
							<view :class="['emojiName',index==emoji.index?'nameA':'']">{{item.text}}</view>
						</view>
					</view>
					<view class="flex labelBox">
						<view v-for="(item,index) in info.reasons" :key="index" v-if="emoji.index + 1 == item.type" :class="['label',item.status?'labelActive':'']"
						 @click="clickLabel(index)">
							{{item.order_evaluate_reason}}
						</view>
					</view>
					<view class="textarea">
						<!-- <textarea placeholder="请输入理由" v-model="content" :auto-height="false" class="uni-input" cursor-spacing="20"></textarea> -->
						<input placeholder="请输入理由" v-model="content" class="uni-input" cursor-spacing="0"/>
						<!-- <u-input placeholder="请输入理由" v-model="content" class="uni-input" cursor-spacing="100" type="textarea" selection-start="0" height="100"/> -->
					</view>
					<view class="button center" @click="getOrderEvaluate">{{info.isLast?'请先对上个律师进行评价哦':'确定评价'}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {getOrderEvaluate,getNoComment,getOrderEvaluateInfo} from "@/api/apis.js"
	export default {
		props: {
			isFrom: Number,
			orderNo: String,
			// info: Object
		},
		// computed: {
			// show: {
			// 	get() {
			// 		// return true
			// 		return this.$store.state.score.status
			// 	},
			// 	set() {}
			// },
			// msg:{
			// 	get() {
			// 		return this.$store.state.score.msg
			// 	},
			// 	set() {}
			// },
			// info: {
			// 	get() {
			// 		return this.$store.state.score.info
			// 	},
			// 	set() {}
			// }
		// },
		// watch:{
		// 	msg(){
		// 		if(this.msg.content.extra.data.status == 9){
		// 			getNoComment().then(res => {
		// 				if (res.data.data.length) {
		// 					let info = res.data.data[0]
		// 					// info.istop = true
		// 					info.reasons.forEach((item, index) => {
		// 						item.status = false
		// 					})
							
		// 					this.$store.commit("setOrderInfo",info)
		// 					return
		// 				}
		// 			})
		// 		}
		// 	}
		// },
		data() {
			return {
				content: null,
				show: false,
				have: {
					list: ["没有", "是的"],
					index: 0
				},
				info: {},
				emoji: {
					list: [{
							image: '/static/images/my_icon_selno.png',
							imageA: '/static/images/my_icon_sel.png',
							text: '满意'
						},
						{
							image: '/static/images/yb_icon.png',
							imageA: '/static/images/yb_icon_sely.png',
							text: '一般'
						},
						{
							image: '/static/images/bmy_iconno.png',
							imageA: '/static/images/bmy_icon_sel.png',
							text: '不满意'
						},
					],
					index: 0
				}
			}
		},
		methods: {
			onClose(){
				this.show=0
				// this.$store.commit("setOrderStatus", false)
			},
			getOrderEvaluate(){
				let ids = []
				this.info.reasons.forEach((item,index)=>{
					if(item.type == (this.emoji.index + 1)&&item.status){
						ids.push(item.order_evaluate_reason_id)
					}
				})
				getOrderEvaluate({
					order_no:this.orderNo,
					evaluate_score:this.emoji.index+1,
					evaluate:this.content?this.content:'',
					order_evaluate_reason_ids:JSON.stringify(ids),
					is_charge:this.have.index
				}).then(res=>{
					console.log(res,114)
					if(res.data.code==0){
						this.show=false
						uni.$u.toast('成功评价')
						// this.$emit("evaluateOver",'')
					}else if(res.data.code==1002){
						uni.$u.toast('订单已评价')
					}else{
						uni.$u.toast('评价失败')
					}
					
					// this.$store.commit("setOrderStatus", false)
				})
			},
			clickLabel(index) {
				// this.$emit("clickEvaluateLabie", index)
				this.info.reasons[index].status=!this.info.reasons[index].status
			},
			clickEmoji(index) {
				this.emoji.index = index;
			},
			clickHave(index) {
				this.have.index = index
			}
		},
		mounted() {
			console.log('pop')
			getOrderEvaluateInfo({order_no:this.orderNo}).then(res => {
				if (res.data.code==0) {
					let info = res.data.data
					// info.istop = true
					info.reasons.forEach((item, index) => {
						item.status = false
					})
					this.info=info
					// this.$store.commit("setOrderInfo",info)
					// return
				}
			})
			//this.$store.commit("setOrderStatus", true)
			/* this.info.reasons.forEach((item, index) => {
				item.status = false
			}) */
		}
	}
</script>

<style lang="scss">
	.button {
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 100rpx;
		background: #0061FF;
		border-radius: 8rpx;
		margin: 64rpx 0;
	}

	.textarea {
		textarea {}

		background: #F3F5F8;
		border-radius: 8rpx;
		padding: 14rpx 32rpx;
	}
	.labelBox{
		.labelActive {
			background: #0061FF !important;
			color: #FFFFFF !important;
		}
		
		.label {
			background: #DDE6F3;
			border-radius: 100rpx;
			font-size: 26rpx;
			color: #888D98;
			padding: 9rpx 24rpx;
			margin: 10rpx 0rpx 10rpx 48rpx;
		}
		padding: 10rpx 0;
	}
	

	.evaluate {
		padding-bottom: 19rpx;
	}

	.emoji {
		image {
			width: 68rpx;
			height: 68rpx;
		}

		.nameA {
			color: #222;
			font-weight: 800;
		}

		border-bottom: 1rpx solid #eceff4;
		padding-bottom: 24rpx;
	}

	.emojiName {
		font-size: 26rpx;
		color: #888D98;
	}

	.evaText {
		font-size: 30rpx;
		color: #222222;
		margin: 20rpx 0 32rpx 0;
	}

	.have {
		font-size: 30rpx;
		font-weight: bold;
		background-size: 100% 100% !important;
		// background: url(../static/images/but.png);
		padding: 23rpx 64rpx;
		color: #FFFFFF;
	}

	.haveActive {
		// background: url(../static/images/but_sel.png);
	}

	.look {
		width: 50upx;
		color: #C9CED9;
		font-size: 24rpx;
	}

	.orderNum {
		margin-top: 8rpx;
		font-size: 26rpx;
		color: #222222;
		.orange{
			color: #FF6E57;
		}
	}

	.name {
		font-size: 30rpx;
		color: #222222;
	}

	.v {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.photo {
		width: 140rpx;
		height: 140rpx;
		border-radius: 100px;
	}

	.status {
		font-size: 34rpx;
		font-weight: bold;
		color: #222222;
		padding-top: 25rpx;
	}
</style>
