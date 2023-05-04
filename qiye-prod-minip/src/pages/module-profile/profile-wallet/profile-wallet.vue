<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="账单列表" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 钱 -->
    <view class="wallet-money-module">
      <view class="wallet-money-title">可用余额（元）</view>
      <view class="wallet-money-wrap">
        <view class="wallet-money">
          <text>{{ isShowMoney ? userInfo.balance : '****' }}</text>
        </view>
        <view class="wallet-money-eye">
          <image class="money-eye-img" mode="aspectFill" :src="isShowMoney ? '../static/wallet/icon-walle-openEye.png' : '../static/wallet/icon-wallet-closeEye.png'" @click="isShowMoney = !isShowMoney" />
        </view>
      </view>
    </view>

    <!-- 单元格 -->
    <view class="wallet-cell-module">
      <view class="cell-item" @click="$commonUtil.routeNavTo('module-profile/profile-wallet-pay/profile-wallet-pay')">
        <image class="cell-left" mode="aspectFill" src="../static/wallet/icon-wallet-pay.png" />
        <view class="cell-middle">充值</view>
        <view class="cell-right">
          <image class="wallet-subsidy-tag" mode="aspectFill" src="../static/wallet/wallet-subsidy-tag.png" />
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view class="cell-item" @click="$commonUtil.routeNavTo('module-profile/profile-wallet-withdraw/profile-wallet-withdraw')">
        <image class="cell-left" mode="aspectFill" src="../static/wallet/icon-wallet-extract.png" />
        <view class="cell-middle">提现</view>
        <view class="cell-right">
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view class="cell-item" @click="$commonUtil.routeNavTo('module-profile/profile-pay-password/profile-pay-password')">
        <image class="cell-left" mode="aspectFill" src="../static/wallet/icon-wallet-set.png" />
        <view class="cell-middle">设置密码</view>
        <view class="cell-right">
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>

    <!-- 单元格 -->
    <view class="wallet-cell-module">
      <view class="cell-item" @click="$commonUtil.routeNavTo('module-profile/profile-wallet-bill/profile-wallet-bill')">
        <image class="cell-left" mode="aspectFill" src="../static/wallet/icon-wallet-bill.png" />
        <view class="cell-middle">查看明细</view>
        <view class="cell-right">
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProfileWallet',
  data() {
    return {
      isShowMoney: true, // 是否显示钱金额
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.lawyerId) {
      this.lawyerId = routeParam.lawyerId;
      this._getLawyerDetail();
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
