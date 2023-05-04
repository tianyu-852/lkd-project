<template>
  <view>
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" immersive title="企业法务" title-color="#fff" :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <!-- banner -->
    <view class="banner-momdule">
      <image style="width: 100%; height: 100%;" mode="aspectFill" :src="vipEnterpriseServeList[activeVipIndex].images_introduce.top_image" />
    </view>

    <view class="content-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 45 + 50 + 'px' }">
      <view class="content-title">标准化法律服务套餐</view>

      <scroll-view class="scroll-x vip-scroll-x" scroll-x enhanced :show-scrollbar="false">
        <view v-for="(sItem, sIndex) in vipEnterpriseServeList" :key="sIndex" class="scroll-x-item">
          <view class="vipServe-wrap" :class="{ 'vipServe-wrap-active': activeVipIndex === sIndex }" @click="changeVipServer(sIndex)">
            <text class="vip-title">{{ sItem.title }}</text>
            <text class="vip-price">{{ sItem.price }}{{ sItem.type === 3 ? '/年' : '/月' }}</text>
            <view v-if="sItem.type === 1" class="vip-tag" :class="{ 'vip-tag-active': activeVipIndex === sIndex }">首月体验</view>
            <image v-if="activeVipIndex === sIndex" class="checked-image" src="../static/active-gou-square.png" />
          </view>
        </view>
      </scroll-view>

      <!-- 图片 -->
      <view class="img-module">
        <view v-for="(iItem, iIndex) in vipEnterpriseServeList[activeVipIndex].images_introduce.total_image" :key="iIndex" @click="previewServeDetailImg(iIndex)">
          <image style="width: 100%; display: block;" mode="widthFix" :src="iItem" />
        </view>
      </view>

      <!-- 用户评价 -->
      <view class="comment-module">
        <view class="title-wrap"><view class="title-left">服务评价</view></view>
        <view class="comment-item-wrap">
          <view v-for="(cItem, cIndex) in serverSpecEvaluateList" :key="cIndex" class="comment-item">
            <view class="comment-left">
              <view class="user-avatar" @click="$commonUtil.previewImg(['https://res.hehu.hanhan.tech/test/cat-blue.jpg'], 'https://res.hehu.hanhan.tech/test/cat-blue.jpg')">
                <u-lazy-load img-mode="aspectFill" height="60" border-radius="30" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="cItem.user.avatar" />
              </view>
            </view>
            <view class="comment-right">
              <view class="comment-header">
                <view class="header-left">
                  <view class="user-name-wrap">
                    <view class="user-name">{{ cItem.user.nickname }}</view>
                    <text style="margin-left: 16rpx; color: #999;">{{ cItem.user.enterprise_vip }}</text>
                  </view>
                  <view class="user-rate">
                    <u-rate :current="cItem.star" :count="5" :disabled="true" size="20" gutter="4" active-icon="star-fill" inactive-icon="star-fill" active-color="#FFC324" inactive-color="#dadada" />
                  </view>
                </view>
                <view class="header-right">{{ cItem.created_at }}</view>
              </view>
              <view class="comment-content">
                <text>{{ cItem.content }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="vipEnterpriseServeList.length" class="btn-bottom" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="contact-wrap" @click="$commonUtil.callPhone(userInfo.enterprise_vip_mobile)">
        <text>全国统一服务热线：{{ userInfo.enterprise_vip_mobile }}</text>
        <text style="margin-left: auto;">立即拨打</text>
        <u-icon name="arrow-right" color="#FE5F48" size="28"></u-icon>
      </view>
      <!-- #ifndef MP-KUAISHOU || MP-TOUTIAO -->
      <view class="btn-wrap">
        <view class="btn-item">{{ vipEnterpriseServeList[activeVipIndex].introduction }}：¥{{ vipEnterpriseServeList[activeVipIndex].price || 0 }}</view>
        <view class="btn-item" @click="buyVipEnterpriseServe">立即支付</view>
      </view>
      <view class="pay-protocol">
        <text>开通即表示同意</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.enterprise_vip_agreement_url)">《百姓律师企业服务协议》</text>
      </view>
      <!-- #endif -->
    </view>

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />

    <!-- 购买成功 popup -->
    <u-popup v-model="isShowBuySucPopup" mode="center" width="544" border-radius="24" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-buySuc-box" @click.stop="$commonUtil.stopPropagation">
        <image class="header-img" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022108-1665200575422-93hRrf.png" />
        <view class="buySuc-wrap">
          <text>请耐心等待</text>
          <text>法务管家联系</text>
          <view class="buySuc-btn" @click="$commonUtil.backPage">我已知晓</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'VipEnterpriseServe',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px

      vipEnterpriseServeList: [], // vip 企业套餐列表
      activeVipIndex: 0, // 选中的企业套餐下标

      serverSpecEvaluateList: [], // 服务套餐评价列表
      isShowBuySucPopup: false, // 是否显示购买成功 popup

      shareEnterpriseVipId: '', // 分享的企业 vip id
      shareLawyerStr: '', // 推广大使(律师)分享标识
    };
  },
  computed: {
    ...mapState(['appConfigInfo']),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters(['sysSafeAreaHeight']),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    // 分享 vip id
    if (routeParam.vip_id) this.shareEnterpriseVipId = Number(routeParam.vip_id);
    // 推广大使(律师)分享标识
    if (routeParam.share_str) this.shareLawyerStr = routeParam.share_str;

    // 未登录进入登录页面
    if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
    
    this._getVipEnterpriseServe();
    this._getVipEnterpriseServeComment();
  },
  onShareAppMessage() {
    const currentRoute = this.$commonUtil.getCurrentRoute();
    
    return {
      title:'一站式企业法律服务',
      path: `${ currentRoute }`,
      imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221011-1665468302906-K531Fw.png'
    }
  },
  methods: {
    /**
     * 获取 vip 企业套餐列表
     */
    async _getVipEnterpriseServe(page = 1) {
      uni.showLoading({ title: '加载中', mask: true });
      const param = { page };

      try {
        const { data: vipEnterpriseServeData } = await this.$api.getVipEnterpriseServeApi(param);
        this.vipEnterpriseServeList = vipEnterpriseServeData.data
        if (this.vipEnterpriseServeList[0].already_buy) ++this.activeVipIndex;
        if (this.vipEnterpriseServeList[1].already_buy) ++this.activeVipIndex;
        if (this.vipEnterpriseServeList[2].already_buy) ++this.activeVipIndex;
        // 存在分享企业套餐 id
        if (this.shareEnterpriseVipId) {
          const findIndex = this.vipEnterpriseServeList.findIndex(item => item.husbandman_enterprise_vip_id === this.shareEnterpriseVipId);
          if (findIndex >= 0) this.activeVipIndex = findIndex;
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取 vip 企业套餐评论列表
     */
    async _getVipEnterpriseServeComment() {
      try {
        const { data: commentData } = await this.$api.getVipEnterpriseServeCommentApi();
        this.serverSpecEvaluateList = commentData.data
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择 vip 服务规格
     */
    changeVipServer(vipIndex) {
      if (vipIndex === 0 && this.vipEnterpriseServeList[vipIndex].already_buy) return this.$u.toast('首月体验已使用请购买其他套餐');
      if (this.vipEnterpriseServeList[vipIndex].already_buy) return;
      this.activeVipIndex = vipIndex;
    },
    /**
     * 预览服务规格详情图片
     */
    previewServeDetailImg(imgIndex) {
      if (imgIndex !== 1) return;
      const imgSrc = this.vipEnterpriseServeList[this.activeVipIndex].images_introduce.popup_image
      this.$commonUtil.previewImg([imgSrc], imgSrc);
    },
    /**
     * 购买 vip 企业套餐
     */
    async buyVipEnterpriseServe() {
      const { userId, vipEnterpriseServeList, activeVipIndex } = this;
      // 未登录进入登录页面
      if (!userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

      const husbandman_enterprise_vip_id = vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id
      // 确定是否购买
      const already_buy = vipEnterpriseServeList[activeVipIndex].already_buy
      if (already_buy) return this.$u.toast('你已购买了该套餐');
      uni.showLoading({ title: '购买中', mask: true });

      try {
        const param = { husbandman_enterprise_vip_id: husbandman_enterprise_vip_id };
        // 存在律师分享标识 & 参数添加律师标识
        this.shareLawyerStr.trim() && (param.lawyer_share_affairs_str = this.shareLawyerStr.trim());

        const { data: orderData } = await this.$api.postVipEnterpriseServeOrderApi(param);
        const orderNo = orderData.order_no; // 订单号
        if (!orderNo) return this.$u.toast('创建订单失败');

        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrderApi({ type: 1, order_no: orderNo });

        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });

        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        if (payResult) {
          // this.$u.toast('购买成功');
          this.isShowBuySucPopup = true;
          // 重新拉取个人信息
          loginUtil.fetchUserInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
