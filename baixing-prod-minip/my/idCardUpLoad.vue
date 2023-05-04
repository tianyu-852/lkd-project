<template>
	<view class="index marlr32">
		<view class="title">
			上传身份证照
		</view>
		<view class="tips">
			光线充足环境下，请将身份证正面朝上拍摄识别成功率更高哦
		</view>
		<view class="imgList">
			<u-upload :header="header" name="image" :action="action1" width="320px" height="240px" max-count="1" :file-list="showList1"
				@on-success="upload1" @on-remove="onRemove" del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true">
				<view slot="addBtn" class="slot-btn">
					<image src="/static/images/khba_image.svg" mode=""></image>
					<text>上传身份证人像面</text>
				</view>
			</u-upload>
			<view class="formBox" v-if="fileList1.length!=0">
				<view class="flex between hcenter padbot20">
					<text>确定名字:</text>
					<input type="text" v-model="name"/>
				</view>
				<view class="flex between hcenter">
					<text>确定身份证:</text>
					<input type="text" v-model="idCard"/>
				</view>
			</view>
			<u-upload :header="header" name="image" :action="action2" width="320px" height="240px" max-count="1" :file-list="showList2"
				@on-success="upload2" del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true">
				<view slot="addBtn" class="slot-btn">
					<image src="/static/images/khba_image.svg" mode=""></image>
					<text>上传身份证国徽面</text>
				</view>
			</u-upload>
		</view>
		<view class="confirmBtn martop32 marbot24" @click="submit">下一步</view>
		<u-popup v-model="dialogShow" mode="center" @close="dialogClose" border-radius="16" :mask-close-able="false">
			<view class="dialogBox ">
				<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661495590928-RNFyyJ.png" mode="widthFix"></image>
				<view class="title">百姓律师</view>
				<view class="tips">已为您上传审核资料，请耐心等待</view>
				<view class="tips">审核结果将会通过短信以及站内消息的形式通知您</view>
				<!-- <view class="close" @click="closeDialog"><u-icon name="close-circle" color="#ffffff" size="60"></u-icon></view> -->
				<view class="confirmBtn" @click="closeDialog">我知道了</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getLawyerForm,
		setLawyerIdCard,
		setLawyerSubmit
	} from "@/api/apis.js";
	import { server } from "@/request.js"
	export default {
		data() {
			return {
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				action1: `${server}api/lawyer/auth/id-card/front`,
				action2: `${server}api/lawyer/auth/id-card/back`,
				showList1:[],
				showList2:[],
				fileList1: [],
				fileList2: [],
				name:'',
				idCard:'',
				dialogShow:false
			}
		},
		methods: {
			upload1(data, index, lists, name) {
				console.log(data, index, lists, name)
				if (data.code == 1009) {
					uni.navigateTo({
						url: "/pagesV1/common/login"
					})
				} else if(data.code == 0){
					this.$u.toast('上传成功')
					this.name=data.data.real_name;
					this.idCard=data.data.id_card;
					this.fileList1 = [lists[0].response.data.url]
					// this.$emit("upload", this.fileList1.concat(this.fileList2))
				}else{
					this.$u.toast(data.message)
				}

			},
			upload2(data, index, lists, name) {
				console.log(data,index, lists, name)
				if (data.code == 1009) {
					uni.navigateTo({
						url: "/pagesV1/common/login"
					})
				} else {
					// this.fileList2[0] = lists[0].response.data.url
					// this.$emit("upload", this.fileList1.concat(this.fileList2))
				}
			},
			onRemove(index, lists, name){
				this.fileList1=[];
			},
			getFormInfo(){
				getLawyerForm().then(res => {
					var data=res.data.data;
					this.name=data.real_name||'';
					this.idCard=data.id_card||'';
					this.showList1=data.id_card_front_image?[{url:data.id_card_front_image}]:[];
					this.fileList1=data.id_card_front_image?[{url:data.id_card_front_image}]:[];
					this.showList2=data.id_card_back_image?[{url:data.id_card_back_image}]:[];
				})
			},
			submit(){
				setLawyerIdCard({id_card:this.idCard,real_name:this.name}).then(res => {
					if(res.data.code===0){
						this.dialogShow = true
					}else{
						this.$u.toast(res.data.message)
					}
				})
				setLawyerSubmit()
			},
			dialogClose() {
				uni.switchTab({
					url: "/pages/v1/my"
				})
				// uni.navigateBack({
				// 	delta: 2
				// })
			},
			closeDialog() {
				this.dialogShow = false
			}
		},
		mounted() {

		},
		onLoad(){
			this.getFormInfo()
		}
	}
</script>

<style scoped lang="scss">
	.index{
		text-align: center;
	}
	/deep/ .u-preview-wrap {
		// border: 0px !important;
		margin: 0 !important;
	}
	.title{
		color: #222;
		font-size: 32upx;
		font-weight: bold;
		margin: 35upx 0 10upx;
	}
	.tips{
		color: #888D98;
		font-size: 24upx;
		margin-bottom: 32upx;
	}
	.imgList {
		display: inline-grid;
		.slot-btn {
			// height: 235upx;
			// width: 318upx;
			// position: relative;
			// left: calc((100% - 256px)/2);
			image {
				height: 240px;
				width: 320px;
			}
			text {
				display: block;
				text-align: center;
				font-size: 26upx;
				color: #888D98;
				margin-top: -15upx;
			}
		}
		.formBox{
			width: 320px;
			margin: 32upx 0;
			color: #888D98;
			padding: 32upx 36upx;
			background: #FFFFFF;
			box-shadow: 0px 4upx 20upx rgba(155, 162, 185, 0.2);
			border-radius: 8upx;
			input{
				color: #222222;
				font-weight: bold;
				text-align: right;
				background-color: #F5F7FB;
			}
		}
	}
	.dialogBox {
		width: 600upx;
		height: auto;
		overflow: hidden;
		position: relative;
		image {
			width: 300upx;
			margin: 32upx auto 0;
		}
		.title{
			margin: 0 auto 50upx;
		}
		.tips{
			margin-bottom: 10upx;
		}
		.close {
			position: fixed;
			left: calc(50% - 25upx);
			bottom: 10%;
			z-index: 2;
		}
		.confirmBtn {
			margin: 32upx;
		}
	}
	.cell {
		margin: 0 32upx;
		padding: 21upx 0;
		font-size: 30upx;
		 
		color: #222222;
		border-bottom: 1px solid #ECEFF4;
		line-height: 56upx;

	}
</style>
