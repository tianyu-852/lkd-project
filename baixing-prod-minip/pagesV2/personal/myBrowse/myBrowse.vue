<template>
	<view>
		<userInfo></userInfo>
		<view class="marlr32">
			<view class="title">我的浏览记录</view>
			<list :list="tab.list[tab.index]"></list>
		</view>
		<types ref="types" @setTypes="setTypes"></types>
	</view>
</template>

<script>
	import {
		getFindBanner,
		getLawyerList,
		getLocation,
		getServeLawyer,
		getAttention
	} from "@/api/apis.js"
	import types from "@/components/types.vue"
	import userInfo from "../components/userInfo.vue"
	import list from "../components/list.vue"
	export default {
		components: {
			types,
			userInfo,
			list
		},
		data() {
			return {
				banner: {},
				tab: {
					nav: [{
						name: "推荐律师"
					}, {
						name: "我的律师"
					}],
					index: 0,
					list: [
						[],
						[]
					],
					page: [1, 1]
				},
				tabIndex: 1,
				typesName: null,
				typesId: 0,
				provinceId: null,
				cityId: null
			}
		},
		methods: {
			linkPhone(info) {
				if(uni.getStorageSync('type') === 1){
					this.$u.toast('暂未开通律师咨询律师功能')
					return
				}
				uni.navigateTo({
					url: `/pagesV1/index/phoneAdvisory?info=${JSON.stringify(info)}`
				})
			},
			setFollow(item, index) {
				console.log(item)
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
			setAddress() {
				uni.navigateTo({
					url: "/pagesV1/common/districts"
				})
			},
			setTypes() {
				let data = this.$refs.types;
				this.typesName = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag;
				this.typesId = data.list[data.listIndex[0]].lawyer_tags[data.listIndex[1]].lawyer_tag_id;
				this.tab.list = [
					[],
					[]
				];
				this.getLawyerList(1, this.typesId, this.provinceId, this.cityId, new Date().getSeconds())
				console.log(this.typesId)
			},
			clickTypes() {
				this.$refs.types.props.status = !this.$refs.types.props.status
			},
			linkSearch() { //跳转搜索页面
				uni.navigateTo({
					url: "/pagesV1/common/search"
				})
			},
			toLawyerPage(id) { //跳转律师主页
				uni.navigateTo({
					url: `../index/lawyerPage?id=${id}`
				})
			},
			getServeLawyer(page, lawyer_tag_id, province_id, city_id) { //服务过我的律师
				getServeLawyer({
					page: this.tab.page[0],
					lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
					province_id: province_id ? province_id : null,
					city_id: city_id ? city_id : null,
				}).then(res => {
					let data = this.tab.list[1].concat(res.data.data.data)
					this.$set(this.tab.list, 1, data);
					this.tab.page[1] += 1;
				})
			},
			getLawyerList(page, lawyer_tag_id, province_id, city_id, time) { //获取律师列表
				getLawyerList({
					page: page,
					lawyer_tag_id: lawyer_tag_id ? lawyer_tag_id : 0,
					province_id: province_id ? province_id : null,
					city_id: city_id ? city_id : null,
					random: time ? time : null
				}).then(res => {
					let data = this.tab.list[0].concat(res.data.data.data)
					this.$set(this.tab.list, 0, data);
					this.tab.page[0] += 1;
				})
			},
			getFindBanner() { //获取banner图
				getFindBanner().then(res => {
					this.$set(this, "banner", res.data.data)
				})
			},
			getAddress() { //默认城市获取
				uni.getLocation({
					success: res => {
						getLocation({
							lng: res.longitude,
							lat: res.latitude
						}).then(res => {
							this.provinceId = res.data.data.provinceId;
							this.cityId = res.data.data.cityId;
							this.getLawyerList(this.tab.page[0], this.typesId, res.data.data
								.provinceId, res.data.data.cityId, new Date().getSeconds())
						})
					}
				})
			},
			setTab(index) {
				this.tab.index = index;
			}
		},
		onLoad() {
			this.getAddress();
			this.getFindBanner();
			this.getServeLawyer();
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

<style lang="scss">
	.typesBox {}
	page {
		background: #F5F7FA;
	}
	.title{
		color: #222;
		font-size: 36upx;
		font-weight: bold;
	}
	.problem {
		.text {
			font-size: 26rpx;
			font-weight: bold;
			color: #888D98;
			margin-left: 6rpx;
		}

		.textA {
			font-size: 26rpx;
			font-weight: bold;
			color: #3777fc;
			margin-left: 6rpx;
		}

		margin-left: 48rpx;
	}

	.search {
		.text {
			font-size: 26rpx;
			color: #C9CED9;
			margin-left: 12rpx;
		}

		image {
			width: 23rpx;
		}

		width: 366rpx;
		height: 64rpx;
		background: #F5F7FA;
		border-radius: 100rpx;
	}
</style>
