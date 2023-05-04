<template>
	<view class="flex-column index">
		<!-- 头部 -->
		<view :class="['head', isEnterpriseVip ? 'paddingB' : '']">
			<u-navbar back-icon-color="#fff" title="我的特权" title-color="#fff" background="background:transparent" :border-bottom="false" title-size="36" title-bold></u-navbar>
		</view>
		
		<view class="button flex between center" v-if="info[tabIndex].vip && info[tabIndex].vip.length > 1">
			<view v-for="(item, index) in info[tabIndex].vip" :key="index" :class="['btn',btnIndex==index?'on':'']" @click="onVip(index)">
				{{ item.vip_name}}￥<text class="font40">{{ JSON.parse(item.origin_price) }}</text>
			</view>
		</view>

		<view :class="['flex1 flex',isEnterpriseVip?'marginT':'']" style="height: 200rpx;padding-bottom: 110rpx;">
			<scroll-view scroll-y class="scroll">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_vip_info.png" class="widthAll vipImg" mode="widthFix" v-if="tabIndex"></image>
				<view class="flex between marlr32 color14284A" v-if="info[tabIndex].vip.length<=1">
					<text class="heavy font32">会员专属服务</text>
					<view class="flex hcenter">
						<text class="bold font24" @click="comparedUp">查看服务对比</text>
						<image src="/static/images/dj_icon.png" class="width16 left8" mode="widthFix"></image>
					</view>
				</view>
				<image :src="!compared?info[tabIndex].images:info[tabIndex].contrast" class="widthAll martop8" mode="widthFix"></image>
				<view class="flex hcenter marlr32 martop28 color888D98" style="padding-bottom: 64rpx;" @click="onActive">
					<view class="radio">
						<image src="/static/images/gx_icon_sel.png" v-if="active" class="width32" mode="widthFix"></image>
					</view>
					<text class="left12">我已阅读知晓并确认</text>
					<text class="color0061FF" @click.stop="toWebView">《用户下单须知》</text>
				</view>
			</scroll-view>
		</view>

		<view class="foot flex between">
			<view class="left32 martop20">
				<text>{{info[tabIndex].vip[btnIndex].vip_name||''}}</text>
				<text class="font40 bold left8">{{info[tabIndex].vip[btnIndex].origin_price}}</text>元
			</view>
			<view class="subBtn" @click="submit">立即开通</view>
		</view>

		<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022829-1661737201124-rraN4r.png" class="fixedBtn" @click="toCustomer" mode=""></image>
		<u-mask :show="popImgUrl" @click="popImgUrl = false">
			<view class="popBox flex hcenter flexcenter" @click.stop="">
				<view class="relative">
					<image :src="`https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/${popImgUrl}.png?time=2022012809`" class="bg" mode="widthFix"></image>
					<view class="btns center flex bold">
						<view class="gray" @click="toCustomer">会员管家</view>
						<view class="blue left16 flex1" @click="toLink('/pagesV1/need/release')">前往深度咨询</view>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import { getVipDetail, getVipOrder, getPay } from "@/api/apis.js"

	/**
	 * URL 参数转换成对象
	 */
	function _queryString(request) {
		let params = request.split('?')[1];
		let param = params.split('&');
		let obj = {};
		for (let i = 0;i < param.length;i++) {
			let paramsA = param[i].split('=');
			let key = paramsA[0];
			let value = paramsA[1];
			if (obj[key]) {
				obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
				obj[key].push(value);
			} else {
				obj[key] = value;
			}
		}
		return obj;
	}

	export default {
		data() {
			return {
				type: 0,
				popImgUrl: false,
				compared: false,
				isEnterpriseVip: false,
				customer: {},
				info: {},
				tags: ['优选律师','平台保障','专属管家','高效便捷'],
				btnIndex: 0,
				active: 1,
				tabIndex: 0,

				qrcodeScanInfo: {}, // 小程序二维码扫码信息
			}
		},
		onLoad(query) {
			if (parseInt(query.type)) {
				this.isEnterpriseVip = query.type
				this.tabIndex = 1
			}

			// 扫描小程序二维码进入页面
			const routeParam = this.$commonUtil.routeParamParse(query);
			if (routeParam.scene) {
				const qrcodeScanInfo = _queryString(`?${ routeParam.scene }`);
				this.qrcodeScanInfo = qrcodeScanInfo;
			}
		},
		onShow() {
			this.customer=uni.getStorageSync('customer')
			this.getVipData();
		},
		methods: {
			toLink(url){
				this.popImgUrl=false
				uni.navigateTo({ url })
			},
			onTab(index){
				this.compared=false
				this.tabIndex=index
				this.btnIndex=0
			},
			onVip(index){
				this.btnIndex=index
			},
			onActive(){
				this.active=!this.active
			},
			comparedUp(){
				this.compared=true
			},
			toWebView(type){
				// var url=!type?getApp().globalData.config.user_service:getApp().globalData.config.privacy_policy
				var url=encodeURIComponent(getApp().globalData.config.order_agreement)
				uni.navigateTo({
					url:'/pagesV1/common/webview?url='+url
				})
			},
			/**
			 * 获取 vip 套餐
			 */
			getVipData(){
				getVipDetail().then(res => {
					// console.log(res)
					if(res.data.code == 0){
						this.info = res.data.data.vips
					}
				})
			},
			/**
			 * 立即开通
			 */
			submit(){
				if(!this.active) return uni.$u.toast('请确认用户下单协议')

				getVipOrder({
					vip_id: this.info[this.tabIndex].vip[this.btnIndex].vip_id
				}).then(order_no => {
					if (order_no.data.code == 0) {
						getPay({
							// #ifdef MP-WEIXIN
							type: 1,
							// #endif
							//#ifdef MP-TOUTIAO
							type: 3,
							//#endif
							order_no: order_no.data.data.order_no
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
									console.log(res)
									// #ifdef MP-TOUTIAO
									if(res.code != 0){
										return
									}
									// #endif
									if(this.tabIndex==0){
										this.popImgUrl='bxls_vip_ph'
									}else if(this.tabIndex==1){
										this.popImgUrl='bxls_vip_yx'
									}else{
										this.popImgUrl='bxls_vip_zx'
									}
									uni.setStorage({
										key: "is_vip",
										data: 1
									})
								},
								fail:res =>{
									console.log(res.errMsg)
								}
							})
						})
					}
				})
			},
			toCustomer(){
				this.popImgUrl=false
				uni.navigateTo({
					url: `/pagesV1/info/infoDetails?id=${this.customer.user_id}&name=${this.customer.nickname}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F7FA;
	}
	.index{
		width: 100vw;
		height: 100vh;
		position: absolute;
	}
	.scroll{
		height: 100%;
	}
	.marginT{
		margin-top: -100rpx !important;
	}
	.paddingB{
		padding-bottom: 142rpx !important;
	}
	.fixedBox{
		position: fixed;
		top: 0;
		z-index: 2;
	}
	.head{
		width: 100%;
		height: 380rpx;
		padding-bottom: 42rpx;
		// background: #F5F7FA url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_vip_bg2.png');
		background: #F5F7FA url('https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-09/2de422aa77ae340a7e3bafd891d143fe.png');
		background-size: 100% 100%;
		.tag {
			color: #fff;
			padding: 0 24rpx;
			line-height: 56rpx;
			border: 3rpx solid #FFFFFF;
			border-radius: 100rpx;
		}
		.tab-item{
			position: relative;
			height: 172rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 16rpx 30rpx rgba(0, 24, 119, 0.2);
			border-radius: 28rpx;
			margin-right: 20rpx;
			overflow: hidden;
			opacity: 0.64;
			&:last-child{
				margin-right: 0rpx;
			}
			.bg{
				display: block;
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				opacity: 0.12;
				position: absolute;
				right: -100rpx;
				bottom: -130rpx;
			}
			.tip{
				height: 54rpx;
				line-height: 54rpx;
				padding: 0 14rpx;
				background: linear-gradient(153deg, #63AAFF 0%, #3A84FF 100%);
				border-radius: 0rpx 28rpx 0rpx 28rpx;
				color: #FFFFFF;
				text-shadow: 0rpx 1rpx 4rpx rgba(0, 0, 0, 0.16);
				position: absolute;
				top: -1rpx;
				right: -1rpx;
			}
		}
		
		.on{
			opacity: 1;
		}
	}
	.radio{
		width: 32rpx;
		height: 32rpx;
		background: #E2E7EF;
		border-radius: 50%;
	}
	
	.button{
		margin: 32rpx 32rpx 20rpx;
		.btn{
			width: 327rpx;
			font-weight: bold;
			color: #3764FF;
			line-height: 88rpx;
			background: #E7F3FE;
			border: 2rpx solid #ACBFFF;
			border-radius: 48rpx;
		}
		.on{
			color: #FFFFFF;
			border: 2rpx solid #4873FF;
			background: linear-gradient(143deg, #4E97F9 0%, #3765FE 100%);
		}
	}
	.foot{
		width: 100%;
		height: 110rpx;
		color: #fff;
		position: fixed;
		bottom: 0;
		background: #424864;
		.subBtn{
			width: 285upx;
			height: 120upx;
			margin-top: -10rpx;
			line-height: 110upx;
			font-size: 32upx;
			font-weight: bold;
			text-align: center;
			background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_zf_bg.png');
			background-size: 100% 100%;
			
		}
	}
	.borderB{
		border-bottom: 1rpx solid #fff;
	}
	.fixedBtn{
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 168rpx;
		right: 32rpx;
		z-index: 9999;
	}
	.popBox{
		height: 100vh;
		.bg{
			width: 600rpx;
		} 
		.btns{
			line-height: 88rpx;
			margin: 0 32rpx;
			transform: translateY(-120rpx);
			.gray{
				width: 212rpx;
				background: #F3F5F8;
				color: #14284A;
				border-radius: 20rpx 20rpx 20rpx 32rpx;
			}
			.blue{
				background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
				color: #fff;
				border-radius: 20rpx 20rpx 32rpx 20rpx;
			}
		}
	}
</style>
