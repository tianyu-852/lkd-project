<template>
	<view class="hidden">
		<u-navbar title="百姓律师" :title-bold="true" title-size="36" title-color="#383F50" background="{background:transparent}" :border-bottom="false"></u-navbar>
		<view class="marlr32 martop32">
			<view class="font32 heavy">尊敬的百姓律师用户：</view>
			<view class="color6E7695 font28 martop20 bold">{{info.text1}}</view>
		</view>
		<image class="bg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_image.png" mode="widthFix"></image>
		<view class="cell ">
			<view class="">
				<view class="flex hcenter">
					<view class="dot"></view>
					<text class="left20 font30 bold text">{{info.text2}}</text>
				</view>
				<view class="qrcodeBox center widthAll">
					<image :src="code||'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_noavatar.png'" show-menu-by-longpress="true" mode=""></image>
					<view class="heavy font34 color14284A">长按添加法律管家微信</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getWeChatQrCode } from "@/api/apis.js";

	export default {
		data() {
			return {
				id: null,
				token: '',
				code:'',
				customer:{},
				info:{}
			}
		},
		onLoad(e) {
			if(e.user_id){
				this.id=e.user_id
			}
			this.info={
				text1:'为保证服务及时性，您可添加法律管家微信',
				text2:'1.长按下方二维码，添加专属法律管家微信',
				text3:'',
				text4:'',
				text5:'1.长按保存图片，打开微信识别二维码下载百姓律师app'
			}
		},
		onShow() {
			this.token=uni.getStorageSync('token')
			this.customer=uni.getStorageSync('customer')
			if(!this.token&&!this.id){
				uni.navigateTo({
					url:'/pagesV1/common/login'
				})
			}
			if(!this.code){
				this.getQrCode()
			}
		},
		methods: {
			getQrCode(){
				getWeChatQrCode({user_id:this.id||this.customer.user_id}).then(res=>{
					if(res.data.code==0){
						if(!res.data.data.wechat_add_qrcode_image){
							uni.$u.toast('获取二维码失败')
							return
						}
						this.code=res.data.data.wechat_add_qrcode_image
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #fff;
	}
	.bg{
		width: 100%;
		position: absolute;
		top: 0;
		z-index: -1;
	}
	.cell{
		font-size: 30rpx;
		border-radius: 56rpx 56rpx 0rpx 0rpx;
		padding: 60rpx 32rpx 0;
		margin-top: 32rpx;
		background-color: #fff;
	}
	.cell .text{
		width: calc(100% - 52rpx);
	}
	.dot{
		width: 32rpx;
		height: 32rpx;
		border: 8rpx solid #0061FF;
		border-radius: 50%;
		background-color: #fff;
	}
	.border_l{
		height: 44rpx;
		border-left: 2rpx dotted #0061FF;
		margin-left: 16rpx;
	}
	.qrcodeBox image{
		width: 480rpx;
		height: 480rpx;
		padding: 16rpx;
		border-radius: 16rpx;
		box-shadow: 0rpx 8rpx 40rpx rgba(3, 30, 119, 0.2);
		margin: 256rpx 0 32rpx;
		pointer-events: auto !important;
	}
	.hint{
		color: #FF6160;
		padding: 0 18rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 48rpx;
		background: #FFEFEF;
		border: 1rpx solid #FFD2D2;
		border-radius: 20rpx;
		margin-bottom: 36rpx;
	}
</style>
