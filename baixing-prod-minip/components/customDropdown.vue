<template>
	<view>
		<u-dropdown ref="customDropdown" title-size="26" height="37" class="u-dropdown" menu-icon="" menu-icon-size="22" inactive-color="#222" active-color="#0061FF" @open="open" @close="close">
			<u-dropdown-item v-model="value" :title="value">
				<view class="slot-content backfff flex">
						<view class="width200 relative">
							<scroll-view scroll-y="true" class="flex scroll">
								<view v-for="(item,index) in area" :key="index"
									:class="['areaItem','relative',index==indextab?'active':'']"
									@click="clickTabList(index)">{{item.name}}
									<view class="absolute xian"></view>
								</view>
								<view style="height: 300rpx;"></view>
							</scroll-view>
						</view>
						<view class="marlr32 itemBox">
							<view v-if="indextab==0" class="title" style="padding-top: 39upx;">
								当前定位
								<view class="now itemC activeC hcenter flexcenter flex" style="margin: 50upx 0;" @click="there">
									<image src="/static/images/nav_dw_icon.svg"></image>{{info.city?info.city.city :'定位失败'}}
								</view>
							</view>
							<view v-if="indextab==0" class="title">热门城市</view>
							<view class="flex between martop16">
								<view :class='["itemC","hcenter","flexcenter","flex",indextab==active[0]&&index==active[1]?"activeC":""]' :style="item.name && item.name.length > 5? 'font-size:25rpx;':''" @click="clickCon(index)" v-for="(item,index) in area[indextab].cities" :key="index">
									{{item.name?item.name:item.city}}
									<image src="/static/images/xz_icon.png" mode="widthFix" class="absImg" v-if="indextab==active[0]&&index==active[1]"></image>
								</view>
							</view>
					</view>
				</view>
			</u-dropdown-item>
		</u-dropdown>
		
	</view>
</template>

<script>
	import {
		getDistricts
	} from "@/api/apis.js"
	export default {
		props: {
			value:String,
			type:{
				type:Number,
				default:0
			},
			info:Object
		},
		model: {
			prop:'value',
		    event: 'input'
		},
		data() {
			return {
				area: [{
					cities: ''
				}],
				from: '',
				active: [0, null],
				indextab: 0,
				callback:false
			};
		},
		methods:{
			close(){
				this.$emit('dropChange',false)
			},
			open(){
				this.$emit('dropChange',true)
			},
			there(){
				console.log(this.info)
				this.$emit('input',this.info.city.city)
				this.$emit('change',this.info.city)
				this.active= [0, null]
				this.$refs.customDropdown.close()
			},
			clickButton() { //点击确定
			
			},
			clickCon(index) {
				this.$set(this.active, 0, this.indextab)
				this.$set(this.active, 1, index);
				const adr = this.area[this.active[0]].cities[this.active[1]];
				this.$emit('input',adr.city?adr.city:adr.name)
				// console.log(JSON.stringify(adr))
				this.$emit('change',{
					city_id:adr.city_id?adr.city_id:adr.district_id,
					city:adr.city?adr.city:adr.name,
					province:this.area[this.active[0]].name,
					province_id:adr.province_id?adr.province_id:this.area[this.active[0]].district_id
				})
				  this.$refs.customDropdown.close()
				
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
		mounted(){
			this.getDistricts()
		}
	}
</script>

<style lang="scss">
	.now{
		
		image{
			height: 26upx;
			width: 22upx;
			margin-top: -2upx;
			margin-right: 12upx;
		}
	}
	.slot-content{
		height: 860upx;
	}
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
		flex: 1;
		height: 100%;
		overflow:scroll;
		overflow-y: visible;
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
