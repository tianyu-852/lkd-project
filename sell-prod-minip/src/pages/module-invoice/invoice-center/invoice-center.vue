<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="发票中心" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="invoice-module">
      <view v-for="(cItem, cIndex) in 20" :key="cIndex" class="invoice-item">
        <view class="invoice-top">
          <view class="contract-name">企业律云服务合同-基础版2203</view>
          <view class="status-btn" @click="$commonUtil.routeNavTo('invoiceCreate')">开发票</view>
        </view>
        <view class="invoice-middle">
          <view class="sell-name">销售：李天天</view>
        </view>
        <view class="invoice-bottom">
          <view class="sell-name">客户：浙江律快答网络科技有限公司</view>
          <view class="create-time">2022-04-06</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'InvoiceCenter',
  data() {
    return {
    };
  },
  onLoad() {
  },
  methods: {}
};
</script>

<style>
  page {
    background: #F5F5F5;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
