<template>
	<view class="content">
		<!-- <image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_office_gm.png" mode="widthFix" ></image> -->
		<view class="shareBtn flex hcenter" @click="share">
			<image src="/static/fx_icon.png" mode=""></image>
			<text class="font34 bold">分享</text>
		</view>
		<image class="bg_img" :src="'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_pay_bg2.png?t='+new Date().getTime()" mode="widthFix" ></image>
		<!-- <scroll-view class="lawyers widthAll" scroll-x="true" v-if="list.length">
			<view v-for="(item1,index1) in list" :key="index1" :class="['lawyers-item',index1==0?'left32':'']" v-if="index1<=7">
				<image :src="item1.avatar" class="userImg" mode="aspectFill"></image>
				<view class="userName">{{item1.nickname}}</view>
			</view>
		</scroll-view> -->
		<view class="navBox">
			<view class="title">服务规格</view>
			<view :class="['flex between']" id="navBox">
				<view v-for="(item1,index1) in price" :key="index1" :class="['nav-item',index1==priceIndex?'on':'',index1==1?'left12':'']" @click="onPrice(index1)" v-if="index1<=1">
					<image src="/static/xz_icon.png" class="icon_bg" v-if="index1==priceIndex" mode="aspectFill"></image>
					<view class="">{{item1.title}}</view>
				</view>
			</view>
		</view>
		<image class="bg_img" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_pay_bg1_dev.png?time=2022012910" mode="widthFix" ></image>
		<image class="bg_img" :src="'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_pay_bg3_dev.png?t='+new Date().getTime()" mode="widthFix" ></image>
		<!-- <image src="/static/lszy_button.png" :class="['fixedBtn',newScrollTop!=scrollTop?'hide':'',isShare?'':'fixedBottom270']" @click="onServiceChat" v-if="source" mode=""></image> -->
		<view style="height: 190rpx;" v-if="!isShare"></view>
		<view :class="['foot',isShare?'':'fixedBottom']" v-if="!isVip">
			<view class="bold">
				<!-- <image src="/static/zf_dt.png" class="bg" mode=""></image> -->
				<!-- <view class="flex hcenter between" v-if="priceIndex==0">
					
					<view class="btn blue relative width270" @click="toPay(price[priceIndex].enterprise_vip_id)">
						<text>{{price[priceIndex].price}}/年</text>
						<view class="tag">原价<text>16800</text>/年</view>
					</view>
					<view class="btn red relative width400" @click="toPay(price[2].enterprise_vip_id)" v-if="!isPFM">
						<text>{{price[2].price}}/首月</text>
						<view class="tag2">限时体验</view>
					</view>
				</view> -->
				<view class="flex hcenter between">
					<view class="btn black flex hcenter flexcenter width270" @click="onServiceChat">
						<image src="/static/dh_icon.png" class="width32" mode="widthFix"></image>
						<text class="left8">法律顾问</text>
					</view>
					<view class="btn blue relative width400" @click="toPay(price[priceIndex].enterprise_vip_id)">
						<text>限时特惠{{price[priceIndex].price}}/年</text>
						<view class="tag2">原价<text>{{priceIndex?'29800':'16800'}}</text>/年</view>
					</view>
				</view>
			</view>
			<!-- <view class="text flex hcenter flexcenter" @click="active=!active">
				<view class="radio">
					<image src="/static/xz_icon_sel.png" v-if="active" mode=""></image>
					<image src="/static/gx_icon.png" v-else mode=""></image>
				</view>
				<text>我已阅读知晓并确认</text>
				<text class="color0061FF" @click.stop="downLoad">《企业用户下单须知》</text>
			</view> -->
		</view>
		<!-- <view style="position: absolute;bottom: 200rpx;left: 50%;color: #bbb;font-size: 20rpx;">v3</view> -->
		<view :class="[!show&&isTop?'fixedBox':'']" v-if="!isVip">
			<view class="flex between marlr52">
				<view v-for="(item1,index1) in price" :key="index1" :class="['nav-item',index1==priceIndex?'on':'',index1==1?'left12':'']" @click="onPrice(index1)" v-if="index1<=1">
					<image src="/static/xz_icon.png" class="icon_bg" v-if="index1==priceIndex" mode="aspectFill"></image>
					<view class="">{{item1.title}}</view>
				</view>
			</view>
			<!-- <view class="hint top12">首月体验活动日期2021-12-01至2021-12-31</view> -->
		</view>
		
		<view class="mask" v-if="show" @click="show=false">
			<view class="payBox" @click.stop="">
				<view class="flex between bottom32 ">
					<view v-for="(item1,index1) in price" :key="index1" :class="['nav-item',index1==priceIndex?'on':'',index1==1?'left12':'']" @click="onPrice(index1)" v-if="index1<=1">
						<image src="/static/xz_icon.png" class="icon_bg" v-if="index1==priceIndex" mode="aspectFill"></image>
						<view class="">{{item1.title}}</view>
					</view>
				</view>
				<scroll-view scroll-y style="height: 800rpx;overflow: scroll;">
					<view class="list" v-for="(item,index) in info">
						<view :class="['title',index?'yellow':'red']">{{item.title}}</view>
						<view class="flex between item" v-for="item1 in item.list" v-if="!item1.type||item1.type==priceIndex+1">
							<text class="font28">{{item1.text}}</text>
							<text class="color4C5058 font26">{{item1.value}}</text>
						</view>
					</view>
				</scroll-view>
				<view class="color888D98 font26">售后及其他协议、合同说明</view>
				<view class="color888D98 font26">购买即表示同意<text class="color0061FF" @click.stop="downLoad">《企业律云【一站式企业法务】服务》</text></view>
				<view v-if="!isVip">
					<!-- <view class="hint top12" v-if="!priceIndex">首月体验活动日期：2021-12-1至2021-12-31</view> -->
					<!-- <view class="flex hcenter between top32" v-if="priceIndex==0">
						<view class="btn blue relative width270" @click="toPay(price[priceIndex].enterprise_vip_id)">
							<text>{{price[priceIndex].price}}/年</text>
							<view class="tag">原价<text>16800</text>/年</view>
						</view>
						<view class="btn red relative width400" @click="toPay(price[2].enterprise_vip_id)" v-if="!isPFM">
							<text>{{price[2].price}}/首月</text>
							<view class="tag2">限时体验</view>
						</view>
					</view> -->
					<view class="buttom" @click="toPay(price[priceIndex].enterprise_vip_id)">
						<text>限时特惠{{price[priceIndex].price}}/年</text>
						<view class="tag2">原价<text>{{priceIndex?'29800':'16800'}}</text>/年</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		// getRecommendLawyers,
		getVipPrice,
		getVipOrder,
		getEnterpriseUser
	} from "@/apis/apis.js"
	export default {
		data() {
			return {
				// list:[],
				navBoxTop:370,
				isTop:false,
				show:false,
				user_id:'',
				isVip:false,
				invite_user_id:'',
				active:false,
				price:[],
				priceIndex:0,
				info:[
					{
						title:'特色化服务',
						list:[
							{
								text:'·律师费补贴',
								value:'15%',
								type:1
							},
							{
								text:'·律师费补贴',
								value:'20%',
								type:2
							},
							{
								text:'·应收账款催收',
								value:'首月 5笔，3笔/月',
								type:2
							},
							{
								text:'·保障服务-合同保',
								value:' 不限次',
								type:0
							}
						]
					},
					{
						title:'标准化服务',
						list:[
							{
								text:'·日常法律咨询',
								value:'不限次',
								type:0
							},
							{
								text:'·律师函起草',
								value:'不限次',
								type:0
							},
							{
								text:'·企业经营合同审查',
								value:'不限次',
								type:0
							},
							{
								text:'·企业经营合同定制',
								value:'不限次',
								type:0
							},
							{
								text:'·商务函件',
								value:'不限次',
								type:0
							},
							{
								text:'·公司章程',
								value:'1份',
								type:0
							},
							{
								text:'·员工手册规章制度',
								value:'10份',
								type:1
							},
							{
								text:'·员工手册规章制度',
								value:'不限次',
								type:2
							},
							{
								text:'·企业纠纷案件合法合规解决分析',
								value:'5份',
								type:1
							},
							{
								text:'·企业纠纷案件合法合规解决分析',
								value:'不限次',
								type:2
							},
							{
								text:'·企业经营合法合规性审查及指导建议',
								value:'不限次',
								type:0
							},
							{
								text:'·劳动用工规范性指导',
								value:'不限次',
								type:0
							},
							{
								text:'·代写诉讼类文书',
								value:'不限次',
								type:0
							},
							{
								text:'·诉讼、仲裁委托咨询',
								value:'不限次',
								type:0
							},
							{
								text:'·企业法律管家',
								value:'全年',
								type:0
							}
						]
					},
				],
				// scrollTop:0,
				// newScrollTop:0,
				token:'',
				source:2,
				platform:'',
				isPFM:0,
				isShare:1,
				// promotion_channel_tag:''
			}
		},
		onLoad(e) {
			this.platform=uni.getSystemInfoSync().platform
			if(e.invite_user_id){
				this.invite_user_id=e.invite_user_id
			}
			if(e.isShare){
				this.isShare=JSON.parse(e.isShare)
			}
			if(e.vip){
				this.isVip=JSON.parse(e.vip)
			}
			if(e.download){
				this.download=1
			}else{
				// if(this.platform == 'ios'){
				// 	this.source=JSON.parse(prompt('onGetSourceAppId',''))
				// }else{
				// 	this.source=JSON.parse(AppProxyClick.onGetSourceAppId())
				// }
			}
			// getRecommendLawyers({},{
			// 	"X-Source-App":this.source
			// }).then(res=>{
			// 	if(res.data.code==0){
			// 		this.list=res.data.data
			// 	}else{
			// 		uni.showToast({
			// 			title:res.data.message,
			// 			icon:'none'
			// 		})
			// 	}
			// })
			setTimeout(()=>{
				this.getDivInfo('#navBox')
			},500)
		},
		onShow() {
			if (!this.token) {
				if (this.platform == 'ios'){
					this.token=prompt('onGetToken','')
					uni.setStorage({
						key: "token",
						data: prompt('onGetToken','')
					})
					this.getIsVip()
				}else{
					this.token=AppProxyClick.onGetToken()
					uni.setStorage({
						key: "token",
						data: AppProxyClick.onGetToken()
					})
					this.getIsVip()
				}
			}

			if (!this.price.length) {
				getVipPrice({},{
					"X-Source-App":this.source
				}).then(res=>{
					if(res.data.code==0){
						this.price=res.data.data
					}else{
						uni.showToast({
							title:res.data.message,
							icon:'none'
						})
					}
				})
			}
			
		},
		onPageScroll(e){
			console.log(e.scrollTop)
			// this.scrollTop=e.scrollTop
			// setTimeout(()=>{
			// 	this.newScrollTop=e.scrollTop
			// },500)
			if(e.scrollTop>this.navBoxTop && !this.isTop){
				this.isTop = true
			}
			if(e.scrollTop<this.navBoxTop && this.isTop){
				this.isTop = false
			}
		},
		methods: {
			getIsVip(){
				getEnterpriseUser({},{
					"X-Source-App":this.source
				}).then(res=>{
					if(res.data.code==0){
						this.isVip=res.data.data.enterprise_vip_expired_at?1:0
						this.isPFM=res.data.data.is_bought_enterprise_vip
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			onPrice(index){
				this.priceIndex=index
				this.show=true
			},
			onServiceChat(){
				if(this.platform == 'ios'){
					prompt('onGotoServiceChat')
				}else{
					AppProxyClick.onGotoServiceChat();
				}
			},
			share(){
				if(this.platform == 'ios'){
					prompt('onGotoShare')
				}else{
					AppProxyClick.onGotoShare();
				}
			},
			downLoad(){
				var url='http://view.officeapps.live.com/op/view.aspx?src='+'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/document/%E4%BC%81%E4%B8%9A%E7%94%A8%E6%88%B7%E4%B8%8B%E5%8D%95%E9%A1%BB%E7%9F%A5.docx'
				if(this.platform == 'ios'){
					prompt('openUrl',url)
				}else{
					AppProxyClick.openUrl(url);
				}
			},
			getDivInfo(obj){
				const query = uni.createSelectorQuery().in(this);
				query.select(obj).boundingClientRect(data => {
					console.log(data)
					this.navBoxTop=data.top-data.height
					console.log(this.navBoxTop)
				}).exec();
			},
			toPay(id){
				if(this.download){
					window.location.href='https://h5.lawkd.com:12229/empty?type=2'
					return
				}
				// if(!this.active){
				// 	uni.showToast({
				// 		title: '请先阅读企业用户下单须知',
				// 		icon:'none'
				// 	})
				// 	return
				// }
				if(!this.token){
					if(this.platform == 'ios'){
						prompt('onGotoLogin')
					}else{
						AppProxyClick.onGotoLogin();
					}
					return
				}
				getVipOrder({
					enterprise_vip_id:JSON.stringify(id),
					invite_user_id:this.invite_user_id
				},{
					"X-Source-App":this.source
				}).then(res=>{
					if(res.data.code==0){
						if(this.platform == 'ios'){
							prompt('pay',res.data.data.order_no)
						}else{
							AppProxyClick.pay(res.data.data.order_no);
						}
					}else{
						uni.showToast({
							title:res.data.message
						})
					}
				})
			}
		}
	}
</script>

<style>
	.bg_img{
		width: 100%;
	}
	.mask{
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		position: fixed;
		background: rgba(0, 0, 0, 0.64);
		z-index: 99;
	}
	.payBox{
		width: calc(100% - 64rpx);
		position: absolute;
		bottom: 0;
		background: #FFFFFF;
		padding: 32rpx 32rpx 68rpx;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
	}
	.payBox .buttom{
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		margin: 56rpx 75rpx 0;
		line-height: 100rpx;
		background: #3764FF;
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		border-radius: 20rpx;
		position: relative;
	}
	/* .payBox .tag{
		position: absolute;
		right: 0;
		top: -16rpx;
		padding: 0 30rpx;
		line-height: 36rpx;
		background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
		border-radius: 16rpx 2rpx 16rpx 4rpx;
		color: #fff;
		font-size: 22rpx;
	} */
	.payBox .list{
		margin-bottom: 16rpx;
		border-bottom: 1rpx solid #ECEFF4;
	}
	.payBox .list .title{
		line-height: 48rpx;
		border-radius: 8rpx;
		padding: 0 15rpx;
		font-size: 26rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
		display: inline-block;
	}
	.payBox .list .red{
		background: #FFEFEF;
		border: 1rpx solid #FFD2D2;
		color: #FF6160;
	}
	.payBox .list .yellow{
		background: #FFF4EA;
		border: 1rpx solid #FFD7B4;
		color: #FF9237;
	}
	.payBox .list .item{
		margin-bottom: 16rpx;
	}
	.color4C5058{
		color: #4C5058;
	}
	.color3764FF{
		color: #3764FF;
	}
	.fixedBox{
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		padding: 88rpx 0 12rpx;
		background-color: #fff;
		z-index: 999;
	}
	.navBox{
		background: #FFFFFF;
		box-shadow: 0px 4rpx 10rpx rgba(0, 67, 184, 0.09);
		border-radius: 16rpx;
		padding: 32rpx;
		margin: 0 20rpx 10rpx;
	}
	.navBox .title{
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 32rpx;
	}
	.nav-item{
		line-height: 64rpx;
		color: #222222;
		font-size: 28rpx;
		text-align: center;
		background: #F5F6FA;
		border-radius: 8rpx;
		flex: 1;
	}
	.on{
		color: #FFFFFF;
		position: relative;
		background: linear-gradient(134deg, #52A1F8 0%, #5592FC 100%);
	}
	.icon_bg{
		width: 68rpx;
		height: 64rpx;
		position: absolute;
		right: 0;
		top: 0;
	}
	/* .lawyers{
		height: 180rpx;
		background-color: rgb(245,247,250);
		white-space: nowrap;
		
	}
	.lawyers::-webkit-scrollbar {
		display:none
	}
	.lawyers .lawyers-item{
		width: 120rpx;
		margin-right: 56rpx;
		// border-radius: 20rpx;
		overflow: hidden;
		position: relative;
		display: inline-block;
	}
	.lawyers .userImg{
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		margin-bottom: 12rpx;
	}
	.lawyers .userName{
		// width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		
	} */
	.content {
/* 		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
		background-color: rgb(245,247,250);
		/* padding-bottom: 180rpx; */
	}
	.shareBtn{
		color: #fff;
		line-height: 50rpx;
		position: absolute;
		right: 32rpx;
		top: 127rpx;
		z-index: 99;
	}
	.shareBtn image{
		width: 54rpx;
		height: 54rpx;
	}
	.fixedBottom{
		width: calc(100% - 40rpx) !important;
		position: fixed !important;
		bottom: 0;
		left: 0;
	}
	.fixedBottom270{
		bottom: 270rpx !important;
	}
	.foot{
		/* width: 100%; */
		height: 182rpx;
		/* position: fixed; */
		/* bottom: 0; */
		/* left: 0; */
		z-index: 99;
		background-color: #fff;
		padding-bottom:constant(safe-area-inset-bottom);
		position: relative;
		padding: 26rpx 20rpx 0;
	}
	.tag{
		position: absolute;
		right: 0;
		top: -16rpx;
		padding: 0 30rpx;
		line-height: 36rpx;
		background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
		border-radius: 16rpx 2rpx 16rpx 4rpx;
		color: #fff;
		font-size: 22rpx;
	}
	.tag text,.tag2 text{
		text-decoration:line-through;
	}
	.tag2{
		position: absolute;
		right: 0;
		top: -16rpx;
		padding: 0 30rpx;
		line-height: 36rpx;
		background: #fff;
		border: 2rpx solid #FF194F;
		border-radius: 16rpx 2rpx 16rpx 4rpx;
		color: #FF003C;
		font-size: 22rpx;
	}
	/* .foot .radio{
		width: 40rpx;
		height: 40rpx;
		background: #F5F7FA;
		border: 2rpx solid #ECEFF4;
		border-radius: 50%;
		margin-right: 18rpx;
	} */
	/* .foot .radio image{
		width: 100%;
		height: 100%;
	} */
	.foot .btn,.payBox .btn{
		color: #fff;
		font-size: 30rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 24rpx;
	}
	.foot .black{
		background: #464B66;
	}
	.foot .blue,.payBox .blue{
		background: linear-gradient(135deg, #509AFF 0%, #2878FE 100%);
	}
	
	.foot .red,.payBox .red{
		background: linear-gradient(126deg, #FF4F7A 0%, #FB2557 100%);
	}
	.width400{
		width: 400rpx;
	}
	.width335{
		width: 335rpx;
	}
	.width270{
		width: 270rpx;
	}
	/* .foot .btn .left50{
		padding-left: 50rpx;
	} */
	/* .foot .btn view{
		height: 100%;
		flex: 1;
		z-index: +1;
	} */
	/* .foot .btn .bg{
		width: 320rpx;
		height: 88rpx;
		position: absolute;
		right: 0;
	} */
	/* .foot .text{
		font-size: 28rpx;
		text-align: center;
		margin-top: 20rpx;
		margin-bottom: 64rpx;
	} */
	/* .foot{
		width: calc(100% - 150rpx);
		position: absolute;
		bottom: 102rpx;
		margin: 0 75rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: linear-gradient(152deg, #FF863B 0%, #FBA14E 100%);
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		border-radius: 100rpx;
		color: #fff;
		text-align: center;
	} */
	/* .fixedBtn{
		width: 216rpx;
		height: 80rpx;
		position: fixed;
		bottom: 120rpx;
		right: 32rpx;
		z-index: 99;
		transition: 0.5s;
	} */
	.hide{
		right: -134rpx;
		opacity: 0.4;
	}
	.hint{
		height: 64rpx;
		line-height: 64rpx;
		background: #FFEFEF;
		font-size: 28rpx;
		font-weight: bold;
		color: #FF6160;
		text-align: center;
	}
	.payBox .hint{
		margin: 12rpx -32rpx 0;
	}
	
</style>
