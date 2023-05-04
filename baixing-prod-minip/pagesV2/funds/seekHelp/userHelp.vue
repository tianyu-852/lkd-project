<template>
	<view class="pageBg">
		<view class="marlr32 card">
			<view class="card-title" @click="titleShow=true">
				求助标题
				<u-icon name="question-circle" color="#888D98" size="30" class="icon"></u-icon>
			</view>
			<view class="card-tips">根据您提供的信息，参考标题如下，请确认是否属实</view>
			<textarea class="card-textarea height80 marbot40" maxlength="30" v-model="title" placeholder="请填写求助的标题" />
			<view class="card-title" @click="hintShow=true">
				求助详情说明
				<u-icon name="question-circle" color="#888D98" size="30" class="icon"></u-icon>
			</view>
			<view class="card-tips">根据您提供的信息，参考标题如下，请确认是否属实</view>
			<textarea class="card-textarea" v-model="content" placeholder="请填写求助的说明" />
			<!-- <text class="textarea">佛挡杀佛干饭干饭高鸿股份画风更好很过分画风更好换个画风个画风更好话费花费高鸿股份更好换个画风个画风更好话费花费高鸿股份更好...</text> -->		</view>
		<view class="marlr32 card relative" style="padding-bottom: 80rpx;">
			<view class="card-title flex between">
				<text>上传相关纠纷照片</text>
				<!-- <view class="right" @click="examplePop">参考实例图<u-icon name="arrow-right" color="#888D98"></u-icon></view> -->
			</view>
			<view class="card-tips">上传照片可得到更多的信任和传播，筹到更多的钱,可上传相关纠纷照片</view>
			<u-upload :header="header" height="141" width="141" :action="action" name="image" @on-change="upLoadChange" @on-remove="onRemove"
			:file-list="showList" :custom-btn="true" :show-progress="false" del-bg-color="rgba(0, 0, 0, 0.36)" max-count="9">
				<view slot="addBtn" class="slot-btn flex flexcenter hcenter">
					<image src="/static/images/sctp9_icon.svg"></image>
					<text>上传照片({{fileList.length}}/9)</text>
				</view>
			</u-upload>
			<view class="card-foot">
				选填,最多上传9张，也可以后面再补充上传
			</view>
		</view>
		<view class="marlr32 card">
			<view class="card-title">我承诺</view>
			<view class="card-tips">{{promise}}</view>
<!-- 			<view class="card-tips">1.所发起的个人大病求助项目，全部求助款项将用于求助人的治疗及康复费用,绝不挪用,如有剩余及时退还</view>
			<view class="card-tips">2.所发布的求助信息完整、准确、真实、及时、合法，无虚构或隐瞒情形</view>
			<view class="card-tips">3.将尊重赠与人的意愿,严格按照平台要求，及时说明求助人的治疗花费、家庭经济状况等平台要求说明的情况并公示相应证明材料</view>
			<view class="card-tips">若有违反,承担全部法律责任,并赔偿相关方所有损失</view> -->
			
			<u-line color="#ECEFF4" margin="12rpx 0 32rpx"/>
			<view class="card-text">
				<u-icon name="checkmark-circle-fill" color="#0061FF" size="34" class="icon"></u-icon>
				我已阅读并同意
				<text @click="toLink(protocol.fundraising)">《点滴讼个人求助信息发布条款》</text>、
				<text @click="toLink(protocol.user_service)">《用户协议》</text>和
				<text @click="toLink(protocol.privacy_policy)">《隐私政策》</text>
			</view>
		</view>
		
		<view class="submitBtn" @click="submit()">提交求助说明</view>
		<u-popup v-model="titleShow" mode="center" border-radius="16">
			<view class="flex between hcenter titlePopBox">
				<view class="width400">如果标题中提及<text>当事人姓名</text>必须与<text>身份证</text>保持—致</view>
				<view class="" @click="titleShow=false">
					<u-icon name="close"></u-icon>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="hintShow" mode="center" border-radius="32">
			<view class="hintBox">
				<view class="title">温馨提示</view>
				<view class="hintBox-text">
					<u-line color="#0061FF" direction="col" border-style="dotted" length="100" class="line"/>
					<view class="relative">
						<view class="icon"></view>
						1.如提及当事人姓名,也必须与<text>身份证</text>保持一致
					</view>
					<view class="relative">
						<view class="icon"></view>
						2.如提及家庭经济状况等信息,应如实描述
					</view>
				</view>
				<view class="confirmBtn" @click="hintShow=false">我已明白</view>
			</view>
		</u-popup>
		<view class="safe-area-inset-bottom"></view>
	</view>
</template>

<script>
	import {
		getUserSeekHelp,
		setUserSeekHelp,
		getUserProtocol
	} from "@/api/apis.js"
	import {server} from "@/request.js"
	export default {
		data() {
			return {
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				action: `${server}api/common/image`,
				id:1,
				hintShow: false,
				titleShow: false,
				title:'',
				content:'',
				promise:'',
				showList: [],
				fileList: [],
				protocol: {}

			}
		},
		watch:{
			lawyerParam(){
				this.setTotal()
			}
		},
		methods: {
			upLoadChange(res, index, lists, name){
				console.log(name, lists)
				let list = []
				for (let i = 0; i < lists.length; i++) {
					list.push(lists[i].response ? lists[i].response.data.url : lists[i].url)
				}
				this.fileList = list
				// let list1 = []
				// for (let i = 0; i < list.length; i++) {
				// 	list1.push({
				// 		url: list[i]
				// 	})
				// }
				// this.showList = list1
			},
			onRemove(index, lists, name) {
				this.fileList.splice(index, 1)
				// this.showList.splice(index,1)
				// this.$refs.xupload.remove(index)
			},
			submit(){
				if(!this.title){
					uni.$u.toast('请填写经过标题')
					return
				}
				if(!this.content){
					uni.$u.toast('请填写经过内容')
					return
				}
				let param = {
					fundraising_id:this.id,
					title:this.title,
					content:this.content,
					images:JSON.stringify(this.fileList)
				}
				setUserSeekHelp(param).then(res=>{
					if(res.data.code != 0){
						this.$u.toast(res.data.message)
					}else{
						this.$u.toast('提交成功')
						uni.navigateBack();
					}
				})
			},
			toLink(url){
				uni.navigateTo({
					url: '/pagesV1/common/webview?url='+url
				})
			}
		},
		onLoad(e) {
			this.id = e.id
			getUserSeekHelp({fundraising_id: e.id}).then(res=>{
				this.title=res.data.data.title
				this.content=res.data.data.content
				this.fileList=res.data.data.images
				this.promise=res.data.data.promise
				let list = []
				for (let i = 0; i < res.data.data.images.length; i++) 				{
					list.push({
						url: res.data.data.images[i]
					})
				}
				this.showList=list
			})
			getUserProtocol().then(res=>{
				this.protocol=res.data.data;
			})
		},
		onHide() {

		},
		onUnload() {
			let param = {
				fundraising_id:this.id,
				title:this.title,
				content:this.content,
				images:JSON.stringify(this.fileList)
			}
			setUserSeekHelp(param)
		}
	}
</script>

<style scoped lang="scss">
	/deep/ .u-preview-wrap {
		border: 0px !important;
		margin: 0upx 15upx 15upx 0 !important;
	}

	.submitBtn {
		margin: 40upx 40upx 86upx 40upx;
		height: 90upx;
		line-height: 90upx;
		background: #0061FF;
		box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
		border-radius: 100upx;
		font-size: 32upx;
		color: #FFFFFF;
		text-align: center;
	}

	.pageBg {
		background: #F5F7FA;
		padding-top: 22upx;
		min-height: 100vh;
	}
	
	.card {
		color: #888D98;
		margin: 0upx 32upx 32upx 32upx;
		background: #FFFFFF;
		box-shadow: 0px 4upx 20upx rgba(0, 17, 71, 0.1);
		border-radius: 8upx;
		padding: 40upx 32upx;
		 
		.card-title{
			font-size: 30upx;
			font-weight: bold;
			line-height: 47upx;
			color: #222222;
			margin-bottom: 20upx;
			.right{
				color: #888D98;
			}
			.icon{
				margin-left: 12upx;
			}
		}
		.card-tips{
			font-size: 26upx;
			line-height: 40upx;
			margin-bottom: 20upx;
		}
		.card-foot{
			width: 100%;
			color: #0061FF;
			background-color: #E7F3FE;
			text-align: center;
			padding: 12upx;
			position: absolute;
			bottom: 0;
			left: 0;
		}
		.card-text{
			position: relative;
			padding-left: 40upx;
			.icon{
				position: absolute;
				top: 4upx;
				left: 0;
			}
			text{
				color: #0061FF;
			}
		}
		.card-textarea{
			width: calc(100% - 48upx);
			padding: 20upx 24upx;
			background: #F3F5F8;
			border-radius: 8upx;
		}
		.height80{
			height: 80upx;
		}
		.slot-btn {
			width: 141upx;
			height: 141upx;
			text-align: center;
			padding: 20upx 0;
			background: #E7EDF5;
			border-radius: 8upx;
			margin: 0 15upx 15upx 0;
			image {
				width: 50upx;
				height: 41upx;
				margin: auto;
			}
			text {
				color: #888D98;
				font-size: 20upx;
				line-height: 28upx;
				margin-left: 8upx;
			}
		}
	}
	.titlePopBox{
		min-width: 600upx;
		max-width: 650upx;
		padding: 26upx 32upx;
		font-size: 30upx;
		font-weight: bold;
		line-height: 54upx;
		.width400{
			width: 400upx;
		}
		text{
			color: #0061FF;
		}
	}
	.hintBox{
		min-width: 500upx;
		max-width: 650upx;
		padding: 32upx;
		.title{
			font-size: 34upx;
			font-weight: bold;
			line-height: 68upx;
			margin: 0 auto 80upx;
			text-align: center;
		}
		.hintBox-text{
			padding: 0 0 0 52upx;
			margin-bottom: 64upx;
			position: relative;
			.line{
				position: absolute;
				left: 17upx;
				top: 4upx;
			}
			text{
				color: #0061FF;
			}
			.icon {
				width: 34upx;
				height: 34upx;
				border-radius: 16upx;
				border: #0061FF solid 10upx;
				position: absolute;
				left: -52upx;
				top: 4upx;
				background-color: #fff;
			}
		}
	}
</style>
