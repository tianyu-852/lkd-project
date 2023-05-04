<template>
	<view>
		<view class="relative searchBox">
			<view class="flex hcenter absolute searchabs flexcenter" v-if="search.TextStatus">
				<image src="/static/images/ss_icon.png" mode="widthFix" class="searchIcon" v-if="!search.value"></image>
				<text class="searchText">{{search.value?'':search_placeholder?search_placeholder:'搜索热门话题'}}</text>
			</view>
			<input type="text" class="searchInput" @focus="getInput" @blur="blurInput" confirm-type="search" v-model="search.value" @confirm="getSearchVal" />
		</view>
		<view class="height1"></view>
		<view class="marlr32">
			<view v-if="search.history.length>0">
				<view class="flex between martop80">
					<view class="historyText">历史记录</view>
					<image src="/static/images/qk_icon.png" mode="widthFix" class="width44" @click="delHistorySearch"></image>
				</view>
				<view class="flex historyBorder">
					<view class="historyLi" v-for="(item,index) in search.history" :key="index" @click="clickItem(item)">{{item}}</view>
				</view>
			</view>
			<view v-if="search.hot.length>0">
				<view class="flex between martop80">
					<view class="historyText">热门搜索</view>
				</view>
				<view class="flex">
					<view class="historyLi" v-for="(item,index) in search.hot" :key="index" @click="clickItem(item)">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="" @click="getSearchVal" >123</view> -->
	</view>
</template>

<script>
import { getHotSearch, getHistorySearch, delHistorySearch } from "@/api/apis.js"

export default {
	data() {
		return {
			search: {
				TextStatus: true,
				history: [],
				hot: [],
				value: null
			},
			search_placeholder:''
		}
	},

	methods: {
		delHistorySearch() {
			uni.showModal({
				content: "删除历史记录?",
				success: res => {
					if (res.confirm) {
						delHistorySearch().then(res => {
							if (!res.data.code) {
								this.$set(this.search, "history", [])
							}
						})
					}
				}
			})
		},
		clickItem(e) { //点击历史或者热门
			this.search.value = e;
			this.getSearchVal();
		},
		getSearchVal() { //将搜索值传给搜索tab页面
			uni.redirectTo({
				url: `./searchTab?value=${this.search.value}`
			})
		},
		blurInput() { //失去焦点时
			this.search.TextStatus = true
		},
		getInput() { //获得焦点时
			this.search.TextStatus = false
		},
		getHistorySearch() { //获取历史记录
			getHistorySearch().then(res => {
				this.search.history = res.data.data
			})
		},
		getHotSearch() { //获取热门搜索
			getHotSearch().then(res => {
				this.search.hot = res.data.data
			})
		}
	},
	onLoad(e) {
		this.getHotSearch();
		this.search_placeholder = e.search_placeholder

	},
	onShow() {
		this.getHistorySearch()
	}
}
</script>

<style>
	.historyBorder {
		border-bottom: 1rpx solid #ECEFF4;
		padding-bottom: 100rpx;
	}

	.historyLi {
		padding: 10rpx 28rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #888D98;
		background: #EEF0F3;
		border-radius: 100rpx;
		margin-right: 28rpx;
		margin-top: 28rpx;
	}

	.historyText {
		font-size: 32rpx;
		font-weight: 500;
		color: #222222;
	}

	.width44 {
		width: 44rpx;
	}

	.height1 {
		height: 1rpx;
		background-color: #ECEFF4;
	}

	.searchBox {
		margin: 14rpx 32rpx;
		margin-top: 0;
		padding-top: 14rpx;
	}

	.searchabs {
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		pointer-events: none;
		/* transform: translate(-50%, -50%); */
	}

	.searchText {
		font-size: 26rpx;
		font-weight: 500;
		color: #C9CED9;
		margin-left: 12rpx;
	}

	.searchIcon {
		width: 23rpx;
	}

	.searchInput {
		/* padding-left: 50rpx; */
		background: #F5F7FA;
		border-radius: 100rpx;
		height: 60rpx;
	}
</style>
