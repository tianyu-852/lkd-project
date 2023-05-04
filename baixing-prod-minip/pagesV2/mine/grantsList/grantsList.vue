<template>
	<view style="background: #F5F7FA;min-height: 100vh;">
		<u-navbar back-icon-size="34" back-text=" " title-color="#222222" title="筹款案件列表" :border-bottom="false"
			title-size="36" :title-bold="false"></u-navbar>
			<view class="flex-column noData" v-if="dataList==0">
				<image src="/pagesV2/static/images/kym_qsy_image@3x.png"></image>
				<view class="hint">
					您暂时还没有筹款案件哦
				</view>
				<view class="btn" @click="toRegister">赶紧去发起筹款案件吧</view>
			</view>
		
		<view class="list">
			<view class="item" v-for="item,index in dataList" :key="item">
				<view class="" style="margin-bottom: 24upx;">
					<!-- <text class="electionTag">律师竞选中</text> -->
					<view class="wrap">
						<view class="text">
							<view :class="['electionTag', 'flex-row', 'hcenter',item.bid.join_status==1?'status1':item.bid.join_status==2?'status2':item.bid.join_status==3?'status3':'']" v-if="item.bid.join_status">
								<image v-if="item.bid.join_status==3" style="width: 26upx;height: 26upx;" src="/static/images/wg_icon.svg" mode=""></image>
								<text>{{item.bid.join_status==1?'律师竞选中':item.bid.join_status==2?'竞选失败':'竞选成功'}}</text>
							</view>
							<button class="btn">展开</button>
							{{item.title}}
						</view>
					</view>
					
				</view>
				
				<view class="flex-row">
					<image class="img" :src="item.litigant.avatar"></image>
					<text class="name">{{item.litigant.nickname}}</text>
					
					<!-- <text v-if="item.detail_type != 3 && item.refund_status_chinese!=''" style="color:#FF6E57 ;" >{{item.refund_status_chinese}}</text>
					<text v-if="item.isEnd == 1" style="color:#FF6E57;">已结束筹款</text> -->
					<view v-if="item.status.text == '' && item.fundraise_money!=item.target_money" style="height: auto;margin: auto;">
						<u-count-down ref="uCountDown" font-size="22" separator-size="20" :timestamp="item.expired_timestamp" separator="zh"></u-count-down>
					</view>
					<text v-else class="hint">{{item.status.text}}<text class="dot"> </text></text>
				</view>
				<!-- <text v-if="item.is_registration == 1" class="authentication">当事人身份认证情况<text
						:class="['tag',item==0?'tag-check':'tag-nocheck']">{{item.litigant.is_auth == 1?'已认证':'未认证'}}</text></text> -->
				<view v-if="item.status.status == 0" style="margin-top: 16upx;">
					<view class="flex-row color888D98">
						<text v-if="item.fundraise_money !=item.target_money" class="grants">已筹<text class="color0061FF">{{item.fundraise_money}}</text>元</text>
						<text v-if="item.target_money == item.fundraise_money" class="grants">筹款金额</text>
						<text>{{item.target_money == item.fundraise_money?'已完成筹款共':'目标'}} <text class="color0061FF">{{item.target_money}}</text>元</text>
					</view>
					<!-- 高度问题 -->
					<view class="" style="height: 32upx;margin-bottom: 20upx;">
							<u-line-progress :show-percent="false" :height="6" active-color="#4885FD" :percent="(item.fundraise_money/item.target_money)">
						</u-line-progress>
					</view>
					
				</view>
				<view class="flex-row status">
					<!-- <text v-if="is" :class="['text',item.status==1?'colorOrg':item.status==3?'colorRed':'']">{{item.is_registration == 0 ?item.case_types:item.status_chinese}}</text> -->
					<text v-if="item.bid.join_status" class="ranking">竞选排名<text class="black">{{item.bid.rank}}名</text><text style="margin: 0 20upx;">|</text>我的票数<text class="black">{{item.bid.votes_number}}票</text></text>
					
					<!-- <button v-if="!(item.litigant.is_auth == 1 || (item.fundraise_money>=item.target_money && item.is_registration == 0))" open-type="share" class="button-org"
						@click="clickShare(item.share)">邀请认证</button> -->
					<!-- <view v-if="item.litigant.is_auth == 0" class="button-org">邀请认证</view> -->
					<!-- <view class="button-refund" v-if="item.is_need_refund==1" @click="showPop(index)">立即退回</view> -->
					<text v-if="item.status.status == 6">已完成</text>
					<view v-else class="button-blue" @click="toDetail(index,item.status.status)">查看详情</view>
				</view>
			</view>
		</view>
		<u-popup v-model="show" :mask="true" border-radius="32" mode="center" @close="">
			<view class="popbox">
				<text class="title">请输入诉讼费</text>
				<view class="content flex-row">
					<text class="unit">￥</text>
					<input v-model="dataList[index].val" class="money" type="number" placeholder="1000"></input>
				</view>
				<view class="hint flex-row">
					<image src="/pagesV2/static/images/bdwx_icon.svg"></image>
					<text>默认使用微信支付</text>
				</view>
				<view class="paybtn" @click="clickPay">
					支付
				</view>
				<u-icon name="close" class="close" color="#C9CED9" size="28" @click="show=false"></u-icon>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getFundraiseJoinPage,
		sendFRLitigationCosts,
		getPay
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				page: 1,
				dataList: [],
				show:false,
				index:0,
			}
		},
		methods: {
			toRegister(){
				uni.navigateTo({
					url:'/pagesV2/funds/register/register'
				})
			},
			showPop(index){
				this.index = index
				this.show = true
			},
			clickPay(){
				const {index,dataList} = this
				if(dataList[index].order){
					if(order_no.data.code != 0)
						return
					uni.navigateTo({
						url:`/pagesV2/pay/pay?id=${dataList[index].order}`
					})
					return
					getPay({
						// #ifdef MP-WEIXIN
						type: 1,
						// #endif
						//#ifdef MP-TOUTIAO
						type: 3,
						//#endif
						order_no: dataList[index].order
					}).then(res => {
						uni.requestPayment({
							provider: uni.getStorageSync('provider'),
							//#ifdef MP-TOUTIAO
							service:5,
							orderInfo:res.data.data,
							//#endif
							// #ifdef MP-WEIXIN
							timeStamp: res.data.data.timeStamp,
							nonceStr: res.data.data.nonceStr,
							package: res.data.data.package,
							paySign: res.data.data.paySign,
							signType: res.data.data.signType,
							// #endif
							success: res => {
								// #ifdef MP-TOUTIAO
								if(res.code != 0){
									return
								}
								// #endif
									this.show = false
									uni.showToast({
										icon:"none",
										title:"支付成功"
									})
								}
							})
						})	
				}else{
					if(!dataList[index].val){
						this.$u.toast('请输入金额')
						return
					}
					sendFRLitigationCosts({
						fundraising_id:dataList[index].fundraising_id,
						money:dataList[index].val
					}).then(res=>{
						if(res.data.code == 0){
							this.dataList[index].order = res.data.data.order_no
							this.clickPay()
						}
					})
				}
				
			},
			clickShare(share) {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					id: 'gh_c2f7b38c007c',
					path: share.wechat_mini_program.path,
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			toDetail(index,type) {
				const {dataList} = this
				// if(type == 0)
				// 	uni.navigateTo({
				// 		url: `/pagesV2/mine/grantsList/detail/detail?id=`+dataList[index].fundraising_registration_id
				// 	})
				// else 
				if(type == 1)
					uni.navigateTo({
						url: `/pagesV2/funds/progressUpload/progressUpload?id=`+dataList[index].fundraising_id
					})
					// uni.navigateTo({
					// 	url: `/pagesV2/funds/register/share?id=${dataList[index].fundraising_registration_id}&isLawyer=true`
					// })
				else if(type == 2)
					uni.navigateTo({
						url: `/pagesV2/funds/seekHelp/lawyerHelp?id=`+dataList[index].fundraising_id
					})
				else if (type == 3)
					uni.navigateTo({
						url: `/pagesV2/funds/progressUpload/progressUpload?id=`+dataList[index].fundraising_id
					})
				else
					uni.navigateTo({
						url: `/pagesV2/index/detail/detail?isFrom=1&id=`+dataList[index].fundraising_id
					})
			},
			getFundraise(page) {
				getFundraiseJoinPage({
					page: page
				}).then(res => {
					let list = res.data.data.data
					for(let item in list){
						if(list[item].expired_timestamp){
							// list[item].expired_at = new Date().getTime() + 1000
							list[item].expired_timestamp = list[item].expired_timestamp - (new Date().getTime()/1000)
						}
					}
					if (page == 1) {
						this.dataList = list
					} else {
						this.dataList = this.dataList.concat(list);
					}
					
					this.page = page
					console.log(page)
				})
			}
		},
		onLoad(e) {
			this.getFundraise(1)
		},
		onPullDownRefresh() {
			this.getFundraise(1)
		},
		onReachBottom() {
			this.getFundraise(this.page + 1)
		}
	}
</script>

<style scoped lang="scss">
	page {
		background: #F5F7FA;
	}
	.wrap{
		display: flex;
		.text{
			font-size: 30upx;
			overflow: hidden;
		    // text-overflow: ellipsis;
		    // text-align: justify;
			  /* display: flex; */
			/*   display: -webkit-box;
			  -webkit-line-clamp: 3;
			  -webkit-box-orient: vertical; */
			  line-height: 1.5;
			  font-weight: bold;
			  max-height: 3em;
			  position: relative;
			.btn{
				height: 45upx;
				line-height: 45upx;
				width: 0;
				position: relative;
				float: right;
				clear: right;
				margin-left: 40upx;
				font-size: 30upx;
				padding: 0;
				background: #3F51B5;
				border-radius: 4upx;
				color:  #fff;
				cursor: pointer;
				border:0;
				overflow: visible;
			}
			.btn::before{
			  content: '...';
			  position: absolute;
			  left: -5px;
			  color: #333;
			  transform: translateX(-100%)
			}
		
		
		}
		.text::before{
		  content: '';
		  float: right;
		  width: 0upx;
		  height: 100%;/*先随便设置一个高度*/
		  background: red ;
		  margin-bottom: -45upx;
		}
		.text::after {
		    content: '';
		    width: 100%;
		    height: 100%;
		    position: absolute;
		    background: #fff;
		}
	}
	
.noData{
	image{
		width: 380upx;
		height: 380upx;
		margin: auto;
		margin-top: 24upx;
	}
	.hint{
		font-size: 30upx;
		 
		font-weight: 500;
		line-height: 53upx;
		color: #B1BCD4;
		margin: auto;
		text-align: center;
		margin-top: -42upx;
	}
	.btn{
		width: 440upx;
		height: 68upx;
		background: linear-gradient(53deg, #2C7EF3 0%, #49A5F6 95%, #49A5F6 100%);
		border-radius: 100px;
		font-size: 32upx;
		 
		font-weight: 500;
		line-height: 68upx;
		color: #FFFFFF;
		margin: auto;
		text-align: center;
		margin-top: 24upx;
	}
}
.popbox{
	width: 600upx;
	background: #FFFFFF;
	box-shadow: 0px 0px 30upx rgba(155, 162, 185, 0.4);
	padding: 32upx 32upx 40upx 32upx;
	.paybtn{
		height: 88upx;
		line-height: 88upx;
		background: #0061FF;
		font-size: 34upx;
		 
		font-weight: bold;
		color: #FFFFFF;
		text-align: center;
		border-radius: 8upx;
		margin-top: 88upx;
	}
	.hint{
		line-height: 33upx;
		font-size: 24upx;
		 
		font-weight: 500;
		color: #222222;
		margin-top: 24upx;
		image{
			width: 32upx;
			height: 32upx;
			margin-right: 12upx;
		}
	}
	.title{
		line-height: 48upx;
		font-size: 34upx;
		 
		font-weight: bold;
		color: #222222;
		text-align: center;
		display: block;
	}
	.content{
		height: 97upx;
		padding-bottom: 16upx;
		margin-top: 64upx;
		border-bottom: 1upx solid #ECEFF4;
		.unit{
			height: 70upx;
			line-height: 70upx;
			margin: auto;
			margin-bottom: 0;
			font-size: 50upx;
 
font-weight: 800;
color: #222222;
		}
		.money{
			flex: 1;
			height: 97upx;
			font-size: 80upx;
			font-family: DIN;
			font-weight: 500;
			line-height: 97upx;
			color: #222222;
			opacity: 1;
		}
	}
	.close{
		position: absolute;
		top: 42upx;
		right: 32upx;
	}
}
	.button-refund{
		width: 148upx;
		height: 56upx;
		line-height: 56upx;
		background: #0061FF;
		border-radius: 100upx;
		font-size: 26upx;
		 
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		margin-left: 16upx;
	}
	.list {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.item {
			background: #fff;
			margin: 20upx 32upx;
			box-shadow: 0px 4upx 20upx rgba(80, 101, 151, 0.1);
			opacity: 1;
			border-radius: 8upx;
			padding: 32upx 20upx 0 20upx;
			.ranking{
				line-height: 56upx;
				font-size: 26upx;
				color: #888D98;
				.black{
					color: #222;
					padding-left: 8upx;
					font-weight: bold;
				}
			}
			.electionTag{
				height: 36upx;
				line-height: 26upx;
				
				border-radius: 8upx;
				font-size: 24upx;
				
				padding: 5upx 10upx;
				margin-right: 10upx;
				float: left;
				margin-top: 3upx;
				image{
					margin-right: 4upx;
				}
			}
			.status1{
				color: #18C295;
				background: #BBF1E2;
			}
			.status2{
				color: #516EBC;
				background: #DFE9FF;
			}
			.status3{
				color: #FF7B40;
				background: #FEF8F1;
			}
			.grants {
				font-size: 28upx;
				flex: 1;
			}

			.status {
				border-top: 1upx solid #ECEFF4;
				padding: 16upx 0;
				margin-top: 24upx;
				color: #888D98;
				.text {
					line-height: 56upx;
					color: #888D98;
					flex: 1;
				}

				.colorOrg {
					color: #FF6E57;
				}

				.colorRed {
					color: #FF4040;
				}

				.button-blue {
					width: 148upx;
					height: 56upx;
					line-height: 54upx;
					border: 2upx solid #0061FF;
					opacity: 1;
					border-radius: 100upx;
					color: #0061FF;
					text-align: center;
					font-size: 26upx;
					margin: auto;margin-right: 0;
				}

				.button-org {
					width: 148upx;
					height: 56upx;
					line-height: 56upx;
					background: linear-gradient(267deg, #FF9307 0%, #FFAE5A 100%);
					opacity: 1;
					border-radius: 100upx;
					color: #fff;
					margin-left: 16upx;
					text-align: center;
					font-size: 26upx;
					padding: 0;
				}
			}

			.authentication {
				font-size: 26upx;
				 
				font-weight: 500;
				line-height: 37upx;
				color: #888D98;
				opacity: 1;
				display: block;
				margin: 20upx 0upx;

				.tag {
					margin-left: 12upx;
					opacity: 1;
					border-radius: 8upx;
					padding: 2upx 14upx;
					font-size: 24upx;
					 
					font-weight: 500;
				}

				.tag-check {
					color: #0061FF;
					background: #E7F3FE;
				}

				.tag-nocheck {
					color: #FF7639;
					background: #FEEEE7;
				}
			}

			.img {
				height: 64upx;
				width: 64upx;
				border-radius: 32upx;
			}

			.title {
				height: 87upx;
				font-size: 30upx;
				font-weight: bold;
				line-height: 45upx;
				color: #222222;
			}

			.name {
				line-height: 64upx;
				font-size: 30upx;
				 width: 0;
				font-weight: bold;
				color: #222;
				flex: 1;
				margin-left: 12upx;
			}

			.hint {
				line-height: 64upx;
				font-size: 28upx;
				 
				font-weight: 500;
				color: #FF4040;
				opacity: 1;
			}
		}
	}
</style>
