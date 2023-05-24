<template>
	<view>
    <view style="width: 100vw; height: auto;">
      <image class="qiye-img" style="width: 100%; height: 100%;" mode="widthFix" :src="unionAdvertImg" />
    </view>

    <view class="apply-btn" @click="clickSignBtn">
      <image class="qiye-img" style="width: 100%; height: 100%;" mode="widthFix" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023410-1681107521551-d9Q7Z0.png" />
    </view>

    <!-- 认证提醒 popup -->
    <u-popup v-model="isShowAuthTipPopup" mode="center" width="586" border-radius="30" closeable :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-signup-box">
        <view class="upopup-header">温馨提示</view>
        <view class="upopup-body">本次活动仅限平台律师参与</view>
        <view class="upopup-btn" @click="navToLawyerAuthPage">立即认证</view>
      </view>
    </u-popup>

    <!-- 报名成功 popup -->
    <u-popup v-model="isShowSignupSucPopup" mode="center" width="586" border-radius="30" closeable :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-signup-box">
        <view class="upopup-header">报名成功</view>
        <view class="upopup-body">请耐心等待，客服将会在第一时间与您联系</view>
        <view class="upopup-btn" @click="navToHomePage">我已知晓</view>
      </view>
    </u-popup>
	</view>
</template>

<script>
import * as api from "@/apis/apis.js"

export default {
  data() {
    return {
      unionAdvertImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023413-1681349936642-n5DBkm.png',
      isShowAuthTipPopup: false, // 是否打开 认证提示 popup
      isShowSignupSucPopup: false, // 是否打开 报名成功  popup

      userToken: '',
      platform: '',
      advertisement_id: '', // 广告id
      userInfo: null, // 用户信息
    }
  },
  onLoad(query) {
    if (query.advertisement_id.trim()) this.advertisement_id = query.advertisement_id.trim(); // 广告 id
  },
  onShow() {
    this.platform = uni.getSystemInfoSync().platform;
    if (this.platform == 'ios') {
      // 缓存用户 token
      uni.setStorageSync('token', prompt('onGetToken'));
      const _userToken = uni.getStorageSync('token');
      // console.log('----苹果用户 token----', _userToken)
      
      this.userToken = _userToken;
      this.userToken && this._getUserInfo();
    } else {
      // 缓存用户 token
      uni.setStorageSync('token', AppProxyClick.onGetToken());
      const _userToken = uni.getStorageSync('token');
      this.userToken = _userToken;
      this.userToken && this._getUserInfo();
    }
  },
  methods: {
    /**
     * 获取用户信息
     */
    async _getUserInfo() {
      try {
        const { data: userData } = await api.getUserInfoApi()
        this.userInfo = userData.data
        this._postVisitNum()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 新增 访问 次数
     */
    async _postVisitNum() {
      const param = { advertisement_id: this.advertisement_id, is_join: 0 }

      try {
        await api.signupCauseSourceUnionApi(param)
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 点击报名 按钮
     */
    clickSignBtn() {
      if (!this.userInfo) {
        // 前往用户登录页
        this.platform == 'ios' ? prompt('onGotoUserLogin') : AppProxyClick.onGotoUserLogin(1);
      } else {
        // 律师身份报名
        if (this.userInfo.type === 1) {
          this._confirmSignupCauseSourceUnion()
        // 用户身份弹窗
        } else {
          this.isShowAuthTipPopup = true;
        }
      }
    },
    
    /**
     * 律师报名案源合作
     */
    async _confirmSignupCauseSourceUnion() {
      const param = { advertisement_id:  this.advertisement_id, is_join: 1 }
      uni.showLoading({ title: '', mask: true });

      try {
        await api.signupCauseSourceUnionApi(param)
        this.isShowSignupSucPopup = true
      } catch (error) {
        console.log(error)
      }

      uni.hideLoading();
    },

    /**
     * 前往用户认证页
     */
    navToLawyerAuthPage() {
      this.isShowAuthTipPopup = false;
      
      if (this.platform == 'ios') {
        prompt('onGotoLawyerApprove')
      } else {
        AppProxyClick.onGotoLawyerApprove();
      }
    },

    /**
     * 前往 APP 首页
     */
    navToHomePage() {
      this.isShowSignupSucPopup = false;
      
      if (this.platform == 'ios') {
        prompt('onGotoAppHome')
      } else {
        AppProxyClick.onGotoAppHome();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
