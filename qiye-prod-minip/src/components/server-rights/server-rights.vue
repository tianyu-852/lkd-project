<template>
  <view>
    <!-- banner -->
    <view class="banner-momdule">
      <image class="banner-bgImg" mode="aspectFill" src="@/static/center/center-rights-banner.png" />

      <view class="info-wrap" :style="{ paddingTop: uNavbarHeight + 'px' }">
        <view class="server-name">{{ userInfo.nickname }}</view>
        <view class="server-timeout">服务到期：{{ userInfo.enterprise_vip_expired_at }}</view>
        <view class="manage-wrap">
          <image class="manage-left" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />
          <view class="manage-middle">
            <view class="manage-name">专属法务管家</view>
            <view class="manage-desc">快速整理需求，匹配专业律师</view>
          </view>
          <view class="manage-right" @click="$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: officKefuInfo.customer_id, enterSrc: 'law_issue' });">联系我吧</view>
        </view>
      </view>
    </view>

    <view class="content-module">
      <scroll-view
        class="scroll-y content-scroll-y"
        scroll-y
        enhanced
        scroll-with-animation
        :show-scrollbar="false"
      >
        <!-- 标准化服务 -->
        <view class="rights-wrap">
          <view class="rights-title">标准化服务</view>
          <view class="rights-item-list">
            <view v-for="(rItem, rIndex) in standardServerRightsList" :key="rIndex" class="rights-item" @click="$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: officKefuInfo.customer_id, enterSrc: 'law_issue' });">
              <!-- 未开通 -->
              <image v-if="!rItem.is_have_privilege" class="noopen-img" mode="aspectFill" src="@/static/center/server-noopen.png" />

              <image class="rights-left" mode="aspectFill" :src="rItem.icon" />
              <view class="rights-middle">
                <view class="rights-name">{{ rItem.title }}</view>
                <view class="rights-desc">{{ rItem.context }}</view>
              </view>
              <view class="rights-right">
                <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
              </view>
            </view>
          </view>
        </view>

        <!-- 特色化服务 -->
        <view class="rights-wrap" style="margin-top: 50rpx;">
          <view class="rights-title">特色化服务</view>
          <view class="rights-item-list">
            <view v-for="(rItem, rIndex) in customServerRightsList" :key="rIndex" class="rights-item" @click="$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: officKefuInfo.customer_id, enterSrc: 'law_issue' });">
              <!-- 未开通 -->
              <image v-if="!rItem.is_have_privilege" class="noopen-img" mode="aspectFill" src="@/static/center/server-noopen.png" />

              <image class="rights-left" mode="aspectFill" :src="rItem.icon" />
              <view class="rights-middle">
                <view class="rights-name">{{ rItem.title }}</view>
                <view class="rights-desc">{{ rItem.context }}</view>
              </view>
              <view class="rights-right">
                <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState } from 'vuex';

export default {
  name: 'ServerRights',
  props: {
    // 头部导航栏高度
    uNavbarHeight: { type: Number, default: 0 },
  },
  data() {
    return {
      standardServerRightsList: [], // 标准化权益列表
      customServerRightsList: [], // 定制化权益列表
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapState([ 'officKefuInfo' ]),
  },
  created() {
    this.getServerRightsInfo();
  },
  methods: {
    /**
     * 获取服务权益信息
     */
    async getServerRightsInfo() {
      try {
        const { data: serverRightsData } = await this.$api.getServerRightsInfo();
        this.standardServerRightsList = serverRightsData.list;
        this.customServerRightsList = serverRightsData.common;
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
