<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="律师认证" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 类型认证 -->
    <view class="lawyer-grade-module">
      <view class="title">请选择认证类型</view>
      <view class="lawyer-grade-wrap">
        <view v-for="(gItem, gIndex) in lawyerGradeList" :key="gIndex" class="lawyer-grade-item" :class="{ 'lawyer-grade-item-active': tIndex === 1 }">{{ gItem.title }}</view>
      </view>
    </view>

    <!-- 头像认证 -->
    <view class="avatar-module">
      <view class="title">请上传头像</view>
      <view class="subtitle">为了确保真实性，照片上传脸无遮挡更能提高</view>
      <view class="avatar-prove-wrap">
        <view class="avatar-prove-left">
          <view class="avatar-upload-wrap">
            <image class="icon-camera-up" mode="aspectFill" src="../static/prove/icon-camera-up.png" />
            <text>上传免冠照</text>
          </view>
        </view>
        <view class="avatar-prove-right">
          <view class="aProve-tip-item">
            <image class="aProve-tip-img" mode="aspectFill" src="../static/prove/avatar-tip-1.png" />
            <view class="aProve-explain">
              <image class="icon-prove-explain" mode="aspectFill" src="../static/prove/avatar-prove-right.png" />
              <text>免冠照</text>
            </view>
          </view>
          <view class="aProve-tip-item">
            <image class="aProve-tip-img" mode="aspectFill" src="../static/prove/avatar-tip-2.png" />
            <view class="aProve-explain">
              <image class="icon-prove-explain" mode="aspectFill" src="../static/prove/avatar-prove-fail.png" />
              <text>大头照</text>
            </view>
          </view>
          <view class="aProve-tip-item">
            <image class="aProve-tip-img" mode="aspectFill" src="../static/prove/avatar-tip-3.png" />
            <view class="aProve-explain">
              <image class="icon-prove-explain" mode="aspectFill" src="../static/prove/avatar-prove-fail.png" />
              <text>非人</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 执业认证 -->
    <view class="certificate-module">
      <view class="title">上传律师实习证</view>
      <view class="subtitle">光线充足环境下，请将证件正面朝上拍摄识别成功率更高</view>
      <view class="eg-btn" @click="isShowCertificatePopup = true">查看示例</view>
      <view class="certificate-wrap">
        <view class="certificate-item">
          <image class="certificate-bg" mode="aspectFill" src="../static/prove/certificate-front.png" />
          <view class="certificate-text">上传律师实习证详情页</view>
        </view>
        <view class="certificate-item">
          <image class="certificate-bg" mode="aspectFill" src="../static/prove/certificate-back.png" />
          <view class="certificate-text">上传律师实习证详情页</view>
        </view>
      </view>
    </view>

    <!-- 执业认证 -->
    <view class="cell-module">
      <view class="cell-item">
        <view class="cell-left">服务地区</view>
        <view class="cell-right">
          <text>请选择</text>
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-left">发证时间</view>
        <view class="cell-right">
          <text>请选择</text>
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view class="cell-item">
        <view class="cell-left">有效时间</view>
        <view class="cell-right">
          <text>请选择</text>
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>

    <!-- 下一步 -->
    <view class="next-btn" @click="enterNext">下一步</view>

    <!-- 黑色蒙层 -->
    <view v-show="isShowCertificatePopup" class="black-mask" @click="isShowCertificatePopup = false" />
    <!-- 执业证书示例 popup -->
    <view v-if="isShowCertificatePopup" class="certificate-eg-popup">
      <image class="certificate-eg-img" mode="aspectFill" src="../static/prove/certificate-eg.png" />
      <image class="certificate-eg-del" mode="aspectFill" src="../static/prove/certificate-del.png" @click="isShowCertificatePopup = false" />
    </view>
  </view>
</template>

<script>
// import { mapState } from 'vuex';

export default {
  name: 'ProfileLawyerProve',
  data() {
    return {
      isShowCertificatePopup: false, // 是否显示证书 popup

      lawyerGradeList: [], // 律师等级列表

      lawyer_grade: '', // 律师等级
    };
  },
  computed: {
  },
  onLoad(query) {
    // const routeParam = this.$commonUtil.routeParamParse(query);
    // if (routeParam.lawyerId) {
    //   this.lawyerId = routeParam.lawyerId;
    //   this._getLawyerDetail();
    //   this._getLawyerDynamicList();
    //   this._getLawyerEvaluateList();
    // }
    this.getLawyerProveConfigInfo();
  },
  methods: {
    /**
     * 获取律师认证配置信息
     */
    async getLawyerProveConfigInfo() {
      // if (!this.lawyerId) return;
      // const { lawyerId } = this;

      try {
        const { data: lawyerProveConfigData } = await this.$api.getLawyerProveConfigInfo();
        this.lawyerGradeList = lawyerProveConfigData.config;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 进入下一步
     */
    enterNext() {
      this.$commonUtil.routeNavTo('module-profile/profile-lawyer-idcard/profile-lawyer-idcard');
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
