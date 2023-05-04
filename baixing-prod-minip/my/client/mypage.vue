<template>
	<view class="relative">
		<view :class="['page','relative',coverPage.status?'blur':'']" :style="{'background-image':`url(${info.background_image})`}">
			<!-- #ifndef MP-TOUTIAO -->
			<view class="barStatus"></view>
			<view class="flex relative flexcenter navBar">
				<image src="/static/images/leftjt.png" mode="widthFix" @click="pageReturn"></image>
				<view class="navtitle">编辑个人资料</view>
			</view>
			<!-- #endif -->

			<view class="flex flexcenter">
				<view class="relative">
					<image :src="info.avatar" mode="aspectFill" class="photo"></image>
					<image src="/static/images/sczp_icon.png" mode="widthFix" class="camera" @click="setPhoto"></image>
				</view>
			</view>
			<view class="tishi center">您填写的内容将用于个人展示及内容推荐</view>
			<view class="bottom">
				<view class="height">
					<view class="top" @click="clickPage">
						<view class="marlr32 flex between hcenter">
							<view class="name">编辑封面</view>
							<image src="/static/images/right.png" mode="widthFix" class="width14"></image>
						</view>
					</view>
					<view class="bottom1">
						<view class="flex between hcenter nicheng">
							<view class="name">昵称</view>
							<view class="flex hcenter">
								<input type="text" v-model="info.nickname" style="text-align: right;" @blur="saveSettings"/>
								<image src="/static/images/right.png" mode="widthFix" class="width14 left12"></image>
							</view>
						</view>
					</view>
					<view class="bottom1">
						<view class="flex between hcenter nicheng">
							<view class="name">性别</view>
							<view class="flex hcenter" @click="saveSettings">
								<text :class="['sexBox',info.gender === 1?'sexBox1':'']" @click="info.gender = 1">男</text><text :class="['sexBox',info.gender === 2?'sexBox2':'']" @click="info.gender = 2">女</text>
							</view>
						</view>
					</view>
					<view class="bottom1">
						<view class="flex between hcenter nicheng">
							<view class="name">个性签名</view>
							<view class="flex hcenter">
								<input type="text" v-model="info.description" style="text-align: right;"  @blur="saveSettings"/>
								<image src="/static/images/right.png" mode="widthFix" class="width14 left12"></image>
							</view>
						</view>
					</view>
					<!-- <view class="saveSettings">
						<view class="marlr32 saveSettingsbutton" @click="saveSettings">
							保存设置
						</view>
					</view> -->
				</view>
			</view>
		</view>
		<view class="pagelist" v-if="coverPage.status">
			<view class="barStatus"></view>
			<view class="flex relative flexcenter navBar">
				<image src="/static/images/leftjt.png" mode="widthFix" @click="clickPageReturn"></image>
				<view class="navtitle">封面设置</view>
			</view>
			<view class="flex marlr32">
				<view v-for="(item,index) in coverPage.list" :key="index" class="item center flex flexcenter">
					<image :src="item.url" mode="aspectFill"></image>
					<view :class="['button',index==coverPage.index?'active':'']" @click="clickButton(index)">
						{{index==coverPage.index?'已使用':'使用'}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUserInfo, getPageData, setMyInfo } from "@/api/apis.js";
	import { server } from "@/request.js";

	export default {
		data() {
			return {
				title: "编辑资料",
				info: {},
				coverPage: {
					status: false,
					list: [],
					index: null
				},
				initial: {
					avatar: null,
					background_image: null,
					nickname: null
				}
			}
		},
		methods: {
			pageReturn() { //返回我的
				uni.navigateBack({
					delta: 1
				})
			},
			saveSettings() {
				setMyInfo({
					avatar: this.info.avatar,
					background_image: this.coverPage.index!=null?this.coverPage.list[this.coverPage.index].url:this.info.background_image,
					nickname: this.info.nickname,
					description:this.info.description||'',
					gender:this.info.gender
				}).then(res => {
					console.log(123)
					if (!res.data.code) {
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			clickPageReturn() {
				this.coverPage.status = false
			},
			clickButton(index) {
				this.coverPage.index = index;
				this.info.background_image = this.coverPage.list[this.coverPage.index].url
				this.coverPage.status = false
				this.saveSettings()
			},
			getPageData() { //获取封面列表
				getPageData().then(res => {
					this.coverPage.list = res.data.data;
					res.data.data.forEach((item, index) => {
						if (item.is_selected||this.info.background_image==item.url) {
							console.log('zhong')
							this.coverPage.index = index;
							this.initial.background_image = item.url
						}
					})
				})
			},
			clickPage() { //点击编辑封面
				this.coverPage.status = true
			},
			setPhoto() { //修改头像
				uni.chooseImage({
					count: 1,
					success: blob => {
						console.log('图片',blob)
						this.upload(blob.tempFilePaths[0],1)
					}
				})
			},
			upload(url,num){
				uni.uploadFile({
					url: `${server}api/common/image`,
					filePath: url,
					header: {
						"Authorization": uni.getStorageSync('token'),
					},
					name: "image",
					success: res => {
						let data = JSON.parse(res.data)
						if (data.code == 1009) {
							uni.clearStorage()
							uni.navigateTo({
								url: "/pagesV1/common/login"
							})
						}
						if(data.code==0){
							this.$set(this.info, "avatar", data.data.url);
							console.log('url',data.data.url)
							this.saveSettings()
						}else{
							if(num<=3){
								num++
								this.upload(url,num)
							}
						}
					}
				})
			},
			getUserInfo() { //获取个人信息
				getUserInfo().then(res => {
					this.$set(this, "info", res.data.data)
					this.initial.avatar = res.data.data.avatar;
					this.initial.nickname = res.data.data.nickname
				})
			}
		},
		onLoad() {
			this.getPageData();
			this.getUserInfo();
		},
		onShow() {
		}
	}
</script>

<style lang="scss">
	.navBar {
		image {
			position: absolute;
			width: 34rpx;
			left: 32rpx;
			top: 20rpx;
		}

		.navtitle {
			font-size: 36rpx;
			font-weight: bold;
		}

		color: #fff;
		line-height: 60rpx;
	}

	.pagelist {
		.item:nth-child(3n-1) {
			margin: 18rpx 13rpx;
		}

		.item {
			.active {
				background-color: blue !important;
				color: #FFFFFF !important;
			}

			.button {
				width: 160rpx;
				line-height: 48rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				text-align: center;
				margin-top: 20rpx;
				color: #000000;
			}

			image {
				width: 220rpx;
				height: 308rpx;
			}

			margin: 18rpx 0rpx;
			width: 220rpx;
		}

		position: fixed;
		background: rgba(0, 0, 0, 0.8);
		height: 100%;
		top: 0;
		width: 100%;
		color: #FFFFFF;
	}

	.bottom {
		.height {
			.saveSettings {
				.saveSettingsbutton {
					text-align: center;
					background: #0061FF;
					border-radius: 8rpx;
					line-height: 100rpx;
					font-size: 36rpx;
					color: #FFFFFF;
				}

				width: 100%;
				position: absolute;
				bottom: 68rpx;

			}
			.sexBox{
				width: 120rpx;
				height: 60rpx;
				background: #F5F7FA;
				border-radius: 100rpx;
				line-height: 60rpx;
				font-size: 32rpx;
				color: #888D98;
				text-align: center;
				margin-left: 12rpx;
			}
			.sexBox1{
				background: linear-gradient(130deg, #66ADFF 0%, #2172FD 100%);
				box-shadow: 0px 4rpx 16rpx rgba(0, 35, 212, 0.36);
				color: #fff;
			}
			.sexBox2{
				background: linear-gradient(130deg, #FF6666 0%, #FD2164 100%);
				box-shadow: 0px 4rpx 16rpx rgba(212, 0, 0, 0.36);
				color: #fff;
			}
			.bottom1 {
				margin: 0 32rpx;
				border-bottom: 1rpx solid #ECEFF4;
				.nicheng {
					padding: 32rpx 0;
				}
				.name {
					font-size: 34rpx;
					color: #222222;
				}
			}

			.top {
				.name {
					font-size: 34rpx;
					color: #222222;
				}

				padding: 48rpx 0 32rpx;
				border-bottom: 12rpx solid #F5F7FA;
			}

			height: 100%;
			position: relative;
		}

		position: absolute;
		width: 100%;
		bottom: 0;
		height: 58vh;
		background-color: #FFFFFF;
		border-radius: 32rpx 32rpx 0px 0px;
	}

	.tishi {
		font-size: 26rpx;
		color: #FFFFFF;
		opacity: 0.84;
		margin-top: 120rpx;
	}

	.camera {
		width: 68rpx;
		position: absolute;
		right: -4upx;
		bottom: 0;
	}

	.photo {
		width: 216rpx;
		height: 216rpx;
		border-radius: 100px;
		margin-top: 123rpx;
		background: #fff;
		display: block;
		border: 4rpx solid #fff;
	}

	.page {
		height: 100vh;
		background-size: 100vw;
	}

	.blur {
		filter: blur(5px);
	}
</style>
