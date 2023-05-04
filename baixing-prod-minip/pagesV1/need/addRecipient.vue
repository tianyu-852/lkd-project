<template>
	<view class="">
		<view class="box font32 hidden">
			<view class="cell flex hcenter between">
				<view class="">收件人姓名</view>
				<input type="text" class="flex1" placeholder="请输入收件人名字" v-model="form.addressee_nickname" />
			</view>
			<view class="cell flex hcenter between" v-for="(item,index) in form.addressee_mobiles">
				<view class="">收件人号码</view>
				<input type="number" class="flex1" placeholder="请输入收件人号码" v-model="form.addressee_mobiles[index]" />
				<view class="">
					<view class="btn blue" @click="add" v-if="index==0&&form.addressee_mobiles.length<4">添加</view>
					<view class="btn red" @click="del(index)" v-else-if="index!=0">删除</view>
				</view>
			</view>
			<view class="cell">
				<view class=" widthAll">收件人地址</view>
				<view class="textBox">
					<textarea maxlength="300" v-model="form.addressee_address" placeholder="请输入收件人地址" />
					<view class="hint">({{form.addressee_address.length||0}}/300字)</view>
				</view>
			</view>
			
		</view>
		<view class="foot">
			<view class="btn center" @click="submit">添加</view>
		</view>
		
	</view>
</template>

<script>
	import {
		
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				form:{
					addressee_nickname:'',
					addressee_mobiles:[''],
					addressee_address:''
				}

			}
		},
		onLoad(e) {

		},
		methods: {
			add(){
				if(this.form.addressee_mobiles.length>3){
					uni.$u.toast('添加已到上限')
					return
				}
				this.form.addressee_mobiles.push('')
			},
			del(index){
				this.form.addressee_mobiles.splice(index,1)
			},
			submit(){
				if(!this.form.addressee_nickname){
					uni.$u.toast('请输入收件人名字')
					return
				}
				
				if(!this.form.addressee_address){
					uni.$u.toast('请输入收件人地址')
					return
				}
				for(var i=0;i<this.form.addressee_mobiles.length;i++){
					if(!this.form.addressee_mobiles[i]){
						uni.$u.toast('请输入收件人号码')
						return
					}
					// if(this.form.addressee_mobiles[i].length<11){
					// 	uni.$u.toast('请输入正确的手机号')
					// 	return
					// }
				}
				const eventChannel = this.getOpenerEventChannel()
				if(eventChannel)
					eventChannel.emit('success', this.form);
				 uni.navigateBack()
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F7FA;
	}
	.box{
		padding: 28rpx;
		margin: 20rpx 16rpx 0;
		background-color: #fff;
		border-radius: 16rpx;
		.cell{
			padding: 24rpx;
			margin-bottom: 28rpx;
			background: #F1F4F9;
			border-radius: 8rpx;
			input{
				height: 48rpx;
				line-height: 48rpx;
				padding: 0 12rpx;
				border-left: 1rpx solid #B2C2DB;
				margin-left: 24rpx;
			}

		}
		.btn{
			height: 48rpx;
			line-height: 48rpx;
			border-radius: 100rpx;
			padding: 0 14rpx;
			font-size: 26rpx;
			color: #fff;
		}
		.blue{
			background: linear-gradient(119deg, #6A96FE 0%, #4475FB 100%);
			box-shadow: 0rpx 4rpx 16rpx rgba(0, 44, 220, 0.3);
		}
		.red{
			background: linear-gradient(119deg, #FF6160 0%, #FF6160 100%);
			box-shadow: 0px 4px 16px rgba(220, 0, 0, 0.3);
		}
	}
	
	.textBox{
		height: 400rpx;
		font-size: 32rpx;
		margin: 28rpx 0;
		background: #F1F4F9;
		border-radius: 8rpx;
		padding: 0 0rpx 60rpx;
		position: relative;
		textarea{
			width: 100%;
			height: 100%;
		}
		.hint{
			color: #F1F4F9;
			position: absolute;
			right: 24rpx;
			bottom: 24rpx;
		}
	}
	
	.foot{
		padding-bottom: 68rpx;
		.btn{
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 32rpx;
			color: #fff;
			background: #0061FF;
			box-shadow: 0rpx 12rpx 32rpx rgba(9, 58, 255, 0.4);
			margin: 32rpx 75rpx 0;
		}
	}
	

</style>
