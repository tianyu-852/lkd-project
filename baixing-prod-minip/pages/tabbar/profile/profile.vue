<template>
  <view class="main">
    <view class="profile-module">
      <view class="profile-wrap">
        <view class="user-avatar" @click="navToProfilePage">
          <u-lazy-load img-mode="aspectFill" height="140" border-radius="14" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="userInfo.avatar || 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678182594867-53Z81P.png'" />
        </view>
        <view class="user-info" @click="navToProfilePage">
          <view v-if="userId" class="user-nickname">{{ userInfo.nickname }}</view>
          <view v-else class="user-nickname" style="font-size: 40rpx;">马上登录</view>
          <view v-if="userId" class="user-fans">
            <text style="margin-right: 30rpx;" @click.stop="navToFollowPage(1)">关注 {{ userInfo.follow_number }}</text>
            <text @click.stop="navToFollowPage(0)">粉丝 {{ userInfo.fans_number }}</text>
          </view>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <text v-if="userId && !userInfo.is_certification" class="enterprise-approve" @click.stop="navToEnterpriseApprovePage">企业认证</text>
        <!-- #endif -->
        <u-icon name="arrow-right" color="#333" size="24" />
      </view>
    </view>

    <view class="menu-module">
      <view class="wallet-nav-wrap" @click="navToMenuPage('/my/wallet')">
        <view class="wallet-title">我的钱包</view>
        <view class="wallet">可用余额：{{ userInfo.balance || 0 }}元</view>
        <u-icon name="arrow-right" color="#333" size="24" />
      </view>
      <view class="menu-nav-wrap">
        <view class="menu-nav-item" @click="navToMenuPage('/my/client/orderForm')">
          <image class="nav-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678155921898-5YGK37.png" />
          <text>订单中心</text>
        </view>
        <view class="menu-nav-item" @click="navToMenuPage('/my/community')">
          <image class="nav-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678155953408-5PhZ92.png" />
          <text>我的问答</text>
        </view>
        <!-- <view class="menu-nav-item">
          <image class="nav-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678155994697-TS72pG.png" />
          <text>我的律师</text>
        </view> -->
        <view class="menu-nav-item" @click="navToOfficialCustomer">
          <image class="nav-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678156024199-bwYY2A.png" />
          <text>人工客服</text>
        </view>
      </view>
    </view>

    <view class="phone-module" @click="openFastPubPhonePopup">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678156493580-dDDEm6.png" />
    </view>

    <view class="tool-module">
      <!-- <view v-if="userInfo.sales_affair && userInfo.sales_affair.user_id" class="tool-item" @click="navToMenuPage('/pages/module-common/vip-lawyer-serve/vip-lawyer-serve')">
        <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678158827118-Tnbi0N.png" />
        <text>优选邀请</text>
      </view> -->
      <view class="tool-item" @click="navToMenuPage('/my/settings/reaction')"> 
        <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678159143534-8XcN32.png" />
        <text>意见反馈</text>
      </view>
      <label for="shareBtnId">
        <view class="tool-item">
          <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678159061868-6MZxtc.png" />
          <text>分享应用</text>
        </view>
      </label>
      <view class="tool-item" @click="navToMenuPage('/my/blacklist')">
        <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678159596106-817cmz.png" />
        <text>黑名单</text>
      </view>
      <view class="tool-item" @click="navToSelectFilePage">
        <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678159658753-NQfJwA.png" />
        <text>上传文件</text>
      </view>
      <view class="tool-item" @click="navToSysSetPage">
        <image class="tool-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202337-1678160506039-dECw5s.png" />
        <text>设置</text>
      </view>
    </view>

    <!-- 快速发布电话咨询 popup -->
    <fast-pubPhone-popup ref="fastPubPhonePopupRef" />

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />

    <tab-bar :selected="4" />
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      officialCustomer: {}, // 官方客服信息
      userEnterpriseInfo: {}, // 用户企业信息
    }
  },
  computed: {
    ...mapState('userModule', ['userInfo', 'userToken']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
    loginUtil.fetchUserInfo().then(res => {
      this._getOfficialCustomer();
      this._getEnterpriseInfo();
    });
  },
  onPullDownRefresh() {
    loginUtil.fetchUserInfo().then(res => {
      uni.stopPullDownRefresh();
      this._getOfficialCustomer();
      this._getEnterpriseInfo();
    });
  },
  onShow() {
    // 更新 tabbar 选中状态 4
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({ selected: 4 });
    }
  },
  onShareAppMessage() {
		let shareTitle = '公益法律咨询';

		return {
			title: shareTitle,
			path: `/pages/tabbar/index/index`,
			imageUrl: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png'
		}
	},
  methods: {
    /**
     * 获取官方客服信息
     */
    async _getOfficialCustomer() {
      try {
        const { data: officialCustomerData } = await this.$api.getOfficialCustomerApi();
        this.officialCustomer = officialCustomerData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取用户企业信息
     */
    async _getEnterpriseInfo() {
      if (!this.userId) return;

      try {
        const { data: enterpriseData } = await this.$api.getEnterpriseInfo();
        this.userEnterpriseInfo = enterpriseData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开快速发布电话咨询弹框
     */
    openFastPubPhonePopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();
    },
    /**
		 * 导航进入菜单页面
		 */
		navToMenuPage(pagePath) {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
			uni.navigateTo({ url: pagePath });
		},
    /**
		 * 导航进入人工客服
		 */
		navToOfficialCustomer() {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

      // #ifndef MP-WEIXIN
      uni.makePhoneCall({ phoneNumber: '400-600-5030' });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({ url: `/pagesV1/info/infoDetails?id=${ this.officialCustomer.user_id }&name=${ this.officialCustomer.nickname }` })
      // #endif
		},
    /**
     * 进入上传文件页面
     */
    navToSelectFilePage() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      uni.navigateTo({
        url: '/pages/module-order/order-file-list/order-file-list',
        success: res => {
          res.eventChannel.emit('cloudFileEvt', { prevedCloudFileList: [] });
        }
      });
    },
    /**
     * 进入个人信息页面
     */
    navToProfilePage() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      uni.navigateTo({ url: `/my/client/heLookPage?id=${ this.userId }` });
    },
    /**
     * 进入 关注/粉丝 页面
     */
    navToFollowPage(i) {
      uni.navigateTo({ url: "/my/faceAndAttention?index=" + i });
    },
    /**
     * 进入企业认证页面
     */
    async navToEnterpriseApprovePage() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      let pagePath = '';

      if (this.userEnterpriseInfo.is_certification) {
        pagePath = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity'
      // step = 1, 填写完企业信息
      } else if (this.userEnterpriseInfo.step === 1) {
        pagePath = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity'
      // step = 2, 填写打款认证信息
      } else if (this.userEnterpriseInfo.step === 2) {
        try {
          const { data: enterpriseBankVerifyData } = await this.$api.getEnterpriseBankVerifyInfo();
          // 人脸认证方式
          if (enterpriseBankVerifyData.cert_type === 2) {
            pagePath = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity?verifyTypeIndex=1'
          } else {
            // 打款认证方式
            pagePath = '/pages/module-profile/profile-enterprise-approveVerify/profile-enterprise-approveVerify'
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        pagePath = '/pages/module-profile/profile-enterprise-approve/profile-enterprise-approve'
      }

      uni.navigateTo({ url: pagePath });
    },
    /**
		 * 导航系统设置页面
		 */
		navToSysSetPage() {
      uni.openSetting();
		},
  }
}
</script>

<style>
 page {
  background: #F5F5F5;
 }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
