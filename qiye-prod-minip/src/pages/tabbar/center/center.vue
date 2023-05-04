<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :immersive="uNavBarImmersive" :background="{ backgroundColor: 'transparent' }" />

    <!-- 服务权益 -->
    <server-rights v-if="userInfo.enterprise_vip_expired_at" ref="serverRightsRef" :uNavbarHeight="uNavbarHeight" />
    <!-- 服务购买 -->
    <server-buy v-else :isSkipVerifyLogin="launchScene === 1154" :isShareEnter="isShareEnter" :qrcodeScanInfo="qrcodeScanInfo" />
    <!-- <server-buy /> -->

    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" @loginSucEvt="onLoginSucEvt" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

/**
 * URL 参数转换成对象
 */
function _queryString(request) {
  let params = request.split('?')[1];
  let param = params.split('&');
  let obj = {};
  for (let i = 0;i < param.length;i++) {
    let paramsA = param[i].split('=');
    let key = paramsA[0];
    let value = paramsA[1];
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export default {
  name: 'Cetner',
  data() {
    return {
      uNavBarImmersive: false, // 导航栏是否开启沉浸式
      uNavbarHeight: 0, // 顶部导航栏高度 px
      launchScene: 0, // 启动场景值 1154: 朋友圈内打开“单页模式”
      isShareEnter: false, // 是否是分享进入该页面

      qrcodeScanInfo: {}, // 小程序二维码扫码信息
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.isShareEnter) this.isShareEnter = routeParam.isShareEnter;

    // 扫描小程序二维码进入页面
    if (routeParam.scene) {
      const qrcodeScanInfo = _queryString(`?${ routeParam.scene }`);
      this.qrcodeScanInfo = qrcodeScanInfo;
    }

    // console.log(routeParam.scene);

    const launchScene = uni.getLaunchOptionsSync().scene;
    this.launchScene = launchScene;
    if (this.launchScene === 1154) return; // 朋友圈内打开 “单页模式”

    // if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: `${ currentRoute }?isShareEnter=true`,
      // path: `${ currentRoute }`,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  onShareTimeline() {
    const { appExplainInfo } = this;

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      query: ``,
    };
  },
  mounted() {
    this.$commonUtil.calcUNavNodeHeight().then(res => { this.uNavbarHeight = res; this.uNavBarImmersive = true; });
  },
  methods: {
    /**
     * 监听登录成功事件
     */
    onLoginSucEvt() {
      uni.$emit('refreshIndexStrictSelectLawyerEvt');
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
