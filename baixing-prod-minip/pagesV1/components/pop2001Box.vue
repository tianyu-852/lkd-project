<template>
	<u-popup v-model="value" mode="center" border-radius="16">
				<view class="pop2001Box flex-column">
					<text class="close" @click="value=false">关闭</text>
					<image class="logo" src="/static/images/logo_icon.svg"></image>
					<view class="title">{{title}}</view>
					<view class="content">
						律师是利用工作之余休息时间解答问题,若
						在开庭办案中,接单可能有所延迟,如长时间
						未接听,建议稍后再拨打或更换律师咨询
					</view>
					<view class="content hint-text">
						(咨询请说明来自<text class="color0061FF">“百姓律师”</text>平台)
					</view>
					<view class="subBtn" @click="toFabu">试试图文咨询</view>
				</view>
			</u-popup>
</template>

<script>
	export default {
		props:{
			value:Boolean,
			title:String
		},
		model:{
			event:'input'
		},
		watch:{
			value(newVal,old){
				this.$emit('input',newVal)
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			toFabu(){
				uni.navigateTo({
					url:'/pagesV1/common/fabu'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
.pop2001Box{
		width: 600upx;
		align-items: center;
		position: relative;
		padding:48upx 32upx 32upx;
		.close{
			font-size: 32upx;
			line-height: 68upx;
			color: #888D98;
			position: absolute;
			top: 32upx;
			right: 32upx;
		}
		.hint-text{
			margin-top: 28upx;
		}
		.content{
			margin-top: 32upx;
			width: 518upx;
			font-size: 28upx;
			line-height: 48upx;
			color: #888D98;
			text-align: center;
		}
		.logo{
			width: 172upx;
			height: 184upx;
		}
		.title{
			width: 506upx;
			font-size: 32upx;
			font-weight: bold;
			line-height: 48upx;
			color: #222222;
			margin-top: 32upx;
			text-align: center;
		}
		.subBtn{
			margin-top: 40upx;
			font-size: 32upx;
			line-height: 88upx;
			text-align: center;
			width: 536upx;
			height: 88upx;
			background: #0061FF;
			border-radius: 8upx;
			color: #fff;
			padding: 0;
		}
	}
</style>
