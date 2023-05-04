<template>
	<view>
		<u-popup v-model="show" :mode="mode" border-radius="16">
			<view class="flex-row"><text class="title">请选择{{type==1?'地区':'类型'}}</text><view class="submit" @click="setTypes">确定</view></view>
			<view class="noticeBox" v-if="type == 1 && isLawyer==0">
				选择地区，当地律师更熟悉当地的法律法规，能更好
				地为您提供优质法律服务
			</view>
			<view class="flex-row typesBox" v-if="type == 0">
				
				<view class="nav">
					<view v-for="(item,index) in list" :key="index" :class="[index==navActive?'navActive':'','navItem']"
					 @click="clickNav(index)">
						{{item.case_type}}
						<view class="line" v-if="index==navActive"></view>
					</view>
				</view>
				<scroll-view class="son" scroll-y>
					<view v-for="(item,index) in list[navActive].children" :key="index" :class="['sonItem',navActive==listIndex[0]&&index==listIndex[1]?'sonActive':'']"
					 @click="clickConItem(index)">
						{{item.case_type}}
					</view>
				</scroll-view>
			</view>
			<view v-else class="flex-row typesBox" style="width: 100vw;">
				<view class="nav relative" style="width: 200upx;">
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
						<view class="now itemC activeC hcenter flexcenter flex" style="margin: 50upx 0;" @click="there"><image src="/static/images/nav_dw_icon.svg"></image>{{info.city?info.city.city :'定位失败'}}
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
		getDistricts
	} from "@/api/apis.js"
	export default {
		props: {
			mode:{
				type:String,
				default:'center'
			},
			type:{
				type:Number,
				default:0
			},
			national:{
				type:Boolean,
				default:false
			}
		},
		watch:{
			national(newVal,oldVal){
				this.getDistricts()
			}
		},
		data() {
			return{
				show:false,
				list:[],
				navActive:0,
				listIndex:[0,0],
				area:[{
					cities: ''
				}],
				info:{},
				isLawyer:uni.getStorageSync('type')
			}
		},
		methods:{
			there(){
				this.$emit('setTypes',this.info.city)
				this.listIndex= [0, null]
				this.show = false;
			},
			setTypes(){
				const {list,listIndex} = this
				this.show = false;
				if(this.type == 1){
					const adr = this.area[listIndex[0]].cities[listIndex[1]];
					this.$emit("setTypes",{
					city_id:adr.city_id?adr.city_id:adr.district_id,
					city:adr.city?adr.city:adr.name,
					province:this.area[listIndex[0]].name,
					province_id:adr.province_id?adr.province_id:this.area[listIndex[0]].district_id
				})
				}else
					this.$emit("setTypes",list[listIndex[0]].children[listIndex[1]])
			},
			clickNav(index) {
				this.navActive = index
			},
			clickConItem(index){
				this.listIndex = [this.navActive,index]
			},
			getDistricts() { //获取tabnav
				getDistricts({
					is_filter_national:this.national?1:0
				}).then(res => {
					res.data.data.cities.unshift({
						name: '常用',
						cities: res.data.data.hots
					})
					this.$set(this, "area", res.data.data.cities)
					// console.log(this.area)
				})
			},
		},
		mounted() {
			if(this.type == 1){
				this.getDistricts()
				this.info.city = getApp().location
			}else
				getFCaseType().then(res => {
					this.$set(this, "list", res.data.data);
					// console.log(this.list)
				})
				
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
	.now{
		
		image{
			height: 26upx;
			width: 22upx;
			margin-top: -2upx;
			margin-right: 12upx;
		}
	}
	.locationTitle {
		font-size: 32rpx;
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
		line-height: 34rpx;
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
	.title{
		font-size: 34upx;
		 
		font-weight: bold;
		line-height: 100upx;
		color: #222222;
		flex: 1;
		text-align: center;
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
		.nav{
			width: 240upx;
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
