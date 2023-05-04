<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="企业认证" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 用户信息 -->
    <view class="profile-info-module">
      <view class="profile-info-left" @click="$commonUtil.previewImg([avatar], avatar);">
        <image style="width: 120rpx; height: 120rpx; border-radius: 50%;" mode="aspectFill" :src="avatar" />
      </view>
      <!-- <view class="profile-info-middle">
        <view class="profile-name">用户名称</view>
      </view> -->
      <view class="profile-info-right" @click="updateUserAvatar">
        <text>上传头像</text>
        <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" />
      </view>
    </view>

    <!-- 企业信息 -->
    <view class="company-info-module">
      <view class="company-info-header">
        <view class="info-header-left">
          <view class="divider-ver" />
          <text class="header-text">企业基本信息</text>
        </view>
        <view class="info-header-right" @click="chooseLicenseImg">
          <image class="icon-camera" mode="aspectFill" src="../static/prove/icon-camera.png" />
          <text class="header-text">上传营业执照识别</text>
        </view>
      </view>

      <view class="company-info-cellWrap">
        <view class="info-cell-item">
          <view class="cell-left">企业名称</view>
          <view class="cell-right">
            <input v-model="nickname" class="input-text" cursor-spacing="30" placeholder="请填写企业名称" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay">
          </view>
        </view>
        <!-- <view class="info-cell-item">
          <view class="cell-left">企业法人</view>
          <view class="cell-right">
            <input v-model="legal_person" class="input-text" cursor-spacing="30" placeholder="请填写企业法人" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay">
          </view>
        </view> -->
        <!-- <view class="info-cell-item" @click="chooseLocation">
          <view class="cell-left">企业地址</view>
          <view class="cell-right">
            <text v-if="enterprise_address">{{ enterprise_address }}</text>
            <text v-else style="color: #999;">请填写企业地址</text>
          </view>
        </view> -->
        <view class="info-cell-item">
          <view class="cell-left">
            <view>统一社会</view>
            <view>信用代码</view>
          </view>
          <view class="cell-right">
            <input v-model="credit_code" class="input-text" cursor-spacing="30" placeholder="请填写统一社会信用代码" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay">
          </view>
        </view>
      </view>

      <view v-if="business_license_image" class="company-license-wrap" @click="$commonUtil.previewImg([business_license_image], business_license_image);">
        <image class="license-img" mode="aspectFill" :src="business_license_image" />
      </view>
    </view>

    <!-- 用户信息 -->
    <view class="user-info-module">
      <view class="user-info-header">
        <view class="info-header-left">
          <view class="divider-ver" />
          <text class="header-text">使用人资料</text>
        </view>
      </view>
      <view class="user-info-cellWrap">
        <view class="info-cell-item">
          <view class="cell-left">名字</view>
          <view class="cell-right">
            <input v-model="represent_nickname" class="input-text" cursor-spacing="30" placeholder="请填写使用者姓名" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay">
          </view>
        </view>
        <view class="info-cell-item">
          <view class="cell-left">手机号码</view>
          <view class="cell-right">
            <text>{{ mobile }}</text>
            <!-- <input v-model="customPayMoney" disabled class="input-text" cursor-spacing="30" placeholder="请填写使用者姓名" placeholder-style="color: #999; font-size: 32rpx;" @confirm="confirmPay"> -->
          </view>
        </view>
      </view>
    </view>

    <view class="prove-btns">
      <!-- 分享按钮 -->
      <!-- <label for="shareBtnId">
        <view class="share-btn">
          <image class="icon-share" mode="aspectFill" src="@/static/common/share-square-f.png" />
          <text>分享</text>
        </view>
      </label> -->
      <view class="prove-btn" @click="submitProve">提交认证</view>
    </view>

    <!-- 无法认证 -->
    <!-- <view class="cannot-prove">
      <text>无法认证，</text>
      <text class="contact-btn" @click="$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: officKefuInfo.customer_id });">联系客服</text>
    </view> -->

    <button id="shareBtnId" open-type="share" style="display: none;" />
    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" @loginSucEvt="onLoginSucEvt" />
  </view>
</template>

<script>
import mpAuthUtil from '@/common/utils/mpAuthUtil';
import fileUtil from '@/common/utils/fileUtil';
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProfileCompanyProve',
  data() {
    return {
      companyProveInfo: {}, // 企业认证信息
      isUpdateAvatar: false, // 是否选择了新的头像

      avatar: '', // 头像
      nickname: '', // 企业昵称
      legal_person: '', // 企业法人
      enterprise_address: '', // 企业地址
      enterprise_lng: '', // 企业经度
      enterprise_lat: '', // 企业纬度
      credit_code: '', // 企业信用代码
      business_license_image: '', // 营业执照 图片链接
      represent_nickname: '', // 使用人姓名
      mobile: '', // 使用人手机号

      userEnterpriseId: '', // 用户企业 id
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo', 'officKefuInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  async onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.user_enterprise_id) this.userEnterpriseId = routeParam.user_enterprise_id;

    if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框

    await this._getCompanyProveInfo();
    this._getIdCompanyProveInfo();
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: `${ currentRoute }?user_enterprise_id=${ this.userEnterpriseId }`,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  methods: {
    /**
     * 获取企业认证信息
     */
    async _getCompanyProveInfo() {
      try {
        const { data: companyProveData } = await this.$api.getCompanyProveInfo();
        this.avatar = companyProveData.avatar;
        this.nickname = companyProveData.nickname;
        this.legal_person = companyProveData.legal_person;
        this.enterprise_address = companyProveData.enterprise_address;
        this.enterprise_lng = companyProveData.enterprise_lng;
        this.enterprise_lat = companyProveData.enterprise_lat;
        this.credit_code = companyProveData.credit_code;
        this.business_license_image = companyProveData.business_license_image;
        this.represent_nickname = companyProveData.represent_nickname;
        this.mobile = companyProveData.mobile;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 根据企业 id 获取企业认证信息
     */
    async _getIdCompanyProveInfo() {
      const { userEnterpriseId } = this;
      if (!userEnterpriseId) return;

      try {
        const { data: companyProveData } = await this.$api.getIdCompanyProveInfo({ user_enterprise_id: userEnterpriseId });
        this.nickname = companyProveData.enterprise_name;
        this.credit_code = companyProveData.credit_code;
        this.represent_nickname = companyProveData.contacts_name;
        this.mobile = companyProveData.contacts_phone;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听登录成功事件
     */
    async onLoginSucEvt(loginStatus) {
      await this._getCompanyProveInfo();
      this._getIdCompanyProveInfo();
    },
    /**
     * 更新用户头像
     */
    async updateUserAvatar() {
      if (!this.userId) return;

      const [error, imgRes] = await uni.chooseMedia({ count: 1, mediaType: ['image'], sizeType: ['original'] });
      if (error) return;
      const tempFilePath = imgRes.tempFiles[0].tempFilePath;
      this.avatar = tempFilePath;
      this.isUpdateAvatar = true;
    },
    /**
     * 选择执照图片
     */
    async chooseLicenseImg() {
      const [error, imgRes] = await uni.chooseMedia({ count: 1, mediaType: ['image'], sizeType: ['original'] });
      if (error) return;
      const tempFilePath = imgRes.tempFiles[0].tempFilePath;
      uni.showLoading({ title: '识别中', mask: true });

      try {
        // 上传文件到 oss
        const imageUrl = await fileUtil.uploadFile(tempFilePath);
        // ocr 识别营业执照
        const { data: ocrCompanyLicenseData } = await this.$api.ocrCompanyLicenseInfo({ business_license_image: imageUrl });
        this.nickname = ocrCompanyLicenseData.nickname;
        this.legal_person = ocrCompanyLicenseData.legal_person;
        this.credit_code = ocrCompanyLicenseData.credit_code;
        this.business_license_image = imageUrl;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择地理位置
     */
    async chooseLocation() {
      // #ifdef MP-WEIXIN
      const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation');
      if (!authSetResult) return;
      // #endif
      const [error, locRes] = await uni.chooseLocation();
      if (!locRes) return;
      const { longitude, latitude, address } = locRes;
      this.enterprise_lng = String(longitude); // 经度
      this.enterprise_lat = String(latitude); // 经度
      this.enterprise_address = address; // 详细地址
    },
    /**
     * 提交/更新 企业认证信息
     */
    async submitProve() {
      const { isUpdateAvatar, avatar, nickname, legal_person, enterprise_address, enterprise_lng, enterprise_lat, credit_code, business_license_image, represent_nickname } = this;
      if (!nickname.trim()) return this.$u.toast('请输入企业名称');
      // if (!legal_person.trim()) return this.$u.toast('请输入企业法人');
      // if (!enterprise_address.trim()) return this.$u.toast('请输入企业地址');
      if (!credit_code.trim()) return this.$u.toast('请输入信用代码');
      uni.showLoading({ title: '更新中', mask: true });

      const param = { avatar, nickname, legal_person, enterprise_address, enterprise_lng, enterprise_lat, credit_code, business_license_image, represent_nickname };
      // 添加企业 id
      if (this.userEnterpriseId) param.user_enterprise_id = this.userEnterpriseId;

      // 上传头像
      if (isUpdateAvatar) {
        const newAvatarUrl = await fileUtil.uploadFile(avatar);
        param.avatar = newAvatarUrl;
      }

      try {
        const data = await this.$api.updateCompanyProveInfo(param);

        this.$u.toast('更新成功');
        // 重新拉取个人信息
        loginUtil.fetchUserInfo();
        // 回退上一页
        setTimeout(() => {
          this.$commonUtil.backClick();
        }, 500);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
