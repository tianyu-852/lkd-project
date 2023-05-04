<template>
	<view>
		<u-sticky h5-nav-height="0">
			<view class="backfff">
				<view :style="'height:'+ offsetTop +'px;'"></view>
				<view class="flex-row customBar">
					<image @click="back" class="back" src="/pagesV2/static/images/nav_fh_icon.svg"></image>
					<view class="search flex-row" @click="linkSearch">
						<image src="/static/images/ss_icon.png"></image>
						<u-input height="37" class="text" @input="inputChange" placeholder="搜索律师" v-model="searchVal"/>
					</view>
				</view>
				<view class="marlr32 flex-row">
					<view class="flex-row address" @click="setAddress">
						<image src="/static/images/nav_dw_icon.png"></image>
						<text class="ellipsis">{{city}}</text>
					</view>
					<view class="u-flex-1">
						<u-tabs :list="tab.nav" :is-scroll="false" :current="tab.index" @change="setTab" inactive-color="#888D98" active-color="#282828" font-size="32" :bar-style='{"backgroundColor":"#0061FF"}'></u-tabs>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="marlr32">
			<view class="ItemBox backfff" v-for="(item,index) in tab.list[tab.index]" :key="index">
				<view class="flex hcenter padbot20 ">
					<view class="relative">
						<image :src="item.avatar" mode="aspectFill" class="photo" @click="toLawyerPage(item.user_id)">
						</image>
						<image
							:src="!item.is_follow?'../../static/images/gz_icon.png':'../../static/images/ygz_icon.png'"
							class="guanzhu" @click="setFollow(item,index)"></image>
					</view>
					<view class="left20 centerBox" @click="toLawyerPage(item.user_id)">
						<view class="flex hcenter" @click="toLawyerPage(item.user_id)">
							<view class="Name">{{item.nickname}}</view>
							<!-- <view class="Year flex flexcenter hcenter">执业{{item.work_year}}年</view> -->
							<view class="lawyerTag">{{item.lawyer_grade_chinese}}</view>
						</view>
						<view class="flex">
							<view class="adr" style="margin: 8rpx 0 4rpx 0;">
								<text v-if="item.work_year">执业{{item.work_year}}年丨</text>
								{{item.province}}-{{item.city}}
							</view>
						</view>
						<view class="adr">{{item.lawyer_office}}</view>
					</view>
					<view class="selectLawyer" @click="setLawyer(item)">确认邀请</view>
					</view>
					<view class="itemTypes flex hcenter" @click="toLawyerPage(item.user_id)">
						<view class="typeName">经常服务:</view>
						<view class="typeItem hcenter flexcenter flex" v-for="(item1,index1) in item.lawyer_tags"
							:key="index1" v-if="index1<=3">{{item1}}</view>
					</view>
				</view>
				<view class="center null" v-if="!tab.list[tab.index].length">
					<image src="/static/images/kym_qsy_image.png"></image>
					<view class="text">暂无数据</view>
				</view>
			</view>
		</view>
</template>

<script>
	import {
		getFindBanner,
		getLawyerList,
		getLocation,
		getServeLawyer,
		getAttention,
		getNoComment
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				offsetTop: uni.getSystemInfoSync().statusBarHeight,
				tab: {
					nav: [{
						name: "推荐律师"
					}, {
						name: "我的律师"
					}, ],
					index: 0,
					searchVal: '',
					list: [
						[],
						[]
					],
					page: [1, 1]
				},
				tabIndex: 1,
				city: ''
			}
		},
		methods: {
			setLawyer(item){
				console.log('123',item)
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('setLawyer',item)
				uni.navigateBack()
			},
			back(){
				uni.navigateBack()
			},
			setTab(index) {
				this.tab.index = index;
			},
			setAddress() {
				uni.navigateTo({
					url: "/pagesV1/common/districts?callback=true",
					events: {
						setAddress: data => {
							console.log(data)
							this.city = data.city
							this.provinceId = data.province_id;
							this.cityId = data.city_id;
							this.tab.page[0] = 1
							this.getLawyerList(this.tab.page[0], this.typesId, this.provinceId,this.cityId, new Date().getSeconds())
						}
					}
				})
			},
			setFollow(item, index) {
				getAttention({
					type: item.is_follow,
					follow_user_id: item.user_id
				}).then(res => {
					if (!res.data.code) {
						item.is_follow = res.data.data.is_follow;
						uni.showToast({
							title: res.data.data.is_follow ? '关注成功' : '已取消关注'
						})
					}

				})
			},
			getServeLawyer(page, lawyer_tag_id, province_id, city_id) { //服务过我的律师
				getServeLawyer({
					page: this.tab.page[0],
					lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
					province_id: province_id ? province_id : null,
					city_id: city_id ? city_id : null,
					is_real: 1,
					is_append_introduction:1
				}).then(res => {
					if(res.data.code != 0)
						return
					let data = this.tab.list[1].concat(res.data.data.data)
					this.$set(this.tab.list, 1, data);
					this.tab.page[1] += 1;
				})
			},
			getLawyerList(page, lawyer_tag_id, province_id, city_id, time,val) { //获取律师列表
				getLawyerList({
					search: this.searchVal||'',
					page: page,
					lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
					province_id: province_id ? province_id : null,
					city_id: city_id ? city_id : null,
					random: time ? time : null,
					is_real: 1,
					is_append_introduction:1
				}).then(res => {
					if(res.data.code != 0)
						return
					let data = []
					if(page == 1){
						data = res.data.data.data
					}else{
						data = this.tab.list[0].concat(res.data.data.data)
					}
					
					this.$set(this.tab.list, 0, data);
					this.tab.page[0] += 1;
				})
			},
			getAddress() { //默认城市获取
				uni.getLocation({
					success: res => {
						getLocation({
							lng: res.longitude,
							lat: res.latitude
						}).then(res => {
							this.city = res.data.data.city
							this.provinceId = res.data.data.provinceId;
							this.cityId = res.data.data.cityId;
							this.getLawyerList(this.tab.page[0], this.typesId, res.data.data
								.provinceId, res.data.data.cityId, new Date().getSeconds())
						})
					}
				})
			},
			inputChange(e){
				this.searchVal=e;
				this.getLawyerList(1, this.typesId, this.provinceId,this.cityId, new Date().getSeconds())
			}
		},
		onReady() {
			if (uni.getStorageSync('type') === 1) {
				this.$set(this.tab, 'nav', [{
					name: "推荐律师"
				}])
			}
		},
		onLoad() {
			this.getAddress();
		},
		onReachBottom() {
			if (!this.tab.index) {
				this.getLawyerList(this.tab.page[0], this.typesId, this.provinceId, this.cityId)
			} else {
				this.getServeLawyer(this.tab.page[1], this.typesId, this.provinceId, this.cityId)
			}
		}
	}
</script>
<style>
	page {
		background: #F5F7FA;
	}
</style>
<style scoped lang="scss">
	.ItemBox {
		.selectLawyer{
			width: 136upx;
			height: 56upx;
			line-height: 56upx;
			background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
			border-radius: 100px;
			font-size: 26upx;
			color: #FFFFFF;
			text-align: center;
			text-shadow: 0px 3upx 4upx rgba(7, 2, 141, 0.22);
		}
		.typeName {
			font-size: 24rpx;
			color: #888D98;
			margin-right: 40rpx;
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
			padding-top: 20rpx;
		}

		.centerBox {
			width: 348rpx;
		}

		.call {
			width: 140rpx;
			height: 55upx;
		}

		.adr {
			font-size: 24rpx;
			color: #222222;
		}

		.Year {
			border: 1rpx solid #5b86ff;
			padding: 1rpx 8rpx 1rpx 8rpx;
			font-size: 20rpx;
			font-weight: bold;
			color: #5B86FF;
			margin-left: 12rpx;
		}

		.Name {
			font-size: 32rpx;
			font-weight: bold;
			color: #222222;
		}

		.photo {
			width: 130rpx;
			height: 130rpx;
			border-radius: 100px;
			display: block;

			image {
				width: 100%;
			}
		}

		.guanzhu {
			width: 44rpx;
			right: -4upx;
			bottom: 0rpx;
			height: 44upx;
			position: absolute;
		}

		padding: 24rpx;
		box-shadow: 0px 4px 20px rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 20rpx;
	}

	.address {
		width: 170upx;

		image {
			width: 28upx;
			height: 32upx;
			margin: auto;
		}

		text {
			font-size: 30upx;
			 
			font-weight: 500;
			color: #222222;
			margin: auto;
			margin-left: 8upx;
			flex: 1;
			-webkit-line-clamp: 1;
		}
	}

	.customBar {
		.back {
			width: 34upx;
			height: 26upx;
			margin: auto;
			margin-right: 32upx;
		}

		border-bottom: 1upx solid #ECEFF4;
		padding: 14upx 32upx;
	}

	.search {
		.text {
			font-size: 26upx;
			margin-left: 12upx;
			height: 37upx;
			line-height: 37upx;
			 
			font-weight: 500;
			flex: 1;
		}

		image {
			width: 23upx;
			height: 23upx;
			margin: auto;
		}

		padding: 11upx 24upx;
		flex: 1;
		height: 60rpx;
		background: #F5F7FA;
		border-radius: 100rpx;
	}
</style>
