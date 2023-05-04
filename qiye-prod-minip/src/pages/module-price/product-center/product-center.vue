<template>
  <view class="main" :style="{ paddingBottom: (safeAreaHeight || 10) + 40 + 20 + 'px' }">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#fff' }">
      <view class="navbar-slot server-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="backPrevPage" />
        <view class="nav-wrap">
          <view class="nav-item" :class="{ 'nav-item-active': activeModuleIndex === 0 }" @click="activeModuleIndex = 0">
            <text>优惠价格</text>
            <view v-if="activeModuleIndex === 0" class="bottom-line" />
          </view>
          <view class="nav-item" :class="{ 'nav-item-active': activeModuleIndex === 1 }" @click="activeModuleIndex = 1">
            <text>公开原价</text>
            <view v-if="activeModuleIndex === 1" class="bottom-line" />
          </view>
        </view>
      </view>
    </u-navbar>

    <view class="tip-module">可多选，组合展示</view>

    <!-- 个人价格 -->
    <view class="person-product-module">
      <view class="product-title" @click="changePersonVip">
        <image v-if="isActivePersonVipMonth && isActivePersonVipYear" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
        <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
        <text>法律咨询套餐</text>
      </view>

      <view class="person-product-items">
        <view class="person-product-item" :class="{ 'person-product-item-active': isActivePersonVipMonth }" @click="isActivePersonVipMonth = !isActivePersonVipMonth">
          <image v-if="isActivePersonVipMonth" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
          <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
          <text>月度套餐</text>
        </view>
        <view class="person-product-item" :class="{ 'person-product-item-active': isActivePersonVipYear }" @click="isActivePersonVipYear = !isActivePersonVipYear">
          <image v-if="isActivePersonVipYear" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
          <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
          <text>年度套餐</text>
        </view>
      </view>
    </view>

    <!-- 公司价格 -->
    <view class="company-product-module">
      <view class="product-title" @click="isActiveCompanyVip = !isActiveCompanyVip">
        <image v-if="isActiveCompanyVip" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
        <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
        <text>标准化法律服务套餐（年）</text>
      </view>

      <!-- 优惠价 -->
      <view v-if="activeModuleIndex === 0" @click="$commonUtil.previewImg([qiyeVipDiscountImg], qiyeVipDiscountImg)">
        <image class="company-product-img" mode="widthFix" :src="qiyeVipDiscountImg" />
      </view>
      <!-- 原价 -->
      <view v-else-if="activeModuleIndex === 1" @click="$commonUtil.previewImg([qiyeVipRawImg], qiyeVipRawImg)">
        <image class="company-product-img" mode="widthFix" :src="qiyeVipRawImg" />
      </view>
    </view>

    <view class="bottom-btn" :style="{ paddingBottom: (safeAreaHeight || 10) + 'px' }">
      <view class="preview-btn" @click="navToPreviewProductPay">预览</view>
      <!-- 分享按钮 -->
      <label for="shareBtnId">
        <view class="share-btn">立即分享</view>
      </label>
    </view>

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProductCenter',
  data() {
    return {
      activeModuleIndex: 0, // 激活的组件模块
      safeAreaHeight: this.$store.state.safeAreaHeight,

      qiyeVipDiscountImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202295-1662371308525-5nK6H9.png',
      qiyeVipRawImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202295-1662371375017-XGrtHT.png',

      shareProductType: '',
      isActivePersonVipMonth: false,
      isActivePersonVipYear: false,
      isActiveCompanyVip: true,
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
  },
  onLoad() {
  },
  async onShareAppMessage() {
    const { appExplainInfo, isActivePersonVipMonth, isActivePersonVipYear, isActiveCompanyVip, activeModuleIndex } = this;

    // 分享产品类型列表
    const shareProductTypeList = [];
    isActivePersonVipMonth && (shareProductTypeList.push(1));
    isActivePersonVipYear && (shareProductTypeList.push(2));
    isActiveCompanyVip && (shareProductTypeList.push(3));

    const shareProductType = shareProductTypeList.join(',');

    const { data: sellerFlagData } = await this.$api.getShareVipSellerFlag();
    const sellerFlag = sellerFlagData.share_affairs_str; // 销售标识

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: `/pages/module-common/product-pay/product-pay?shareProductType=${ shareProductType }&qiyeIsDiscount=${ activeModuleIndex ? 0 : 1 }&sellerFlag=${ sellerFlag }`,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  methods: {
    ...mapActions('userModule', [ 'removeUserTokenAndUserInfoAction' ]),
    /**
     * 全选/取消 选择个人套餐
     */
    changePersonVip() {
      if (this.isActivePersonVipMonth && this.isActivePersonVipYear) {
        this.isActivePersonVipMonth = false;
        this.isActivePersonVipYear = false;
      } else if ((this.isActivePersonVipMonth || this.isActivePersonVipYear) || (!this.isActivePersonVipMonth && !this.isActivePersonVipYear)) {
        this.isActivePersonVipMonth = true;
        this.isActivePersonVipYear = true;
      }
    },
    /**
     * 回退上一页
     */
    backPrevPage() {
      this.removeUserTokenAndUserInfoAction();

      const pages = getCurrentPages();
      if (pages.length === 1) {
        uni.navigateBackMiniProgram();
      } else {
        this.$commonUtil.backClick();
      }
    },
    /**
     * 去预览产品支付页面
     */
    navToPreviewProductPay() {
      const { isActivePersonVipMonth, isActivePersonVipYear, isActiveCompanyVip, activeModuleIndex } = this;
      if (!isActivePersonVipMonth && !isActivePersonVipYear && !isActiveCompanyVip) return this.$u.toast('请选择分享产品项');

      // 分享产品类型列表
      const shareProductTypeList = [];
      isActivePersonVipMonth && (shareProductTypeList.push(1));
      isActivePersonVipYear && (shareProductTypeList.push(2));
      isActiveCompanyVip && (shareProductTypeList.push(3));
      const shareProductType = shareProductTypeList.join(',');

      this.$commonUtil.routeNavTo('module-common/product-pay/product-pay', { enterSrc: 'productCenter', shareProductType, qiyeIsDiscount: activeModuleIndex ? 0 : 1 });
      // uni.navigateTo({ url: `/pages/module-common/product-pay/product-pay?enterSrc=productCenter&shareProductType=${ shareProductType }&qiyeIsDiscount=${ activeModuleIndex ? 0 : 1 }` });
    }
  }
};
</script>

<style>
  page {
    background: #fff;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
