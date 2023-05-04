<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="零钱提现" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="withdraw-module">
      <view class="withdraw-header">
        <text>提现金额（元）</text>
        <text class="total-btn" @click="selectWithdrawTotal">全部提现</text>
      </view>
      <view class="withdraw-wrap">
        <view class="icon-money">￥</view>
        <input v-model="withdrawMoney" class="input-text" type="digit" maxlength="7" cursor-spacing="30" placeholder="请输入金额" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay">
      </view>
      <view class="divider-hor" />
      <view class="usable-money">可提现金额{{ userInfo.balance }}元</view>
    </view>

    <view class="withdraw-btn" @click="confrimWithdrawMoney">提现</view>

    <!-- 提现提醒 -->
    <view class="withdraw-tips-wrap">
      <view class="withdraw-tips-item">1.提现金额10元起，提现后7个工作日内到账（节假日顺延）</view>
      <view class="withdraw-tips-item">2.为提供更便捷、更优质的服务，收款的微信账号必须已实名认证，否则提现不成功。每笔提现平台将收取提现金额20%的平台服务费</view>
      <view class="withdraw-tips-item">3.如通过第三方直接支付，申请退款将原路退回，扣除第三方收取的手续费，如微信0.6%的手续费</view>
      <view class="withdraw-tips-item">4.非平台原因造成用户无法提现的，平台不承担责任</view>
      <view class="withdraw-tips-item">5.账户信息和安全：您应自行设置账号的登录密码和支付密码，并妥善保管，不得外借并承担由此带来的风险</view>
    </view>

    <!-- 支付密码弹框 -->
    <u-popup v-if="isShowPasswordPopup" v-model="isShowPasswordPopup" mode="center" border-radius="20">
      <view class="upopup-passwrod-box" @click.stop="stopPropagationEvt">
        <view v-if="userInfo.is_set_deal_password === 0" class="header-passwrod">{{ setPayPasswordInfo.firstPassword ? '请再次输入密码' : '请设置支付密码' }}</view>
        <template v-else-if="userInfo.is_set_deal_password === 1">
          <view class="header-passwrod">请输入支付密码</view>
          <view class="withdraw-money"><text style="font-size: 40rpx; margin-right: 4rpx;">￥</text>{{ withdrawMoney }}</view>
        </template>

        <u-message-input dot-fill focus :maxlength="6" @finish="onPasswordFinishEvt" />
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'ProfileWalletWithdraw',
  data() {
    return {
      withdrawMoney: '', // 提现金额
      isShowPasswordPopup: false, // 是否显示输入密码弹框
      setPayPasswordInfo: { firstPassword: '' } // 头一次设置密码信息
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
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },
    /**
     * 提取全部
     */
    selectWithdrawTotal() {
      if (!this.userInfo.balance) return;
      this.withdrawMoney = this.userInfo.balance;
    },
    /**
     * 确认提现
     */
    async confrimWithdrawMoney() {
      if (!this.withdrawMoney.trim()) return this.$u.toast('请输入提现金额');
      // 判断字符串是否为数字类型
      const numRegExp = /^[0-9]+.?[0-9]*$/;
      const testResult = numRegExp.test(this.withdrawMoney.trim());
      if (!testResult) return this.$u.toast('请输入数值金额');
      // 判断金额是否大于等于 10
      const withdrawMoneyNum = parseFloat(this.withdrawMoney.trim());
      if (withdrawMoneyNum < 10) return this.$u.toast('提现金额最小为10元');

      this.isShowPasswordPopup = true;
    },
    /**
     * 监听密码输入完成事件
     */
    async onPasswordFinishEvt(passwordValue) {
      // 用户存在设置的支付密码
      if (this.userInfo.is_set_deal_password) return this._launchAccountWithdraw(passwordValue);

      // 第一次输入支付密码
      if (!this.setPayPasswordInfo.firstPassword) {
        this.setPayPasswordInfo.firstPassword = passwordValue;
        this.isShowPasswordPopup = false;
        setTimeout(() => {
          this.isShowPasswordPopup = true;
        }, 300);
        return;
      // 第二次输入的支付密码 和 第一次输入的不一致
      } else if (this.setPayPasswordInfo.firstPassword !== passwordValue) {
        this.$u.toast('两次密码不一致');
      // 第二次输入的支付密码 和 第一次输入的一致
      } else if (this.setPayPasswordInfo.firstPassword === passwordValue) {
        try {
          const data = await this.$api.setPayPassword({ deal_password: passwordValue.trim() });
          // 重新拉取个人信息
          await loginUtil.fetchUserInfo();

          this.isShowPasswordPopup = false;
          setTimeout(() => {
            this.isShowPasswordPopup = true;
          }, 300);
        } catch (error) {
          console.log(error);
        }
      }
    },
    /**
     * 发起账户提现
     */
    async _launchAccountWithdraw(payPassword) {
      if (!payPassword) return;
      this.isShowPasswordPopup = false;
      uni.showLoading({ title: '提现中', mask: true });

      const withdrawMoneyNum = parseFloat(this.withdrawMoney.trim()); // 提现金额

      try {
        const { data: withdrawMoneyData } = await this.$api.launchAccountWithdraw({ withdraw_money: withdrawMoneyNum, deal_password: payPassword });
        uni.$u.toast('申请成功，请等待审核');
        // 重新拉取个人信息
        await loginUtil.fetchUserInfo();
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
