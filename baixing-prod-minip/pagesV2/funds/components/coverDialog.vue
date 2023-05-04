<template>
	<view>
		<u-popup v-model="dialogShow" mode="center" border-radius="16">
			<view class="dialogBox flex-row">
				<text class="context">
					平台将扣除筹款金额的<text class="color0061FF">20%</text>作为项目服务费
				</text>
				<u-icon name="close" color="#C9CED9" size="28" @close="dialogShow=false"></u-icon>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props:{
			dialogShow:Boolean
		}
	}
</script>

<style scoped lang="scss">
	.dialogBox{
		width: 686upx;
		padding: 26upx 32upx;
		.context{
			width: 524upx;
			height: 96upx;
			font-size: 30upx;
			 
			font-weight: bold;
			line-height: 54upx;
			color: #222222;
			display: block;
		}
	}
	
</style>
