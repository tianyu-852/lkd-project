<template>
  <view>
    <view
      id="dragBtn"
      class="drag"
      :class="{ 'drag-transition': isDock && !isMoving, 'drag-opacity': isHide }"
      :style="'left: ' + left + 'px; top:' + top + 'px;'"
      @click.stop.prevent="dragBtnClickEvt"
      @touchstart="dragBtnTouchstartEvt"
      @touchmove.stop.prevent="dragBtnTouchmoveEvt"
      @touchend="dragBtnTouchendEvt"
    >
      <image class="drag-img" mode="aspectFill" src="@/static/center/server-open-btn.png" />
    </view>

    <!-- 客服 popup -->
    <kefu-popup ref="kefuRef" :headerImgType="2" />
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
    isDock: { type: Boolean, default: true },
    // 是否停靠隐藏
    isHide: { type: Boolean, default: false },
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
      // edgeDist: 10, // 边界距离 10 px
      edgeDist: 0, // 边界距离 10 px
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  watch: {
    /**
     * 监听 是否隐藏按钮
     */
    isHide(newVal) {
      this.isMoving = true;
      const edgeRigthDist = this.windowWidth - this.width - this.edgeDist;
      if (newVal) {
        if (this.left < this.windowWidth / 2 - this.offsetWidth) {
          this.left = 0 - this.offsetWidth;
        } else {
          this.left = this.windowWidth - this.offsetWidth;
        }
      } else {
        if (this.left < this.windowWidth / 2 - this.offsetWidth) {
          this.left = this.edgeDist;
        } else {
          this.left = edgeRigthDist;
        }
      }
      this.isMoving = false;
    }
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
     * 手指点击事件
     */
    dragBtnClickEvt() {
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
      this.left = event.touches[0].clientX - this.offsetWidth; // X轴 位移距离

      let clientY = event.touches[0].clientY - this.offsetHeight;

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
      this.$refs.kefuRef.openKefuPopup();

      // const { userId } = this;
      // if (userId) return this.$refs.kefuRef.openKefuPopup();

      // this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
    },
  }
};
</script>

<style lang="scss">
  @import './style.scss';
</style>
