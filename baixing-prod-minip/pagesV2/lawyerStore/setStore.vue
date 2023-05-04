<template>
	<view style="padding-bottom: 180rpx;background: linear-gradient(316deg, #DEE9FF 0%, #F0F6FF 100%);" class="relative">
		<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_1.png" mode="" class="bg_img_1"></image>
		<image src="/static/images/bg1_icon.png" class="bg_img_2" mode="widthFix"></image>
		<image src="/static/images/bg2_icon.png" class="bg_img_3" mode="widthFix"></image>
		
		<view class="nav fixed">
			<image class="backIcon" src="/static/images/nav_fh_icon.png" mode="" @click="backNav"></image>
			{{type===1?'诚信保障计划':'开通自己的法律小铺'}}
		</view>
		<view class="nav">
			
		</view>
		<view class="" v-if="type === 1">
		<view class="safe-title flex-row hcenter marlr32" v-if="type != 1">
			诚信保障计划
		</view>
		<view class="safe-content">
			因在线法律服务的特殊性，迅速提升用户信任度，建议<text style="color:#FF6E57 ;">加入诚信保障计划</text></view>
		<view class="safe-content">
			通过[百姓律师]与平台认证律师建立联系，后续
			产生任何法律服务交易(<text style="color:#FF6E57 ;">不限于平台内或线下支付</text>)，经司法局、
			律协认定违规，平台将先行赔付已付律师费。<text>\n</text>
			仅限已加入<text style="color:#FF6E57 ;">诚信保障计划</text>的律师，赔付上限不超过律师缴纳的保障金
		</view>
		<view class="safe-hint" v-if="type == 0 ">
			提醒:建议使用本平台功能联系律师，若发生纠纷平台将最大程度提供帮助！
		</view>
		<view v-else class="martop32"  style="z-index: 2;position: relative;">
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">平台将优先向用户推荐加入诚信保障计划的律师，可大幅度提高接单量</view>
			</view>
			<view class="flex tips between">
				
				<view class="test" style="width: auto;"><view class="dot"></view>专属推荐律师列表</view>
				<view style="color: #9BA3B6;padding-right: 56rpx;" @click="showMask(0)">
					示例 
					<image style="width: 14rpx;margin-left: 8rpx;" src="/static/images/ic_right_gray.png" mode="widthFix"></image></view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test hcenter flex">特殊身份标识 <image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_lawyer_vip_all.png" mode="widthFix" style="width: 159rpx;margin-left: 12rpx;"></image></view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">保障金可随时申请退还</view>
			</view>
		</view>
		<view class="safe-title flex-row hcenter">
			<view class="safe-title-before"></view>如何识别诚信保障计划律师
		</view>
		<view class="safe-content-imgs">
			<view class="safe-content-imgs-title" style="margin-top: 64rpx;">1.律师列表带有<text style="color:#FF6E57 ;">[诚信保障标签]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag1.png" mode="widthFix" style="margin-top: 8;width: 686rpx;"></image>
			<view class="line"></view>
			<view class="safe-content-imgs-title" style="margin-top: 32rpx;">2.问答社区带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag2.png" mode="widthFix"></image>
		</view>
		<view class="button-store fixed" v-if="type === 1" @click="pay">加入诚信保障计划</view>
		</view>
		
		<view class="type02" style="padding: 0 56rpx;" v-else>
			<view class="flex between hcenter" style="margin-bottom: 16upx;">
				<view class="h3" >
					诚信保障计划</view>
				<view class="price flex">
					<text>保障金</text>
					<view class="blue">
						￥<text class="font">{{info.guarantee_plan_price}}</text>
					</view>
				</view>
			</view>
			<image style="width: 535rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_setstore_guarantee.png" mode="widthFix"></image>
			<view class="line" style="width: 100%;"></view>
			<!-- <view class="flex safe-content">
				<view class="test" style="margin-top: 32rpx;">
					因在线法律服务交易的特殊性，迅速提升用户信任度，建议加入
					<text style="color: #FF6E57;" @click="attestPop2=true">诚信保障计划</text>
				</view>
				
			</view> -->
			<view class="safe-content" style="margin-top: 32rpx;">
				因在线法律服务的特殊性，迅速提升用户信任度，建议<text style="color:#FF6E57 ;">加入诚信保障计划</text></view>
			<view class="flex safe-content">
				<view class="test" style="margin-top: 28rpx;">
					通过[百姓律师]与平台认证律师建立联系，后续产生任何法律服务交易(<text style="color: #FF6E57;">不限于平台内或线下支付</text>)，经司法局、律协认定违规，平台将先行赔付已付律师费。
				</view>
			</view>
			<view class="flex safe-content" style="margin-top: 28rpx;">
				<view class="test">
					仅限已加入<text style="color: #FF6E57;">诚信保障计划</text>的律师，赔付上限不超过律师缴纳的保障金
					</view>
			</view>
			<view class="flex tips martop36">
				<view class="dot"></view>
				<view class="test">平台将优先向用户推荐加入诚信保障计划的律师，可大幅度提高接单量</view>
			</view>
			<view class="flex tips between">
				
				<view class="test" style="width: auto;"><view class="dot"></view>专属推荐律师列表</view>
				<view style="color: #9BA3B6;" @click="showMask(0)">
					示例 
					<image style="width: 14rpx;margin-left: 8rpx;" src="/static/images/ic_right_gray.png" mode="widthFix"></image></view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="between flex u-flex-1" >
					<view class="test hcenter flex" style="width: auto;">特殊身份标识 <image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_lawyer_vip_all.png" mode="widthFix" style="width: 159rpx;margin-left: 12rpx;"></image></view>
					<view style="color: #9BA3B6;" @click="showMask(1)">
					示例 
					<image style="width: 14rpx;margin-left: 8rpx;" src="/static/images/ic_right_gray.png" mode="widthFix"></image></view>
				</view>
				
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">律师主页专属展示</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">保障金可随时申请退还</view>
			</view>
			
			<!-- <view class="banner">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_store_popup.png" mode="widthFix"></image>
			</view> -->
			<view v-if="type === 2" class="button-store fixed" @click="pay" style="line-height: 0;padding: 17rpx 0;">
				<view style="line-height: 45rpx;margin-bottom: 8rpx;">加入诚信保障计划￥{{parseFloat(info.lawyer_store_price) + parseFloat(info.guarantee_plan_price)}}</view>
				<text>限时免费开通法律小铺</text>
			</view>
			<view v-else class="button-store fixed" @click="pay">限时免费开通法律小铺</view>
		</view>
		<view class="safe-title flex-row hcenter">
			<view class="safe-title-before"></view>如何识别诚信保障计划律师
			<text class="vipHint" >特权展示</text>
		</view>
		<view class="safe-content-imgs">
			<view class="safe-content-imgs-title" style="margin-top: 64rpx;">1.律师列表带有<text style="color:#FF6E57 ;">[诚信保障标签]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag1.png" mode="widthFix" style="margin-top: 8;width: 686rpx;"></image>
			<view class="line"></view>
			<view class="safe-content-imgs-title" style="margin-top: 32rpx;">2.问答社区带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag2.png" mode="widthFix"></image>
			<view class="line"></view>
			<view class="safe-content-imgs-title" style="margin-top: 32rpx;">3.律师主页带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image style="margin-top: 8rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag3.png" mode="widthFix"></image>
		</view>
		<view class="" style="height: 68rpx;"></view>
		<u-mask :show="maskShow" @click="maskShow = false" >
			<view class="flex-column flexcenter hcenter" style="height: 100%;width: 100%;">
				<image style="width: 637rpx;" :src="maskUrl" mode="widthFix"></image>
				<image src="/static/images/gb_icon_border.svg" mode="widthFix" style="width: 66rpx;margin-top: 40rpx;"></image>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import{ getLawyerStoreOrder, getPay, getHomeBanner }from "@/api/apis.js"

	export default {
		data() {
			return {
				maskShow:false,
				attestPop:false,
				type:0,
				info:{},
				maskUrl:''
			}
		},
		methods: {
			setStoreStorage(){
				const {type} = this
				if(type === 2){
					uni.setStorageSync('is_lawyerStore',1)
					uni.setStorageSync('is_guarantee',1)
				}else if(type === 0){
					uni.setStorageSync('is_lawyerStore',1)
				}else if(type === 1){
					uni.setStorageSync('is_guarantee',1)
				}
			},
			getBanner(){
				getHomeBanner().then(res => {
					if(res.data.code==0){
						this.info=res.data.data
					}
				})
			},
			pay() {
				const {type} = this
				getLawyerStoreOrder({type:type}).then(order_no => {
					if(order_no.data.code == 0){
						if(parseFloat(this.info.guarantee_plan_price) != 0){
							uni.navigateTo({
								url:`/pagesV2/pay/pay?id=${order_no.data.data.order_no}`,
								events:{
									over: res => {
										this.setStoreStorage()
										// if(!this.nojump)
										//TODO  判断是本人
										setTimeout(res=>{
											// uni.navigateTo({
											// 	url: `/pagesV1/index/lawyerPage?id=${this.user_id}`
											// })
											uni.navigateBack()
										},1000)
										
										// this.popDown(true)
										uni.$u.toast('开通成功')
									}
								}
							})
						}else{
							this.setStoreStorage()
							uni.navigateTo({
								url: `/pagesV1/index/lawyerPage?id=${this.user_id}`
							})
							// this.popDown(true)
							uni.$u.toast('开通成功')
						}
					} else{
						uni.$u.toast(order_no.data.message)
					}
					
				})
			},
			showMask(index){
				console.log(index)
				this.maskUrl = index?'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_setstore_mask.png':'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safeguard_mask.png'
				this.maskShow = true
				
			},
			storePopDown(val){
				this.attestPop=val
				this.is_guarantee = uni.getStorageSync('is_guarantee')
			},
			backNav(){
				uni.navigateBack()
			},
			toLink(index){
				let url = '/pagesV1/common/fabu?isTag=1'
				if(index)
					url = '/pagesV1/common/districts'
				uni.navigateTo({
					url:url
				})
				
			}
		},
		onLoad(e) {
			this.type = parseInt(e.type) 
			this.getBanner()
		}
	}
</script>
<style scoped lang="scss">
	.vipHint{
		 margin-left: 8rpx;
		 font-size: 28rpx;
		 font-weight: bold;
		 line-height: 41rpx;
		 color: #FFFFFF;
		 width: 129rpx;
		 height: 41rpx;
		 text-align: center;
		 background: linear-gradient(130deg, #FF8557 0%, #FF4409 100%);
		 border-radius: 12rpx 2rpx 12rpx 2rpx;
	}
	.banner{
		// padding: 0 25upx;
		margin: 11upx auto 48upx;
		image{
			width: 100%;
			border-radius: 32upx;
			box-shadow: 0px 4upx 16upx rgba(0, 51, 146, 0.2);
		}
	}
	.type02{
		.h3{
			font-size: 34upx;
			font-weight: bold;
			line-height: 54upx;
		}
		.price{
			height: 50upx;
			line-height: 50upx;
			background: #D6E2FF;
			border-radius: 8upx;
			font-size: 26upx;
			color: #2766FE;
			padding-left: 12upx;
			.blue{
				color: #fff;
				height: 50upx;
				border-radius: 8upx;
				padding:  0 15upx 0 30upx;
				background: linear-gradient(103deg, #D6E2FF 10%, #6592FD 11%);
				position: relative;
				.opacity{
					opacity: 0.6;
					text-decoration:line-through;
				}
				.font{
					font-size: 32upx;
					font-weight: 800;
				}
			}
		}
		.safe-content{
			margin: 0;
		}
		.dot{
			margin: 18upx 10upx 0 19rpx !important;
		}
		.button-store{
			left: 32rpx;
			right: 32rpx;
			background: linear-gradient(269deg, #58BCFF 0%, #266EFF 100%);
			box-shadow: 0px 4rpx 12rpx rgba(0, 69, 206, 0.31);
			border-radius: 16rpx;
			text{
				line-height: 33rpx;
				font-size: 24rpx;
				color: #D1E7FE;
			}
		}
	}
	.tips{
		z-index: 2;
		font-size: 30upx;
		line-height: 48upx;
		color: #687085;
		margin-bottom: 20upx;
		.dot{
			width: 10upx;
			height: 10upx;
			border-radius: 50%;
			background: #687085;
			margin: 18upx 10upx 0 43upx;
		}
		.test{
			width: calc(100% - 63upx);
		}
		text{
			color: #FF6E57;
			// text-decoration:underline;
		}
	}
	.button-user{
		line-height: 100rpx;
		font-size: 34rpx;
		font-weight: bold;
		flex: 1;
		border-radius: 100px;
		text-align: center;
		color: #FFFFFF;background: linear-gradient(132deg, #464B66 0%, #464B66 100%);
	}
	.button-store{
		line-height: 100rpx;
		background: linear-gradient(308deg, #2B7AFE 0%, #4C96FF 100%);
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		font-size: 36rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 100px;
		left: 75rpx;
		right: 75rpx;
		bottom: 68rpx;
	}
	 
 .line{
	 width: calc(100% - 32rpx);
	 height: 1rpx;
	 background: #DCE3EF;
	 margin-top: 12rpx;
 }
 .safe-content-imgs-title{
	 font-size: 28rpx;
	 font-weight: bold;
	 color: #383F50;
 }
 .safe-content-imgs{
	 padding-left: 33rpx;
 }
 .safe-content{
	 margin: 24rpx 27rpx 0 32rpx;
	 font-size: 32rpx;
	 font-weight: bold;
	 line-height: 54rpx;
	 color: #4F5667;
 }
 .safe-hint{
	 margin: 24rpx 16rpx 0 32rpx;
	font-size: 32rpx;
	line-height: 54rpx;
	color: #4F5667;
 }
 .safe-title{
	 margin-top: 40rpx;
	line-height: 45rpx;
	 font-size: 32rpx;
	 font-weight: 800;
	 color: #222222;
	 
 }
 .safe-title-before{
	 width: 16rpx;
	 height: 28rpx;
	 background: #5C90F9;
	 border-radius: 0px 6rpx 6rpx 0px;
	 margin-right: 16rpx;
 }
 .nav{
	 height: 171rpx;
	 font-size: 36rpx;
	 font-weight: bold;
	 line-height: 50rpx;
	 color: #383F50;
	 text-align: center;
	 padding-top: 107rpx;
	 width: 100vw;
	 top: 0;
	 background: #F0F6FF;
 }
 .backIcon{
	 position: absolute;
	 padding: 32rpx;
	 /* left: 32rpx; */
	 left: 0;
	 bottom: 0rpx;
	 width: 34rpx;
	 height: 26rpx;
 }
 .bg_img_1{
	 width: 303rpx;
	 height: 515rpx;
	 position: absolute;
	 top: 0;
	 right: 0;
 }
 .bg_img_2{
	 width: 162rpx;
	 height: 243rpx;
	 position: absolute;
	 top: 521rpx;
	 right: 0;
	 z-index: 0;
 }
 .bg_img_3{
	 width: 177rpx;
	 height: 291rpx;
	 position: absolute;
	 left: 0;
	 bottom: 0rpx;
	 z-index: 0;
 }
</style>
