<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="发票中心" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="invoice-module" style="margin-bottom: 16rpx;">
      <!-- 抬头类型 -->
      <view class="invoice-item">
        <view class="invoice-key">抬头类型</view>
        <view class="type-wrap">
          <view v-for="(tItem, tIndex) in typeList" :key="tIndex" class="type-item" :class="{ 'type-item-active': activeTypeIndex === tIndex }" @click="changeType(tIndex)">{{ tItem.name }}</view>
        </view>
      </view>
      <!-- 发票抬头 -->
      <view class="invoice-item">
        <view class="invoice-key">发票抬头</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入单位名称" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 企业税号 -->
      <view class="invoice-item">
        <view class="invoice-key">企业税号</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入纳税人识别号" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 金额 -->
      <view class="invoice-item">
        <view class="invoice-key">金额</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入发票申请金额" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
    </view>

    <view class="invoice-module">
      <!-- 户名 -->
      <view class="invoice-item">
        <view class="invoice-key">户名</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入户名" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 开户银行 -->
      <view class="invoice-item">
        <view class="invoice-key">开户银行</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入开户银行名称" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 银行账号 -->
      <view class="invoice-item">
        <view class="invoice-key">银行账号</view>
        <input v-model="invoiceInfo.username" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请输入银行账号" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
    </view>

    <!-- 申请按钮 -->
    <view class="apply-btn" @click="submitApply">申请发票</view>
  </view>
</template>

<script>
export default {
  name: 'InvoiceCreate',
  data() {
    return {
      typeList: [ { name: '专票', type: 1 }, { name: '普票', type: 2 } ], // 抬头类型列表
      activeTypeIndex: 0, // 激活的抬头类型下标

      invoiceInfo: {
        username: '', // 户名
      }
    };
  },
  onLoad() {
  },
  methods: {
    /**
     * 改变抬头类型
     */
    changeType(tIndex) {
      this.activeTypeIndex = tIndex;
    },
    /**
     * 提交申请
     */
    submitApply() {
      console.log('申请');
    }
  }
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
