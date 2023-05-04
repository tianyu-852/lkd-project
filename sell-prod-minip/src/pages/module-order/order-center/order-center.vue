<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="服务套餐" title-color="#030303" :background="{ background: '#F5F5F5' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="header-module" :style="{ top: uNavbarHeight + 'px'}">
      <!-- 条件导航 -->
      <view class="factor-nav-wrap">
        <view class="factor-item" @click.stop="openFactorPopup('priceTypeFactor')">
          <view v-if="priceTypeFactorInfo.priceTypeIndex > -1" style="color: #0085FF;">{{ priceTypeFactorInfo.priceTypeFactorList[priceTypeFactorInfo.priceTypeIndex].price }}</view>
          <view v-else>套餐类型</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'priceTypeFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" style="margin-left: auto; margin-right: 80rpx;" @click.stop="openFactorPopup('payStatusFactor')">
          <view v-if="[-1, 0].includes(payStatusFactorInfo.payStatusIndex)">支付状态</view>
          <view v-else style="color: #0085FF;">{{ payStatusFactorInfo.payStatusFactorList[payStatusFactorInfo.payStatusIndex].name }}</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'payStatusFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" @click.stop="openFactorPopup('timeFactor')">
          <view v-if="[-1, 0].includes(timeFactorInfo.timeFactorIndex)">筛选</view>
          <view v-else style="color: #0085FF;">{{ timeFactorInfo.timeFactorList[timeFactorInfo.timeFactorIndex].name }}</view>
          <image class="icon-sort" mode="aspectFill" src="../static/icon-sort-inactive.png" />
        </view>
      </view>

      <!-- 条件过滤 popup -->
      <view v-if="isOpenFactorPopup" class="factor-filter-popup" :style="{ top: headerModuleHeight + 'px' }">
        <!-- 套餐类型 -->
        <view v-if="factorPopupType === 'priceTypeFactor'" class="price-factor-wrap">
          <view v-for="(pItem, pIndex) in priceTypeFactorInfo.priceTypeFactorList" :key="pIndex" class="price-factor-item" :class="{ 'price-factor-item-active': priceTypeFactorInfo.priceTypeIndex === pIndex }" @click="choosePriceTypeFactor(pItem, pIndex)">
            <text v-if="pItem.title" class="price-title">{{ pItem.title }}</text>
            <text class="price">{{ pItem.price }}</text>
          </view>
        </view>
        <!-- 支付状态 -->
        <view v-if="factorPopupType === 'payStatusFactor'" class="pay-factor-wrap">
          <view v-for="(pItem, pIndex) in payStatusFactorInfo.payStatusFactorList" :key="pIndex" class="pay-factor-item" :class="{ 'pay-factor-item-active': payStatusFactorInfo.payStatusIndex === pIndex }" @click="choosePayStatusFactor(pItem, pIndex)">
            <text class="pay-status-name">{{ pItem.name }}</text>
          </view>
        </view>
        <!-- 时间条件 -->
        <view v-if="factorPopupType === 'timeFactor'" class="time-factor-wrap">
          <view v-for="(pItem, pIndex) in timeFactorInfo.timeFactorList" :key="pIndex" class="time-factor-item" :class="{ 'time-factor-item-active': timeFactorInfo.timeFactorIndex === pIndex }" @click="chooseTimeFactor(pItem, pIndex)">
            <text class="time-status-name">{{ pItem.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-module" :style="{ marginTop: headerModuleHeight + 'px' }">
      <view v-for="(oItem, oIndex) in 20" :key="oIndex" class="order-item" @click="$commonUtil.routeNavTo('orderDetail')">
        <view class="order-header">
          <image class="icon-price" mode="aspectFill" src="../static/price-company.png" />
          <text class="client-name">{{ '浙江律快答网络科技有限公司' }}</text>
          <text class="pay-status">{{ '已支付' }}</text>
        </view>
        <view class="order-sell-item">
          <view class="vip-name">服务套餐：{{ '基础版5998元/年' }}</view>
          <view class="sell-name">销售：{{ '李天天' }}</view>
        </view>
        <view class="order-time-item">
          <view class="client-phone">手机号码：18923357453</view>
          <view class="order-time">{{ '2022-07-09 12:34' }}</view>
        </view>

        <view class="order-btns">
          <view class="order-btn" @click="openPayModePopup">重新编辑</view>
          <view class="order-btn" @click="openPayModePopup">邀请支付</view>
          <view class="order-btn" style="background: #0085FF; color: #fff; border: none;" @click="openPayModePopup">在线签署</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OrderCenter',
  data() {
    return {
      uNavbarHeight: 0, // 顶部导航栏高度 px
      headerModuleHeight: 0, // 头部模块高度 px

      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'priceTypeFactor' 'payStatusFactor', 'timeFactor'
      // 套餐类型条件
      priceTypeFactorInfo: {
        priceTypeFactorList: [], // 套餐类型条件列表
        priceTypeIndex: -1, // 选中下标
        priceTypeId: '', // 套餐类型 id
        priceType: '', // 套餐类型 1 个人 2 企业
      },
      // 支付状态条件
      payStatusFactorInfo: {
        payStatusFactorList: [{ name: '全部状态', status: 0 }, { name: '未支付', status: 1 }, { name: '已支付', status: 2 }], // 支付状态条件列表
        payStatusIndex: -1, // 支付状态下标
        payStatus: '', // 支付状态
      },
      // 时间条件
      timeFactorInfo: {
        timeFactorList: [{ name: '综合排序', sort: 1 }, { name: '时间正序', sort: 0 }, { name: '时间倒序', sort: 1 }], // 支付状态条件列表
        timeFactorIndex: -1, // 选中下标
        timeSort: 1, // 时间排序
      },
    };
  },
  onLoad() {
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
    this.headerModuleHeight = await this.$commonUtil.calcNodeHeight('.header-module');
  },
  onReachBottom() {
    // const { priceShareOrderList, priceShareOrderTotal } = this;
    // if (priceShareOrderList.length >= priceShareOrderTotal) return;
    // this._getPriceShareOrderList(++this.priceShareOrderPage);
  },
  methods: {
    /**
     * 打开条件弹框
     */
    openFactorPopup(factorType) {
      if (this.isOpenFactorPopup && this.factorPopupType !== factorType) return this.factorPopupType = factorType;
      this.factorPopupType = factorType;

      this.isOpenFactorPopup = !this.isOpenFactorPopup;
    },
    /**
     * 关闭条件弹框
     */
    closeFactorPopup() {
      this.isOpenFactorPopup = false;
    },
    /**
     * 选择套餐类型条件
     */
    choosePriceTypeFactor(pItem, pIndex) {
      this.priceTypeFactorInfo.priceTypeIndex = pIndex;
      this.priceTypeFactorInfo.priceTypeId = pItem.vip_id;
      this.priceTypeFactorInfo.priceType = pItem.type;
      this.isOpenFactorPopup = false;
      // this._getPriceShareOrderList();
    },
    /**
     * 选择支付状态条件
     */
    choosePayStatusFactor(pItem, pIndex) {
      this.payStatusFactorInfo.payStatusIndex = pIndex;
      this.payStatusFactorInfo.payStatus = pItem.status;
      this.isOpenFactorPopup = false;
      // this._getPriceShareOrderList();
    },
    /**
     * 选择时间条件
     */
    chooseTimeFactor(pItem, pIndex) {
      this.timeFactorInfo.timeFactorIndex = pIndex;
      this.timeFactorInfo.timeSort = pItem.sort;
      this.isOpenFactorPopup = false;
      // this._getPriceShareOrderList();
    },
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
