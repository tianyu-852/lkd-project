<template>
	<view style="background: #F5F7FA;height: 100vh;">
		<u-popup v-model="showApp" :mask-close-able="false" mode="center" border-radius="100">
			<view class="popBox">
				<image src="http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_dialog_toapp.png"></image>
				<!-- <a href="bxls://open/raiseLaunchByCertify" text=""></a> -->
					<view class="btn" @click="toLink">立即前往</view>
			</view>
		</u-popup>
		<u-swiper :list="list" height="727"></u-swiper>
		<!-- <view class="notice flex-row">
			<image :src="pollList[pollindex].avatar" mode=""></image>
			<view style="z-index: 2;-webkit-line-clamp: 1;flex: 1;"class="ellipsis">
				<rich-text type :nodes="pollList[pollindex].text"></rich-text>
			</view>
		</view> -->
		<view class="card">
			<text class="title">当事人身份认证</text>
			<!-- <text class="warn">{{headerText}}</text> -->
			<view class="head flex-row">
				<image :src="info.avatar"></image>
				<text>当事人身份认证</text>
			</view>
			<view class="cell flex-row">
				<text class="left">姓名</text>
				<text class="center">{{info.nickname}}</text>
			</view>
			<view class="cell flex-row">
				<text class="left">常用手机号</text>
				<text class="center">{{info.mobile}}</text>
			</view>
		<!-- 	<view class="cell flex-row" style="border: 0;">
				<text class="left">案件简述</text>
			</view>
			<view class="text">
				<text>{{info.content?(detailShow?info.content:info.content.substr(0,50)+'...'):''}} </text>
				<text class="showButton" @click="detailShow = true" v-if="!detailShow&&info.content">展开</text>
			</view>
			<view class="girds">
				<view @click="preview(index)" class="item" v-for="item,index in info.images"  v-if="index < 4 || showImg">
					<image :src="item" mode="aspectFill"></image>
					<view @click="showImg = true" v-if="info.images.length > 4 && index == 3 && !showImg" class="shade flex-row"><text>+{{info.images.length-3}}</text> </view>
				</view>
				<view style="clear: both;"></view>
			</view>
			<view class="error flex-row">
				<image :src="isCheck?'/pagesV2/static/images/gx_icon_red.svg':'/pagesV2/static/images/gx_icon_red_sel.svg'" mode="" @click="isCheck = true"></image>
				<text>请仔细查看以上信息，并确认无误</text>
			</view> -->
			
			<basicInfo :hideLawyer="true" ref="basicInfo" type='当事人' @upload="upload"></basicInfo>
			<!-- <view class="cell flex-row">
				<text class="left">姓名</text>
				<u-input height="56" placeholder="请输入您的姓名" class="center" />
			</view>
			<view class="cell flex-row">
				<text class="left">常用手机号</text>
				<u-input height="56" type="number" maxlength="11" placeholder="请输入您的手机号" class="center" />
				<text class="right" @tap="getCode">{{tips}}</text>
				<u-verification-code @end="end" @start="start" ref="uCode" change-text="重新发送(Xs)"
					@change="codeChange"></u-verification-code>
			</view>
			<view class="cell flex-row">
				<text class="left">验证码</text>
				<u-input height="56" type="number" maxlength="6" placeholder="验证码" class="center" />
			</view>
			<view class="flex-row imgList">
				<u-upload height="235" width="318" :action="action" :file-list="fileList" max-count="1" del-bg-color="rgba(0, 0, 0, 0.36)"
					custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传身份证人像面</text>
					</view>

				</u-upload>
				<u-upload height="235" width="318" :action="action" :file-list="fileList" max-count="1"
					custom-btn="true">
					<view slot="addBtn" class="slot-btn">
						<image src="/static/images/khba_image.svg" mode=""></image>
						<text>上传身份证国徽面</text>
					</view>
				</u-upload>
			</view> -->
			<view :class="['button',1?'enable':'']" @click="submit()">
				提交身份认证
			</view>
		</view>
		<u-mask z-index="10099" duration="0" :show="maskShow" @click="maskShow = false">
			<view class="warp flex-column">
				<image src="/pagesV2/static/images/jt_image@3x.png" mode=""></image>
				<text>嘿~就差一步啦
				点击右上角
				选择在浏览器中打开</text>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import {
		getFRPoll,
		getFRbanners,
		getFRLitigant,
		sendFRLitigantSubmit
	} from "@/api/apis.js"
	import {
		server
	} from "@/request.js"
	import basicInfo from "@/pagesV2/funds/components/basicInfo.vue"
	export default {
		components: {
			basicInfo
		},
		data() {
			return {
				maskShow:false,
				isCheck:false,
				showApp:false,
				showImg:false,
				mobile: '',
				list: [
					'1.png',
					'2.png'
				],
				noticeList: [
					'寒雨连江夜入吴',
					'平明送客楚山孤',
					'洛阳亲友如相问',
					'一片冰心在玉壶',
					'2'
				],
				pollindex: 0,
				pollList: [{avatar:'',text:''}],
				fileList: [],
				headerText: '',
				detailShow:false,
				info:{
					content:'一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶一片冰心在玉壶'
				}
			}
		},
		methods: {
			toLink(){
				//#ifdef H5
				let status = navigator.userAgent.toLowerCase();
		        if (status.match(/MicroMessenger/i) == "micromessenger") {
					this.maskShow=true
		            console.log('微信浏览器') 
					return
		        }else{
		            console.log('普通浏览器')
		        }
				window.location.href="bxls://open/raiseLaunchByCertify?raiseRegId="+ this.id
				const info = uni.getSystemInfoSync()
				console.log(JSON.stringify(info))
				if(info.platform == 'ios'){
					window.location.href='https://apps.apple.com/cn/app/%E5%BE%8B%E5%B8%88%E5%BF%AB%E7%AD%94/id1513531987'

				}else{
					setTimeout(res=>{
						window.location.href='https://a.app.qq.com/o/simple.jsp?pkgname=com.cnsunrun.lawyer&g_f=1000047'
					},2000)
				}
				//#endif
				//#ifndef H5
					uni.setClipboardData({
					    data: 'https://h5.lawkd.com:12229/empty',
					    success: res=> {
					        this.$u.toast('已复制链接到剪贴板，请在浏览器中打开');
					    }
					});
				//#endif
			},
			preview(index){
				uni.previewImage({
					current:index,
					urls:this.info.images
				})
			},
			upload(list) {
				console.log(list)
				this.fileList = list
			},
			submit(e) {
				this.showApp = true
				// if(this.fileList.length<2){
				// 	this.$u.toast('请上传身份证');
				// 	return
				// }
				// sendFRLitigantSubmit({
				// 	fundraising_registration_id: this.id,
				// 	id_card_front: this.fileList[0],
				// 	id_card_back: this.fileList[1],
				// 	// code: this.$refs.basicInfo.code,
				// 	// litigant_mobile: this.$refs.basicInfo.mobile,
				// 	// litigant_user_nickname: this.$refs.basicInfo.nickname
				// }).then(res => {
				// 	if (res.data.code != 0) {
				// 		this.$u.toast(res.data.message);
				// 		return
				// 	}
				// 	uni.setStorage({
				// 		key: "token",
				// 		data: res.data.data.access_token
				// 	})
				// 	console.log(res)
				// 	uni.navigateTo({
				// 		url:'/pagesV2/funds/face/face?id='+ this.id
				// 	})
				// })
			},
			update_form(text) {
				var update_str = "";
				var tmp_num_str = "";
				for (var i = 0; i < text.length; i++) {
					//alert(text.charAt(i));
					var inter_char = text.charAt(i);
					if (!isNaN(inter_char)) {
						//为数字时
						if (tmp_num_str == "") {
							//增加样式<FONT size=+0> 5
							tmp_num_str = "<b style='color: #0061FF'>" + inter_char;
						} else {
							tmp_num_str = tmp_num_str + inter_char;
						}
					} else {
						//闭合样式</FONT>
						if (tmp_num_str != "") {
							tmp_num_str = tmp_num_str + "</b>" + inter_char;
							update_str = update_str + tmp_num_str;
							tmp_num_str = "";
						} else {
							update_str = update_str + inter_char;
						}
					}
				}
				return update_str;
			}
		},
		onShareAppMessage() {

		},
		onLoad(e) {
			this.id = e.id ? e.id : 1
			getFRLitigant({
				fundraising_registration_id: this.id
			}).then(res => {
				this.headerText = res.data.data.header_text
				this.info=res.data.data
				this.fileList=[this.info.id_card_front_image,this.info.id_card_back_image]
			
				this.$refs.basicInfo.showList1 = [{url:this.info.id_card_front_image}]
				this.$refs.basicInfo.showList2 = [{url:this.info.id_card_back_image}]
			})

			getFRPoll().then(res => {
				this.pollList = res.data.data
				setInterval(() => {
					this.pollindex++
					if (this.pollindex >= this.pollList.length)
						this.pollindex = 0
				}, 2000)
				for (let i = 0; i < this.pollList.length; i++) {
					this.pollList[i].text = this.update_form(this.pollList[i].text)
				}
				// this.$set(this.pollList, 0, res.data);

			})
			getFRbanners().then(res => {
				this.list = res.data.data
			})
		}
	}
</script>

<style scoped lang="scss">
	.warp {
			display: flex;
			// align-items: center;
			// justify-content: center;
			height: 50%;
			width: 100%;
			text{
				color: #fff;
				margin: auto;
				margin-top: 0;
				font-size: 40upx;
				 
				font-weight: 500;
				line-height: 60upx;
				color: #FFFFFF;
			}
			image{
				width: 206upx;
				height: 218upx;
				display: block;
				margin: auto;
				margin-right: 32upx;
				margin-top: 32upx;
				margin-bottom: 0;
			}
		}
	.error{
		height: 56upx;
		line-height: 56upx;
		background: #FEE7E7;
		border-radius: 8upx;
		margin: 0 32upx;
		text{
			font-size: 30upx;
			 
			font-weight: 500;
			color: #FF1717;
			flex: 1;
		}
		image{
			width: 28upx;
			height: 28upx;
			margin: auto;
			margin-left: 28upx;
			margin-right: 8upx;
		}
	}
	.popBox{
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
	.girds{
		margin: 16upx 32upx;
		image{
			
		}
		.shade{
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.36);
			border-radius: 8upx;
			z-index: 2;
			position: absolute;
			top: 0;
			line-height: 100%;
			font-size: 30upx;
			 
			font-weight: bold;
			color: #FFFFFF;
			text{
				margin: auto;
				display: block;
			}
		}
		.item {
			position: relative;
			width: calc((100% - 45upx)/4);
			height: 0;
			padding-bottom: calc((100% - 45upx)/4);
			background: #9AAAFF;
			border-radius: 8upx;
			float: left;
			background: #9AAAFF;
			opacity: 1;
			margin-right: 15upx;
			border-radius: 8upx;
			margin-bottom: 15upx;
			display: block;
			overflow: hidden;
			image{
				width: 100%;
				height: auto;
				top: 0 !important;
				bottom: 0 !important;
				position: absolute;
			}
		}
		.item:nth-child(4){
			margin-right: 0upx;
		}
		.item:nth-child(8){
			margin-right: 0upx;
		}
	}
	.showButton{
		float: right;
		color: #0061FF;
		font-size: 28upx;
		 
		font-weight: 500;
		line-height: 42upx;
	}
	.text{
		background: #F3F5F8;
		border-radius: 8upx;
		padding: 20upx 24upx;
		font-size: 30upx;
		 
		line-height: 42upx;
		color: #222222;
		margin: 0upx 32upx;
		background: #F3F5F8;
		display: block;
	}
	.button {
		margin: 80upx 32upx 0 32upx;
		height: 90upx;
		line-height: 90upx;
		color: #888D98;
		background: #D5DBE5;
		border-radius: 100upx;
		text-align: center;
		font-size: 32upx;
	}
	.enable{
		color: #FFFFFF;
		box-shadow: 0px 4upx 16upx rgba(0, 47, 233, 0.5);
		background: #0061FF;
	}

	/deep/ .u-preview-wrap {
		// border: 0px !important;
		margin: 0 !important;
	}

	.imgList {
		margin: 16upx 0 0 14upx;

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
		margin: 0 32upx;
		padding: 21upx 0;
		font-size: 30upx;
		 
		color: #222222;
		border-bottom: 1px solid #ECEFF4;
		line-height: 56upx;

		.left {
			width: 188upx;
		}

		.center {
			display: block;
			line-height: 56upx;
			color:#9BA2B9 ;
		}

		.right {
			padding: 0 14upx;
			min-width: 148upx;
			// display: block;
			text-align: center;
			line-height: 56upx;
			height: 56upx;
			background: #0061FF;
			opacity: 1;
			font-size: 24upx;
			color: #FFFFFF;
			border-radius: 4upx;
		}
	}

	.card {
		.head {
			margin: 28upx 0 0 32upx;

			text {
				line-height: 80upx;
				font-size: 28upx;
				 
				font-weight: bold;
				color: #222222;
				opacity: 1;
				margin-left: 20upx;
				display: block;
			}

			image {
				width: 80upx;
				height: 80upx;
			}
		}

		.warn {
			display: block;
			background: #FEE7E7;
			opacity: 1;
			border-radius: 0px 0px 8upx 8upx;
			padding: 14upx 21upx;
			font-size: 24upx;
			 
			line-height: 36upx;
			color: #FF3951;
			margin-top: 16upx;
		}

		.title {
			display: block;
			font-size: 36upx;
			 
			font-weight: 800;
			line-height: 50upx;
			color: #222222;
			opacity: 1;
			text-align: center;
			margin-top: 28upx;
		}

		margin: 32upx;
		width: 686upx;
		padding-bottom: 32upx;
		// height: 1026upx;
		background: #FFFFFF;
		box-shadow: 0px 4upx 20upx rgba(0, 17, 71, 0.1);
		opacity: 1;
		border-radius: 8upx;
		margin-top: -168upx;
		z-index: 2;
		position: absolute;
	}

	.notice {
		position: absolute;
		height: 56upx;
		line-height: 56upx;
		border-radius: 33upx;
		white-space: nowrap;
		color: #fff;
		font-size: 24upx;
		padding-right: 32upx;
		top: 268upx;
		left: 32upx;

		.blue {
			color: #0061FF;
		}

		image {
			width: 44upx;
			height: 44upx;
			border-radius: 22upx;
			margin: 6upx;
			display: block;
			opacity: 1;
			z-index: 23;
		}
	}

	.notice::before {
		content: "";
		/*-webkit-filter: opacity(50%);  
		            filter: opacity(50%); */
		background: #000000;
		opacity: 0.36; //透明度设置
		z-index: 1;
		position: absolute;
		//一定要设置position:absolute,这样才能设置z-index，让背景处于内容的下一层
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		border-radius: 33upx;
	}
</style>
