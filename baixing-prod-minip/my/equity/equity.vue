<template>
	<view class="flex-column ">
		<view class="customBack">
			<image src="/static/images/nav_fh_icon.png" @click="customBack"></image>
		</view>
		<image style="" class="bgImg" src="http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_equity.png" mode="widthFix"></image>
		<view class="banner flex-column">
			<!-- <view class="goldtitle flex-column">
				<image src="/my/static/images/btbg_image.svg" mode="widthFix"></image>
				<text>让你的专业能力不再无处施展</text>
			</view> -->
			
				<!-- <swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" @change="bannerChange">
					<swiper-item v-for="item,index in banner.imgs" :key="index"> -->
					<!-- #ifdef H5 -->
					<view class="swiper-item" v-if="banner.imgs">
						<image :src="banner.imgs[0]" mode="aspectFill"></image>
					</view>
					<!-- #endif -->
						<!-- 
					</swiper-item>
			</swiper> -->
			<!-- #ifndef H5 -->
			<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_az_image@3x.png" mode="widthFix" style="width: 100%;"></image>
			<!-- #endif -->
			
			
			
			<!-- <view class="customDots flex-row">
				<view v-for="(item,index) in banner.imgs" :class="['dot',index==banner.current?'active':'']" :key="index"></view>
			</view> -->
			<!-- <view class="hint">
				触达更多的案源，赚取更多的佣金
			</view> -->
		</view>
		<!-- #ifndef H5 -->
		<view class="banner flex-column" style="margin-top: 40rpx;">
			<image style="width: 100%;" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_ios_image@3x.png" mode="widthFix"></image>
		</view>
		<!-- #endif -->
		<!-- <view class="flex-row money">
			<view v-for="(item,index) in prices" :key="index" :class="['item',index === pricesIndex?'active':'']" @click="pricesIndex = index">
				<text class="title">{{item.name}}</text>
				<view class="flex-row flexcenter value"><text style="font-size: 28upx;line-height: 92upx;">￥</text>{{item.price}}</view>
				<text class="hint">原价￥{{item.origin_price}}</text>
			</view>
		</view> -->
		<view class="apply" @click="applyOrder">
			下载APP认证律师
			<!-- 申请认证￥{{prices[pricesIndex].price}} -->
		</view>
		
		<!-- <view class="checkbox marlr32 flex-row">
			<image :src="value?'/static/images/gx_icon.svg':'/my/static/images/gx_icon_sel_gold.svg'" mode=""></image>
			已同意[律师合作协议]、[隐私协议]
		</view>
		
		<view class="goldtitle flex-column" style="margin-top: 57upx;">
			<image src="/my/static/images/btbg_image.svg" mode="widthFix"></image>
			<text>专属律师主页直通客户</text>
		</view>
		<image src="http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lawyer_show.png" class="lawyerShow" mode="widthFix"></image>
		<view class="showHint">平台审核·资质可靠·标签展示</view> -->
		<u-mask :show="show" @click="show = false">
			<view class="dialogBox flex-column">
				<view class="flex-column">
					<image :src="isYX?'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/dialog_yxrz_image.png':'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/dialog_rzls_image.png'" mode=""></image>
					<view :class="['button',isYX?'button-yellow':'']" >	
						立即前往
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import {
		getLawyerAuthPrices,
		sendLawyerAuthOrder,
		getPay,
		getMyData
	} from "@/api/apis.js"
	
	export default {
		data() {
			return {
				isYX:0,
				show:false,
				banner:{
					current:0
				},
				pricesIndex:0,
				prices:[],
				user:{}
			}
		},
		methods: {
			applyOrder(){
				//#ifdef H5
				window.location.href='https://h5.lawkd.com:12229/empty'
				//#endif
				//#ifndef H5
				return
				//#endif
				const {pricesIndex,prices} = this
				if(true){//this.user.is_show_buy_lawyer_auth === 0
					uni.navigateTo({
						url:'/my/identification'
					})
					return
				}
					
				sendLawyerAuthOrder({
					lawyer_auth_price_id:prices[pricesIndex].lawyer_auth_price_id
				}).then(res => {
					if(res.data.code){
						this.$u.toast(res.data.message)
					}else{
						uni.navigateTo({
							url:`/pagesV2/pay/pay?id=${res.data.data.order_no}`
						})
						return
						getPay({
							// #ifdef MP-WEIXIN
							type: 1,
							// #endif
							//#ifdef MP-TOUTIAO
							type: 3,
							//#endif
							order_no: res.data.data.order_no
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
									this.user.is_show_buy_lawyer_auth = 0
									uni.navigateTo({
										url:'/my/identification'
									})
								}
							})
						})
					}
				})
			},
			bannerChange(e){
				this.banner.current = e.detail.current
			},
			customBack(){
				uni.navigateBack()
			}
		},
		onShareAppMessage(res) {
			return {
				title: '百姓律师一站式法律服务平台',
				imageUrl: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_share_equiy.png'
			}
		},
		onLoad(e) {
			getLawyerAuthPrices().then(res=>{
				if(res.data.code)
					return
				this.banner.imgs = res.data.data.banners
				this.prices = res.data.data.prices
			})
			getMyData().then(res =>{
				if(res.data.code)
					return
				this.user = res.data.data
			})
		},
		onShow() {
			
		}
	}
</script>
<style>
	page{
		width:100%;
		overflow-x:hidden;
		background: linear-gradient(180deg, #383F5E 0%, #172047 100%);
	}
</style>
<style scoped lang="scss">
	.bgImg{
		width: calc(100vw - 19upx);
		padding-left: 19upx;
		margin-top: 88upx;
	}
	.dialogBox{
		height: 100vh;
		align-items: center;
		justify-content:center;
		image{
			width: 500upx;
			height: 580upx;
			z-index: 0;
		}
		.button{
			width: 360upx;
			height: 90upx;
			line-height: 90upx;
			background: linear-gradient(180deg, #4686FC 0%, #2B69F9 100%);
			box-shadow: 0px 0px 20upx rgba(0, 29, 122, 0.4);
			border-radius: 100px;
			font-size: 34upx;
			font-weight: bold;
			color: #FFFFFF;
			margin: auto;
			margin-top: -63upx;
			z-index: 2;
			text-align: center;
		}
		.button-yellow{
			background: linear-gradient(180deg, #FCBE46 0%, #F9922C 100%);
		}
	}
	.lawyerShow{
		margin:auto;
		margin-top: 16upx;
		width: 638upx;
	}
	.showHint{
		line-height: 40upx;
		font-size: 28upx;
		font-weight: bold;
		color: #FFFFFF;
		text-align: center;
		padding: 6upx 0 49upx 0;
	}
	.checkbox{
		margin-top: 28upx;
		line-height: 37upx;
		font-size: 26upx;
		color: #FFFFFF;
		image{
			width:26upx ;
			height: 26upx;
			margin: auto;
			margin-left: 0;
			margin-right: 11upx;
		}
	}
	.goldtitle{
		height: 76upx;
		font-size: 31upx;
		font-weight: bold;
		color: #593816;
		text-align: center;
		width: 538upx;
		margin: auto;
		line-height: 76upx;
		position: relative;
		text{
			z-index: 2;
		}
		image{
			width: 100%;
			position: absolute;
			z-index: 1;
		}
	}
	.banner{
		margin:-228upx 32upx 0 32upx;
		background: #FFFFFF;
		border-radius: 24upx;
		padding: 25upx 22upx 45upx 22upx;
		z-index: 2;
		// padding-bottom: 25upx;
		.hint{
			line-height: 40upx;
			font-size: 28upx;
			font-weight: bold;
			color: #222222;
			text-align: center;
		}
		
		/deep/ swiper{
			margin-top: 25upx;
			height: 920upx;
			box-shadow: 0px 4upx 16upx rgba(0, 51, 146, 0.2);
			border-radius: 25upx;
			// background: linear-gradient(180deg, #575D73 0%, #424764 100%);
		}
		.swiper-item{
			height: 946upx;
			// height: 100%;
			width: 100%;
			image{
				height: 100%;
				width: 100%;
				
			}
		}
		.customDots{
			padding: 24upx 0;
			width: auto;
			margin: auto;
			.dot{
				width: 16upx;
				height: 16upx;
				margin: 0 8upx;
				background: #DBE3EF;
				border-radius: 50%;
			}
			.active{
				background:#ECBF9A  !important;
			}
		}
	}
	
	.money{
		margin: 48upx 32upx 0 32upx;
		.item{
			flex: 1;
			margin-right: 16upx;
			background: linear-gradient(180deg, #575D73 0%, #424764 100%);
			box-shadow: 0px 4upx 16upx rgba(0, 19, 54, 0.53);
			border-radius: 20upx;
			text-align: center;
			padding: 24upx 0 37upx 0;
			text{
				display: block;
			}
			.title{
				line-height: 40upx;
				font-size: 28upx;
				font-weight: 400;
				color: #FBD8BC;
			}
			.value{
				height: 75upx;
				line-height: 75upx;
				font-size: 54upx;
				font-weight: bold;
				color: #FBD8BC;
				margin-top: 8upx;
				
			}
			.hint{
				line-height: 30upx;
				font-size: 22upx;
				color: #898D9E;
				margin-top: 16upx;
				text-decoration:line-through
			}
		}
		.item:last-child{
			margin-right: 0upx;
			
		}
		.active{
			.title{
				color: #593816;
				font-weight: bold;
			}
			.value{
				color: #4E311F;
			}
			.hint{
				color: #AC8D70;
			}
			background: linear-gradient(180deg, #FADCBD 0%, #F9C793 100%);
		}
		
	}
	
	.apply{
		margin: 25upx 0 0 0;
		line-height: 141upx;
		background: linear-gradient(91deg, #ECBD98 0%, #FAE2C4 100%);
		box-shadow: 0px 4upx 20upx rgba(0, 0, 0, 0.2);
		border-radius: 16upx 16upx 0px 0px;
		text-align: center;
		font-size: 40upx;
		font-weight: bold;
		color: #6D482E;
		z-index: 2;
	}
</style>
