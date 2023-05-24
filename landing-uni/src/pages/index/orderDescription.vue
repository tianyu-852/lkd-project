<template>
	<view style="padding-bottom: 300rpx;background: #F5F7FA;overflow: hidden;" class="relative">
		<view class="safe-content">1.为及时了解及监督服务质量、解决服务纠纷平台有权对通话进行录音及查询</view>
		<view class="safe-content">2.参与本服务的,将视为您已确认并同意交易价格、形式及服务规范等内容,并遵守平台相关规则。平台有权对前述内容进行调整,具体以届时发布的通知为准。在符合法律法规规定的前提下，平台对本规则享有最终解释权</view>
		<view class="safe-content">3.服务价格<br>电话咨询<text style="color:#FF6E57;">20</text>元/单<br>合同审查<text style="color:#FF6E57;">98</text>元/单<br>合同定制<text style="color:#FF6E57;">198</text>元/单<br>文书起草<text style="color:#FF6E57;">198</text>元/单<br>(平台会按市场行情进行不定期调整价格和规格，以最终展示价格为准)<br>由用户下单时完成支付,款项将先由平台托管<br></view>
		<view class="safe-content">4.订单规则<br>(1)接到订单后，律师须在3分钟内电话联系用户，否则订单将自动取消，重新发布<br>(2)接到订单后，律师拨打用户电话3次皆因用户原因未接听，订单将不会再自动取消<br>(3)如合同审查、合同起草、文书起草等后期需修改的服务，将在交付7天后自动结束该订单<br></view>
		<view class="safe-content">5.如您还有其他任何疑问，可以联系律师管家或者拔打热线0577-86859588，我们会有专业客服为您服务</view>
		
		<view class="line top40"></view>
		<view class="" @click="pay">
			<image src="/static/yxjh_image.png" class="safe-banner marlr32" mode="widthFix"></image>
		</view>
		<view class="safe-content">因在线法律服务的特殊性，提升用户信任度，在线接单需加入优选律师计划</view>
		<view class="safe-content">用户与平台认证律师建立联系，后续产生任何法律服务交易(不限于平台内或线下支付)经司法局、律协认定违规并已注明赔付金额，平台将先行赔付</view>
		<view class="safe-content">仅限已加入优选律师计划的律师，赔付上限不超过该服务律师缴纳的保障金</view>
		<view class="safe-content">适用温州律快答网络科技有限公司旗下平台，包含但不限于百姓律师、律师推见、企业律云</view>
		
		<view class="top32 relative" style="z-index: 2;">
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">平台将优先向用户推荐优选律师</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">专属推荐律师列表</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">订单广场在线接单</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">迅速提升曝光量</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test flex hcenter">
					<view>特殊身份标识</view>
					<image src="/static/bzjh_icon.png" class="width32" mode="widthFix"></image>
				</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">保障金可随时申请退还</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">开启法律小铺，设置收费咨询</view>
			</view>
		</view>
		<view class="safe-title flex-row hcenter">
			<view class="safe-title-before"></view>诚信保障计划律师
			<text class="vipHint">特权展示</text>
		</view>
		
		<view class="safe-content-imgs top40">
			<view class="safe-content-imgs-title">1.专属优选律师列表</view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/yx_image.png" class="widthAll" mode="widthFix"></image>
			<view class="line top20"></view>
			<view class="safe-content-imgs-title">2.律师列表带有<text style="color:#FF6E57 ;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lb_image.png" class="widthAll" mode="widthFix"></image>
			<view class="line top20"></view>
			<view class="safe-content-imgs-title">3.问答社区带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag2.png" class="widthAll" mode="widthFix"></image>
			<view class="line top20"></view>
			<view class="safe-content-imgs-title">4.律师主页带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lszy_tc_icon.png" class="widthAll" mode="widthFix"></image>
		</view>

		<view class="" v-if="!show">
			<view class="button-store fixed flex hcenter flexcenter" v-if="type == 1 && is_guarantee == 0" @click="pay">
				<view class="">
					<text>开通诚信保障计划</text>
					<view class="hint">加入优选律师<text v-if="num">￥{{num}}</text></view>
				</view>
			</view>
			<view class="button-store fixed red" v-if="type == 1 && is_guarantee == 1" @click="showMask(2)">退出诚信保障计划</view>
		</view>
		
		<view class="mask flex-column" v-if="maskShow">
			<view class="flex-column relative" v-if="maskShow==1">
				<view class="mask-colse" @click="showMask(0)"></view>
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_safe_pop.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即接单</view>
			</view>
			<view class="relative mask-box center " v-if="maskShow==2">
				<view class="font34 bold bottom56">温馨提示</view>
				<view class="font36 bold bottom40">退出诚信保障计划，将影响部分功能使用</view>
				<view class="flex between bottom40">
					<view v-for="(item,index) in icons" :key="index">
						<image :src="item.icon" class="width80 icon" mode="widthFix"></image>
						<view class="font30 top12">{{item.name}}</view>
					</view>
				</view>
				<view class="flex between">
					<view class="btn bold font34 red blue" @click="showMask(0)">我再想想</view>
					<view class="btn bold font34 " @click="quit">仍要退出</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getUser, getGuaranteeOrder, getRefundGuarantee } from "@/apis/apis.js"

export default {
	data() {
		return {
			num:0,
			source:3,
			icons:[{
				icon:'/static/ddgc_icon.png',
				name:'订单广场'
			},{
				icon:'/static/flxp_icon.png',
				name:'法律小铺'
			},{
				icon:'/static/pttj_icon.png',
				name:'平台推荐'
			}],
			platform:'',
			maskShow:false,
			show:0,
			attestPop:false,
			type:1,
			is_guarantee:0
		}
	},
	methods: {
		showMask(i){
			//APP端触发弹窗
			//i: 1 支付成功 2 退出弹窗 0关闭
			this.maskShow = i
		},
		// storePopDown(val){
		// 	this.attestPop=val
		// 	this.is_guarantee = uni.getStorageSync('is_guarantee')
		// },
		pay(){
			//调起APP端支付功能
			// 由于对象映射，所以调用AppProxyClick对象等于调用Android映射的对象
			getGuaranteeOrder({}, {
				"X-Source-App":this.source
			}).then(res=>{
				if(res.data.code==0){
					if(this.platform == 'ios'){
						// window.webkit.messageHandlers.quit.postMessage({body: res.data.data.order_no})
						prompt('pay')
					}else{
						AppProxyClick.pay(res.data.data.order_no);
					}
				}else{
					uni.showToast({
						title:res.data.message
					})
				}
			})
		},
		quit(){
			getRefundGuarantee({},{
				"X-Source-App":this.source
			}).then(res=>{
				if(res.data.code==0){
					this.showMask(0)
					this.is_guarantee=0
					if(this.platform == 'ios'){
						prompt('quit')
					}else{
						AppProxyClick.quit();
					}
				}else{
					uni.showToast({
						title:res.data.message
					})
				}
			})
		},
		toLink(){
			if(this.platform == 'ios'){
				prompt('quit')
			}else{
				AppProxyClick.toOrder();
			}
		}
	},
	onLoad(e) {
		this.show=e.show
		if(!e.show){
			this.platform=uni.getSystemInfoSync().platform
			if(this.platform == 'ios'){
				this.num=prompt('onGetAppConfig')
				this.source=JSON.parse(prompt('onGetSourceAppId',''))
				uni.setStorage({
					key: "token",
					data: prompt('onGetToken')
				})
			}else{
				this.num=AppProxyClick.onGetAppConfig()
				this.source=JSON.parse(AppProxyClick.onGetSourceAppId())
				uni.setStorage({
					key: "token",
					data: AppProxyClick.onGetToken()
				})
			}
			
			getUser({},{
				"X-Source-App":this.source
			}).then(res=>{
				if(res.data.code==0){
					this.type=res.data.data.type
					this.is_guarantee=res.data.data.is_guarantee
					// uni.setStorage({
					// 	key: "type",
					// 	data: res.data.data.type
					// })
					// uni.setStorage({
					// 	key: "is_guarantee",
					// 	data: res.data.data.is_guarantee
					// })
					// uni.showToast({
					// 	title:res.data.data.is_guarantee
					// })
				}
			})
		}
	}
}
</script>
<style scoped>
	.mask{
		top: 0;bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
	}
	.mask .btn{
		width: calc(50% - 8rpx);
		color: #14284A;
		background-color: #F3F5F8;
		line-height: 88rpx;
		border-radius: 20rpx;
	}
	.mask .red{
		color: #fff;
		background-color: #FF6160;
	}
	.mask .blue{
		color: #fff;
		background-color: #0061FF;
	}
	.mask-box{
		/* height: 520rpx; */
		box-shadow: 0px 0px 30rpx rgba(155, 162, 185, 0.4);
		border-radius: 56rpx;
		background-color: #fff;
		padding: 32rpx 36rpx;
	}
	.mask-box .icon{
		display: block;
		margin: 0 auto;
	}
	.mask-colse{
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		z-index: 9;
	}
	.mask-btn{
		width: 528rpx;
		height: 90rpx;
		background: #3764FF;
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		border-radius: 100px;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 90rpx;
		color: #FFFFFF;
		text-align: center;
		margin-top: -140rpx;
		z-index: 2;
	}
	.tips{
		z-index: 2;
		font-size: 30upx;
		line-height: 48upx;
		color: #687085;
		margin-bottom: 20upx;
	}
	.tips .dot{
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #687085;
		margin: 18upx 10upx 0 43upx;
	}
	.tips .test{
		width: calc(100% - 63upx);
	}
	.tips text{
		color: #FF6E57;
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
		/* line-height: 120rpx; */
		background: linear-gradient(269deg, #58BCFF 0%, #266EFF 100%);
		box-shadow: 0px 4rpx 12rpx rgba(0, 69, 206, 0.31);
		font-size: 32rpx;
		text-align: center;
		padding: 14rpx 0;
		font-weight: bold;
		color: #FFFFFF;
		border-radius: 16rpx;
		left: 75rpx;
		right: 75rpx;
		bottom: 120rpx;
		z-index: 99;
	}
	
	.button-store .tag{
		line-height: 41rpx;
		padding: 0 22rpx;
		color: #fff;
		font-size: 28rpx;
		background: linear-gradient(130deg, #FF8557 0%, #FF4409 100%);
		border-radius: 12rpx 2rpx 12rpx 2rpx;
		position: absolute;
		right: 0;
		top: -20rpx;
	}
	.button-store .hint{
		font-size: 28rpx;
		font-weight: 400;
	}
	 
 .line{
	 width: calc(100% - 32rpx);
	 height: 1rpx;
	 background: #DCE3EF;
	 margin-left: auto;
	 margin-right: auto;
 }
 .safe-content-imgs-title{
	 font-size: 28rpx;
	 font-weight: bold;
	 color: #383F50;
	 margin: 20rpx 0;
 }
 .safe-content-imgs{
	 padding: 0 32rpx;
 }
 .safe-banner{
	 width: calc(100% - 64rpx);
	 margin-top: 28rpx;
 }
 .safe-content{
	 margin: 24rpx 27rpx 0 32rpx;
	 font-size: 30rpx;
	 font-weight: bold;
	 line-height: 54rpx;
	 color: #4F5667;
	 position: relative;
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
 .nav{
	 font-size: 36rpx;
	 font-weight: bold;
	 
 }
 .backIcon{
	 position: absolute;
	 padding: 32rpx;
	 /* left: 32rpx; */
	 left: 0;
	 top: -20rpx;
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
