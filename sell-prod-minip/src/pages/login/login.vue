<template>
  <view class="login-module">
    <view class="title">欢迎登录</view>
    <view class="title">律快答营销中心</view>
    <view class="input-wrap">
      <view class="input-item">
        <view style=" font-size: 32rpx; margin-right: 40rpx;">+86</view>
        <input v-model="mobile" class="input" maxlength="11" placeholder="请输入手机号" placeholder-style="color: #999; font-size: 32rpx;">
      </view>
      <view class="input-item">
        <input v-model="smsCode" class="input" maxlength="6" placeholder="输入验证码" placeholder-style="color: #999; font-size: 32rpx;">
        <view class="code-btn" :class="{ 'code-btn-disable': isDisableSMSCodeBtn }" @click="sendSMSCode">{{ smsCodeText }}</view>
      </view>
    </view>

    <view class="login-btn" @click="userLogin">登录</view>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="发送验证码" end-text="发送验证码" @start="onSMSCodeStart" @change="onSMSCodeChange" @end="onSMSCodeEnd" />
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'Login',
  data() {
    return {
      mobile: '', // 手机号
      smsCode: '', // 验证码

      smsCodeText: '发送验证码',
      isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮
    };
  },
  onLoad() {},
  methods: {
    /**
     * 发送短信验证码
     */
    async sendSMSCode() {
      if (this.isDisableSMSCodeBtn) return;
      if (!this.mobile.trim()) return this.$u.toast('请输入手机号码');

      uni.showLoading({ title: '正在获取验证码', mask: true });

      try {
        const data = await loginUtil.getUserLoginSMSCode(this.mobile.trim());
        this.$refs.uCode.start();
        this.isDisableSMSCodeBtn = true;
        this.$u.toast('验证码已发送');
      } catch (error) {
        this.isDisableSMSCodeBtn = false;
        this.$refs.uCode.reset();
        console.log(error);
      }
    },
    /**
     * 登录
     */
    async userLogin() {
      if (!this.mobile.trim()) return this.$u.toast('请输入手机号码');
      if (!this.smsCode.trim()) return this.$u.toast('请输入验证码');
      uni.showLoading({ title: '登录中', mask: true });

      try {
        // 微信小程序 code
        const wxMpCode = await loginUtil.getWxMpCode();
        const data = await loginUtil.userLogin(this.mobile, this.smsCode, wxMpCode);
        this.$commonUtil.backPage();
        uni.$emit('toastEvt', { msg: '登录成功' }); // 触发全局的 toast 事件
        uni.$emit('indexPageEvt'); // 触发全局的 toast 事件
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听验证码发送开始事件
     */
    onSMSCodeStart() {
      this.isDisableSMSCodeBtn = false;
    },
    /**
     * 监听验证码发送变化事件
     */
    onSMSCodeChange(text) {
      this.smsCodeText = text;
    },
    /**
     * 监听验证码发送结束事件
     */
    onSMSCodeEnd() {
      this.isDisableSMSCodeBtn = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
