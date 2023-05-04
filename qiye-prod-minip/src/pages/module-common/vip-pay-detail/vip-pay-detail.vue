<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :immersive="uNavBarImmersive" :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 服务权益 -->
    <server-rights v-if="userInfo.enterprise_vip_expired_at" ref="serverRightsRef" :uNavbarHeight="uNavbarHeight" />
    <!-- 服务购买 -->
    <server-buy v-else :isSkipVerifyLogin="launchScene === 1154" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'VipPayDetail',
  data() {
    return {
      uNavBarImmersive: false, // 导航栏是否开启沉浸式
      uNavbarHeight: 0, // 顶部导航栏高度 px
      launchScene: 0, // 启动场景值 1154: 朋友圈内打开“单页模式”
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
  },
  onLoad() {
    const launchScene = uni.getLaunchOptionsSync().scene;
    this.launchScene = launchScene;
    if (this.launchScene === 1154) return; // 朋友圈内打开 “单页模式”
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: `/pages/module-common/vip-pay-detail/vip-pay-detail`,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  onShareTimeline() {
    const { appExplainInfo } = this;

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      query: `enterSrc=friendCircle`,
    };
  },
  mounted() {
    this.$commonUtil.calcUNavNodeHeight().then(res => { this.uNavbarHeight = res; this.uNavBarImmersive = true; });
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
