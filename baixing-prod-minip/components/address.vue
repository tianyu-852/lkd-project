<template>
	<view>
		<u-popup v-model="show" :mode="mode" border-radius="0">
			<u-navbar :is-back="false" v-if="statusH"></u-navbar>
			<view class="flex-row typesBox" style="width: 100vw;">
				<view class="navs relative">
					<scroll-view scroll-y="true" class="flex scroll">
						<view v-for="(item,index) in area" :key="index"
							:class="['areaItem','relative',index==navActive?'navActive':'']"
							@click="clickNav(index)">{{item.name}}
							<view class="absolute xian"></view>
						</view>
						<!-- <view style="height: 300rpx;"></view> -->
					</scroll-view>
				</view>
				<view class="itemBox">
					<view v-if="navActive==0" class="locationTitle" style="padding-top: 39upx;">
						当前定位
						<view class="itemC activeC hcenter flexcenter flex" style="margin: 50upx 0;" @click="there">
							<image src="/static/images/nav_dw_icon.png" class="width24" mode="widthFix"></image>
							<text class="left8">{{city?city.city :'获取定位'}}</text>
						</view>
					</view>
					<view v-if="navActive==0" class="title">热门城市</view>
					<view class="flex between martop16">
						<view
							:class='["itemC","hcenter","flexcenter","flex",navActive==listIndex[0]&&index==listIndex[1]?"activeC":""]' :style="item.name && item.name.length > 5? 'font-size:25rpx;':''"
							@click="clickConItem(index)" v-for="(item,index) in area[navActive].cities" :key="index">
							{{item.name?item.name:item.city}}
							<image src="/static/images/xz_icon.png" mode="widthFix" class="absImg"
								v-if="navActive==listIndex[0]&&index==listIndex[1]"></image>
						</view>
					</view>
				</view>
				
			</view>
			<view :class="mode == 'bottom'?'safe-area-inset-bottom-b':''"></view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getFCaseType,
		getLocation,
		getDistricts
	} from "@/api/apis.js"
	export default {
		props: {
			mode:{
				type:String,
				default:'top'
			},
			// type:{
			// 	type:Number,
			// 	default:0
			// },
			statusH:{
				type:Boolean,
				default:false
			},
			// national:{
			// 	type:Boolean,
			// 	default:false
			// }
		},
		// watch:{
		// 	national(newVal,oldVal){
		// 		this.getDistricts()
		// 	}
		// },
		data() {
			return{
				show:false,
				list:[],
				navActive:0,
				listIndex:[0,0],
				national:0,
				area:[{
					cities: ''
				}],
				city:{},
				// isLawyer:1
			}
		},
		methods:{
			there(){
				console.log(this.city)
				if(!this.city){
					// this.$emit('openAdr')
					uni.authorize({
						scope: "scope.userLocation",
						success: res => {
							console.log('已授权')
							this.getAddress()
						},
						fail: res => {
							console.log('未授权')
							this.openSetting()
						}
					})
					return
				}
				this.$emit('setTypes',this.city)
				this.listIndex= [0, null]
				this.show = false;
			},
			setTypes(){
				const {list,listIndex} = this
				this.show = false;
				// if(this.type == 1){
					const adr = this.area[listIndex[0]].cities[listIndex[1]];
					console.log(adr.city_id,adr.district_id)
					var there={
						city_id:adr.city_id!=undefined?adr.city_id:adr.district_id,
						city:adr.city||adr.name,
						province:this.area[listIndex[0]].name,
						province_id:adr.province_id!=undefined?adr.province_id:this.area[listIndex[0]].district_id
					}
					getApp().globalData.there=there
					this.$emit("setTypes",there)
				// }else
				// 	this.$emit("setTypes",list[listIndex[0]].children[listIndex[1]])
			},
			clickNav(index) {
				this.navActive = index
			},
			clickConItem(index){
				this.listIndex = [this.navActive,index]
				this.setTypes()
			},
			getAddress(){
				uni.getLocation({
					success: res => {
						console.log(res);
					},
					fail: res => {
						console.log(res)
					},
					complete: res => {
						getLocation({
							lng: res.longitude,
							lat: res.latitude
						}).then(res => {
							var there = {
								province_id:res.data.data.provinceId,
								city_id:res.data.data.cityId,
								city:res.data.data.city
							}
							this.city=there
							uni.setStorage({
								key: 'there',
								data: there,
							});
						})
					}
				})
			},
			openSetting(){
				uni.showModal({
				    title: '提示',
				    content: '请授权获取您的地址',
				    success: res=> {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.openSetting({
								success: res=> {
									if(res.authSetting){
										uni.authorize({
											scope: "scope.userLocation",
											success: res => {
												console.log('已授权')
												this.getAddress()
											}
										})
									}
								},
								complete: res => {
									console.log(res);
								}
							})
				        }
				    }
				});
				
			},
			getDistricts() { //获取tabnav
				// if(!uni.getStorageSync('area')){
					getDistricts({
						is_filter_national:this.national?1:0
					}).then(res => {
						if(res.data.code==0){
							res.data.data.cities.unshift({
								name: '常用',
								cities: res.data.data.hots
							})
							// for(var i=0;i<res.data.data.cities.length;i++){
							// 	if(res.data.data.cities[i].cities.length>1&&i>0){
							// 		console.log('插入全省')
							// 		res.data.data.cities[i].cities.unshift({
							// 			"name":res.data.data.cities[i].name,
							// 			"abbreviation":res.data.data.cities[i].abbreviation,
							// 			"district_id":res.data.data.cities[i].district_id,
							// 			"cities":[]
							// 		})
							// 	}
							// }
							uni.setStorage({
								key:'area',
								data:res.data.data.cities
							})
							this.$set(this, "area", res.data.data.cities)
							// console.log(this.area)
						}
					})
				// }else{
				// 	this.$set(this, "area", uni.getStorageSync('area'))
				// }
			},
		},
		mounted() {
			// if(this.type == 1){
			this.getDistricts()
			this.city=uni.getStorageSync('there')||null
			// }else
			// 	getFCaseType().then(res => {
			// 		this.$set(this, "list", res.data.data);
			// 	})
		}
	}
</script>

<style lang="scss" scoped>
	.noticeBox{
		padding: 15rpx 30rpx;
		background: #E7F3FE;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 48rpx;
		color: #0061FF;
	}
	.navActive .xian {
		width: 6rpx;
		height: 40rpx;
		background-color: #0061FF;
		right: 0rpx;
		top: 38rpx;
	}
	.areaItem {
		padding: 39rpx 10upx;
		/* text-indent: 36rpx;*/
		text-align: center;
		line-height: 45upx;
		font-size: 32rpx;
		color: #888D98;
	}
	.locationTitle {
		font-size: 34rpx;
		line-height: 45upx;
		font-weight: bold;
		color: #222222;
	}
	.activeC {
		border: 1rpx solid #0061FF !important;
		background-color: #fff !important;
		color: #0061FF !important;
	}
	
	.itemC {
		box-sizing: border-box;
		width: 233rpx;
		background: #EEF0F3;
		height: 68rpx;
		border-radius: 8rpx;
		font-size: 30rpx;
		color: #888D98;
		margin: 10rpx 0;
		line-height: 68rpx;
		position: relative;
		text-align: center;
	}
	.scroll {
		height: 100%;
		background: #F3F5F8;
		/* padding: 40rpx 0; */
	}
	.itemBox {
		margin:0 32upx ;
		flex: 1;
		height: 1000upx;
		overflow:scroll;
		overflow-y: visible;
	}
	.itemBox::-webkit-scrollbar{
		display: none;
	}
	.title{
		font-size: 34upx;
		font-weight: bold;
		line-height: 100upx;
		color: #222222;
		// flex: 1;
		// text-align: center;
	}
	.submit{
		width: 209upx;
		height: 100upx;
		background: #0061FF;
		// border-radius: 0px 16upx 0px 0px;
		line-height: 100upx;
		font-size: 34upx;
		 
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		margin: auto;
		margin-right: 0;
	}
	.absImg{
		position: absolute;
		width: 26rpx;
		right: 0;
		bottom: 0;
	}
	.typesBox{
		width: calc(100vw - 64upx);
		background-color: #fff;
		.son{
			flex: 1;
			// padding: 18upx 0 10upx 22upx;
			background: #F3F5F8;
			height: 1000upx;
			padding-left: 62upx;
		}
		.sonActive{
			color: #0061FF !important;
		}
		.sonItem{
			height: 125upx;
			line-height: 125upx;
			font-size: 32upx;
			 
			font-weight: bold;
			color: #888D98;
		}
		.navs{
			width: 200upx;
			height: 1000upx;
		}
		.navActive{
			color: #222222 !important;
			background:#F3F5F8 !important;
		}
		.line{
			width: 6upx;
			height: 40upx;
			background: #0061FF;
			position: absolute;
			right: -6upx;
			top: 43upx;
			z-index: 100;
		}
		.navItem{
			position: relative;
			width: 240upx;
			height: 125upx;
			line-height: 125upx;
			font-size: 32upx;
			 
			font-weight: bold;
			color: #888D98;
			text-align: center;
			background: #fff;
		}
	}
</style>
