<template>
	<view>
		<view class="flex-row" style="padding:80upx 36upx;">
			<image src="/pagesV2/static/images/qd_icon.svg" style="width: 80upx;height: 80upx;"></image>
			<text class="title">资料已成功提交，请<text style="color: #FF6E57;">前往下载APP</text>进行人
			脸识别确认律师身份</text>
		</view>
		<view class="bottom flex-column">
			<image class="QRCode" :src="qrcode.url" @longtap="longtap"></image>
			<view class="button" @click="longtap">保存二维码</view>
			<text class="hint">认证方法</text>
			<view class="hint flex"style="margin-top: 26upx;">
				<image src="/pagesV2/static/images/d_icon.svg"  mode=""></image>方法1.前往各大商城搜索 <text style="color: #FF6E57;">[百姓律师]</text> 点击下载
			</view>
			<view class="hint flex" style="margin-top: 46upx;">
				<image src="/pagesV2/static/images/d_icon.svg" mode=""></image>方法2.保存图片,识别图中二维码扫码完成下载
			</view>
		</view>
		
	</view>
</template>

<script>
	import QR from "../static/wxqrcode.js" // 二维码生成器  
	import { pathToBase64, base64ToPath } from '../static/index.js'
	
	export default {
		data() {
			return {
				qrcode:{
					url:'',
					code:''
				},
			}
		},
		methods: {
			longtap(e){
				console.log(e)
				uni.saveImageToPhotosAlbum({
				filePath:this.qrcode.url,
					success:res=>{
						console.log(res)
						this.$u.toast('已保存图片到相册')
					},
					fail:res=>{
						console.log(res)
					}
				})
			}
		},
		onLoad() {
			let base64Img = QR.createQrCodeImg('https://h5.lawkd.com:12229/empty', {  
			     size: parseInt(300)//二维码大小  
			})
			this.qrcode.url = base64Img
			base64ToPath(base64Img)
			.then(path => {
				this.qrcode.url=path
				// console.log(path)
			 })
			.catch(error => {
				console.error(error)
			 })
			// console.log(img)
		}
	}
</script>
<style>
	page{
		background: #F5F7FA;
	}
</style>
<style scoped lang="scss">
	
	.title{
		margin-left: 24upx;
		font-size: 30upx;
		font-weight: bold;
		line-height: 48upx;
		color: #222222;
	}
	.bottom{
		.hint{
			line-height: 42upx;
			font-size: 30upx;
			font-weight: bold;
			color: #222222;
			image{
				width: 32upx;
				height: 32upx;
				margin: auto;
				margin-left: 0;
				margin-right: 20upx;
			}
			margin-left: 32upx;
		}
		height: 1199upx;
		background: #FFFFFF;
		box-shadow: 0px -4upx 20upx rgba(0, 67, 184, 0.09);
		border-radius: 40upx 40upx 0px 0px;
		.QRCode{
			width: 260upx;
			height: 260upx;
			background: #FFFFFF;
			box-shadow: 0px 8upx 40upx rgba(3, 30, 119, 0.2);
			border-radius: 16upx;
			padding: 20upx;
			margin: auto;
			margin-top: 88upx;
			margin-bottom: 0;
		}
		.button{
		margin: auto;
		margin-top: 88upx;
		width: 600upx;
		height: 90upx;
		line-height: 90upx;
		background: linear-gradient(90deg, #5090FF 0%, #2B69FA 100%);
		box-shadow: 0px 6upx 16upx rgba(0, 27, 201, 0.32);
		border-radius: 100px;
		font-size: 32upx;
		color: #FFFFFF;
		text-align: center;
		margin-bottom: 100upx;
	}
	}
</style>
