<template>
  <view>
    <view
      id="dragBtn"
      class="drag-btn"
      :class="{ 'drag-transition': isDock && !isMoving }"
      :style="'left: ' + left + 'px; top:' + top + 'px;'"
      @click.stop.prevent="click"
      @touchstart="dragBtnTouchstartEvt"
      @touchmove.stop.prevent="dragBtnTouchmoveEvt"
      @touchend="dragBtnTouchendEvt"
    >
      <template v-if="userInfo.enterprise_vip_expired_at">
        <image class="kefu-avatar" mode="aspectFill" src="@/static/common/kefu-dragBtn-manager.png" @click="openOfficKefuPopup" />
      </template>
      <template v-else>
        <image class="kefu-avatar" mode="aspectFill" src="@/static/common/kefu-dragBtn-serve.png" @click="openOfficKefuPopup" />
      </template>
    </view>

    <!-- 官方客服 popup -->
    <view v-if="isShowOfficKefuPopup" class="black-mask" @click="isShowOfficKefuPopup = false" />
    <view v-if="isShowOfficKefuPopup" class="kefu-guide-module">
      <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="isShowOfficKefuPopup = false" />

      <view class="kefu-wrap">
        <image class="kufu-left" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />
        <view class="kefu-right">
          <view class="kefu-right-key">{{ userInfo.enterprise_vip_expired_at ? '法务管家' : '法律顾问' }}-{{ officKefuInfo.customer_name }}</view>
          <view class="kefu-right-value">hi，想要更优质的企业法律服务，找我就对了～～～</view>
        </view>
      </view>
      <view class="btn-wrap">
        <view class="btn-item" @click="clickBtn(1)">
          <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-wxLogo-f.png" />
          <text>微信</text>
        </view>
        <view class="btn-item" @click="clickBtn(2)">
          <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-call-f.png" />
          <text>电话</text>
        </view>
      </view>
    </view>

    <!-- 客服 popup -->
    <kefu-popup ref="kefuRef" />
    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'KefuDragButton',
  props: {
    // 是否启用自动停靠
    isDock: { type: Boolean, default: false },
    // 当前页面是否包含tabbar APP需要
    existTabBar: { type: Boolean, default: false },
    // 导航栏高度
    navbarHeight: { type: Number, default: 0 },
  },
  data() {
    return {
      left: 0, // 小球位移 X 轴 px
      top: 0, // 小球位移 Y 轴 px
      width: 0, // 小球宽度 px
      height: 0, // 小球高度 px
      offsetWidth: 0, // 小球一半宽度 px
      offsetHeight: 0, // 小球一半高度 px
      windowWidth: 0, // 窗口宽度 px
      windowHeight: 0, // 窗口高度 px
      isMoving: true, // 是否正在移动中
      edgeDist: 10, // 边界距离 10 px

      isShowOfficKefuPopup: false, // 是否显示客服模块
    };
  },
  computed: {
    ...mapState([ 'officKefuInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  watch: {
  },
  mounted() {
    const sysInfo = uni.getSystemInfoSync();
    this.windowWidth = sysInfo.windowWidth;
    this.windowHeight = sysInfo.windowHeight;
    // console.log(sysInfo);

    // #ifdef APP-PLUS
    this.existTabBar && (this.windowHeight -= 50);
    // #endif
    if (sysInfo.windowTop) {
      this.windowHeight += sysInfo.windowTop;
    }

    const query = uni.createSelectorQuery().in(this);
    query.select('#dragBtn').boundingClientRect(data => {
      this.width = data.width;
      this.height = data.height;
      this.offsetWidth = data.width / 2;
      this.offsetHeight = data.height / 2;
      this.left = this.windowWidth - this.width - this.edgeDist;
      // this.top = this.windowHeight - this.height - this.edgeDist;
      this.top = this.windowHeight / 2 + 180;
    }).exec();
  },
  methods: {
    /**
     * 点击事件
     */
    click() {
      this.$emit('btnClick');
    },
    /**
     * 手指触摸动作开始事件
     */
    dragBtnTouchstartEvt(event) {
      this.$emit('btnTouchstart');
    },
    /**
     * 手指触摸后移动事件
     */
    dragBtnTouchmoveEvt(event) {
      if (event.touches.length !== 1) return false; // 非单指触摸 return

      this.isMoving = true;
      // this.left = event.touches[0].clientX - this.offsetWidth; // X轴 位移距离
      let clientX = event.touches[0].clientX - this.offsetWidth; // X轴 位移距离
      let clientY = event.touches[0].clientY - this.offsetHeight; // Y轴 位移距离

      this.left = clientX;

      // #ifdef H5
      clientY += this.height;
      // #endif

      // 下边界距离
      const edgeBottom = this.windowHeight - this.height - this.edgeDist;

      // 上下触及边界
      if (clientY < this.edgeDist + this.navbarHeight) {
        this.top = this.edgeDist + this.navbarHeight;
      } else if (clientY > edgeBottom) {
        this.top = edgeBottom;
      } else {
        this.top = clientY;
      }
    },
    /**
     * 手指触摸动作结束事件
     */
    dragBtnTouchendEvt(event) {
      if (this.isDock) {
        // 右边界距离
        let edgeRigthDist = this.windowWidth - this.width - this.edgeDist;

        if (this.left < this.windowWidth / 2 - this.offsetWidth) {
          this.left = this.edgeDist;
        } else {
          this.left = edgeRigthDist;
        }
      }

      this.isMoving = false;
      this.$emit('btnTouchend');
    },
    /**
     * 打开官方客服 popup
     */
    openOfficKefuPopup() {
      const { userId } = this;
      if (!userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      this.userInfo.enterprise_vip_expired_at ? (this.isShowOfficKefuPopup = true) : this.$refs.kefuRef.openKefuPopup();
    },
    /**
     * 点击 btn
     */
    clickBtn(btnType = 1) {
      if (!this.officKefuInfo) return;

      if (btnType === 1) {
        this.$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: this.officKefuInfo.customer_id });
      } else if (btnType === 2) {
        this.$commonUtil.callPhone(this.officKefuInfo.mobile);
      }
      this.isShowOfficKefuPopup = false;
    }
  }
};
</script>

<style lang="scss">
  @import './style.scss';
</style>
