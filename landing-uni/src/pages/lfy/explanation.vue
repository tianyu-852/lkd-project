<template>
	<view class="page relative">
		<!-- <view class="top flex between hcenter">
			<view class="text">因在线法律服务交易的特殊性，仅限已加入诚信保障计划的律师参与接单</view>
			<view class="btn" @click="pay">立即加入</view>
		</view> -->
		<view class="safe-content">1.为及时了解及监督服务质量、解决服务纠纷平台有权对通话进行录音及查询</view>
		<view class="safe-content">2.参与本服务的,将视为您已确认并同意交易价格、形式及服务规范等内容,并遵守平台相关规则。平台有权对前述内容进行调整,具体以届时发布的通知为准。在符合法律法规规定的前提下，平台对本规则享有最终解释权</view>
		<view class="safe-content">3.如您还有其他任何疑问，可以联系<text @click="onServiceChat">律师管家</text>或者拔打热线<text @click="call">0577-86859588</text>,我们会有专业客服为您服务</view>
		<view class="gap marlr32 top40"></view>
		<view class="font36 bold top32 marlr32 flex between">
			<text>诚信保障计划</text>
			<view class="btn" v-if="type == 1 && is_guarantee == 0" @click="pay">立即加入</view>
		</view>
		<view class="safe-content" style="color: #FF6160;" v-if="type == 1 && is_temp_guarantee == 1">体验活动2021年12月31日截止</view>
		<view class="safe-content">因在线法律服务的特殊性，提升用户信任度，在线接单需加入诚信保障计划</view>
		<view class="safe-content">用户与平台认证律师建立联系，后续产生任何法律服务交易(不限于平台内或线下支付)经司法局、律协认定违规并已注明赔付金额，平台将先行赔付</view>
		<view class="safe-content">仅限已加入诚信保障计划的律师，赔付上限不超过该服务律师缴纳的保障金</view>
		<view class="safe-content">适用温州律快答网络科技有限公司旗下平台，包含但不限于百姓律师、律付云、企业律云</view>
		<view class="top36 relative" style="z-index: 2;">
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">平台将优先向用户推荐加入诚信保障计划的律师</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">订单广场在线接单</view>
			</view>
			<view class="flex tips">
				<view class="dot"></view>
				<view class="test">迅速提高曝光率</view>
			</view>

			<view class="flex tips">
				<view class="dot"></view>
				<view class="test hcenter flex">特殊身份标识 <image src="/static/bzjh_icon.png" class="width32 left12" mode="widthFix" /></view>
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
		<view class="safe-title flex-row hcenter left32">
			诚信保障计划律师
			<text class="vipHint">特权展示</text>
		</view>
		<view class="safe-content-imgs">
			<view class="safe-content-imgs-title" style="margin-top: 64rpx;">1.律师列表带有<text style="color:#FF6E57 ;">[诚信保障标签]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lb_image.png" mode="widthFix" style="margin-top: 8;width: 686rpx;"></image>
			<view class="line"></view>
			<view class="safe-content-imgs-title" style="margin-top: 32rpx;">2.问答社区带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_tag2.png" mode="widthFix"></image>
			<view class="line"></view>
			<view class="safe-content-imgs-title" style="margin-top: 32rpx;">3.律师主页带有<text style="color:#FF6E57 ;width: 686rpx;">[诚信保障标识]</text></view>
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lszy_tc_icon.png" class="top8" mode="widthFix"></image>
		</view>
		<view class="button-store fixed relative" v-if="type == 1 && is_guarantee == 0" @click="pay">
			加入诚信保障计划￥{{num}}
			<!-- <view class="tag">保障金</view> -->
		</view>
		<!-- <view class="button-store fixed" v-if="type == 1 && is_guarantee == 0" @click="pay">加入诚信保障计划￥{{1000}}</view> -->

		<!-- <storePop :attestPop="attestPop" :type="0" @attestPopDown="storePopDown"></storePop> -->
<!-- 		<u-mask :show="maskShow" @click="maskShow = false" >
			<view class="flex-column flexcenter hcenter" style="height: 100%;width: 100%;">
				<image style="width: 637rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safeguard_mask.png" mode="widthFix"></image>
				<image src="/static/images/gb_icon_border.svg" mode="widthFix" style="width: 66rpx;margin-top: 40rpx;"></image>
			</view>
		</u-mask> -->
<!-- 		<view class="mask flex-column" v-if="maskShow">
			<view class="flex-column relative" v-if="maskShow==1">
				<view class="mask-colse" @click="showMask(0)"></view>
				<image style="width: 600rpx;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_safe_pop.png" mode="widthFix"></image>
				<view class="mask-btn" @click="toLink">立即接单</view>
			</view>
			
		</view> -->
	</view>
</template>

<script>
	import {
		getUser,
		getGuaranteeOrder
	} from "@/apis/apis.js"
	// import storePop from "@/components/storePop.vue"
	export default {
		components:{
			// storePop
		},
		data() {
			return {
				// maskShow:false,
				// attestPop:false,
				platform:'',
				source:3,
				num:0,
				type:0,
				is_temp_guarantee:0,
				is_guarantee:0
			}
		},
		methods: {
			// showMask(){
			// 	this.maskShow = true
			// },
			pay(){
				//调起APP端支付功能
				// 由于对象映射，所以调用AppProxyClick对象等于调用Android映射的对象
				getGuaranteeOrder({},{
					"X-Source-App":this.source
				}).then(res=>{
					if(res.data.code==0){
						if(this.platform == 'ios'){
							// window.webkit.messageHandlers.quit.postMessage({body: res.data.data.order_no})
							prompt('pay',res.data.data.order_no)
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
			onServiceChat(){
				if(this.platform == 'ios'){
					prompt('onGotoServiceChat')
				}else{
					AppProxyClick.onGotoServiceChat();
				}
			},
			call(){
				if(this.platform == 'ios'){
					prompt('onGotoDial','0577-86859588')
				}else{
					AppProxyClick.onGotoDial('0577-86859588');
				}
			}
			// storePopDown(val){
			// 	this.attestPop=val
			// 	this.is_guarantee = uni.getStorageSync('is_guarantee')
			// }
		},
		onLoad() {
			this.platform=uni.getSystemInfoSync().platform
			
			if(this.platform == 'ios'){
				this.num=prompt('onGetAppConfig')
				this.source=JSON.parse(prompt('onGetSourceAppId',''))
				uni.setStorage({
					key: "token",
					data:prompt('onGetToken')
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
					this.is_temp_guarantee=res.data.data.is_temp_guarantee
					// uni.setStorage({
					// 	key: "type",
					// 	data: res.data.data.type
					// })
					// uni.setStorage({
					// 	key: "is_guarantee",
					// 	data: res.data.data.is_guarantee
					// })
				}
			})
		}
	}
</script>
<style scoped>
	page{
		background: #F5F7FA;
	}
	.page{
		padding-bottom: 300rpx;
	}
	.top{
		height: 116rpx;
		font-size: 28rpx;
		color: #FF3951;
		padding: 16rpx 32rpx;
		background: #FEE7E7;
	}
	.top .text{
		width: 500rpx;
		line-height: 44rpx;
	}
	.btn{
		color: #fff;
		font-size: 24rpx;
		padding: 0 22rpx;
		line-height: 56rpx;
		background: linear-gradient(90deg, #FF7474 0%, #FF5050 100%);
		border-radius: 100rpx;
	}
	.tips{
		z-index: 2;
		font-size: 30upx;
		line-height: 48upx;
		color: #687085;
		margin-bottom: 20upx;
	}
	.tips .test{
		width: calc(100% - 63upx);
	}
	.tips .dot{
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		background: #687085;
		margin: 18upx 10upx 0 43upx;
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
		line-height: 100rpx;
		background: linear-gradient(308deg, #2B7AFE 0%, #4C96FF 100%);
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		font-size: 36rpx;
		color: #FFFFFF;
		text-align: center;
		border-radius: 16rpx;
		left: 75rpx;
		right: 75rpx;
		bottom: 160rpx;
		z-index: 99;
	}
	.gap{
		border-bottom: 1rpx solid #DDE4EE;
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
		font-size: 30rpx;
		font-weight: bold;
		line-height: 54rpx;
		color: #4F5667;
	}
	.safe-content text{
		color: #3764FF;
		text-decoration: underline;
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
