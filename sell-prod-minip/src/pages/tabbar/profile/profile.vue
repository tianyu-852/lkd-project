<template>
  <view class="main" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
    <!-- 小程序码 -->
    <view v-if="userInfo.bai_xing_qrcode" class="minipcode-module">
      <image class="minipcode" mode="aspectFill" show-menu-by-longpress :src="userInfo.bai_xing_qrcode" />
      <view class="minipcode-info">
        <view>我的专属小程序码</view>
        <view class="save-btn" @click="saveImageToPhotosAlbum(userInfo.bai_xing_qrcode)">保存小程序码</view>
      </view>
    </view>

    <view class="qrcode-module">
      <view class="qrcode-header">
        <image class="kufu-avatar" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202295-1662355389786-pyTnp2.png" />
        <view class="kufu-info">
          <view class="kufu-text">招商经理-{{ userInfo.china_merchants.name || '无' }}</view>
        </view>
      </view>

      <!-- 微信二维码 -->
      <view class="qrcode-wrap">
        <image class="qrcode" mode="aspectFill" show-menu-by-longpress :src="userInfo.china_merchants.qrcode" />
        <view class="qrcode-text">长按二维码添加招商经理企业微信</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import mpAuthUtil from '@/common/utils/mpAuthUtil';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'Profile',
  data() {
    return {
    };
  },
  computed: {
    ...mapState([ 'systemInfo' ]),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
  },
  onShow() {
    // 更新 tabbar 选中状态 2
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({ selected: 2 });
    }
  },
  methods: {
    ...mapActions('userModule', ['removeUserTokenAndUserInfoAction']),
    /**
     * 保存图片到相册
     */
    async saveImageToPhotosAlbum(fileSrc) {
      const [error, res] = await uni.downloadFile({ url: fileSrc });
      if (!res) return;
      const tempFilePath = res.tempFilePath;

      console.log(res);

      const authSetResult = await mpAuthUtil.getMpAuthSetting('writePhotosAlbum');
      if (!authSetResult) return;

      // console.log(filePath);

      const [error2, res2] = await uni.saveImageToPhotosAlbum({ filePath: tempFilePath });
      console.log(error);

      if (!res2) return;
      this.$u.toast('已保存至相册');
    }
  }
};
</script>

<style>
page {
  background: #0085FF;
}
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
