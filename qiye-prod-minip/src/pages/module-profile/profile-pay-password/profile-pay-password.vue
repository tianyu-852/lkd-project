<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="支付密码修改" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="phone-module">当前登录手机号码：{{ userInfo.mobile }}</view>

    <view class="set-password-module">
      <!-- 输入验证码 -->
      <view class="set-password-item">
        <view class="set-password-left">输入验证码</view>
        <input v-model="verifyCode" class="set-password-middle" type="number" maxlength="6" placeholder="请输入验证码">
        <view class="set-password-right">
          <view class="send-verifycode-btn" :class="{ 'send-verifycode-btn-disable': isDisableSendVCodeBtn }" @click="sendVerifyCode">{{ sendVCodeText }}</view>
        </view>
      </view>
      <!-- 输入新密码 -->
      <view class="set-password-item">
        <view class="set-password-left">输入新密码</view>
        <input v-model="firstPassword" class="set-password-middle" type="number" password maxlength="6" placeholder="请输入密码">
      </view>
      <!-- 再次输入密码 -->
      <view class="set-password-item">
        <view class="set-password-left">再次输入密码</view>
        <input v-model="secondPassword" class="set-password-middle" type="number" password maxlength="6" placeholder="再次输入密码">
      </view>
    </view>

    <!-- 修改密码按钮 -->
    <view class="set-password-btn" @click="updatePassword">修改密码</view>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" @start="onVerifyCodeStart" @change="onVefifyChange" @end="onVerifyCodeEnd" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'ProfileWalletWithdraw',
  data() {
    return {
      verifyCode: '', // 验证码
      sendVCodeText: '获取验证码',
      isDisableSendVCodeBtn: false, // 是否禁用发送验证码按钮
      firstPassword: '', // 第一次密码
      secondPassword: '', // 第二次密码
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  onLoad() {
  },
  methods: {
    /**
     * 发送验证码
     */
    async sendVerifyCode() {
      if (!this.userInfo.mobile) return;
      if (this.isDisableSendVCodeBtn) return;

      uni.showLoading({ title: '正在获取验证码', mask: true });

      try {
        const data = await this.$api.getUpdatePayPwordVerifyCode({ mobile: this.userInfo.mobile });
        this.$refs.uCode.start();
        this.isDisableSendVCodeBtn = true;
        this.$u.toast('验证码已发送');
      } catch (error) {
        this.isDisableSendVCodeBtn = false;
        this.$refs.uCode.reset();
        console.log(error);
      }
    },
    /**
     * 监听验证码发送开始事件
     */
    onVerifyCodeStart() {
      this.isDisableSendVCodeBtn = false;
    },
    /**
     * 监听验证码发送开始事件
     */
    onVefifyChange(text) {
      this.sendVCodeText = text;
    },
    /**
     * 监听验证码发送结束事件
     */
    onVerifyCodeEnd() {
      this.isDisableSendVCodeBtn = false;
      this.sendVCodeText = '获取验证码';
    },
    /**
     * 更新密码
     */
    async updatePassword() {
      const { verifyCode, firstPassword, secondPassword } = this;
      const numRegExp = /^[0-9]+.?[0-9]*$/; // 数字类型正则

      if (!verifyCode.trim()) return this.$u.toast('请输入验证码');
      const testVerifyCodeResult = numRegExp.test(verifyCode.trim());
      if (!testVerifyCodeResult) return this.$u.toast('请输入数字类型验证码');

      if (!firstPassword.trim()) return this.$u.toast('请输入密码');
      const testFirstPasswordResult = numRegExp.test(firstPassword.trim());
      if (!testFirstPasswordResult) return this.$u.toast('请输入数字类型密码');
      if (firstPassword.trim().length < 6) return this.$u.toast('请输入6位数字密码');

      if (!secondPassword.trim()) return this.$u.toast('请再次输入密码');
      const testSecondPasswordResult = numRegExp.test(secondPassword.trim());
      if (!testSecondPasswordResult) return this.$u.toast('请输入数字类型密码');

      if (firstPassword.trim() !== secondPassword.trim()) return this.$u.toast('两次密码不一致');
      console.log(secondPassword);
      uni.showLoading({ title: '更新中', mask: true });

      try {
        const data = await this.$api.setPayPassword({ deal_password: secondPassword.trim(), code: verifyCode.trim() });
        // 重新拉取个人信息
        await loginUtil.fetchUserInfo();
        this.$u.toast('更新密码成功');
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
