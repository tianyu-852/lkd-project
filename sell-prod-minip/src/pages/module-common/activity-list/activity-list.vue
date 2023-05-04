<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="官方活动" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="nav-module" :style="{ top: uNavbarHeight + 'px' }">
      <view class="nav-wrap">
        <view class="nav-item" :class="{ 'nav-item-active': activityType === 1 }" @click="changeActiveType(1)">法律咨询</view>
        <view class="nav-item" :class="{ 'nav-item-active': activityType === 2 }" @click="changeActiveType(2)">律师函</view>
      </view>
      <view class="data-wrap">
        <text>已使用：{{ activityTotal }}份</text>
        <text style="margin-left: 40rpx;">未使用：{{ activityType === 1 ? allianceActivityInfo.active_lawyer_call_num : allianceActivityInfo.active_lawyer_letter_num }}份</text>
      </view>
    </view>

    <view class="activity-module">
      <view v-for="(aItem, aIndex) in activityList" :key="aIndex" class="activity-item">
        <view class="activity-info">
          <text class="qiye-name">{{ activityList.length - aIndex }}.{{ aItem.enterprise_name }}</text>
          <text class="activity-name">{{ aItem.type }}</text>
        </view>
        <view class="activity-time">
          <text class="seller-name">销售：{{ aItem.sales_name }}</text>
          <text class="time-text">{{ aItem.created_at }}</text>
        </view>
      </view>
    </view>

    <u-empty v-if="!activityList.length" class="empty-img" text="暂无数据" mode="list" />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'ActivityList',
  data() {
    return {
      activityType: 1, // 激活活动类型 1: 法律咨询 2: 律师函
      uNavbarHeight: 0, // 顶部导航栏高度 px

      allianceActivityInfo: {}, // 加盟商活动信息

      activityList: [], // 活动列表
      activityPage: 1, // 活动当前页数
      activityTotal: 0, // 活动总数
      isNextLoading: false, // 是否正在加载下一页
    };
  },
  computed: {
    ...mapGetters(['sysSafeAreaHeight']),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
    const { activityType, unuseNum } = this.$Route.query;
    this.activityType = Number(activityType);
    this.unuseNum = Number(unuseNum);
    console.log(this.$Route);

    this._getAllianceActivity();
    this._getAllianceActivityList();
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
  },
  onReachBottom() {
    const { activityList, activityTotal } = this;
    if (activityList.length >= activityTotal) return;
    this._getAllianceActivityList(++this.activityPage);
  },
  methods: {
    /**
     * 获取加盟商活动 数据
     */
    async _getAllianceActivity() {
      try {
        const { data: allianceActivityData } = await this.$api.getAllianceActivity();
        this.allianceActivityInfo = allianceActivityData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取加盟商活动 数据列表
     */
    async _getAllianceActivityList(page = 1) {
      if (this.isNextLoading) return;
      this.isNextLoading = true;

      const { activityType } = this;
      const param = { page, sales_list_type: activityType };

      page === 1 && uni.showLoading({ title: '加载中', mask: true });
      page === 1 && (this.activityList = []); // 请求第一页，先清空数组

      try {
        const { data: allianceActivityData } = await this.$api.getAllianceActivityList(param);
        this.activityList.push(...allianceActivityData.data);
        this.activityTotal = allianceActivityData.total;
        this.isNextLoading = false;
      } catch (error) {
        this.isNextLoading = false;
        console.log(error);
      }
    },
    /**
     * 切换活动类型
     */
    changeActiveType(activityType) {
      if (this.activityType === activityType) return;

      this.activityType = activityType;
      this._getAllianceActivityList();
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
