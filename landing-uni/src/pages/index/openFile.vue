<template>
	<view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			downLoad(url){
				uni.downloadFile({
				    url: url, //仅为示例，并非真实的资源
				    success: (res) => {
				        if (res.statusCode === 200) {
				            console.log('下载成功');
							uni.openDocument({
								filePath:res.tempFilePath,
								success: (res) => {
									
								}
							})
				        }
				    }
				});
			},
		},
		onLoad(e) {
			window.location.href='http://view.officeapps.live.com/op/view.aspx?src='+'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/document/%E4%BC%81%E4%B8%9A%E5%BE%8B%E4%BA%91%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.docx'
			// if(e.type==1){
				// this.downLoad('http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/document/%E4%BC%81%E4%B8%9A%E5%BE%8B%E4%BA%91%E7%94%A8%E6%88%B7%E6%B3%A8%E5%86%8C%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.docx')
			// }
			
		}
	}
</script>

<style>
	.logo {
		width: 148rpx;
		margin: 80rpx 0;
		box-shadow: 0px 4rpx 16rpx rgba(52, 76, 194, 0.26);
		border-radius: 30rpx;
	}

	.text {
		font-size: 28rpx;
		line-height: 58rpx;
		font-weight: bold;
		color: #222222;
		text-align: justify;
		margin-bottom: 28rpx;
	}
	
	.foot{
		width: 100%;
		position: absolute;
		bottom: 100rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
	}
</style>
