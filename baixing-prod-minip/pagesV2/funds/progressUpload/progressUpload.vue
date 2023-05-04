<template>
	<view>
		<u-navbar back-icon-size="34" back-text=" " title-color="#222222" title="案件进度上传" :border-bottom="false"
			title-size="32" :title-bold="true"></u-navbar>
		<u-popup v-model="popShow" mode="center" border-radius="40">
			<view class="changeBox">
				<view class="close" @click="popShow=false">
					<u-icon name="close" color="#C9CED9" size="28"></u-icon>
				</view>
				<view class="title">
					重新上传进度
				</view>
				<view class="field flex-row">
					选择时间  <text @click="show = true" :class="['time',popInfo.created_at==''?'colorGray':'']">{{popInfo.created_at ==''? '2020.12.12':popInfo.created_at}}</text>
				</view>
				<view class="flex-row field">
					进度名称
					<u-input v-model="popInfo.fundraising_progress" :clearable="false" height="45" type="" placeholder="请输入进度名称" @input="" class="center" />
				</view>
				<view class="" style="margin-top: 28upx;">
					<u-upload ref="uupload" :name="2" :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="popInfo.fileList" @on-change="uploadChange" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
						<view slot="addBtn" class="slot-btn flex-column">
							<image src="/static/images/sctp9_icon.svg"></image>
							<text>继续上传({{popInfo.images.length}}/9)</text>
						</view>
					</u-upload>
				</view>
				
				<view class="popsubtn" @click="sendFProgressItemsAuth(popInfo)">重新提交</view>
			</view>
		</u-popup>	
		<view class="error-notice">
			{{info.prompt}}
		</view>
		<!-- <view class="option marlr32 flex-row">
			案件项目选择
			<view @click="showPop()" class="dropdown">{{dropdownVal.fundraising_role}}
				<image src="/static/images/ck.svg"></image>
			</view>
			<u-picker v-model="show" mode="selector" :default-selector="[0]" :range="selector"
				range-key="fundraising_role" @confirm="pickerConfirm" cancel>
			</u-picker>
		</view> -->
		<view class="option marlr32 martop48 flex-row">
			案件进度
		</view>
		<view class="steps marlr32">
			<view v-for="item,index in info.items" class="item active flex-row" :key="index">
				<view class="left flex-column">
					<image :class="['image']" :src="item.status==1? '/pagesV2/static/images/ywc_icon.png':item.status==0? '/pagesV2/static/images/dsh_icon.png':item.status==2? '/pagesV2/static/images/wtg_icon.png':'/pagesV2/static/images/dwc_icon.png'"></image>
					<view :class="[index < info.items.length - 1?'active':'dashed','view'] "></view>
				</view>
				<view class="content">
					<view class="title flex-row">
						<text class="u-flex-1">{{item.fundraising_progress}}｜{{item.created_at}}</text>
						<view class="change flex-row" v-if="item.status != 1" @click="showPop(item)">修改<image src="/pagesV2/static/images/ck@3x.png"></image></view>
					</view>
					<image v-for="image,index1 in item.images" :class="[item.images.length == 1?'img':'imgs']" mode="aspectFill" :src="image.image" :key="index1" @click="preview(index1,item.images)"></image>
				</view>
			</view>
			<view class="item active flex-row">
				<view class="left flex-column">
					<image :class="['image']" :src="item.status==0? '/pagesV2/static/images/ywc_icon.png':item.status==1? '/pagesV2/static/images/dsh_icon.png':item.status==2? '/pagesV2/static/images/wtg_icon.png':'/pagesV2/static/images/dwc_icon.png'"></image>
					<view v-if="false" :class="[item < 1?'active':'dashed','view'] "></view>
				</view>
				<view class="content">
					<view class="title flex-row">
						选择时间  <text @click="show = true" :class="['time',param.created_at==''?'colorGray':'']">{{param.created_at ==''? '2020.12.12':param.created_at}}</text>
						<u-picker v-model="show" @confirm="pickerConfirm" cancel>
						</u-picker>
					</view>
					<view class="flex-row add">
						进度名称
						<u-input v-model="param.fundraising_progress" :clearable="false" height="45" type="" placeholder="请输入进度名称" @input="" class="center" />
					</view>
					<view>
						<u-upload :header="header" height="144" width="144" :action="action" name="image" max-count="9" :file-list="show_images" @on-change="uploadChange" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
							<view slot="addBtn" class="slot-btn flex-column">
								<image src="/static/images/sctp9_icon.svg"></image>
								<text>继续上传({{param.images.length}}/9)</text>
							</view>
						</u-upload>
					</view>
				</view>
			</view>
		</view>
		<view class="flex-row">
			<view class="caseOver" @click="clickCaseOver">申请结案</view>
			<view class="subButton" @click="sendFProgressItemsAuth(param)">上传进度</view>
		</view>
		
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script>
	import {
		getFRProgressItems,
		sendFProgressItemsAuth,
		sendFundraisingEndApply
	} from "@/api/apis.js"
	import {
		server
	} from "@/request.js"
	export default {
		data() {
			return {
				action:`${server}api/common/image`,
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				show: false,
				popShow:false,
				info:{},
				param:{
					images: [],
					created_at:'',
					fundraising_progress:''
				},
				show_images: [],
				popInfo:{
					created_at:'',
					fundraising_progress:'',
					fileList:[]
				}
			};
		},
		methods: {
			clickCaseOver(){
				sendFundraisingEndApply({
					fundraising_id:this.param.id,
				}).then(res=>{
					if(res.data.code){
						this.$u.toast(res.data.message)
					}else{
						this.$u.toast('申请成功，请耐心等待')
					}
				})
			},
			preview(index,urls){
				console.log(urls)
				let list = []
				for(let i in urls){
					list.push(urls[i].image) 
				}
				uni.previewImage({
					current:index,
					urls:list
				})
			},
			showPop(item) {
				this.popShow = true
				this.popInfo = item
				let list = []
				for(let i in item.images){
					list.push({url:item.images[i].image})
				}
				// this.popInfo.images = list
				this.$refs.uupload.clear()
				this.$set(this.popInfo,'fileList',list)
				 
			},
			// pickerConfirm(e) {
			// 	console.log(e)
			// 	this.dropdownVal = this.selector[e]
			// },
			sendFProgressItemsAuth(item){
				if(item.fundraising_progress == ''){
					this.$u.toast('请填写进度名称')
					return
				}
				if(item.created_at == ''){
					this.$u.toast('请选择时间')
					return
				}
				sendFProgressItemsAuth({
					fundraising_id:this.param.id,
					fundraising_progress:item.fundraising_progress,
					created_at:item.created_at,
					images:JSON.stringify(item.images),
					fundraising_progress_item_auth_id:item.fundraising_progress_item_auth_id
				}).then(res =>{
					if(res.data.code == 0){
						this.$u.toast('进度上传成功')
					}
				})
			},
			pickerConfirm(e) {
				// console.log(e)
				if(!this.popShow)
					this.param.created_at = `${e.year}.${e.month}.${e.day}`
				else
					this.popInfo.created_at = `${e.year}.${e.month}.${e.day}`
			},
			uploadChange(res, index, lists, name) {
				console.log(name,lists)
				let list = []
				for (var i = 0; i < lists.length; i++) {
					let item = {title:'',image:lists[i].response?lists[i].response.data.url : lists[i].url}
					list.push(item)
				}
				if(name == 2){
					this.popInfo.images = list
				}else{
					this.param.images = list
				}
				
			},
		},
		onLoad(e) {
			this.param.id = e.id
			getFRProgressItems({
				fundraising_id:e.id
			}).then(res=>{
				if(res.data.code == 0){
					this.info = res.data.data
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F5F7FA;
	}
	.changeBox{
		width: calc( 100vw - 64upx);
		padding: 32upx 32upx 28upx 32upx;
		position: relative;
		.popsubtn{
			line-height:90upx;
			height: 90upx;
			background: #0061FF;
			box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
			border-radius: 100upx;
			color: #fff;
			font-size: 32upx;
			 
			font-weight: 500;
			text-align: center;
			margin-top: 64upx;
		}
		.close{
			position: absolute;
			top: 44upx;
			right: 32upx;
		}
		.title{
			text-align: center;
			line-height: 50upx;
			font-size: 36upx;
			 
			font-weight: 800;
			color: #222222;
		}
		.time{
			margin-left: 16upx;
		}
		.colorGray{
			color: #C9CED9;
		}
		.field{
			line-height: 42upx;
			font-size: 30upx;
			 
			font-weight: 500;
			color: #222222;
			border-bottom: 1upx solid #ECEFF4;
			padding: 28upx 0;
			.center{
				font-weight: 500;
				color: #C9CED9;
				opacity: 1;
				font-size:30upx;
				margin-left: 16upx;
			}
		}
	}
	.caseOver{
		width: 260upx;
		line-height: 88upx;
		height: 88upx;
		margin-left: 32upx;
		background: #E7F3FE;
		border-radius: 8upx;
		font-size: 34upx;
		font-weight: bold;
		color: #0061FF;
		text-align: center;
	}
	.subButton{
		margin: 0 32upx;
		flex: 1;
		height: 88upx;
		line-height: 88upx;
		background: #0061FF;
		border-radius: 8upx;
		margin-bottom: 82upx;
		font-size: 36upx;
		text-align: center;
		color: #FFFFFF;
	}
	.add{
		// width: 128px;
		padding: 20upx 0;
		line-height: 45upx;
		font-size: 32upx;
		 
		font-weight: bold;
		color: #222222;
		opacity: 1;
		border-top:1upx  solid #ECEFF4 ;
		border-bottom:1upx  solid #ECEFF4;
		margin-bottom:26upx ;
		.center{
			font-weight: 500;
			color: #C9CED9;
			opacity: 1;
			margin-left: 16upx;
			
		}
	}
	/deep/ .u-preview-wrap {
		// border: 0px !important;
		margin: 0upx 15upx 15upx 0 !important;
	}

	/deep/ .u-delete-icon {
		width: 30upx !important;
		height: 30upx !important;
		top: 8upx !important;
		right: 8upx !important;
	}

	.slot-btn {
		width: 144upx;
		height: 144upx;
		background: #F3F5F8;
		opacity: 1;
		border-radius: 8upx;
		margin-bottom: 15upx;

		image {
			width: 50upx;
			height: 41upx;
			margin: auto;
			margin-bottom: 0;
		}

		text {
			display: block;
			line-height: 24upx;
			font-size: 17upx;
			 
			font-weight: bold;
			color: #888D98;
			opacity: 1;
			margin: auto;
			margin-top: 16upx;
			text-align: center;
			margin-bottom: 31upx;
		}
	}

	.steps {
		margin-top: 25upx;

		.item {
			position: relative;

			.left {
				width: 34upx;
				margin-top: 7upx;

				.image {
					// background: #F5F7FA;
					margin: auto;
					z-index: 2;
					display: block;
					width: 34upx;
					height: 34upx;
				}

				height: 100%;

				.view {
					top: 22upx;
					bottom: -22upx;
					width: 6upx;
					left: 14upx;
					// right: 20upx;
					position: absolute;
				}

				.dashed {
					background-image: linear-gradient(to bottom, #D2DFF2 0%, #D2DFF2 50%, transparent 50%);
					background-size: 6upx 24upx;
					background-repeat: y-repeat;
				}

				.active {
					background: #EBEEF5;
				}
			}

			.content {
				flex: 1;
				margin-left: 32upx;
				padding-bottom: 48upx;

				.title {
					line-height: 45upx;
					font-size: 32upx;
					 
					font-weight: bold;
					color: #222222;
					opacity: 1;
					margin-bottom: 20upx;
					.change{
						line-height: 45upx;
						font-size: 28upx;
						 
						font-weight: 500;
						color: #0061FF;
						image{
							height: 22upx;
							width: 14upx;
							display: block;
							margin: auto;
							margin-left: 8upx;
						}
					}
					.time{
						margin-left: 16upx;
					}
					.colorGray{
						color: #C9CED9;
					}
				}

				.img {
					width: 100%;
					height: 240upx;
					background: #9AAAFF;
					opacity: 1;
					border-radius: 8upx;
				}
				.imgs {
					width: calc((100% - 45upx)/4);
					height: 0;
					padding-bottom: calc((100% - 45upx)/4);
					float: left;
					background: #9AAAFF;
					opacity: 1;
					margin-right: 15upx;
					border-radius: 8upx;
					margin-bottom: 15upx;
					display: block;
				}
				.imgs:nth-child(5){
					margin-right: 0upx;
				}
				.imgs:nth-child(9){
					margin-right: 0upx;
				}
			}
		}
	}

	.error-notice {
		height: 64upx;
		line-height: 64upx;
		background: #FEE7E7;
		opacity: 1;
		border-radius: 0px 0px 8upx 8upx;
		padding: 0 32upx;
		font-size: 28upx;
		 
		font-weight: 400;
		color: #FF3951;
	}

	.option {
		height: 56upx;
		font-size: 40upx;
		 
		font-weight: 800;
		line-height: 57upx;
		color: #222222;
		opacity: 1;
		margin-top: 32upx;
		.status{
			margin: auto;
			margin-right: 0;
		}
		.statusImg{
			width: 32upx;
			height: 32upx;
		}
		.statusText{
			line-height: 33upx;
			font-size: 24upx;
			 
			font-weight: 500;
			margin-left: 5upx;
		}
	}

	.dropdown {
		line-height: 48upx;
		font-size: 28upx;
		 
		font-weight: 400;
		color: #888D98;
		margin: auto;
		margin-right: 0;
		opacity: 1;
		border-radius: 8upx;
		background: #E4E9EE;
		padding: 0 16upx;

		image {
			width: 22upx;
			height: 14upx;
			margin-left: 12upx;
		}
	}
</style>
