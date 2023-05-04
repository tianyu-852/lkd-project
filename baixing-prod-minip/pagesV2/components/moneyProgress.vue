<template>
	<view>
		<u-line-progress style="margin-top: 12upx;display:block;" :show-percent="false" :height="6" active-color="#4885FD" :percent="70"></u-line-progress>
		<text class="money">已筹<text class="blue">12323</text>元  ｜  目标<text class="blue">150000</text> 元</text>
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.money{
		font-size: 28upx;
		color: #888D98;
		font-weight: Medium;
		.blue{
			color: #0061FF;
			font-weight: Bold;
		}
	}
</style>
