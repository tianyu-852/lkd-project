<template>
	<view class="flex-column page">
		<image class="widthAll top" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bxls_tb_top.png" mode="widthFix" ></image>
		<view class="cell font26">
			<view class="flex flexend bottom12">
				<view class="title">商店下载</view>
			</view>
			<view class="item flex hcenter" v-for="(item,index) in list" :key="index">
				<image :src="item.image" mode="widthFix"></image>
				<view class="left48 ">
					<view class="btn">{{item.btn}}</view>
					<text class="heavy font28">{{item.text}}</text>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="item">
				<view class="flex between bottom12">
					<image src="/static/llq_txt.png" mode="widthFix"></image>
					<view class="title">商店下载</view>
				</view>
				<view class="textBox">{{url}}</view>
				<view class="copyBtn bold" @click="copy(url)">点我复制链接</view>
			</view>
			<view class="item flex hcenter" v-for="(item,index) in list2" :key="index">
				<image :src="item.image" mode="widthFix"></image>
				<view class="left48 flex1">
					<view class="btn">{{item.btn}}</view>
					<text class="heavy font28">{{item.text}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMyData
	} from "@/apis/apis.js"
	
	export default {
		data() {
			return {
				url:'https://h5.lawkd.com/empty?type=2',
				list:[{
					image:'/static/1.png',
					btn:'第一步',
					text:'打开应用市场'
				},{
					image:'/static/2.png',
					btn:'第二步',
					text:'搜索“律快答-律师端”'
				},{
					image:'/static/3.png',
					btn:'第三步',
					text:'点击下载'
				}],
				list2:[{
					image:'/static/4.png',
					btn:'第二步',
					text:'前往任意浏览器'
				},{
					image:'/static/5.png',
					btn:'第三步',
					text:'点击地址栏，粘贴链接地址'
				},{
					image:'/static/3.png',
					btn:'第四步',
					text:'前往应用市场下载'
				}]
			}
		},
		methods: {
			copy(data){
				uni.setClipboardData({
				    data: data,
				    success: function () {
				        console.log('success');
				    }
				});
			}
		},
		onShareAppMessage(res) {
			return {
				title: '百姓律师一站式法律服务平台',
				imageUrl: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_share_equiy.png'
			}
		},
		onLoad(e) {
			getMyData().then(res =>{
				if(res.data.code)
					return
				this.user = res.data.data
			})
		},
		onShow() {
			
		}
	}
</script>
<style scoped>
	.page{
		background: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_register_bg.png') 100%;
		padding-bottom: 36rpx;
	}
	.top{
		margin-bottom: -50rpx;
	}
	.title{
		color: #fff;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 24rpx;
		padding: 0 32rpx;
		background: #395CEA;
		border-radius: 16rpx;
	}
	.cell{
		width: calc(100% - 104rpx);
		padding: 32rpx;
		margin: 20rpx 20rpx 0;
		background: #FFFFFF;
		border: 1rpx solid #B4C5FF;
		border-radius: 40rpx;
		z-index: 1;
	}
	.item{
		padding-bottom: 36rpx;
		border-bottom: 2rpx dotted #CED3E6;
		margin: 0 8rpx 36rpx;
		
	}
	.item image{
		width: 282rpx;
	}
	.item .btn{
		color: #fff;
		display: table;
		line-height: 48rpx;
		font-size: 26rpx;
		padding: 0 15rpx;
		background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
		box-shadow: 0rpx 6rpx 16rpx rgba(0, 35, 212, 0.32);
		border-radius: 44rpx;
		margin-bottom: 24rpx;
	}
	.cell .item:last-child{
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	.copyBtn{
		color: #fff;
		line-height: 88rpx;
		text-align: center;
		background: linear-gradient(90deg, #4787FD 0%, #2B69F9 100%);
		box-shadow: 0px 6rpx 16rpx rgba(0, 35, 212, 0.32);
		border-radius: 44rpx;
	}
	.textBox{
		line-height: 88rpx;
		font-size: 26rpx;
		background: #F5F7FA;
		border-radius: 24rpx;
		margin-top: 34rpx;
		margin-bottom: 36rpx;
		text-align: center;
	}
</style>
