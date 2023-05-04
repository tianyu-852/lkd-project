<template>
  <view :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
    <view class="profile-module">
      <view class="profile-wrap">
        <view v-if="userInfo.alliance_name" class="">主：{{ userInfo.alliance_name }}</view>
        <view class="">
          <text>{{ userInfo.type_text }}</text>
          <text style="margin-left: 20rpx;">{{ userInfo.name }}</text>
        </view>
      </view>
      <view class="menu-wrap">
        <!-- <view class="account-wrap">
          账户余额
        </view> -->
        <view class="menu-item-wrap">
          <view class="menu-item" @click="navToQiyeMinipPriceShare">
            <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-pay.png" />
            <text>邀请支付</text>
          </view>
          <view class="menu-item" @click="navToQiyeMinipProductShare">
            <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-share.png" />
            <text>产品分享</text>
          </view>
          <view class="menu-item" @click="navToMenuPage('contractCreate')">
            <!-- <view class="menu-item" @click="navToMenuPage('contractCenter')"> -->
            <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-contract.png" />
            <text>创建合同</text>
          </view>
          <!-- <view class="menu-item" @click="navToMenuPage('teamCenter')"> -->
          <view class="menu-item" @click="navToMenuPage('clientCenter')">
            <image class="icon-menu" mode="aspectFill" src="@/static/profile/icon-profile-team.png" />
            <!-- <text>团队管理</text> -->
            <text>客户管理</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 官方活动 -->
    <view class="base-module activity-module">
      <view class="title-wrap">
        <text>
          <text>官方活动</text>
          <text style="font-size: 28rpx; font-weight: 400; color: #999;">（体验在线法律服务）</text>
        </text>
        <view class="activity-nav" @click="navToActivityListPage(1)">
          <text>详情</text>
          <image class="icon-arrow-right" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view class="activity-wrap">
        <view class="activity-item" style="background: #F9FCFF; margin-right: 24rpx;" @click="navToActivityListPage(1)">
          <view class="activity-left">
            <view>剩余<text style="color: #0085FF; margin: 0 20rpx;">{{ allianceActivityInfo.active_lawyer_call_num || 0 }}</text>份</view>
            <view style="color: #999;">法律咨询</view>
          </view>
          <image class="icon-arrow-right" mode="aspectFill" src="@/static/profile/icon-activity-rightB.png" />
        </view>
        <view class="activity-item" style="background: #FFFBFB;" @click="navToActivityListPage(2)">
          <view class="activity-left">
            <view>剩余<text style="color: #FE5F48; margin: 0 20rpx;">{{ allianceActivityInfo.active_lawyer_letter_num || 0 }}</text>份</view>
            <view style="color: #999;">律师函</view>
          </view>
          <image class="icon-arrow-right" mode="aspectFill" src="@/static/profile/icon-activity-rightR.png" />
        </view>
      </view>
    </view>

    <!-- 数据概况 -->
    <!-- <view class="base-module data-module">
      <view class="title-wrap">
        <text>数据概况</text>
        <view class="data-filter-nav" @click="isShowTimeFactorPopup = !isShowTimeFactorPopup">
          <text>{{ timeFactorList[selectedTimeFactorIndex].name }}</text>
          <image class="icon-arrow-bottom" mode="aspectFill" src="@/static/profile/icon-arrow-bottom.png" />

          <view v-if="isShowTimeFactorPopup" class="time-filter-popup">
            <view v-for="(tItem, tIndex) in timeFactorList" :key="tIndex" class="time-filter-item" :class="{ 'time-filter-item-active': selectedTimeFactorIndex === tIndex}" @click.stop="confirmTimeFactor(tIndex)">{{ tItem.name }}</view>
          </view>
        </view>
      </view>
      <view class="data-wrap">
        <view class="data-item-line">
          合同金额
          <view class="data-item">
            <text class="data-num">34,455</text>
            <text class="data-title">合同金额</text>
          </view>
          <view class="ver-line" />
          已付款
          <view class="data-item">
            <text class="data-num" style="color: #00CB31;">34</text>
            <text class="data-title">已付款</text>
          </view>
          <view class="ver-line" />
          待付款
          <view class="data-item">
            <text class="data-num" style="color: #FE5F48;">23</text>
            <text class="data-title">待付款</text>
          </view>
        </view>
        <view class="data-item-line">
          合同金额
          <view class="data-item">
            <text class="data-num">3,231</text>
            <text class="data-title">已发合同</text>
          </view>
          <view class="ver-line" />
          已付款
          <view class="data-item">
            <text class="data-num" style="color: #00CB31;">45</text>
            <text class="data-title">已签订</text>
          </view>
          <view class="ver-line" />
          待付款
          <view class="data-item">
            <text class="data-num" style="color: #FE5F48;">78</text>
            <text class="data-title">未签订</text>
          </view>
        </view>
      </view>
    </view> -->

    <!-- 待办事项 -->
    <view class="base-module todo-module">
      <view class="title-wrap">
        <text>待办事项</text>
      </view>
      <view class="todo-wrap">
        <view v-for="(tItem, tIndex) in 3" :key="tIndex" class="todo-item">
          <image class="icon-todo" mode="aspectFill" src="@/static/profile/icon-todo.png" />
          <view class="todo-name">
            <view>浙江律快答网络科技有限公司合同</view>
            <view style="color: #0085FF">销售：李甜甜</view>
          </view>
          <view class="todo-status">待签订合同</view>
          <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>

    <!-- 更多功能 -->
    <view class="base-module more-module">
      <view class="title-wrap">
        <text>更多功能</text>
      </view>
      <view class="more-wrap">
        <!-- 订单中心 -->
        <view class="more-item" @click="navToMenuPage('orderCenter')">
          <image class="icon-more" mode="aspectFill" src="@/static/profile/icon-profile-order.png" />
          <text>订单中心</text>
        </view>
        <!-- 发票中心 -->
        <view class="more-item" @click="navToMenuPage('invoiceCenter')">
          <image class="icon-more" mode="aspectFill" src="@/static/profile/icon-profile-ticket.png" />
          <text>发票中心</text>
        </view>
        <!-- 发票中心 -->
        <view class="more-item" @click="navToMenuPage('causeCreate')">
          <image class="icon-more" mode="aspectFill" src="@/static/profile/icon-profile-ticket.png" />
          <text>案源中心</text>
        </view>
        <!-- 退出登录 -->
        <view class="more-item" @click="logout">
          <image class="icon-more" mode="aspectFill" src="@/static/profile/icon-profile-logout.png" />
          <text>退出登录</text>
        </view>
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
      isShowTimeFactorPopup: false, // 是否显示时间条件 popup
      timeFactorList: [
        { name: '本月', status: 2, },
        { name: '近7日', status: 1, },
        { name: '上月', status: 3, },
      ], // 时间条件列表
      selectedTimeFactorIndex: 0, // 选中的时间条件下标

      allianceActivityInfo: {}, // 加盟商活动信息
    };
  },
  computed: {
    ...mapState([ 'systemInfo' ]),
    ...mapState('userModule', ['userInfo', 'userToken']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  async onLoad() {
    // const wxMpCode = await loginUtil.getWxMpCode();
    // console.log(wxMpCode);
    if (this.userId) {
      this._getAllianceActivity();
    }

    // 监听登录成功刷新页面
    uni.$on('indexPageEvt', data => {
      this._getAllianceActivity();
    });
  },
  onShow() {
    // 更新 tabbar 选中状态 0
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({ selected: 0 });
    }
  },
  async onPullDownRefresh() {
    try {
      await loginUtil.fetchUserInfo();
      this._getAllianceActivity();
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
    ...mapActions('userModule', [ 'removeUserTokenAndUserInfoAction' ]),
    /**
     * 获取加盟商活动 数据
     */
    async _getAllianceActivity() {
      // 非销售人员 return
      if (this.userInfo.type !== 1) return;

      try {
        const { data: allianceActivityData } = await this.$api.getAllianceActivity();
        this.allianceActivityInfo = allianceActivityData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 确定时间条件
     */
    confirmTimeFactor(timeFactorIndex) {
      this.selectedTimeFactorIndex = timeFactorIndex;
      this.isShowTimeFactorPopup = false;
    },
    /**
     * 导航进入菜单页面
     */
    navToMenuPage(pageName) {
      if (!this.userId) return this.$Router.push({ name: 'login' });

      this.$Router.push({ name: pageName });
    },
    /**
     * 导航进入活动列表页面
     */
    navToActivityListPage(activityType = 1) {
      if (!this.userId) return this.$Router.push({ name: 'login' });

      this.$Router.push({ name: 'activityList', params: { activityType } });
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
     * 跳转企业律云小程序-价格分享
     */
    navToQiyeMinipPriceShare() {
      if (!this.userId) return this.$Router.push({ name: 'login' });

      uni.navigateToMiniProgram({
        appId: 'wx2c76433714c368a0',
        path: '/pages/module-price/price-center/price-center',
        envVersion: 'develop',
        // envVersion: 'trial',
        // envVersion: 'release',
        extraData: {
          sellerUserToken: this.userToken
        },
        success: () => {},
      });
    },
    /**
     * 跳转企业律云小程序-产品分享
     */
    navToQiyeMinipProductShare() {
      if (!this.userId) return this.$Router.push({ name: 'login' });

      uni.navigateToMiniProgram({
        appId: 'wx2c76433714c368a0',
        path: '/pages/module-price/product-center/product-center',
        envVersion: 'develop',
        // envVersion: 'trial',
        // envVersion: 'release',
        extraData: {
          sellerUserToken: this.userToken
        },
        success: () => {},
      });
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
