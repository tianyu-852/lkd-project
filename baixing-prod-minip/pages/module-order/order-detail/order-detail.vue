<template>
  <view>
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" :title="orderDetail.demand_type" :title-size="36" title-color="#fff" title-bold immersive :background="{ backgroundColor: '#0085FF' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <view class="header-module">
      <view class="content-wrap">
        <view class="usre-avatar">
          <u-lazy-load img-mode="aspectFill" height="100" border-radius="14" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="orderDetail.user.avatar" />
        </view>
        <view>{{ orderDetail.user.nickname }}</view>
      </view>
    </view>

    <view class="content-module">
      <!-- 发布平台 -->
      <view class="detail-item">
        <view class="detail-left">发布平台</view>
        <view class="detail-right">
          <text>{{ orderDetail.source_type_chinese }}</text>
        </view>
      </view>
      <!-- 案件类型 -->
      <view class="detail-item">
        <view class="detail-left">案件类型</view>
        <view class="detail-right">
          <text>{{ orderDetail.lawyer_tag }}</text>
        </view>
      </view>
      <!-- 律师地域 -->
      <view class="detail-item">
        <view class="detail-left">律师地域</view>
        <view class="detail-right">
          <text>{{ orderDetail.lawyer_area }}</text>
        </view>
      </view>
      <!-- 标的额 -->
      <view v-if="orderDetail.case_money" class="detail-item">
        <view class="detail-left">标的额</view>
        <view class="detail-right">
          <text>￥{{ orderDetail.case_money }}</text>
        </view>
      </view>
      <!-- 律师费 -->
      <view v-if="orderDetail.budget" class="detail-item">
        <view class="detail-left">律师费</view>
        <view class="detail-right">
          <text>￥{{ orderDetail.budget }}</text>
        </view>
      </view>
      <!-- 发布时间 -->
      <view class="detail-item">
        <view class="detail-left">发布时间</view>
        <view class="detail-right">
          <text>{{ orderDetail.created_at }}</text>
        </view>
      </view>
      <!-- 需求说明 -->
      <view v-if="orderDetail.content" class="detail-item">
        <view class="detail-left">需求说明</view>
        <view class="detail-right">
          <text>{{ orderDetail.content }}</text>
        </view>
      </view>
      <!-- 相关图片 -->
      <view v-if="orderDetail.related_images && orderDetail.related_images.length" class="detail-item">
        <view class="detail-left">相关图片</view>
        <view class="detail-right">
          <view class="detail-img-wrap">
            <view v-for="(iItem, iIndex) in orderDetail.related_images" :key="iIndex" class="detail-img" @click="$commonUtil.previewImg(orderDetail.related_images, iItem)">
              <u-lazy-load img-mode="aspectFill" height="140" border-radius="16" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="iItem" />
            </view>
          </view>
        </view>
      </view>
      <!-- 相关文件 -->
      <view v-if="orderDetail.related_cloud_files && orderDetail.related_cloud_files.length" class="detail-item">
        <view class="detail-left">相关文件</view>
        <view class="detail-right">
          <view class="detail-file-wrap">
            <view v-for="(fItem, fIndex) in orderDetail.related_cloud_files" :key="fIndex" class="file-item">
              <image class="file-img" mode="aspectFill" src="../static/file-bg.png" />
              <view class="file-name">{{ fItem.file_name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="divide-line" />

    <view class="lawyer-module">
      <view class="lawyer-title">律师报价</view>

      <view v-for="(lItem, lIndex) in orderCompeteLawyerList" :key="lIndex" class="lawyer-item">
        <view class="lawyer-info">
          <image class="lawyer-avatar" mode="aspectFill" :src="lItem.user.avatar" />
          <view class="lawyer-baseinfo">
            <view class="lawyer-nickname-wrap">
              <view class="lawyer-nickname">{{ lItem.user.nickname }}</view>
              <view class="lawyer-year">执业{{ lItem.user.work_year }}年</view>
            </view>
            <view v-if="lItem.user.lawyer_tags.length" class="lawyer-skill-wrap">
              <text>擅长：</text>
              <text v-for="(sItem, sIndex) in lItem.user.lawyer_tags" :key="sIndex" class="lawyer-skill-item">{{ sItem }}</text>
            </view>
          </view>
          <view class="lawyer-price">￥{{ lItem.price }}</view>
        </view>
        <view v-if="lItem.content" class="lawyer-content">{{ lItem.content }}</view>
      </view>
    </view>

    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="pay-btn" @click="navToOrderCreatePage">
        <image class="icon-weituo" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202334-1677899953417-zck1yM.png" />
        <text>委托打官司</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,

      demandId: '', // 订单 id
      orderDetail: {}, // 订单详情
      orderCompeteLawyerList: [], // 订单竞争律师列表
    }
  },
  computed: {
    ...mapGetters('userModule', ['userId']),
    ...mapGetters(['sysSafeAreaHeight']),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.demandId) this.demandId = routeParam.demandId;

    this._getCauseSourceOrderDetail();
    this._getCauseSourceOrderCompeteLawyerList();
  },
  methods: {
    /**
     * 获取订单详情
     */
    async _getCauseSourceOrderDetail() {
      if (!this.demandId) return;
      uni.showLoading({ title: '加载中', mask: true });
      const param = { demand_id: this.demandId }

      try {
        const { data: orderDetailData } = await this.$api.getCauseSourceOrderDetailApi(param);
        this.orderDetail = orderDetailData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取案源订单竞争律师
     */
    async _getCauseSourceOrderCompeteLawyerList() {
      if (!this.demandId) return;
      const param = { demand_id: this.demandId }

      try {
        const { data: orderCompeteData } = await this.$api.getCauseSourceOrderCompeteLawyerListApi(param);
        this.orderCompeteLawyerList = orderCompeteData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 前往订单发布页面
     */
    navToOrderCreatePage() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$commonUtil.routeNavTo('module-order/order-create/order-create', { activePTypeIndex: 2 });
		},
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
