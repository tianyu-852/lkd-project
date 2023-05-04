<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="账单列表" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 账单模块 -->
    <view class="bill-module">
      <view v-for="(bItem, bIndex) in accountBillList" :key="bIndex" class="bill-item">
        <view v-if="bItem.type === 0" class="bill-item-header">
          <view class="bill-date">{{ bItem.month }}月账单：</view>
          <view class="bill-total" style="margin-right: 50rpx;">
            <text>{{ bItem.income }}元</text>
            <image class="icon-bill" mode="aspectFill" src="../static/wallet/icon-bill-upper.png" />
          </view>
          <view class="bill-total">
            <text>{{ bItem.outlay }}元</text>
            <image class="icon-bill" mode="aspectFill" src="../static/wallet/icon-bill-lower.png" />
          </view>
        </view>
        <view v-if="bItem.type === 1" class="bill-item-wrap">
          <view class="bill-item-left">
            <u-lazy-load img-mode="aspectFill" height="60" border-radius="30" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="bItem.avatar" />
          </view>
          <view class="bill-item-middle">
            <view class="bill-title">
              <text>{{ bItem.title }}</text>
              <text style="margin-left: 14rpx; color: #999; font-size: 28rpx;">{{ bItem.created_at }}</text>
            </view>
            <view class="bill-subtitle">
              <text>{{ bItem.subtitle }}</text>
            </view>
          </view>
          <view class="bill-item-right">
            <text v-if="!bItem.income_type">+</text>
            <text>{{ bItem.money }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空数据 -->
    <view v-if="!accountBillList.length" class="empty-wrap">
      <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="@/static/common/empty-data.png" />
      <view class="null-text">暂无账单数据</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProfileWalletBill',
  data() {
    return {
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,

      accountBillList: [], // 账单列表
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  onLoad() {
    this._getAccountBillList();
  },
  methods: {
    /**
     * 获取账单列表
     */
    async _getAccountBillList() {

      const param = { type: 0 };

      try {
        const { data: accountBillData } = await this.$api.getAccountBillList(param);
        this.accountBillList = accountBillData;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
  page {
    background: #fff;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
