<template>
  <view class="main" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 35 + 10 + 'px' }">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="订单详情" title-color="#fff" :background="{ background: '#0085FF' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="info-module">
      <!-- 企业名称 -->
      <view class="order-item">
        <view class="order-title">企业名称</view>
        <view class="order-value">张自忠</view>
      </view>
      <!-- 企业信用代码 -->
      <view class="order-item">
        <view class="order-title">企业信用代码</view>
        <view class="order-value">91330108MA7JPF1P55</view>
      </view>
      <!-- 联系人 -->
      <view class="order-item">
        <view class="order-title">联系人</view>
        <view class="order-value">张自忠</view>
      </view>
      <!-- 联系电话 -->
      <view class="order-item">
        <view class="order-title">联系电话</view>
        <view class="order-value">1368462774664</view>
      </view>
      <!-- 购买法律服务套餐 -->
      <view class="order-item">
        <view class="order-title">购买法律服务套餐</view>
        <view class="order-value">基础版优惠价4998元/年</view>
      </view>
    </view>

    <view class="divide-ver" />

    <!-- 订单流程 -->
    <view class="flow-module">
      <view class="flow-title">订单流程</view>

      <view class="flow-timeline">
        <u-time-line>
          <u-time-line-item v-for="(eItem, eIndex) in 6" :key="eIndex" nodeTop="10">
            <!-- 左边内容 -->
            <template #node>
              <view class="unode-left">
                <view class="icon-dot" :class="{ 'icon-dot-cur': eIndex === 0, 'icon-dot-fail': eIndex === 1 }" />
              </view>
            </template>
            <!-- 右边内容 -->
            <template #content>
              <view class="unode-right">
                <view class="timeline-title">
                  <text class="title">已发起在线合同签署</text>
                  <text class="time">2022-06-07 12:34</text>
                </view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
      </view>
    </view>

    <!-- 底部按钮组 -->
    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="btn-item">取消订单</view>
      <view class="btn-item">重新编辑</view>
      <view class="btn-item" style="background: #0085FF; color: #fff; border: none;">在线签署</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {
      uNavbarHeight: 0, // 顶部导航栏高度 px
    };
  },
  computed: {
    ...mapGetters(['sysSafeAreaHeight']),
  },
  onLoad() {
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
