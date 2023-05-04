<template>
  <view>
    <view class="profile-module">
      <view class="profile-wrap">
        <view class="profile-left">
          <view v-if="userId" class="profile-name">
            <text>{{ userInfo.name }}</text>
            <text class="profile-phone">{{ userInfo.mobile }}</text>
          </view>
          <view v-else class="profile-name" @click="$Router.push({ name: 'login' });">请先登录</view>

          <view class="profile-job">
            <text>{{ userInfo.type_text }}</text>
            <text style="margin-left: 20rpx;">{{ userInfo.alliance_name }}</text>
          </view>
        </view>
        <view class="profile-right">
          <image v-if="userInfo.sex === 2" class="profile-avatar" mode="aspectFill" src="@/static/common/avatar-woman.png" />
          <image v-else class="profile-avatar" mode="aspectFill" src="@/static/common/avatar-man.png" />
        </view>
      </view>
    </view>
    
    <view class="menu-module">
      <view class="menu-item" @click="navToMenuPage('contractCenter')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
        <text>合同管理</text>
      </view>

      <view class="menu-item" @click="navToMenuPage('clientCenter')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-client.png" />
        <text>客户管理</text>
      </view>

      <view v-if="!userInfo.is_alliance && userInfo.type === 1" class="menu-item" @click="navToMenuPage('teamCenter')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-team.png" />
        <text>团队管理</text>
      </view>

      <view class="menu-item" @click="navToMenuPage('causeCreate')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
        <text>案源中心</text>
      </view>

      <!-- <view class="menu-item" @click="navToMenuPage('orderCenter')"> -->
      <view class="menu-item" @click="navToMinip">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
        <text>订单中心</text>
      </view>

      <view class="menu-item" @click="navToMenuPage('contractCreate')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
        <text>创建合同</text>
      </view>

      <view class="menu-item" @click="navToMenuPage('priceCenter')">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
        <text>价格分享</text>
      </view>

      <view v-if="!userId" class="menu-item" @click="$Router.push({ name: 'login' });">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-login.png" />
        <text>前去登录</text>
      </view>

      <view v-else class="menu-item" style="background: #FFFBFB;" @click="logout">
        <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-logout.png" />
        <text>退出登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'Index',
  data() {
    return {
      title: 'Index'
    };
  },
  computed: {
    ...mapState([ 'systemInfo' ]),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  async onLoad() {
    // const wxMpCode = await loginUtil.getWxMpCode();
    // console.log(wxMpCode);
  },
  async onPullDownRefresh() {
    try {
      await loginUtil.fetchUserInfo();
      this.$u.toast('刷新成功');
    } catch (error) {
      this.$Router.push({ name: 'login' });
    }
    uni.stopPullDownRefresh();
  },
  onShareAppMessage() {
    const curPage = this.$commonUtil.getCurrentRoute();

    return {
      title: '律快答-营销中心',
      path: `${ curPage }`,
      imageUrl: 'https://oss2.lawkd.com/temp/2022-07-05/e7c99488452ab041de6a71142834ac4d.png'
    };
  },
  methods: {
    ...mapActions('userModule', ['removeUserTokenAndUserInfoAction']),
    /**
     * 导航进入菜单页面
     */
    navToMenuPage(pageName) {
      if (!this.userId) return this.$Router.push({ name: 'login' });

      this.$Router.push({ name: pageName });
    },
    /**
     * 退出登录
     */
    async logout() {
      const [error, res] = await uni.showModal({ title: '提示', content: '是否确定退出登录?', confirmColor: '#0085FF', cancelColor: '#666' });
      if (!res.confirm) return;

      this.removeUserTokenAndUserInfoAction();
      this.$Router.push({ name: 'login' });
    },
    /**
     * 跳转企业律云小程序
     */
    navToMinip() {
      uni.navigateToMiniProgram({
        appId: 'wx2c76433714c368a0',
        path: '/pages/module-price/price-center/price-center',
        envVersion: 'develop',
        success: () => {},
        fail: error => {
          console.log(error);
        },
      });
    }
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
