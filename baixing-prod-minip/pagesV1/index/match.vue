<template>
	<view>
		<!-- <view class="barStatus"></view>
		<view class="barStatusH"></view> -->
		<view class="backfff matchTop">
			<view class="flex hcenter navBox marlr32 font32">
				<view class="flex hcenter flexcenter u-flex-1">
					<view :class="[tab.navIndex==0?'on':'','relative']" @click="clickNav(index)" v-for="(item,index) in tab.nav" :key="index">
						<text>{{item}}</text>
						<view class="xian"></view>
					</view>
				</view>
				<view :class="['flex hcenter typesBox flexcenter u-flex-1',tab.navIndex==1?'on':'']" @click="setAddress">
					<image src="/static/images/dw_icon@3x.png" mode="widthFix"></image>
					<view class="left8 relative">
						<text>{{there?there.city:'选择地区'}}</text>
						<view class="xian"></view>
					</view>
				</view>
			</view>
				<!-- <view class="flex between typesBox">
					<view class="flex hcenter" @click="clickTypes">
						<image src="../../static/images/bottom.png" mode="widthFix"></image>
						<view :class="['typesText','flex']">
							<view v-if="type.select">已选择</view>
							<view :class="['flex',type.select?'color0061FF':'']">
								<view v-if="type.select">「</view>{{type.select?type.select:"问题类型"}}
								<view v-if="type.select">」</view>
							</view>
						</view>
					</view>
					
				</view> -->
		</view>
		<view style="height: 88rpx;"></view>
		<!-- <view class="fixed" style="z-index: 11;top: 100px;">
			<types :haveBar="true" ref="types" @setTypes="setTypes"></types>
		</view> -->
		<view class="" v-if="!tab.navIndex">
			<view class="" v-for="(item,index) in Con.list">
				<lawyer-list-item :key="index" :item="item" @setFollow="setFollow(item,index)"></lawyer-list-item>
				<view class="banner" v-if="index == 2" @click="clickBanner">
					<image :src="banner[0].banner" mode="widthFix"></image>
				</view>
			</view>
			<view class="center null" v-if="!Con.list.length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="" v-if="tab.navIndex">
			<view class="" v-for="(item,index) in Con.list1">
				<lawyer-list-item :key="index" :item="item" @setFollow="setFollow(item,index)"></lawyer-list-item>
				<view class="banner" v-if="index == 2" @click="clickBanner">
					<image :src="banner[0].banner" mode="widthFix"></image>
				</view>
			</view>
			<view class="center null" v-if="!Con.list.length">
				<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getLawyerList,
		getServeLawyer,
		getAttention,
		getBanner
	} from "@/api/apis.js"
	import {jumpToUrl} from "@/common/util.js"
	import lawyerListItem from "@/components/lawyerListItem.vue"
	import types from "@/components/types.vue"
	export default {
		components: {
			types,
			lawyerListItem
		},
		data() {
			return {
				provinceId: 296,
				cityId: 301,
				cityName: null,
				there:{},
				tab: {
					nav: ["推荐律师"],
					navIndex: 0,
				},
				Con: {
					list: [],
					page: 1,
					list1: [],
					page1: 1
				},
				type: {
					select: null,
					id: null
				},
				banner:[]
			}
		},
		methods: {
			clickBanner(){
				jumpToUrl(this.banner[0].jump_type)
			},
			setFollow(item,index) {
				getAttention({
					type: item.is_follow,
					follow_user_id:item.user_id
				}).then(res => {
					if (!res.data.code) {
						item.is_follow = res.data.data.is_follow;
						uni.showToast({
							title: res.data.data.is_follow ? '关注成功' : '已取消关注'
						})
					}
			
				})
			},
			// setFollow(val, id, index) {
			// 	getAttention({
			// 		type: val ? 1 : 0,
			// 		follow_user_id: id
			// 	}).then(res => {
			// 		if (!res.data.code) {
			// 			if(this.tab.navIndex == 0)
			// 				this.Con.list[index].is_follow = res.data.data.is_follow	
			// 			else
			// 				this.Con.list1[index].is_follow = res.data.data.is_follow
			// 		}

			// 	})
			// },
			setAddress() { //切换地址
				if(!this.there||this.tab.navIndex){
					uni.navigateTo({
						url: `/pagesV1/common/districts?callback=true&city=`+JSON.stringify(this.there),
						events:{
							setAddress:res=>{
								console.log(res)
								// this.cityId=res.city_id
								// this.provinceId=res.province_id
								// this.cityName=res.city
								this.there=res
								this.Con.page1=1
								this.Con.list1 = []
								this.tab.navIndex=1
								this.getAddLawyer(this.Con.page1);
								// this.getServeLawyer(this.Con.page1);
							}
						}
					})
				}else{
					this.tab.navIndex=1
				}
			},
			// setTypes() { //筛选问题类型
			// 	let data = this.$refs.types;
			// 	if (!this.tab.navIndex) {
			// 		this.Con.page = 1;
			// 		this.Con.list = []
			// 		this.type.select = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag;
			// 		this.type.id = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag_id;
			// 		this.getLawyer(this.Con.page, data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]]
			// 			.lawyer_tag_id)
			// 		console.log(data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag_id)
			// 		console.log(data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag)
			// 	}
			// },
			// clickTypes() {
			// 	this.$refs.types.props.status = !this.$refs.types.props.status
			// },
			clickNav(index) {
				this.tab.navIndex = index
			},
			getAddLawyer(page, type) { //获取匹配律师
				getLawyerList({
					// random: time ? time : 0,
					page: page,
					province_id: this.there.province_id || null,
					city_id: this.there.city_id || null,
					lawyer_tag_id: type || null
				}).then(res => {
					if (!res.data.code) {
						//console.log(res);
						let data = this.Con.list1.concat(res.data.data.data);
						this.$set(this.Con, "list1", data)
						this.Con.page1 += 1
					}

				})
			},
			getLawyer(page, type) { //获取匹配律师
				getLawyerList({
					// random: time ? time : 0,
					page: page,
					lawyer_tag_id: type || null
				}).then(res => {
					if (!res.data.code) {
						//console.log(res);
						let data = this.Con.list.concat(res.data.data.data);
						this.$set(this.Con, "list", data)
						this.Con.page += 1
					}
			
				})
			},
			getServeLawyer(page) {
				getServeLawyer({
					page: page
				}).then(res => {
					let data = this.Con.list1.concat(res.data.data.data);
					this.$set(this.Con, "list1", data)
					this.Con.page1 += 1
				})
			}
		},
		onLoad(e) {
			console.log('e',e)
			this.there = uni.getStorageSync('there')||null
			this.getLawyer(this.Con.page);
			this.getAddLawyer(this.Con.page1);
		},
		onReady() {
			getBanner({
				key:3
			}).then(res=>{
				this.banner = res.data.data
			})
		},
		onReachBottom(e) {
			if (!this.tab.navIndex) {
				this.getLawyer(this.Con.page, this.type.id);
			} else {
				this.getAddLawyer(this.Con.page1)
			}

		}
	}
</script>

<style lang="scss">
	.banner{
		width: calc(100% - 64rpx);
		margin: 20rpx 32rpx 0;
		image{
			width: 100%;
		}
	}
	.ItemBox {

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
			flex: 1;
			flex-wrap: nowrap;
		}

		.call {
			width: 140rpx;
		}

		.address {
			font-size: 24rpx;
			color: #222222;
		}

		.Year {
			padding: 0 8upx;
			border: 2rpx solid #5b86ff;
			font-size: 20rpx;
			line-height: 27upx;
			font-weight: bold;
			color: #5B86FF;
			margin-left: 12rpx;
			height: 30upx;
			border-radius: 5upx;
		}
		
		.tips{
			width: 128upx;
			height: 32upx;
			line-height: 32upx;
			color: #424a66;
			background: linear-gradient(229deg, #EBCDA1 0%, #E8C99C 43%, #E3C396 100%);
			text-align: center;
			font-size: 20upx;
			border-radius: 4upx;
			display: block;
			margin-left: 12upx;
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
		}

		.guanzhu {
			width: 44rpx;
			right: -4upx;
			bottom: 0;
			position: absolute!important;
		}

		padding: 24rpx;
		box-shadow: 0px 4px 20px rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		margin-top: 20rpx;
	}

	.color0061FF {
		color: #0061ff !important;
	}

	.barStatus {
		position: fixed;
		background-color: #fff;
		z-index: 10;
		width: 100%;
	}

	.matchTop {
		position: fixed;
		width: 100%;
		z-index: 10;
	}

	page {
		background-color: #F5F7FA;
	}

	.typesBox {
		padding: 16rpx 0;
		// margin-right: 168rpx;
		flex-wrap: nowrap;
	}

	.typesBox image {
		width: 24rpx;
	}

	.navBox {
		font-size: 32rpx;
		color: #888D98;
		// padding-bottom: 22rpx;
		// border-bottom: 1px solid #ECEFF4;
		.on{
			font-weight: bold;
			color: #222222;
			.xian {
				width: 28rpx;
				height: 6rpx;
				background: #0061FF;
				border-radius: 100rpx;
				position: absolute;
				bottom: -16rpx;
				left: 50%;
				transform: translate(-50%, 0);
			}
		}
	}

</style>
