<template>
	<view>
		<u-mask :show="show" @click="onClose">
			<view class="warp flex-column">
				<view class="relative widthAll">
					<image class="bgImg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bzfwq_bg.png" mode="widthFix" v-if="type==0&&!isVip"></image>
					<image class="bgImg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ysq_vip_bg.png" mode="widthFix" v-else-if="type==0&&isVip"></image>
					<image class="bgImg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ysq_bg.png" mode="widthFix" v-else-if="type==1"></image>
					<image class="bgImg" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/hyykt_bg.png" mode="widthFix" v-else></image>
					<view class="" v-if="type==0&&!isVip">
						<view class="btn no1" @click="callBack">申请</view>
						<view class="btn no2" @click="toLink('/pagesV1/common/fabu')">发布</view>
					</view>
					<view class="" v-else-if="type==0&&isVip">
						<view class="btn no3" @click="toLink('/pagesV1/common/fabu')">发布</view>
					</view>
					<view class="listBox" v-else-if="type==2">
						<view class="ItemBox" v-for="(item,index) in list" :key="index" @click="toLawyerPage(item.user_id)" v-if="!item.is_advertisement">
							<view class="flex hcenter padbot12">
								<view class="relative">
									<image :src="item.avatar" mode="aspectFill" class="photo"></image>
									<image :src="!item.is_follow?'/static/images/gz_icon.png':'/static/images/ygz_icon.png'" class="guanzhu" @click.stop="setFollow(item,index)"></image>
								</view>
								<view class="left20 centerBox" >
									<view class="flex hcenter">
										<rich-text class="Name" :nodes="item.nickname"></rich-text>
										<view class="Year flex flexcenter hcenter">执业{{item.work_year}}年</view>
										<!-- <view class="lawyerTag">{{item.lawyer_grade_chinese}}</view> -->
									</view>
									<view class="flex">
										<view class="address line1" style="margin: 8rpx 0 4rpx 0;">
											{{item.province}}-{{item.city}}
										</view>
									</view>
									<view class="address line1">{{item.lawyer_office}}</view>
								</view>
								<view class="call-lawyer flex-row">
									<image src="/static/images/ic_phone.svg" mode="widthFix"/>
									<text>免费咨询</text>
								</view>
							</view>
							<view class="itemTypes flex-row hcenter">
								<view class="flex hcenter online" v-if="isVip">
									<view :class="['dot',item.is_enable_call?'':'bg9BA2B9']"></view>
									<text :class="[item.is_enable_call?'color18C295':'color9BA2B9']">{{item.is_enable_call?'在线中':'未上线'}}</text>
								</view>
								<view class="typeName">擅长:</view>
								<view v-if="item.store.length" class="u-flex-1 flex-row">
									<text class="nullText" v-if="item.store.length==0">未设置</text>
									<view class="storeItem flex-column" v-for="(item1,index1) in item.store" :key="index1" v-if="index1<=4">
										<text class="item-price line1">￥{{item1.price}}</text>
										<text class="line1">{{item1.lawyer_product_category_name}}</text>
									</view>	
								</view>
								<view v-if="!item.store.length" class="flex-row u-flex-1">
									<text class="nullText" v-if="item.lawyer_tags.length==0">未设置</text>
									<view class="typeItem hcenter flexcenter flex" v-for="(item1,index1) in item.lawyer_tags" :key="index1" v-if="index1<=3">{{item1}}</view>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="" v-else>
						<view class="btn no3" @click="toLink('/pagesV1/common/fabu')">发布</view>
					</view> -->
					<text class="btn1" @click="toLink('/my/payVip')" v-if="type==0&&!isVip">开通会员，匹配在线律师</text>
					<text class="btn1" @click="toLink('/pagesV1/common/fabu')" v-else-if="type==1||(type==0&&isVip)">试试图文咨询</text>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import {
		sendCallPhone,
		getLawyerEnableCallList
	}
	from "@/api/apis.js"
	export default {
		props: {
			type: Number,
			userId: String
		},
		watch:{

		},
		data() {
			return {
				show:false,
				isVip:false,
				list:[]
			};
		},
		methods:{
			onClose(){
				this.show=false;
			},
			toLink(url){
				this.show=false;
				uni.navigateTo({
					url: url
				})
			},
			getList(){
				getLawyerEnableCallList().then(res=>{
					if(res.data.code==0){
						this.list=res.data.data
					}
				})
			},
			callBack(){
				sendCallPhone({lawyer_user_id:this.userId}).then(res=>{
					if(res.data.code==0){
						this.show=false;
						this.$emit('setCall')
					}else
						this.$u.toast(res.data.message)
				})
			}
		},
		mounted() {
			console.log(uni.getStorageSync('is_vip'))
			this.isVip=uni.getStorageSync('is_vip')
			// if(this.type==2&&this.show&&uni.getStorageSync('token')){
			// 	this.getList()
			// }
		}
	}
</script>

<style scoped lang="scss">
	.warp{
		margin: auto;
		width: 600upx;
		align-items: center;
		justify-content: center;
		height: 100vh;
		// image{
		// 	width: 100%;
		// 	z-index: 1;
		// 	display: block;
		// }
		// .relative{
		// 	width: 100%;
		// }
		.btn{
			width: 100upx;
			height: 54upx;
			font-size: 30upx;
			font-weight: bold;
			line-height: 54upx;
			text-align: center;
			color: #0061FF;
			background: #FFFFFF;
			box-shadow: 0px 4upx 0px #005CE3;
			border-radius: 28upx;
			position: absolute;
			right: 63upx;
		}
		.btn1{
			width: 528upx;
			margin: auto;
			margin-top: -127upx;
			font-size: 34upx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 80upx;
			border-radius: 100upx;
			text-align: center;
			display: block;
			z-index: 3;
			background: linear-gradient(105deg, #FFA836 0%, #FF9340 100%);
			box-shadow: 0px 2upx 20upx rgba(255, 94, 0, 0.57);
			text-shadow: 0px 3px 6px rgba(123, 38, 0, 0.16);
		}
		.no1{
			top: 210upx;
		}
		.no2{
			top: 297upx;
		}
		.no3{
			top: 309upx;
		}
		.listBox{
		    width: 100%;
		    position: absolute;
		    bottom: 0;
		}
		.bgImg{
		    width: 100%;
		    z-index: 1;
		    display: block;
		}
		
		/*列表*/
		.ItemBox {
		    position: relative;
		    padding: 24rpx 24rpx 16rpx 24rpx;
		    box-shadow: none;
		    border-radius: 8rpx;
		    margin-top: 0;
		}
		.typeName {
		    font-size: 24rpx;
		    color: #888D98;
		    margin-right: 20rpx;
		}
		
		.typeItem {
		    font-size: 22rpx;
		    color: #99A0AC;
		    border: 1rpx solid #C9CED9;
		    border-radius: 8rpx;
		    width: 101rpx;
		    height: 40rpx;
		    margin: 0 6rpx;
		}
		
		.itemTypes {
		    border-top: 1rpx solid #ECEFF4;
		    padding-top: 12rpx;
		    flex-wrap: nowrap;
		}
		.itemTypes .nullText{
		    font-size: 24rpx;
		    color: #888D98;
		}
		.adImg{
		    height: 240rpx;
		    width: 100%;
		    overflow: hidden;
		    border-radius: 16rpx;
		}
		.storeItem{
		    width: 0;
		    flex: 1;
		    font-size: 22rpx;
		    line-height: 36rpx;
		    color: #888D98;
		    text-align: center;
		}
		.item-price{
		    line-height: 42rpx;
		    font-size: 30rpx;
		    font-weight: bold;
		    color: #FF6E57;
		}
		.centerBox {
		    flex: 1;
		    flex-wrap: nowrap;
		    width: 0;
		}
		
		.call {
		    width: 140rpx;height: 55rpx;
		}
		
		.address {
		    font-size: 24rpx;
		    color: #222222;
		    line-height: 33rpx;
		}
		
		.Year {
		    border: 1rpx solid #5b86ff;
		    padding: 1rpx 8rpx 1rpx 8rpx;
		    font-size: 20rpx;
		    font-weight: bold;
		    color: #5B86FF;
		    margin-left: 0;
		}
		
		.Name {
		    font-size: 32rpx;
		    line-height: 45rpx;
		    font-weight: bold;
		    color: #222222;
		}
		
		.photo {
		    width: 110rpx;
		    height: 110rpx;
		    border-radius: 100rpx;
		    display: block;
		}
		.photo image{
		    width: 100%;
		}
		.guanzhu {
		    width: 44rpx;
		    right: -4rpx;
		    bottom: 0rpx;
		    height: 44rpx;
		    position: absolute;
		}
		.call-lawyer image{
		    margin: 0 8rpx 0 0;
		}
		.online{
		    line-height: 33rpx;
		    font-size: 24rpx;
		    margin-right: 28rpx;
		}
		.online .dot{
		    width: 16rpx;
		    height: 16rpx;
		    background: #18C295;
		    border-radius: 50%;
		    margin: 0 8rpx 0 17rpx;
		}
		.online .bg9BA2B9{
		    background: #9BA2B9;
		}
	}
</style>
