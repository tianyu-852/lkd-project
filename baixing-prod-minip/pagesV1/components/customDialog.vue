<template>
	<view>
		<u-popup v-model="show"  mode="center" border-radius="32">
			<view class="dialogBox">
				<view class="hint" v-if="type == 1">温馨提示</view>
				<view class="title">{{title}}</view>
				<view class="flex-row">
					<view class="button gray" @click="popDown(false)">
						{{text[0]?text[0]:'否'}}
					</view>	
					<view class="button blue" style="margin-left:16upx;" @click="popDown(true)">
						{{text[1]?text[1]:'是'}}
					</view>	
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getLawyerServiceOrder
	} from "@/api/apis.js"
	export default {
		props: {
			title:String,
			type:Number,
			text:Array
		},
		data() {
			return{
				show:false,
			}
		},
		methods: {
			popDown(success){
				this.$emit('change',{show:false,success:success})
			}
		}
	}
</script>

<style scoped lang="scss">
	.dialogBox{
		width: 646upx;
		padding: 49upx 32upx 40upx 32upx;
		.hint{
			height: 48upx;
			font-size: 34upx;
			font-weight: bold;
			color: #222222;
			text-align: center;
			margin-bottom: 48upx;
		}
		.title{
			font-size: 34upx;
			font-weight: bold;
			line-height: 68upx;
			color: #222222;
			text-align: center;
			margin-bottom: 64upx;
		}
		.button{
			flex: 1;
			height: 88upx;
			line-height: 88upx;
			border-radius: 8upx;
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
		}
		.gray{
			color: #222222;
			background: #F3F5F8;
		}
		.blue{
			color: #FFFFFF;
			background: #0061FF;
		}
	}
</style>
