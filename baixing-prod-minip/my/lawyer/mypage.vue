<template>
	<view class="relative">
		<view :class="['page','relative']">
			<view class="barStatusH"></view>
			<view class="flex relative flexcenter navBar">
				<image src="/static/images/leftjt.png" mode="widthFix" @click="pageReturn"></image>
				<view class="navtitle">编辑个人资料</view>
			</view>
			<view class="avatar">
				<image :src="info.avatar" mode="aspectFill" class="photo"></image>
				<image src="/static/images/sczp_icon.png" mode="widthFix" class="camera" @click="setPhoto"></image>
			</view>
			
			<view class="pageName center">{{info.nickname}}</view>
			<view class="tishi center">您填写的内容将用于个人展示及内容推荐</view>
			<view class="bottom">
				<view class="top flex between hcenter" >
					<view class="name">登录账号</view>
					<view class="flex hcenter u-flex-1 color888D98">
						<view class="u-flex-1">
							{{info.mobile}}
						</view>
					</view>
				</view>
				<view class="top flex between hcenter" >
					<view class="name">咨询接听</view>
					<view class="flex hcenter u-flex-1 color888D98">
						<view class="u-flex-1">
							{{info.call_mobile}}
						</view>
					</view>
				</view>
				<view class="top flex between hcenter">
					<view class="name">律所</view>
					<view class="flex hcenter u-flex-1 color888D98">
						<view class="u-flex-1">
							{{info.lawyer_office}}
						</view>
						<text style="color:#0061FF;">更换</text>
						<!-- <image src="/static/images/right.png" mode="widthFix" class="width14"></image> -->
					</view>
				</view>
				<view class="top flex between hcenter" @click="toMap">
					<view class="name">律所地址</view>
					<view class="flex hcenter u-flex-1 color888D98">
						<image style="width: 21upx;" mode="widthFix" src="/static/images/dw_icon@3x.png"></image>
						<view class="u-flex-1" @click="">
							{{info.lawyer_office}}
						</view>
					</view>
				</view>
				<view class="top flex between hcenter" @click="clickTypes">
					<view class="name">个人标签</view>
					<view class="flex hcenter u-flex-1 color888D98">
						<view class="u-flex-1" >
							<text v-for="(item,index) in info.lawyer_tag_ids" :key="index">{{index==0?'':'、'}}{{item.lawyer_tag}}</text>
						</view>
						<image src="/static/images/right.png" mode="widthFix" class="width14"></image>
					</view>
				</view>
				
				<view class="textarea flex-column" :style="dropdownVal.fundraising_role != '本人'?'margin-top:28upx !important;':''">
					<!-- <textarea cols="30" placeholder-style="color:#C9CED9" rows="10" v-model="textarea" :placeholder="user.type ==1?'请简单描述下您的案件经过':'请简单描述下您的案件经过(选填)'" maxlength="300" @input="inputChange" :auto-height="true" v-if="!dialogShow && !show"></textarea> -->
					<u-input v-model="info.introduction" :clearable="false" type="textarea" :border="border" maxlength="300"  :custom-style="textareaSty" placeholder="律师个人简介(选填)" v-if="isShow"></u-input>
					<text class="hint">({{info.introduction.length}}/300字)</text>
				</view>
				<view class="slot-btn flex-row">
					<u-upload ref="lawyerUpload" :index="`lawyer${lawyerIndex}`" @on-change="uploadChange" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="Lhonor_certificates[lawyerIndex]"  custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)" :show-upload-list="false">
						<view slot="addBtn" class="slot-btn flex-row cell marlr32">
							
							<text>上传律师荣誉照({{honor_certificates?honor_certificates.length:0}}/9)</text>
							<view class="hint">
								上传
							</view>
							<image style="width: 34upx;height: 28upx;margin: auto;" src="/static/images/sctp9_icon.svg"></image>
							
						</view>
					</u-upload>
				</view>
				<view style="margin: 4upx 0 0 64upx;">
					<view class="honorItem flex-column" v-for="img,index in honor_certificates">
						<image class="uploadImg" :src="img.image" mode="aspectFill"></image>
						<view class="label flex">
							<image src="/my/static/images/bj_icon@3x.png"></image>
							<u-input :clearable="false" v-model="img.title" height="37" placeholder="荣誉描述" class="input"/>
						</view>
						<image class="delImg" src="/pagesV2/static/images/gb_icon.svg" @click="removeHonor(index)"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<view class="saveSettings">
					<view class="marlr32 saveSettingsbutton" @click="saveSettings">
						提交
					</view>
				</view>
			</view>
		</view>
		<manyTypes ref="manyTypes" :types="types" @clickItem="clickItem" @showChange="showChange"></manyTypes>

	</view>
</template>

<script>
	import manyTypes from "@/my/components/manyTypes.vue"
	import {
		// getUserInfo,
		// setLawyerInfo,
		getMyData,
		setLawyerForm
	} from "@/api/apis.js";
	import {
		server
	} from "@/request.js"
	export default {
		components: {
			manyTypes
		},
		data() {
			return {
				action: `${server}api/common/image`,
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				honor_certificates:[],
				title: "编辑资料",
				info: {
					lawyer_tag_ids:[]
				},
				introduction:null,
				initial: {
					avatar: null,
					background_image: null,
					nickname: null
				},
				types:[],
				Lhonor_certificates:[],
				honor_certificates:[],
				isShow:true,
				newLocation:null
			}
		},
		methods: {
			toMap(e){
				const {info} = this
				uni.chooseLocation({
					latitude:info.lawyer_office_lat?parseFloat(info.lawyer_office_lat):'',
					longitude:info.lawyer_office_lng?parseFloat(info.lawyer_office_lng):'',
				    success: res=> {
						this.newLocation = {lawyer_office_lat:res.latitude,
						lawyer_office_lng:res.longitude}
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
				    }
				});
			},
			showChange(e){
				// console.log(e)
				this.isShow = !e
			},
			uploadChange(res, index, lists, name){
				let list = []
				for (let i = 0; i < lists.length; i++) {
					list.push({
						title:'',
						image:lists[i].response ? lists[i].response.data.url : lists[i].url
					})
				}
				this.honor_certificates = list
			},
			removeHonor(index){
				this.$refs.lawyerUpload.remove(index)
				this.honor_certificates.splice(index,1)
			},
			clickItem(){
				this.info.lawyer_tag_ids = this.$refs.manyTypes.lawyer_tag
				console.log(this.info.lawyer_tag_ids)
			},
			clickTypes() {//弹窗状态
				this.$refs.manyTypes.props.status = true
				// this.isShow = false
			},
			pageReturn() { //返回我的
				uni.navigateBack({
					delta: 1
				})
			},
			saveSettings() {//save
				let data = []
				this.info.lawyer_tag_ids.forEach((item,index) =>{
					data.push(item.lawyer_tag_id)
				})
				setLawyerForm({
					...this.newLocation,
					lawyer_tag_ids:JSON.stringify(data),
					introduction:this.info.introduction,
					honor_certificates:JSON.stringify(this.honor_certificates)
				}).then(res => {
					if (!res.data.code) {
						uni.navigateBack()
						this.$u.toast('修改成功')
						// uni.switchTab({
						// 	url: "/my/my"
						// })
					}
				})
			},
			setPhoto() { //修改头像
				uni.chooseImage({
					count: 1,
					success: blob => {
						uni.uploadFile({
							url: `${server}api/common/image`,
							filePath: blob.tempFilePaths[0],
							header: {
								"Authorization": "test",
							},
							name: "image",
							success: res => {
								console.log(JSON.parse(res.data));
								this.$set(this.info, "avatar", JSON.parse(res.data).data.url);
								console.log(this.info)
							}
						})
					}
				})
			},
			getUserInfo() { //获取个人信息
				getMyData().then(res => {
					// res.data.data.lawyer_tag_ids=[]
					const data = res.data.data
					this.$set(this, "info", data)
					console.log(this.info)
					this.types = data.lawyer_tag_ids
					
					const reg = /^(\d{3})\d{4}(\d{4})$/;
					let mb = String(data.mobile);
					this.info.mobile = mb.replace(reg, '$1****$2');
					mb = String(data.call_mobile);
					this.info.call_mobile = mb.replace(reg, '$1****$2');
					this.initial.avatar = data.avatar;
					this.initial.nickname = data.nickname;
					let buf = []
					for (let i in data.honor_certificates) {
						data.honor_certificates[i].url = data.honor_certificates[i].image
						buf.push(data.honor_certificates[i])
					}
					this.Lhonor_certificates.push(buf)
				})
			}
		},
		onLoad(e) {
			// this.types = JSON.parse(e.data);
			this.$set(this,"introduction",e.introduction)
			this.getUserInfo();
		},
		onShow() {

		}
	}
</script>

<style lang="scss">
	.cell{
		width: calc(100vw - 64upx);
		margin-top: 24upx;
		border-top: 1upx solid #ECEFF4;
		border-bottom: 1upx solid #ECEFF4;
		line-height: 112upx;
		font-size: 34upx;
		color: #222222;
		.hint{
			font-size: 26upx;
			flex: 1;
			color: #888D98;
			text-align: right;
			margin-right: 8upx;
		}
			image {
				width: 34upx;
				height: 28upx;
				margin: auto;
			}
		
	}
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
	.honorItem{
		width: 304upx;
		margin-right: 14upx;
		float: left;
		position: relative;
		margin-top: 16upx;
		.delImg{
			width: 30upx;
			height: 30upx;
			position: absolute;
			right: 8upx;
			top: 8upx;
			z-index: 2;
		}
		.uploadImg{
			width: 100%;
			height:200upx;
			background: #9AAAFF;
			border-radius: 8upx;
		}
		.label{
			height: 37upx;
			margin-top: 16upx;
			-webkit-line-clamp: 1;
			// float: left;
			image{
				width: 22upx;
				height: 22upx;
				margin: auto;
			}
			
			.input{
				flex: 1;
			}
		}
		text{
			height: 37upx;
			font-size: 26upx;
			 
			font-weight: 500;
			color: #888D98;
		}
	}
	.textarea {
		margin: 32upx 32upx 0 32upx;
		display: block; 
		height: 220upx;
		padding: 24upx 28upx; 
		background: #F3F5F8;   
		border-radius: 8rpx; 
		font-size: 28upx; 
		line-height: 42upx; 
		color: #222222; 
		word-wrap : break-word; 
		position: relative;
		textarea{ 
			flex: 1; 
			line-height: 42upx; 
			word-wrap : break-word; 
		}
		
		.hint {
			line-height: 33upx;
			font-size: 24upx;
			font-weight: 400;
			color: #979EB3;
			text-align: right;
			position: absolute;
			bottom: 22upx;
			right: 24upx;
			left: 32upx;
		}

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
			margin-top: 48upx;
		}

		.bottom1 {
			.nicheng {
				padding: 32rpx 0;
			}

			.name {
				font-size: 34rpx;
				color: #222222;
			}
			.textareaBox{
				textarea{
					width: 100%;
					height: 230rpx;
				}
				margin-top: 20rpx;
				background: #F3F5F8;
				padding:  24rpx 32rpx;
			}
		}

		.top {
			.name {
				font-size: 34upx;
				color: #222222;
				width: 156upx;
			}
			.color888D98{
				line-height: 42upx;
				font-size: 30upx;
			}

			image {
				margin-left: 12rpx;
			}

			padding: 32upx 0rpx;
			margin: 0 32upx;
			border-bottom: 1upx solid #ECEFF4;
		}
		width: 100%;
		margin-top: 40upx;
		background-color: #FFFFFF;
		border-radius: 32upx 32upx 0px 0px;
		padding-bottom: 43upx;
	}

	.pageName {
		font-size: 32rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-top: 36rpx;
	}

	.tishi {
		font-size: 26rpx;
		color: #FFFFFF;
		opacity: 0.84;
		margin-top: 20rpx;
	}
	
	.avatar{
		.photo {
			width: 220upx;
			height: 220upx;
			border-radius: 220upx;
			border: 6upx solid #fff;
			background: #fff;
		}
		.camera {
			width: 68upx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		position: relative;
		margin: auto;
		width: 232upx;
		height: 232upx;
		margin-top: 119upx;
	}
	

	.page {
		height: 100vh;
		background-size: 100% 100%;
		background: linear-gradient(180deg, #505873 0%, #1A233E 100%);
	}

	.blur {
		filter: blur(5px);
	}
</style>
