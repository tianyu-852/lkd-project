<template>
	<view>
		<view class="card">
			<text class="warn">感谢您的热心，如果您了解该案件，希望您如实填写真实身份、
真实情况，这将为受助人赢取更多信任</text>
			<u-select v-model="selectShow" mode="single-column" :list="selectList" @confirm="confirm" value-name="fundraising_role_id" label-name="fundraising_role" :safe-area-inset-bottom="true"></u-select>
			<view class="title" style="margin-top: 28upx;">您和筹款人的关系</view>
			<view class="cell flex-row padlr32"  @click="selectShow = true">
				<text class="left">请选择</text>
				<text class="selectInput">{{relation==''?selectList[0].fundraising_role:relation}}</text>
				<u-icon name="arrow-down" size="22" color="#C9CED9"></u-icon>
			</view>
			<!-- <view class="line"></view> -->
			<!-- <basicInfo ref="basicInfo" type='当事人' @upload="upload"></basicInfo> -->
			<view class="title"  >您的姓名</view>
			<view class="cell flex-row">
				<!-- <text class="left">姓名</text> -->
				<input placeholder="请填写真实姓名" height="64" v-model="name" placeholder-style="color:#C9CED9"/>
			</view>
			<view class="title">说明内容</view>
			<view class="cell flex-row">
				<textarea class="textarea" cols="30" rows="10" v-model="content" placeholder="筹款人是您的...您了解的情况是...(最多200字)" maxlength="200" placeholder-style="color:#C9CED9"></textarea>
			</view>
			<view class="title">身份证号码</view>
			<view class="hint marlr32">身份证信息会被严格保密，不会被展示给其他人</view>
			<view class="cell flex-row">
				<input placeholder="请填写身份证号" v-model="idCard" placeholder-style="color:#C9CED9"/>
			</view>
<!-- 			<view class="flex-row imgList flex between">
				<u-upload :header="header" :index="0" name="image" @on-change="upload" height="235" width="318" :action="action" max-count="1" del-bg-color="rgba(0, 0, 0, 0.36)" custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传身份证人像面</text>
					</view>
				</u-upload>
				<u-upload :header="header" :index="1" name="image" @on-change="upload" height="235" width="318" :action="action" max-count="1" custom-btn="true" del-bg-color="rgba(0, 0, 0, 0.36)">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传身份证国徽面</text>
					</view>
				</u-upload>
			</view> -->
			<view class="button" @click="submit()">提交</view>
		</view>
		<view class="message">
			<view>感谢您的热心，如果您参与、探访、深入了解过此筹款项目，请
			您如实填写真实身份、真实情况，这将为受助人赢得更多信任。
			同时提醒您，您需要对说明内容的真实性负责，如有不实，需承
			担相应法律责任。</view>
			<hint title="我已阅读并同意《用户协议》《隐私政策》和《证明人承诺》" size="12" color="#888D98"></hint>
		</view>
		<u-popup v-model="show" mode="center">
			<view class="popVerify" @click="show=false">
				<image src="http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_dialog_register.png"></image>
				<!-- <a href="bxls://open/raiseLaunchByCertify" text=""></a> -->
					<button class="btn" open-type="share">立即分享</button>
			</view>
		</u-popup>
	</view>
	
</template>

<script>
	import {
		getFRLitigantRoles,
		sendFundraingConfirm
	} from "@/api/apis.js"
	import {
		server
	} from "request.js"
	import basicInfo from "@/pagesV2/funds/components/basicInfo.vue"
	import hint from "@/pagesV2/components/hint.vue"
	export default {
		components: {
			basicInfo,hint
		},
		data() {
			return {
				show:false,
				id:0,
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				action:`${server}api/common/image`,
				content: '',
				relation: '',
				selectShow: false,
				selectList: [],
				selectItem: '',
				name: '',
				fileList: ['',''],
				idCard: ''
			}
		},
		methods: {
			// upload(res, index, lists, name) {
			// 	let data = JSON.parse(res.data)
			// 	if(data.code !=0 ){
			// 		this.$u.toast(data.message)
			// 	}else{
			// 		this.$u.toast('上传成功')
			// 		this.fileList[name]=data.data.url
			// 	}
			// 	console.log(this.fileList)
			// 	// this.fileList = lists
			// },
			confirm(e) {
				console.log(e);
				this.selectItem = e[0]
				this.relation=e[0].label
			},
			submit(e) {
				if(this.idCard == ''){
					this.$u.toast('请填写身份证号');
					return
				}else if(this.name == ''){
					this.$u.toast('请填写真实姓名');
					return
				}else if(this.selectItem == ''){
					this.$u.toast('请选择你们的关系');
					return
				}else if(this.content == ''){
					this.$u.toast('请介绍一些详细的情况');
					return
				}
				sendFundraingConfirm({
					fundraising_id:this.id,
					fundraising_role_id:this.selectItem.value,
					real_name:this.name,
					id_card:this.idCard,
					content:this.content
				}).then(res => {
					if(res.data.code!=0){
						this.$u.toast(res.data.message);
					}else{
						this.$u.toast('提交成功')
						// uni.navigateBack()
						this.show = true
						this.share = res.data.data
					}
					// coensole.log(res)
				})
			}
		},
		onLoad(e) {
			this.id = e.id ? e.id : 1
			getFRLitigantRoles().then(res => {
				this.selectList = res.data.data
			})
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮 res.target.dataset
				const {share} = this
				return {
					title: share.title,
					path: share.wechat_mini_program.path,
					imageUrl:share.wechat_mini_program.cover_image
				}
			}else{
				return{
					title:'维权太难就是点滴讼互助，筹款打官司',
					imageUrl:'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/share.png'
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	/deep/.u-mode-center-box {
		border-radius: 90upx 40upx 90upx 90upx;
	}
	.popVerify{
		
		width: 600upx;
		height: 675upx;
		position: relative;
		image{
			height: 100%;
			width: 100%;
		}
		.btn{
			width: 528upx;
			height: 90upx;
			background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
			box-shadow: 0px 6upx 16upx rgba(0, 35, 212, 0.32);
			opacity: 1;
			border-radius: 100px;
			font-size: 34upx;
			 
			font-weight: bold;
			line-height: 90upx;
			color: #FFFFFF;
			z-index: 2;
			position: absolute;
			left: 36upx;
			bottom: 48upx;
			text-align: center;
		}
	}
	.title{
		color: #222;
		font-size: 30upx;
		text-align: left;
		margin: 36upx 0 16upx 32upx;
	}
	.line{
		margin: 18upx 32upx 28upx;
		border-top: 1upx solid #ECEFF4;
	}
	.message{
		padding: 60upx 34upx 68upx;
		color: #888D98;
		font-size: 24upx;
		view{
			margin-bottom: 32upx;
		}
	}
	.button {
		margin: 48upx 32upx 0 32upx;
		height: 90upx;
		line-height: 90upx;
		background: #0061FF;
		box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
		opacity: 1;
		border-radius: 100upx;
		text-align: center;
		font-size: 32upx;
		 
		font-weight: 400;
		color: #FFFFFF;
	}

	/deep/ .u-preview-wrap {
		// border: 0px !important;
		margin: 0 !important;
	}

	.imgList {
		padding: 16upx 32upx 0 14upx;

		.u-list-item {
			margin: 0 !important;
		}

		.slot-btn {
			height: 235upx;
			width: 318upx;

			image {
				height: 235upx;
				width: 340upx;
			}

			text {
				display: block;
				text-align: center;
				font-size: 26upx;
				color: #888D98;
				margin-top: -15upx;
			}
		}
	}

	.cell {
		margin: 0 32upx 0upx;
		padding: 0 32upx;
		font-size: 28upx;
		 
		color: #222222;
		line-height: 64upx;
		background-color: #F3F5F8;
		border-radius: 8upx;
		.left {
			width: 200upx;
		}
		input{
			height: 64upx;
			line-height: 64upx;
			font-size: 28upx;
		}
	}

	.card {
		color: #888D98;
		.hint{
			font-size: 26upx;
			margin-bottom: 12upx;
		}
		.warn {
			display: block;
			background: #FEEEE7;
			opacity: 1;
			border-radius: 0px 0px 8upx 8upx;
			padding: 14upx 21upx;
			font-size: 24upx;
			line-height: 36upx;
			color: #FF7639;
		}
		input{
			width: 100%;
		}
		// .title {
		// 	display: block;
		// 	font-size: 36upx;
		// 	 
		// 	font-weight: 800;
		// 	line-height: 50upx;
		// 	color: #222222;
		// 	opacity: 1;
		// 	text-align: center;
		// 	margin-top: 28upx;
		// }
		.selectInput {
			color: #888D98;
			margin-left: 38upx;
			display: block;
			line-height: 64upx;
			margin-right: 24upx;
			flex: 1;
			text-align: right;
		}
		.textarea{
			width: 100%;
			height: 130upx;
			padding: 24upx 0;
			line-height: 30upx;
		}
		padding-bottom: 48upx;
		// height: 1026upx;
		background: #FFFFFF;
		box-shadow: 0px 4upx 20upx rgba(0, 17, 71, 0.1);
		border-radius: 8upx;
	}

	
</style>
