<template>
	<view v-if="showWebView">
		<web-view :src="redirectUri" @load="handleWebViewLoad" @error="handleWebViewError"></web-view>
	</view>

	<view class="auth" v-else>
		<view class="auth-logo">
			<image src="https://faceid-ecard-1254418846.cos.ap-chengdu.myqcloud.com/eidLogo.png" />
		</view>
		<view class="title">
			您正在授权
			<view class="merchant-name">{{' '+ appName}}</view>
		</view>
		<view class="sub-title">通过腾讯云E证通核验并获取您的身份信息</view>
		<view class="agreement">
			<checkbox-group @change="changeAgree">
				<checkbox :value="agreement" :checked="isAgree" />
			</checkbox-group>
			<view>
				<view>
					<view @click="changeAgree" style="display:inline">已阅读并同意</view>
					<navigator url="/pages/module-common/mp_ecard_sdk/protocol/service/service">《腾讯云E证通服务使用协议》</navigator>和
				</view>
				<view>
					<navigator url="/pages/module-common/mp_ecard_sdk/protocol/eid/eid">《eID数字身份小程序服务协议》</navigator>
				</view>
			</view>
		</view>
		<view class="button-area">
			<button @click='navigateToEid' :disabled="!isAgree || isNavigating">
				确认授权
			</button>
		</view>
	</view>
</template>

<script>
import index from "./index";
export default index;
</script>

<style>
@import url('../index.css');
</style>
