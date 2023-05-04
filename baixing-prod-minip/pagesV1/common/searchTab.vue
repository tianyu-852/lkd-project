<template>
	<view>
		<view id="top">
			<view class="relative searchBox">
				<view class="flex hcenter absolute searchabs" v-if="search.TextStatus&&!search.value">
					<image src="/static/images/ss_icon.png" mode="widthFix" class="searchIcon"></image>
					<text class="searchText">搜索热门话题</text>
				</view>
				<input type="text" class="searchInput" @focus="getInput" @blur="blurInput" confirm-type="search" @confirm="getSearchVal(1)" v-model="search.value" />
			</view>
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" height="88" active-color="#222" 
			:bar-style='{"backgroundColor":"#0061FF","border-radius":"20rpx","marginBottom":"-4rpx"}' swiperWidth="750"></u-tabs-swiper>
		</view>
	
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiperBox" :style="{height:'calc(100% - '+swiperHeight+'px)'}">
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;" @scrolltolower="getSearchVal(0)">
					<view class="">
						<lawyerListItem v-for="(item,index) in tabs[0]" :key="index" :item="item" @setFollow="setFollow(item,index)"></lawyerListItem>
					</view>
					<view class="center null" v-if="!tabs[0].length">
						<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="getSearchVal(0)">
					<view class="itemBox1" v-for="(item,index) in tabs[1]" :key="index">
						<view class="marlr32">
							<view class="" @click="linkDetails(item.question_id)">
								<view class="flex hcenter">
									<image :src="item.avatar" mode="aspectFill" class="photo1"></image>
									<u-parse :html="search.value,item.nickname | toRed" class="name1"></u-parse>
									<view class="time1">{{item.created_at}}</view>
								</view>
								<view class="content1 line3">
									<text class="type1">{{item.lawyer_tag}}</text>
									<text class="title1">{{item.title.length>60? item.title.substr(0,60)+'...' :item.title}}</text>
									<text class="more" v-if="item.title.length > 60">阅读全文</text>
								</view>
								<!-- <view class="more">阅读全文</view> -->
								<image class="question_images" :src="item1" mode="aspectFill" v-for="(item1,index1) in item.question_images" :key="index1"></image>
							</view>
							<view class="flex between color888D98">
								<button class="flex hcenter share" open-type="share" :data-data="item">
									<image src="/static/images/fx_icon.png" mode="widthFix" class="width36"></image>
									<text>分享</text>
								</button>
								<view class="flex hcenter">
									<image src="/static/images/pl_icon.png" mode="widthFix" class="width36"></image>
									<text class="left8">{{item.comment_number}}</text>
								</view>
								<view class="flex hcenter" @click="clickLike(item.question_id,item.is_like,index)">
									<image
										:src="item.is_like?'/static/images/dz_icon_sel.png':'/static/images/dz_icon.png'"
										mode="widthFix" class="width36"></image>
									<text class="left8">{{item.like_number}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="center null" v-if="!tabs[1].length">
						<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="getSearchVal(0)">
					<view class="backfff item2" v-for="(item,index) in tabs[2]" :key="index" @click="toUserPage(item.user_id)">
						<view class="marlr32 flex between hcenter">
							<view class="flex hcenter flex1">
								<image :src="item.avatar" mode="aspectFill" class="photo2"></image>
								<view class="left16">
									<u-parse :html="search.value,item.nickname | toRed" class="name3 line1"></u-parse>
									<view class="fans">{{item.follow_number}}</view>
								</view>
							</view>
							<view class="attention flex hcenter" @click.stop="toDetail(item.user_id,item.nickname)">
								<image src="/static/images/sl_icon2.png" class="width32" mode="widthFix"></image>
								<text class="left4">私聊</text>
							</view>
							<!-- <view :class="item.is_follow?'attentionA':'attention'"
								@click.stop="getAttention(item.is_follow,item.user_id,index)">
								{{item.is_follow?"已关注":"关注"}}
							</view> -->
						</view>
					</view>
					<view class="center null" v-if="!tabs[2].length">
						<image src="/static/images/kym_qsy_image.png" mode="widthFix"></image>
						<view class="text">暂无数据</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import { getSearchVal, getLike, getUnlike, getAttention } from "@/api/apis.js"
	import lawyerListItem from "@/components/lawyerListItem.vue"

	export default {
		components:{
			lawyerListItem
		},
		data() {
			return {
				swiperHeight: null,
				search: {
					TextStatus: false,
					value: null,
				},
				list: [
					{ name: '律师', type: 2 }, 
					{ name: '问答', type: 0 },
				  // { name: '用户', type: 1 }
				],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				page: [1, 1, 1],
				type: null,
				tabs: [
					[],
					[],
					[]
				]
			}
		},
		filters: {
			toRed: function(content, keyword) {
				var reslut = keyword.replace('' + content + '', "<text style='color:#0061FF'>" + content + "</text>");
				return reslut;
			},
		},
		methods: {
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
			toDetail(id,name){
				uni.navigateTo({
					url: `/pagesV1/info/infoDetails?id=${id}&name=${name}`
				})
			},
			toUserPage(id){
				uni.navigateTo({
					url: `/my/client/heLookPage?id=${id}`
				})
			},
			toLawyerPage(id) { //跳转律师主页
				uni.navigateTo({
					url: `../index/lawyerPage?id=${id}`
				})
			},
			// toPhone(info) {
			// 	if(uni.getStorageSync('type') === 1){
			// 		this.$u.toast('暂未开通律师咨询律师功能')
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url: `/pagesV1/index/phoneAdvisory?info=${JSON.stringify(info)}`
			// 	})
			// },
			linkDetails(id) {
				uni.navigateTo({
					url: `../index/askDetails?id=${id}`
				})
			},
			getAttention(is, id, index) { //关注
			console.log(is, id, index)
			console.log(this.tabs)
				getAttention({
					type: is ? 1 : 0,
					follow_user_id: id
				}).then(res => {
					this.tabs[2][index].is_follow = res.data.data.is_follow
					console.log(res)
				})
			},
			clickLike(id, islick, index) { //点赞
				if (islick) {
					getUnlike({
						type: 3,
						source_id: id
					}).then(res => {

						this.tabs[0][index].is_like = 0;
						this.tabs[0][index].like_number -= 1;
						uni.showToast({
							icon: "none",
							title: "取消点赞成功"
						})
					})
					return
				}
				getLike({
					type: 3,
					source_id: id
				}).then(res => {
					this.tabs[0][index].is_like = 1;
					this.tabs[0][index].like_number += 1;
					uni.showToast({
						icon: "none",
						title: "点赞成功"
					})
				})
			},
			getSearchVal(next) { //获取搜索结果
				this.page[this.swiperCurrent]=next?1:this.page[this.swiperCurrent]
				getSearchVal({
					type: this.list[this.swiperCurrent].type,
					search: this.search.value,
					page: this.page[this.swiperCurrent]
				}).then(res => {
					let data = next?res.data.data.data:this.tabs[this.swiperCurrent].concat(res.data.data.data)
					this.$set(this.tabs, this.swiperCurrent, data);
					this.page[this.swiperCurrent] += 1
				})
			},
			blurInput() { //失去焦点时
				this.search.TextStatus = true
			},
			getInput() { //获得焦点时
				this.search.TextStatus = false
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);

			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				setTimeout(() => {
					this.getSearchVal(1);
				}, 501)
			},
			// getElementHeight(element) { //动态获取高度
			// 	uni.getSystemInfo({
			// 		success: res => {
			// 			this.$set(this, "swiperHeight", res.windowHeight)
			// 		}
			// 	})
			// },
			getDivInfo(obj){
				const query = uni.createSelectorQuery().in(this);
				query.select(obj).boundingClientRect(data => {
					console.log(data.height)
					this.swiperHeight=data.height
					// obj=='#myNavbar'?this.navBarHeight=data.height:null;
					// obj=='#mySticky'?this.stickyHeight=data.height:null;
				}).exec();
			},
		},
		onLoad(value) {
			this.search.value = value.value;
			this.type=uni.getStorageSync('type')
			this.getSearchVal(1);
			this.getDivInfo('#top')
			// this.getElementHeight()
		},
		// onReachBottom() {
		// 	this.getSearchVal(0);
		// },
		onShareAppMessage(e) {
			const promise = new Promise(resolve => {
				resolve({
					title: e.target.dataset.data.title
				})
			})
			return {
				title: e.target.dataset.data.title,
				path: `/pagesV1/index/askDetails?id=${e.target.dataset.data.question_id}`
			}
		}
	}
</script>

<style>
	.serveItem {
		width: 105upx;
		height: 40rpx;
		border: 1rpx solid #C9CED9;
		border-radius: 8rpx;
		font-size: 22rpx;
		line-height: 36rpx;
		color: #99A0AC;
		margin: 0 12rpx;
	}

	.serveName {
		width: 108rpx;
		height: 33rpx;
		font-size: 24rpx;
		 
		font-weight: 500;
		line-height: 36rpx;
		color: #888D98;
		opacity: 1;
		/* margin-right: 26rpx; */
	}
	.swiperBox{
		width: 100%;
		height: calc(100% - 88px);
		background:#F5F7FA;
		position: absolute;
	}
	.advisory {
		width: 130rpx;
	}

	.item3 {
		box-shadow: 0px 4px 20px rgba(194, 220, 238, 0.26);
		border-radius: 8rpx;
		padding: 24rpx 0 27rpx 0;
		margin: 20rpx 32rpx;
	}

	.year {
		margin: 8rpx 0 4rpx 0;
	}

	.fontZ {
		font-size: 24rpx;
		color: #222222;
	}

	.name3 {
		width: 300rpx;
		white-space:nowrap;
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
	}

	.photo3 {
		width: 130rpx;
		height: 130rpx;
		border-radius: 100px;
	}

	.attentionA {
		padding: 10rpx 20rpx;
		background: #E8EEF6;
		line-height: 44rpx;
		font-size: 28rpx;
		border-radius: 100rpx;
		color: #AEB7C8;
	}

	.attention {
		border: 2rpx solid #0061FF;
		border-radius: 100rpx;
		padding: 10rpx 34rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: #0061FF;
	}

	.fans {
		font-size: 28rpx;
		color: #888D98;
		margin-top: 8rpx;
	}

	.name2 {
		width: 420rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: #222222;
	}

	.photo2 {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100px;
	}

	.item2 {
		margin: 12rpx 0 0;
		padding: 24rpx 0;
		border-radius: 8rpx;
	}

	.width36 {
		width: 36rpx;
	}

	.question_images {
		width: 220rpx;
		height: 144rpx;
		margin-right: 10upx;
	}

	.more {
		text-align: right;
		font-size: 26rpx;
		font-weight: bold;
		color: #677592;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		float: right;
	}

	.itemBox1 {
		padding: 40rpx 0;
		background-color: #FFFFFF;
		margin: 14rpx 0;
	}

	.content1 {
		margin-top: 18rpx;
	}

	.title1 {
		margin-top: 18rpx;
		text-align: justify;
		margin-left: 20rpx;
	}

	.type1 {
		color: #FFFFFF;
		font-size: 26upx;
		font-weight: bold;
		/* background-size: 100% 100% !important; */
		padding: 2rpx 8rpx;
		background: linear-gradient(270deg, #FF2B2B 0%, #FF4646 100%);
		border-radius: 4upx;
	}

	.time1 {
		font-size: 28rpx;
		font-weight: 500;
		color: #888D98;
		margin-left: 12rpx;
	}

	.name1 {
		margin-left: 8rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #222222;
	}

	.photo1 {
		border-radius: 100px;
		width: 28rpx;
		height: 28rpx;
	}

	.searchBox {
		padding: 14rpx 32rpx;
		height: 88upx;
	}

	.searchabs {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
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
		padding-left: 50rpx;
		background: #F5F7FA;
		border-radius: 100rpx;
		height: 60rpx;
	}
</style>
