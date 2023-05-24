<template>
	<view class="index">
		<text class="">
			在你申请注销{{name}}帐号之前，请你认真阅读、理解并同意《{{name}}帐号注销须知》(以下称“注销须知”)
			[特别提示]在此善意提醒你，注销{{name}}帐号为不可恢复的操作，注销帐号后你将无法再使用本{{name}}帐号或找回你浏览、关注、添加、绑定的任何内容或信息
			                
			<text class="bold textblack">(即使你使用相同的手机号码再次注册并使用{{name}})\n</text>
			
			建议你在注销前自行备份{{name}}帐号相关的所有信息，并请确认与本{{name}}帐号相关的所有服务均已进行妥善处理。注销成功后，我们将删除你的个人信息，或对其进行匿名化处理。请你知悉并理解，根据相关法律法规规定相关日志记录{{name}}将保留不少于6个月的时间\n
			
			<text class="bold textblack">1.我们对你注销{{name}}帐号的决定深表遗憾。如果你仍执意注销帐号，你的帐号需同时满足以下条件:\n</text>
			1.1帐号处于安全状态帐号处于正常使用状态，无被盗风险
			1.2帐号财产已结清，没有未完成和/或存在争议的服务:帐号中没有资产、欠款、未结清的资金和虚拟权益;本帐号及通过本帐号接入的第三方中没有未完成和/或存在争议的服务
			1.3帐号权限解除：帐号已解除与其他产品、网站授权登录或绑定关系
			1.4帐号无任何纠纷，包括投诉举报或被投诉举报\n
			
			<text class="bold textblack">2.在你的帐号注销期间，如果你的帐号涉及争议纠纷包括但不限于:\n</text>
			
			
			2.1投诉、举报、诉讼、仲裁、国家有权机关调查等，你知晓并理解，{{name}}有权自行决定是否终止本帐号的注销而无需另行得到你的同意\n
			
			<text class="bold textblack">3.注销{{name}}帐号，你将无法再使用本{{name}}帐号，也将无法找回本{{name}}帐号中及与帐号相关的任何内容或信息，包括但不限于:\n</text>
			
			3.1本{{name}}帐号的个人资料和历史信息(包括但不限于头像、用户名、发布内容、浏览记录、关注、收藏等)都将无法找回
			3.2你将无法登录、使用本{{name}}帐号，你的粉丝将无法继续关注你或通过本帐号与你互动
			3.3你通过本{{name}}帐号使用、授权登录或绑定本{{name}}帐号后使用的{{name}}或第三方服务的相关记录将无法找回。你将无法再登录、使用上述服务，你曾获得的虚拟权益等财产性利益视为你自动放弃，将无法继续使用。你理解并同意，{{name}}无法协助你重新恢复上述服务。\n
			
			<text class="bold textblack">4.注销本{{name}}帐号并不代表注销前的帐号中的行为和相关责任得到豁免或减轻\n\n</text>
			
		</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'百姓律师',
				topId: null,
				scrollHeight: null
			}
		},
		methods: {
			toTop(id){
				console.log(id)
				this.topId=id
			}
		},
		onLoad(e) {
			let systemInfo = uni.getSystemInfoSync();
			this.scrollHeight = systemInfo.windowHeight;
			if(e.type==0){
				this.name='百姓律师'
			}else if(e.type==1){
				this.name='律付云'
			}else if(e.type==2){
				this.name='企业律云'
			}else if(e.type==3){
				this.name='律快答律师端'
			}
		}
	}
</script>

<style scoped>
	.index{
		width: auto;
		padding: 0 32rpx;
	}
	text {
		font-size: 28rpx;
		line-height: 58rpx;
		color: #4F5667;
	}
	view {
		font-size: 28rpx;
		line-height: 58rpx;
		color: #4F5667;
	}
	.textblack {
		color: #222;
		font-size: 30rpx;
	}

</style>
