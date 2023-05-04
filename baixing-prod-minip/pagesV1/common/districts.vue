<template>
	<view>
		<view class="flex">
			<view class="width200 relative">
				<scroll-view scroll-y="true" class="flex scroll">
					<view v-for="(item,index) in area" :key="index"
						:class="['areaItem','relative','line1',index==indextab?'active':'']"
						@click="clickTabList(index)">{{item.name}}
						<view class="absolute xian"></view>
					</view>
					<view style="height: 300rpx;"></view>
				</scroll-view>
			</view>
			<view class="marlr32 itemBox">
				<view v-if="indextab==0" class="title">
					当前定位
					<view class="itemC activeC hcenter flexcenter flex" style="margin: 50upx 0;" @click="there">
						{{city&&city.city?city.city :'暂无'}}
					</view>
				</view>
				<view v-if="indextab==0" class="title">热门城市</view>
				<view class="flex between martop16">
					<view
						:class='["itemC","hcenter","flexcenter","flex",indextab==active[0]&&index==active[1]?"activeC":""]'
						@click="clickCon(index)" v-for="(item,index) in area[indextab].cities" :key="index">
						{{item.name?(item.name.substring(0,6)):item.city}}{{item.name&&item.name.length>=7?'...':''}}
						<image src="/static/images/xz_icon.png" mode="widthFix" class="absImg"
							v-if="indextab==active[0]&&index==active[1]"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="button center" @click="clickButton">确定</view> -->
	</view>
</template>

<script>
	import {
		getDistricts
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				area: [{
					cities: ''
				}],
				from: '',
				active: [0, null],
				indextab: 0,
				callback:false,
				city:null
			}
		},
		methods: {
			there(){
				if(this.callback){
					const eventChannel = this.getOpenerEventChannel()
					// console.log(JSON.stringify(adr))
					eventChannel.emit('setAddress',this.city)
				}
				uni.navigateBack()
			},
			clickButton() { //点击确定

			},
			clickCon(index) {
				this.$set(this.active, 0, this.indextab)
				this.$set(this.active, 1, index);
				if(this.callback){
					const eventChannel = this.getOpenerEventChannel()
					const adr = this.area[this.active[0]].cities[this.active[1]];
					// console.log(JSON.stringify(adr))
					  eventChannel.emit('setAddress',{
						  city_id:adr.city_id?adr.city_id:adr.district_id,
						  city:adr.city?adr.city:adr.name,
						  province:this.area[this.active[0]].name,
						  province_id:adr.province_id?adr.province_id:this.area[this.active[0]].district_id
						  
					  })
					  uni.navigateBack()
					return
				}
				if(this.from=='identification'){
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let nowPage = pages[ pages.length - 1];  //当前页页面实例
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					prevPage.$vm.formData.address = {
						city:this.area[this.active[0]].cities[this.active[1]].name,
						province_id:this.area[this.active[0]].district_id,
						city_id:this.area[this.active[0]].cities[this.active[1]].district_id
					}//修改上一页data里面的searchVal参数值为1211
					uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
					return
				}
				
				if (getCurrentPages()[getCurrentPages().length - 2].route == "pagesV1/index/match") {
					if (this.active[0]) {
						uni.redirectTo({
							url: `/pagesV1/index/match?provinceId=${this.area[this.active[0]].district_id}&cityId=${this.area[this.active[0]].cities[this.active[1]].district_id}&cityName=${this.area[this.active[0]].cities[this.active[1]].name}`
						})
						return
					}

					uni.redirectTo({
						url: `/pagesV1/index/match?provinceId=${this.area[0].cities[this.active[1]].province_id}&cityId=${this.area[0].cities[this.active[1]].city_id}&cityName=${this.area[0].cities[this.active[1]].city}`
					})
				} else {
					// console.log(this.active[0],this.active[1])
					if (this.active[0]) {
						
						uni.navigateTo({
							url: `/pagesV1/index/match?provinceId=${this.area[this.active[0]].district_id}&cityId=${this.area[this.active[0]].cities[this.active[1]].district_id}&cityName=${this.area[this.active[0]].cities[this.active[1]].name}`
						})
						return
					}
					uni.navigateTo({
						url: `/pagesV1/index/match?provinceId=${this.area[0].cities[this.active[1]].province_id}&cityId=${this.area[0].cities[this.active[1]].city_id}&cityName=${this.area[0].cities[this.active[1]].city}`
					})
				}

			},
			clickTabList(index) { //点击tablist
				this.$set(this, 'indextab', index)
			},
			getDistricts() { //获取tabnav
				getDistricts().then(res => {
					res.data.data.cities.unshift({
						name: '常用',
						cities: res.data.data.hots
					})
					this.$set(this, "area", res.data.data.cities)
					// console.log(this.area)
				})
			},
		},

		onLoad(e) {
			this.from=e.from;
			this.callback = e.callback
			if(e.city && e.city!='undefined'){
				this.city = JSON.parse(e.city)
			}
			console.log(getCurrentPages()[getCurrentPages().length - 2])
			this.getDistricts()
		}
	}
</script>

<style>
	.button {
		position: fixed;
		width: 100%;
		background-color: #0061FF;
		bottom: 0;
		color: #fff;
		line-height: 100rpx;
	}

	.absImg {
		position: absolute;
		right: 0rpx;
		bottom: 0;
		width: 26rpx;
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
		position: relative;

	}

	.itemBox {
		padding-top: 39rpx;
		flex: 1;
	}

	.title {
		font-size: 32rpx;
		line-height: 45upx;
		font-weight: bold;
		color: #222222;
	}

	.active {
		font-weight: bold;
		color: #222222 !important;
	}

	.active .xian {
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

	.scroll {
		position: fixed;
		width: 200rpx;
		height: 100%;
		background: #F3F5F8;
		/* padding: 40rpx 0; */
	}
</style>
