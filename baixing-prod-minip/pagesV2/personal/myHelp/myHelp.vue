<template>
	<view>
		<userInfo :info="info"></userInfo>
		<view class="marlr32" style="padding-bottom: 20upx;">
			<view class="title">我的帮助列表</view>
			<list :list="list" @clickBtn="clickBtn"></list>
		</view>
	</view>
</template>

<script>
	import {
		getFRHistoryHeader,
		getFRHistoryPage,
		sendFundraisingRefund
	} from "@/api/apis.js"
	import userInfo from "../components/userInfo.vue"
	import list from "../components/list.vue"
	export default {
		components: {
			userInfo,
			list
		},
		data() {
			return {
				info: {},
				list: [],
				page:1
			}
		},
		methods: {
			clickBtn(index,type){
				const item = this.list[index]
				if(type == 0){
					sendFundraisingRefund({
						fundraising_id:item.fundraising_id,
					}).then(res=>{
						if(res.data.code){
							this.$u.toast(res.data.message)
						}else{
							item.is_refund = 1
							this.$set(this.list,index,item)
						}
					})
				}else{
					uni.navigateTo({
					    url: '/pagesV2/index/detail/detail?id=' + item.fundraising_id + '&isFrom=' + 1
					});
				}
			},
			getFRHistoryPage() {
				getFRHistoryPage({
					page: this.page
				}).then(res => {
					if(res.data.code != 0)
						return
						let list = res.data.data.data
					for(let item in list){
						if(list[item].expired_at){
							// list[item].expired_at = new Date().getTime() + 1000
							list[item].expired_at = list[item].expired_at - (new Date().getTime()/1000)
						}
					}
					if(this.page == 1){
						this.list = res.data.data.data
					}else{
						this.list.concat(res.data.data.data)
						this.page += 1;
					}
				})
			}
		},
		onShow() {
			getFRHistoryHeader().then(res => {
				if (res.data.code == 0) {
					this.info = res.data.data
					let list = [{
						title: '赞助金额',
						number: this.info.donate_money,
						unit: '元'
					}, {
						title: '我帮助的',
						number: this.info.fundraise_number,
						unit: '人'
					}, {
						title: '帮忙转发',
						number: this.info.share_fundraising_number,
						unit: '人'
					}]
					this.info.myData = list
				}
			})
			this.page=1
			this.getFRHistoryPage();
		},
		onPullDownRefresh() {
			this.page = 1
			this.getFRHistoryPage()
		},
		onReachBottom() {
			this.getFRHistoryPage()
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title:'邀请好友证实，即可申请首页推荐',
				url:this.info.share.wechat_mini_program.path
			}
		}
	}
</script>

<style lang="scss">
	.typesBox {}

	page {
		background: #F5F7FA;
	}

	.title {
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
