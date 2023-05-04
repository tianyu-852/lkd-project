<template>
  <view>
    <u-navbar :is-back="false" :border-bottom="false" title="委托详情" title-color="#fff" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- banner -->
    <view class="header-momdule">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="../static/order/order-detail-banner.png" />
      <view class="header-content">
        <view class="content-left">
          <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="demandOrderDetail.user.avatar" />
        </view>
        <view class="content-right">
          <view class="creator-info">
            <text class="creator">{{ demandOrderDetail.user.nickname }}</text>
            <view v-if="demandOrderDetail.user.is_enterprise_auth" class="prove-tag">已认证</view>
          </view>
          <view class="creator-label">委托人</view>
        </view>
      </view>
    </view>
    <view class="content-module">
      <scroll-view class="scroll-y content-scroll-y" scroll-y enhanced scroll-with-animation :show-scrollbar="false">
        <view class="order-detail">
          <!-- 需求类型 -->
          <view v-if="demandOrderDetail.demand_type" class="detail-item">
            <view class="detail-left">需求类型</view>
            <view class="detail-right">{{ demandOrderDetail.demand_type }}</view>
          </view>
          <!-- 案源类型 -->
          <view v-if="demandOrderDetail.lawyer_tag" class="detail-item">
            <view class="detail-left">案源类型</view>
            <view class="detail-right">{{ demandOrderDetail.lawyer_tag }}</view>
          </view>
          <!-- 律师地域 -->
          <view v-if="demandOrderDetail.lawyer_area" class="detail-item">
            <view class="detail-left">律师地域</view>
            <view class="detail-right">{{ demandOrderDetail.lawyer_area }}</view>
          </view>
          <!-- 期望报价 -->
          <view v-if="demandOrderDetail.price && demandOrderDetail.price.value" class="detail-item">
            <view class="detail-left">期望报价</view>
            <view class="detail-right" style="color: #FE5F48;">{{ demandOrderDetail.price.value }}</view>
          </view>
          <!-- 发布时间 -->
          <view v-if="demandOrderDetail.created_at" class="detail-item">
            <view class="detail-left">发布时间</view>
            <view class="detail-right">{{ demandOrderDetail.created_at }}</view>
          </view>
          <!-- 需求说明 -->
          <view v-if="demandOrderDetail.content" class="detail-item">
            <view class="detail-left">需求说明</view>
            <view class="detail-right">{{ demandOrderDetail.content }}</view>
          </view>
        </view>

        <!-- 竞标详情 -->
        <view v-if="demandOrderDetail.is_join_success || demandOrderBidList.length" class="bid-detail">
          <!-- 确认合作律师 -->
          <template v-if="demandOrderDetail.is_join_success">
            <view class="bid-title">确认合作律师</view>
            <view class="lawyer-wrap" style="margin-bottom: 60rpx;">
              <view class="lawyer-item" @click="navToLawyerDetail(demandOrderDetail.is_join_success.user.user_id)">
                <view class="lawyer-left">
                  <view class="lawyer-avatar">
                    <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="demandOrderDetail.is_join_success.user.avatar" />
                  </view>
                  <image v-if="demandOrderDetail.is_join_success.is_guarantee" class="badge-img" mode="aspectFill" src="@/static/common/approve-badge-active.png" />
                </view>
                <view class="lawyer-middle">
                  <view class="lawyer-info">
                    <view class="lawyer-name">{{ demandOrderDetail.is_join_success.user.nickname }}</view>
                    <image class="icon-arrow-right" mode="aspectFill" src="@/static/index/icon-arrowRight-b.png" />
                    <view class="lawyer-tag">执业{{ demandOrderDetail.is_join_success.user.work_year }}年</view>
                  </view>
                  <view v-if="demandOrderDetail.is_join_success.user.lawyer_tags && demandOrderDetail.is_join_success.user.lawyer_tags.length" class="lawyer-skill">
                    <text>擅长：</text>
                    <text v-for="(tItem, tIndex) in demandOrderDetail.is_join_success.user.lawyer_tags" :key="tIndex" class="skill-item">{{ tItem }}</text>
                  </view>
                </view>
                <view class="lawyer-right">¥{{ demandOrderDetail.is_join_success.price }}</view>
              </view>
            </view>
          </template>

          <!-- 律师报价 -->
          <template v-if="demandOrderBidList.length">
            <view class="bid-title">律师报价</view>
            <view class="lawyer-wrap">
              <view v-for="(oItem, oIndex) in demandOrderBidList" :key="oIndex" class="lawyer-item">
                <view class="lawyer-left">
                  <view class="lawyer-avatar">
                    <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="oItem.user.avatar" />
                  </view>
                  <image v-if="oItem.user.is_guarantee" class="badge-img" mode="aspectFill" src="@/static/common/approve-badge-active.png" />
                </view>
                <view class="lawyer-middle">
                  <view class="lawyer-info">
                    <view class="lawyer-name">{{ oItem.user.nickname }}</view>
                    <view class="lawyer-tag">执业{{ oItem.user.work_year }}年</view>
                  </view>
                  <view v-if="oItem.user.lawyer_tags.length" class="lawyer-skill">
                    <text>擅长：</text>
                    <text v-for="(tItem, tIndex) in oItem.user.lawyer_tags" :key="tIndex" class="skill-item">{{ tItem }}</text>
                  </view>
                </view>
                <view class="lawyer-right">¥{{ oItem.price }}</view>
              </view>
            </view>
          </template>
        </view>
        <view style="height: 30rpx; background: #fff;" />
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,

      demandOrderId: '', // 需求订单 id
      demandOrderDetail: {}, // 需求订单详情
      demandOrderBidList: [], // 需求订单竞价列表
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.demandOrderId) {
      this.demandOrderId = routeParam.demandOrderId;
      this._getOrderDetail();
      this._getServerOrderBidList();
    }
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title: `一站式企业法律服务中心`,
      path: `${ currentRoute }?demandOrderId=${ this.demandOrderId }`,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  methods: {
    /**
     * 获取订单详情
     */
    async _getOrderDetail() {
      if (!this.demandOrderId) return;
      const { demandOrderId } = this;
      uni.showLoading({ title: '', mask: true });

      try {
        const { data: demandOrderDetail } = await this.$api.getServerOrderDetail({ demand_id: demandOrderId });
        this.demandOrderDetail = demandOrderDetail;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取订单竞价列表
     */
    async _getServerOrderBidList() {
      if (!this.demandOrderId) return;
      const { demandOrderId } = this;

      try {
        const { data: demandOrderBidData } = await this.$api.getServerOrderBidList({ demand_id: demandOrderId });
        this.demandOrderBidList = demandOrderBidData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 进入律师详情页面
     */
    navToLawyerDetail(lawyerId) {
      if (!lawyerId) return;
      this.isShowEvaluatePopup = false;
      this.$commonUtil.routeNavTo('module-lawyer/lawyer-detail/lawyer-detail', { lawyerId });
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
