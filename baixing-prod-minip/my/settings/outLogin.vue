<template>
	<view>
		<view class="list backfff">
			<view class="marlr32">
				<view class="item flex between hcenter" v-for="(item,index) in list" @click="Link(item.url)" :key="index">
					<view class="name">{{item.name}}</view>
					<image src="/static/images/right.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="outLogin center backfff col100" @click="outLogin">退出登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [/* {
						name: "更换/解绑支付宝账号",
						url: ""
					}, */
					{
						name: "添加/修改支付密码",
						url: "setPassword"
					},
					{
						name: "意见反馈",
						url: "reaction"
					},
					{
						name: "用户协议说明",
						url: "userProtocol"
					},
					{
						name: "隐私协议说明",
						url: "privacyProtocol"
					},
					{
						name: "关于我们",
						url: "about"
					}
				]
			}
		},
		methods: {
			Link(url){
				uni.navigateTo({
					url:`${url}`
				})
			},
			outLogin() {
				uni.showModal({
					title: "百姓律师提醒您",
					content: "退出登录后将回到新用户初始状态,下次登录时将载入保存在帐号中的数据",
					confirmText: "退出登录",
					confirmColor: "#ff5757"
				})
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
	.outLogin {
		padding: 26rpx 0;
		font-size: 34rpx;
		font-weight: bold;
		color: #FF5757;
		position: fixed;
		bottom: 100rpx;
	}

	.list {
		.item {
			.name {
				font-size: 34rpx;
				color: #222222;
			}

			image {
				width: 14rpx;
			}

			padding: 32rpx 0;
			border-bottom: 1rpx solid #ECEFF4;
		}

		.item:last-child {
			border-bottom: 0rpx;
		}

		margin-top: 20rpx;
	}

	page {
		background: #F5F7FA;
	}
</style>
