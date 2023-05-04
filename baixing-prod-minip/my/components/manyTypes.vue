<template>
	<view>
		<u-popup v-model="props.status" mode="bottom" height="62%">
			<view class="flex typesBox">
				<view class="width200">
					<view v-for="(item,index) in list" :key="index" :class="['navItem','center',index==listActive?'navActive':'']"
					 @click="clickNav(index)">
						{{item.lawyer_tag_group}}
						<view class="xian1" v-if="index==listActive"></view>
					</view>
				</view>
				<view class="u-flex-1" style="padding-top: 18upx;">
					<view class="marlr32 flex between">
						<view v-for="(item,index) in list[listActive].lawyer_tags" :key="index" :class="['ConItem','flex','hcenter','flexcenter',item.status?'ConActive':'']"
						 @click="clickConItem(listActive,index)">
							<image v-if="item.status" src="/static/images/xz_icon.png" mode="widthFix" class="img"></image>
							{{item.lawyer_tag}}
						</view>
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
			types: Array
		},
		data() {
			return {
				props: {
					status: false,
				},
				list: [{
					lawyer_tags: [{
						status: false
					}]
				}],
				listActive: 0,
				conList: [],
				lawyer_tag: []
			}
		},
		watch:{
			'props.status'(newVal, oldVal){
				// console.log(newVal)
				this.$emit('showChange',newVal)
			}
		},
		methods: {

			clickConItem(tab1, tab2) {
				if (this.list[tab1].lawyer_tags[tab2].status) {
					this.$set(this.list[tab1].lawyer_tags[tab2], "status", !this.list[tab1].lawyer_tags[tab2].status);
					
					this.lawyer_tag.forEach((item, index) => {
						if (item.lawyer_tag_id == this.list[tab1].lawyer_tags[tab2].lawyer_tag_id) {
							this.lawyer_tag.splice(index, 1)
						}
					})
				} else {
					if (this.lawyer_tag.length == 3) {
						uni.showToast({
							icon: "none",
							title: "不能超过三个"
						})
						return
					}
					this.$set(this.list[tab1].lawyer_tags[tab2], "status", !this.list[tab1].lawyer_tags[tab2].status);
					this.lawyer_tag.push(this.list[tab1].lawyer_tags[tab2])
				}
				this.$emit("clickItem")
			},
			clickNav(index) {
				this.listActive = index
			},
			getFabuList() { //获取数据
				getFabuList().then(res => {
					this.$set(this, "list", res.data.data);
					this.types.forEach((item, index) => {
						res.data.data.forEach((item1, index1) => {
							item1.lawyer_tags.forEach((item2) => {
								if (item.lawyer_tag_id == item2.lawyer_tag_id) {
									this.$set(item2, 'status', true)
									this.lawyer_tag.push(item2);
								}
							})
						})
					})
				})
			}
		},
		mounted() {
			this.getFabuList();
		}
	}
</script>

<style scoped lang="scss">
	.typesBox {
		.ConActive {
			.img {
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
			width: 233upx;
			height: 68upx;
			background: #EEF0F3;
			border-radius: 8upx;
			font-size: 30upx;
			color: #888D98;
			margin: 10upx 0;
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
				top: 39upx;
			}
			position: relative;
			font-size: 32rpx;
			color: #888D98;
			line-height: 47rpx;
			padding: 36upx 0;
		}

		.width200 {
			background-color: #F3F5F8;
			height: 62vh;
			padding-top: 3upx;
		}
	}
</style>
