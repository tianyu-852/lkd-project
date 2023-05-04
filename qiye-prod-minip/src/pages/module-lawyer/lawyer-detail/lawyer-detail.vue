<template>
  <view class="main" :style="{ paddingBottom: (safeAreaHeight || 10) + 40 + 10 + 'px' }">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :title="isChangeUNavBarStyle ? lawyerDetail.nickname : ''" title-color="#030303" :immersive="uNavBarImmersive" :background="{ backgroundColor: isChangeUNavBarStyle ? '#fff' : 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" :src="isChangeUNavBarStyle ? '/static/common/back-arrow-3.png' : '/static/common/back-arrow-f.png'" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="header-module">
      <view class="header-bg">
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="../static/detail/detail-header-bg.png" />
      </view>
      <view class="header-info-wrap">
        <!-- 律师头像 -->
        <view class="lawyer-avatar" @click="$commonUtil.previewImg([lawyerDetail.avatar], lawyerDetail.avatar)">
          <u-lazy-load img-mode="aspectFill" height="160rpx" border-radius="30" :loading-img="qiyeLoadImg400" :error-img="qiyeLoadImg400" :image="lawyerDetail.avatar" />
        </view>
        <!-- 分享按钮 -->
        <label for="shareBtnId">
          <view class="share-btn">分享律师</view>
        </label>
        <!-- 律师名称 -->
        <view class="lawyer-name-wrap">
          <text>{{ lawyerDetail.nickname }}</text>
          <image v-if="lawyerDetail.is_guarantee" class="badge-img" mode="aspectFill" src="@/static/common/approve-badge-active.png" />
          <view class="work-year">执业{{ lawyerDetail.work_year || 1 }}年</view>
        </view>
        <!-- 公司名 -->
        <view class="company-name">{{ lawyerDetail.lawyer_office }}</view>
        <!-- 咨询信息 -->
        <view class="serve-data-wrap">
          <text class="data-num">{{ lawyerDetail.order_number || 0 }}</text>
          <text>次咨询</text>
          <text class="data-num" style="margin-left: 30rpx;">{{ lawyerDetail.praise_number || 0 }}</text>
          <text>次好评</text>
          <text class="data-num" style="margin-left: 30rpx;">{{ lawyerDetail.enterprise_number || 0 }}</text>
          <text>次服务企业</text>
        </view>
        <!-- 信息认证 -->
        <view class="info-prove-wrap">
          <view class="prove-item"><image style="width: 100%; height: 100%;" mode="aspectFill" src="../static/detail/info-prove-work.png" /></view>
          <view class="prove-item"><image style="width: 100%; height: 100%;" mode="aspectFill" src="../static/detail/info-prove-realname.png" /></view>
          <view class="prove-item"><image style="width: 100%; height: 100%;" mode="aspectFill" src="../static/detail/info-prove-face.png" /></view>
        </view>
        <!-- 保障认证 -->
        <view v-if="lawyerDetail.is_guarantee" class="safe-prove-wrap" @click="isShowSafeProvePopup = true">
          <view class="safe-prove-text" style="color: #0085FF;">服务保障（已开通）</view>
          <view class="ver-divider" />
          <image class="safe-prove-img" mode="aspectFill" src="../static/detail/safe-prove-active.png" />
          <view class="safe-prove-text" style="color: #0085FF;">诚信保障计划</view>
          <image class="safe-prove-img" mode="aspectFill" src="../static/detail/safe-prove-active.png" />
          <view class="safe-prove-text" style="color: #0085FF;">担保交易</view>
        </view>

        <view v-else class="safe-prove-wrap" @click="isShowSafeProvePopup = true">
          <view class="safe-prove-text">服务保障（未开通）</view>
          <view class="ver-divider" />
          <image class="safe-prove-img" mode="aspectFill" src="../static/detail/safe-prove-inactive.png" />
          <view class="safe-prove-text">诚信保障计划</view>
          <image class="safe-prove-img" mode="aspectFill" src="../static/detail/safe-prove-inactive.png" />
          <view class="safe-prove-text">担保交易</view>
        </view>
      </view>
    </view>

    <view class="divider-hor" />

    <!-- 内容 -->
    <view class="content-module">
      <!-- 档案信息 -->
      <view class="base-wrap archives-wrap">
        <view class="title-wrap"><view class="title-left">律师档案</view></view>
        <view class="archives-item-wrap">
          <!-- 专业领域 -->
          <view v-if="lawyerDetail.lawyer_tags && lawyerDetail.lawyer_tags.length" class="archives-item">
            <view class="archives-left">专业领域：</view>
            <view class="archives-right tag-right-wrap">
              <view v-for="(tItem, tIndex) in lawyerDetail.lawyer_tags.slice(0, 3)" :key="tIndex" class="tag-item">{{ tItem }}</view>
            </view>
          </view>
          <!-- 执业证号 -->
          <view class="archives-item">
            <view class="archives-left">执业证号：</view>
            <view class="archives-right">
              <view>{{ lawyerDetail.license_number }}</view>
            </view>
          </view>
          <!-- 律所地址 -->
          <view v-if="lawyerDetail.lawyer_office_point.address" class="archives-item">
            <view class="archives-left">办公地址：</view>
            <view class="archives-right loc-right-wrap" @click="openMapLocation">
              <view>{{ lawyerDetail.lawyer_office_point.address || '暂无地址' }}</view>
              <image v-if="lawyerDetail.lawyer_office_point && lawyerDetail.lawyer_office_point.lat && lawyerDetail.lawyer_office_point.lng" class="locnav-img" mode="aspectFill" src="@/static/lawyer/location-nav.png" />
            </view>
          </view>
          <!-- 律师介绍 -->
          <view v-if="lawyerDetail.introduction" class="archives-item">
            <view class="archives-left">律师简介：</view>
            <view class="archives-right intro-right-wrap">
              <view class="intro-wrap">
                <text>{{ isShowMoreLawyerIntro ? (lawyerDetail.introduction || '暂无简介') : sliceLawyerIntro }}</text>
                <text v-if="sliceLawyerIntro" class="more-btn" @click="isShowMoreLawyerIntro = !isShowMoreLawyerIntro">{{ isShowMoreLawyerIntro ? '收起' : '显示全部' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 荣誉墙 -->
      <template v-if="lawyerDetail.honor_certificates.length">
        <view class="divider-hor" />
        <view class="base-wrap honor-wrap">
          <view class="title-wrap"><view class="title-left">荣誉墙</view></view>
          <scroll-view class="scroll-x honor-scroll-x" scroll-x enhanced :show-scrollbar="false">
            <view v-for="(hItem, hIndex) in lawyerDetail.honor_certificates" :key="hIndex" class="scroll-x-item">
              <view class="honor-item-wrap" @click="$commonUtil.previewImg(lawyerDetail.honor_certificates, hItem.image, 'image')">
                <u-lazy-load img-mode="aspectFill" height="180" border-radius="16" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="hItem.image" />
              </view>
            </view>
          </scroll-view>
        </view>
      </template>

      <!-- 律师动态 -->
      <template v-if="lawyerDynamicList.length">
        <view class="divider-hor" />
        <view class="base-wrap dynamic-wrap">
          <view class="title-wrap">
            <view class="title-left">律师动态</view>
            <!-- <view class="title-right" @click="$commonUtil.routeNavTo('module-lawyer/lawyer-strict-list/lawyer-strict-list')">
              <text>更多</text>
              <image class="arrow-left-img" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
            </view> -->
          </view>

          <view class="dynamic-item-list">
            <view v-for="(dItem, dIndex) in lawyerDynamicList" :key="dIndex" class="dynamic-item">
              <view class="dynamic-top">
                <view class="dynamic-top-left">
                  <u-lazy-load img-mode="aspectFill" height="60" border-radius="10" :loading-img="qiyeLoadImg400" :error-img="qiyeLoadImg400" :image="dItem.avatar" />
                </view>
                <view class="dynamic-top-right">
                  <view class="dynamic-lawyer">
                    <view class="lawyer-name">{{ dItem.nickname }}</view>
                    <view class="dynamic-time">{{ dItem.created_at2 }}</view>
                  </view>
                  <view class="dynamic-content">
                    <text>{{ dItem.question_comment }}</text>
                  </view>
                </view>
              </view>
              <view class="dynamic-bottom">
                <view class="dynamic-tag">原贴</view>
                <view class="dynamic-raw">#{{ dItem.lawyer_tag_id }}#{{ dItem.question_title }}</view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- 全部评价 -->
      <template v-if="lawyerEvaluateList.length">
        <view class="divider-hor" />
        <view class="base-wrap comment-wrap">
          <view class="title-wrap"><view class="title-left">全部评价（{{ lawyerDetail.praise_number }}）</view></view>
          <view class="comment-item-wrap">
            <view v-for="(eItem) in lawyerEvaluateList" :key="eItem.order_no" class="comment-item">
              <view class="comment-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="60" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="eItem.avatar" />
                </view>
              </view>
              <view class="comment-right">
                <view class="comment-header">
                  <view class="header-left">
                    <view class="user-name">{{ eItem.nickname }}</view>
                    <view class="user-rate">
                      <u-rate :current="eItem.evaluate_score | formatStar" :count="5" :disabled="true" size="20" gutter="4" active-icon="star-fill" inactive-icon="star-fill" active-color="#FFC324" inactive-color="#dadada" />
                    </view>
                  </view>
                  <view class="header-right">{{ eItem.created_at }}</view>
                </view>
                <view class="comment-content">
                  <text>{{ eItem.evaluate }}</text>
                </view>
                <view v-if="eItem.order_evaluate_reasons.length" class="comment-tag-wrap">
                  <view v-for="(tItem, tIndex) in eItem.order_evaluate_reasons" :key="tIndex" class="comment-tag-item">{{ tItem }}</view>
                </view>
                <!-- <view class="comment-type">#{{ eItem.order_type_chinese }}#</view> -->
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 按钮组 -->
    <view class="bottom-btns" :style="{ paddingBottom: (safeAreaHeight || 10) + 'px' }">
      <view class="bottom-btn" @click="contactLawyer">
        <image class="icon-img" mode="aspectFill" src="@/static/lawyer/lawyer-msg-f.png" />
        <text>联系律师</text>
      </view>
      <view class="bottom-btn" @click="navToVipPayDetail">
        <image class="icon-img" mode="aspectFill" src="@/static/lawyer/lawyer-vip-f.png" />
        <text>企业专享</text>
      </view>
    </view>

    <!-- 保障认证 popup -->
    <u-popup v-model="isShowSafeProvePopup" mode="bottom" border-radius="30" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-safeprove-box" @click.stop="$commonUtil.stopPropagation">
        <view class="safeprove-header">
          <text>该律师</text>
          <text style="color: #FE5F48;">{{ lawyerDetail.is_guarantee ? '已加入平台保障' : '未加入平台保障' }}</text>
        </view>
        <view class="safeprove-item">
          <view class="safeprove-item-title">
            <image class="icon-safeprove" mode="aspectFill" src="../static/detail/icon-integrity-safe.png" />
            <text>诚信保障计划</text>
          </view>
          <view class="safeprove-item-content" style="margin-bottom: 18rpx;">
            通过“企业律云”与平台认证律师建立联系，后续产生任何法律服务交易<text style="color: #FE5F48;">（不限于平台内或线下支付）</text>，经公司法局、律协认定违规，平台将先行赔付已付律师费。
          </view>
          <view class="safeprove-item-content" style="margin-bottom: 40rpx;">
            仅限已加入<text style="color: #FE5F48;">诚信保障计划</text>的律师，赔付上限不超过该服务律师缴纳的保证金
          </view>
        </view>
        <view class="safeprove-item">
          <view class="safeprove-item-title">
            <image class="icon-safeprove" mode="aspectFill" src="../static/detail/icon-status-safe.png" />
            <text>资质担保</text>
          </view>
          <view class="safeprove-item-content">
            企业律云承诺所有服务律师均通过严格的审查机制
          </view>
        </view>
        <view class="know-btn" @click="isShowSafeProvePopup = false">我知道了</view>
      </view>
    </u-popup>

    <button id="shareBtnId" open-type="share" style="display: none;" />

    <!-- 下载app popup -->
    <download-app-popup ref="downloadAppRef" />
    <!-- 客服 vip popup -->
    <kefu-vip-popup ref="kefuVipPopupRef" />
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LawyerDetail',
  filters: {
    // 格式化评分星星
    formatStar(star) {
      let _star = 2;
      (star === 1) && (_star = 5);
      (star === 2) && (_star = 3);
      (star === 3) && (_star = 1);

      return _star;
    },
  },
  data() {
    return {
      qiyeLoadImg400: this.$store.state.qiyeLoadImg400,
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,
      safeAreaHeight: this.$store.state.safeAreaHeight,

      uNavBarImmersive: false, // 导航栏是否开启沉浸式
      uNavbarHeight: 0, // 顶部导航栏高度 px
      headerInfoNodeTop: 0, // .header-info-wrap top px
      isChangeUNavBarStyle: false, // 是否改变顶部导航栏样式

      lawyerId: '', // 律师 id
      lawyerDetail: {}, // 律师详情
      sliceLawyerIntro: '', // 律师介绍简段介绍
      isShowMoreLawyerIntro: true, // 是否显示更多律师介绍

      lawyerDynamicList: [], // 律师动态列表
      lawyerEvaluateList: [], // 律师好评列表

      isShowSafeProvePopup: false, // 是否打开保障认证 popup
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.lawyerId) {
      this.lawyerId = routeParam.lawyerId;
      this._getLawyerDetail();
      this._getLawyerDynamicList();
      this._getLawyerEvaluateList();
    }
  },
  onPullDownRefresh() {
    this._getLawyerDetail();
  },
  mounted() {
    this.$commonUtil.calcUNavNodeHeight().then(res => { this.uNavbarHeight = res; this.uNavBarImmersive = true; });

    // header头部节点 top
    const uNavbarNodeRef = uni.createSelectorQuery().select('.header-info-wrap');
    uNavbarNodeRef.boundingClientRect(rect => {
      this.headerInfoNodeTop = rect.top;
    }).exec();
  },
  onPageScroll(res) {
    const { scrollTop } = res;
    const { headerInfoNodeTop, uNavbarHeight } = this;
    // 滚动 scrollTop 大于 uNavbarHeight
    if (scrollTop >= (headerInfoNodeTop - uNavbarHeight - uNavbarHeight)) {
      this.isChangeUNavBarStyle = true;

      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
        animation: { duration: 400, timingFunc: 'easeIn' }
      });
    } else {
      this.isChangeUNavBarStyle = false;

      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
        animation: { duration: 400, timingFunc: 'easeIn' }
      });
    }
  },
  onShareAppMessage() {
    const { lawyerDetail } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();
    return {
      title: lawyerDetail.share.title,
      path: `${ currentRoute }?lawyerId=${ this.lawyerId }`,
      imageUrl: lawyerDetail.share.wechat_mini_program.cover_image
    };
  },
  methods: {
    /**
     * 获取律师详情
     */
    async _getLawyerDetail() {
      if (!this.lawyerId) return;
      const { lawyerId } = this;
      uni.showLoading({ title: '', mask: true });

      try {
        const { data: lawyerDetailData } = await this.$api.getLawyerDetail({ user_id: lawyerId });
        this.lawyerDetail = lawyerDetailData;

        // 律师简介长度判断
        if (this.lawyerDetail.introduction && this.lawyerDetail.introduction.length > 74) {
          this.sliceLawyerIntro = this.lawyerDetail.introduction.substr(0, 74) + '...';
          this.isShowMoreLawyerIntro = false;
        }
        uni.stopPullDownRefresh();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取律师动态列表
     */
    async _getLawyerDynamicList() {
      if (!this.lawyerId) return;
      const { lawyerId } = this;

      try {
        const { data: lawyerDynamicData } = await this.$api.getLawyerDynamicList({ user_id: lawyerId, page: 1 });
        this.lawyerDynamicList = lawyerDynamicData.data.slice(0, 3);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取律师好评列表
     */
    async _getLawyerEvaluateList() {
      if (!this.lawyerId) return;
      const { lawyerId } = this;

      try {
        const { data: lawyerEvaluateData } = await this.$api.getLawyerEvaluateList({ user_id: lawyerId });
        this.lawyerEvaluateList = lawyerEvaluateData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开地图查看位置
     */
    openMapLocation() {
      if (!this.lawyerDetail.lawyer_office_point.lat && !this.lawyerDetail.lawyer_office_point.lng) return;
      const latitude = Number(this.lawyerDetail.lawyer_office_point.lat);
      const longitude = Number(this.lawyerDetail.lawyer_office_point.lng);

      if (latitude <= 0 || longitude <= 0) return;
      const address = this.lawyerDetail.lawyer_office_point.address || '';
      uni.openLocation({ latitude, longitude, address });
    },
    /**
     * 联系律师
     */
    contactLawyer() {
      if (!this.userInfo || this.userInfo.enterprise_vip_expired_at) return this.$refs.downloadAppRef.openDowloadAppPopup();
      this.$refs.kefuVipPopupRef.openKefuPopup();
    },
    /**
     * 进入vip购买详情页面
     */
    navToVipPayDetail() {
      this.$commonUtil.routeNavTo('module-common/vip-pay-detail/vip-pay-detail');
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
