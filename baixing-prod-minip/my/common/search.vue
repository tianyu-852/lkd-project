<template>
	<view class="index">
		<view class="inputBox marlr32">
			<u-search placeholder="请输入关键字" v-model="search" bg-color="#ffffff" :focus="true" @change="inputChange"></u-search>
		</view>
		<view class="listBox marlr32">
			<view class="list-item" v-for="(item,index) in searchList" :key="index" @click="onSchool(item)">
				{{item.school_name}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getSchoolList
	} from "@/api/apis.js"
	export default{
		data(){
			return{
				searchList:[]
			}
		},
		methods:{
			onSchool(item){
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				prevPage.$vm.formData.school = item;   //修改上一页data里面的searchVal参数值为1211
				uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			},
			inputChange(e){
				console.log(e);
				getSchoolList({search:e}).then(res=>{
					this.searchList=res.data.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	.inputBox{
		width: calc(100% - 64upx);
		padding: 24upx 0;
		border-top: 2upx solid #E8EEF6;
		border-bottom: 2upx solid #E8EEF6;
		position: fixed;
		top: 0;
		background-color: #fff;
	}
	.listBox{
		margin-top: 126upx;
		.list-item{
			padding: 24upx 0;
			border-bottom: 2upx solid #E8EEF6;
		}
	}
	
</style>
