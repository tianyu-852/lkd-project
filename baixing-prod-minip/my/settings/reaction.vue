<template>
	<view class="flex-column" style="min-height: 100vh;">
		<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_safguard_1.png" mode="" class="bg_img_1"></image>
		<!-- #ifndef MP-TOUTIAO -->
		<view class="nav relative">
			<image class="backIcon" src="/static/images/nav_fh_icon.png" mode="" @click="backNav"></image>
			意见反馈
		</view>
		<!-- #endif -->
		
		<view class="safe-title flex-row hcenter">
			<view class="safe-title-before"></view>温馨提示
		</view>
		<view class="marlr32">
			<view class="prompt">
				亲爱的用户，为了保障每一位用户的权益，如遇到任何使用问题，请在下面输入遇到的问题或者以截图的形式反馈给我们，客服会及时联系您。您也可以将问题反馈到<text class="linkText relative" @click="toLink(0)">在线客服</text> 
			</view>
			<view class="prompt">
			    如需咨询法律问题，请点击<text class="linkText" @click="toLink(1)">图文咨询</text>
					<!-- 或是<text class="linkText" @click="toLink(2)">电话咨询</text>寻找帮助 -->
			</view>
		</view>
		<view class="card-box">
			<view class="flex between type">
				<view v-for="(item,index) in type.list" :key="index" class="flex hcenter" @click="clickType(index)">
					<image :src="type.index==index?'/static/images/xx_icon_sel.svg':'/static/images/xx_icon.svg'"
					 mode="widthFix"></image>
					<view :class="type.index==index?'active':'text'">{{item}}</view>
				</view>
			</view>
			<view class="val">
				<view class="marlr32">
					<textarea v-model="val" placeholder="对我们的产品或有什么更好的意见欢迎补充哦" maxlength="200" />
					<view class="flex between hcenter">
						<view class="Upload flex hcenter" @click="upload">
							<image src="/static/images/sctp9_icon.svg" mode="widthFix"></image>
							<view class="text">上传照片({{uploadImg.length}}/9)</view>
						</view>
						<view class="num">{{val.length}}/200</view>
					</view>
				</view>
			</view>
			<view class="flex">
				<view class="upLi relative" v-for="(item,index) in uploadImg" :key="index">
					<image src="/static/images/gb_icon.png" mode="widthFix" class="absImg" @click="delImg(index)"></image>
					<image  :src="item" mode="aspectFill" class="UploadImg " @click="previewImage(uploadImg,index)"></image>
				</view>
			</view>
			<view class="button center" @click="clickButton">提交反馈</view>
		</view>
	</view>
</template>

<script>
	import {getReaction} from "@/api/apis.js"
	import {server} from "@/request.js";
	export default {
		data() {
			return {
				type: {
					list: ["鼓励加油", "我要差评", "发表意见"],
					index: 0
				},
				uploadImg:[],
				// banner:{
				// 	status:false
				// },
				val:''
			}
		},
		methods: {
			toLink(index) {
				if(index == 0){
					// #ifndef MP-WEIXIN
						uni.makePhoneCall({ phoneNumber: '400-600-5030' });
					// #endif

					// #ifdef MP-WEIXIN
					uni.navigateTo({ url:'/pagesV1/info/infoDetails?id=new_1&name=官方客服' })
					// #endif
				} else if (index == 1) {
					if(uni.getStorageSync('type') == 0)
					uni.navigateTo({ url:'/pages/module-dynamic/dynamic-create/dynamic-create' })
				} else if (index == 2) {
					if(uni.getStorageSync('type') == 0)
					uni.navigateTo({ url:'/pagesV1/index/match' })
				}
			},
			backNav(){
				uni.navigateBack()
			},
			clickButton(){
				if(!this.val){
					uni.showToast({
						title:"请填写内容",
						icon:"none"
					})
					return
				}
				getReaction({
					content:this.val,
					suggest_type:this.type.index,
					images:JSON.stringify(this.uploadImg)
				}).then(res=>{
						uni.navigateBack();
						uni.showToast({
							title:res.data.code?'反馈失败':'反馈成功',
							icon:"none"
						})
					
				})
			},
			delImg(index){
				this.uploadImg.splice(index,1)
			},
			
			clickType(index) {//types
				this.type.index = index
			},
			previewImage(urls,index){
				uni.previewImage({
					current: index,
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
			
			upload(){//图片上传
				uni.chooseImage({
					success:blob=>{
						if(blob.tempFilePaths.length + this.uploadImg.length > 9){
							uni.showToast({
								title:'已超过9张',
								icon:'none'
							})
							return
						}
						console.log(blob);
						blob.tempFilePaths.forEach((item,index)=>{
							this.uploadFile(blob.tempFilePaths[index],1)
						})
						
					}
				})
			},
			uploadFile(url,num){
				uni.uploadFile({
					url:`${server}api/common/image`,
					filePath:url,
					header:{
						"Authorization":uni.getStorageSync('token'),
					},
					name:"image",
					success:res=>{
						let data = JSON.parse(res.data)
						if (data.code == 1009) {
							uni.clearStorage()
							uni.navigateTo({
								url: "/pagesV1/common/login"
							})
						}
						if(data.code==0){
							this.uploadImg.push(data.data.url)
						}else{
							if(num<=3){
								num++
								this.uploadFile(url,num)
							}
						}
					}
				})
			}
		},
		onLoad() {

		}
	}
</script>
<style>
	page{
		background: linear-gradient(316deg, #DEE9FF 0%, #F0F6FF 100%);
	}
</style>
<style lang="scss">
	.linkText{
		color: #0061FF;
		text-decoration: underline;
	}
	.card-box{
		margin-top: 24rpx;
		flex: 1;
		background: #fff;
		padding: 40rpx 32rpx 0 32rpx;
		
border-radius: 36rpx 36rpx 0px 0px;
	}
	.safe-title{
		 margin-top: 69rpx;
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
		 font-size: 36rpx;
		 font-weight: bold;
		 line-height: 50rpx;
		 color: #383F50;
		 text-align: center;
		 margin-top: 107rpx;
		 
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
	.button{
		background: #0061FF;
		border-radius: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #FFFFFF;
		
box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		margin-top: 160rpx;
	}
	// .swiperbox{
	// 	.bannerImg{
	// 		width: 100%;
	// 	}
	// 	.swiper{
	// 		height: 100%;
	// 	}
	// 	position: fixed;
	// 	z-index: 999;
	// 	width: 100%;
	// 	height: 100%;
	// 	top: 0;
	// 	background-color: #000000;
	// }
	.upLi{
		.absImg{
			position: absolute;
			width: 30rpx;
			right: 0;
			top: 0;
		}	
		.UploadImg{
			width: 200rpx;
			height: 200rpx;
		}
		margin: 16rpx 14rpx;
	}
	.val {
		.num{
			font-size: 24rpx;
			color: #C9CED9;
		}
		.Upload{
			image{
				width: 32rpx;
			}
			.text{
				font-size: 24rpx;
				font-weight: bold;
				color: #979EB3;
				margin-left: 12rpx;
			}
		}
		textarea{
			width: 100%;
			height: 220rpx;
			padding-top: 24rpx;
		}
		background: #F3F5F8;
		border-radius: 8rpx;
		height: 300rpx;
	}

	.type {
		.text {
			font-size: 30rpx;
			color: #888D98;
		}

		.active {
			font-size: 30rpx;
			font-weight: bold;
			color: #222222;
		}

		image {
			width: 28rpx;
			height: 28rpx;
			margin-right: 12rpx;
		}

		// margin-top: 60rpx;
		padding-bottom: 32rpx;
		border-bottom: 1rpx solid #ECEFF4;
	}

	.prompt {
		margin-top: 16rpx;
		line-height: 50rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #4F5667;
	}
</style>
