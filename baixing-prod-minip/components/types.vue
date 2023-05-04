<template>
	<view>
		<u-popup v-model="props.status" :mode="mode">
			<u-navbar :is-back="false" v-if="haveBar"></u-navbar>
			<view class="flex-row typesBox">
				<view class="width200">
					<view v-for="(item,index) in list" :key="index" :class="['navItem','center',index==listActive?'navActive':'']"
					 @click="clickNav(index)">
						{{item.lawyer_tag_group}}
						<view class="xian1" v-if="index==listActive"></view>
					</view>
				</view>
				<view style="flex: 1;padding: 18upx 0 10upx 22upx;" class="backfff">
					<view class="hottitle flex-row between">
						<text>{{listActive==0?'热门推荐':' '}} </text>
						<view class="flex hcenter"@click="props.status = false;">
							<u-icon name="arrow-up" size="25" color="#222"></u-icon>
							<text style="margin-right: 32rpx;margin-left: 8rpx;"> 收起</text>
						</view>
					</view>
					<view v-for="(item,index) in list[listActive].lawyer_tags" :key="index" :class="['ConItem','flex','hcenter','flexcenter',listActive==listIndex[0]&&index==listIndex[1]?'ConActive':'']" @click="clickConItem(index)">
					 <image v-if="listActive==listIndex[0]&&index==listIndex[1]" src="../static/images/xz_icon.png" mode="widthFix" class="img"></image>
						{{item.lawyer_tag}}
					</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import {
		getFabuList
	} from "@/api/apis.js"
	export default {
		props: {
			haveBar:Boolean,
			mode:{
				type:String,
				default:'top'
			}
		},
		data() {
			return {
				props: {
					status: false,
				},
				list: [{
					lawyer_tags: null
				}],
				listActive: 0,
				listIndex: [0, null],
			}
		},
		methods: {

			clickConItem(index) {
				this.listIndex[0] = this.listActive;
				this.listIndex[1] = index;
				this.props.status = false;
				this.$emit("setTypes",this.list[this.listActive].lawyer_tags[index])
			},
			clickNav(index) {
				this.listActive = index
			},
			getFabuList() { //获取数据
				getFabuList({is_have_hot:1}).then(res => {
					this.$set(this, "list", res.data.data);
				})
			}
		},
		mounted() {
			this.getFabuList();
			console.log(this.haveBar)
		}
	}
</script>

<style lang="scss">
	.hottitle{
		height: 42rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #222222;
		margin: 23rpx 0 18rpx 10rpx;
	}
	.typesBox {
		background-color: #fff;
		.ConActive {
			.img{
				position: absolute;
				width: 26rpx;
				right: 0;
				bottom: 0;
			}
			box-sizing: border-box;
			border: 2rpx solid #0061FF;
			background-color: #FFFFFF !important;
			color: #0061FF !important;
			position: relative;
		}
		
		.ConItem {
			width: 233rpx;
			height: 68rpx;
			background: #EEF0F3;
			border-radius: 8rpx;
			font-size: 30rpx;
			color: #888D98;
			margin: 10rpx;
			float: left;
		}

		.navActive {
			color: #222222 !important;
			font-weight: bold !important;
		}

		.navItem {
			.xian1 {
				width: 6upx;
				height: 40upx;
				background: #0061FF;
				position: absolute;
				right: -5upx !important;
				top: 42upx;
			}

			position: relative;
			font-size: 32rpx;
			color: #888D98;
			line-height: 47rpx;
			padding: 39upx 0;
		}

		.width200 {
			background-color: #F3F5F8;
		}
	}
</style>
