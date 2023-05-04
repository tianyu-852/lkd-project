<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false">
      <view class="navbar-slot logo-navbar-slot">
        <image class="logo-img" mode="aspectFill" src="@/static/index/qiye-logo.png" />
        <view class="divider-ver" />
        <text class="explain">一站式企业法律中心</text>
      </view>
    </u-navbar>

    <!-- 头部信息 -->
    <view class="header-module">
      <!-- banner -->
      <view v-if="true" class="swiper-wrap">
        <swiper class="swiper" easing-function="easeOutCubic" autoplay circular @change="bannerSwiperChange">
          <swiper-item v-for="bItem in bannerList" :key="bItem.id" class="swiper-item">
            <image class="swiper-img" mode="aspectFill" :src="bItem.banner" @click="clickBanner" />
          </swiper-item>
        </swiper>
        <!-- swiper 指示器 -->
        <view class="swiper-indicator">
          <view v-for="(iItem, index) in bannerList.length" :key="index" class="indicator-item" :class="[ bSwiperActiveIndex === index ? 'indicator-item-active' : '' ]" />
        </view>
      </view>

      <!-- 数据信息 -->
      <view class="data-wrap">
        <view class="data-item">
          <view class="data-num">100000+</view>
          <view class="data-title">客户</view>
          <view class="data-desc">个人、企事业单位</view>
        </view>
        <view class="data-item">
          <view class="data-num">20000+</view>
          <view class="data-title">案件</view>
          <view class="data-desc">大数据匹配律师</view>
        </view>
        <view class="data-item">
          <view class="data-num">8000+</view>
          <view class="data-title">律师</view>
          <view class="data-desc">专业服务 有保障</view>
        </view>
        <view class="data-item">
          <view class="data-num">33个</view>
          <view class="data-title">省份</view>
          <view class="data-desc">已覆盖全国</view>
        </view>
      </view>
    </view>

    <!-- 动态 -->
    <view class="dynamic-module">
      <view class="dynamic-server">
        <image class="server-bgImg" mode="aspectFill" src="@/static/index/server-bgImg.png" />
        <view class="server-data">
          <view class="server-num">{{ serverOrderNum }}</view>
          <view class="server-text">累计服务次数</view>
        </view>
      </view>
      <swiper class="dynamic-swiper" vertical autoplay easing-function="easeOutCubic" circular @change="bannerSwiperChange">
        <swiper-item v-for="(dItemlist, dIndex) in todayDynamicList" :key="dIndex" class="swiper-item">
          <view v-for="(dItem, dIdx) in dItemlist" :key="dIdx" class="dynamic-item" @click="clickDynamicItem(dItem)">
            <!-- <view class="gray-dot" /> -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <view class="dynamic-content" v-html="dItem.title" />
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 严选律师 -->
    <view class="strict-module">
      <view class="title-wrap">
        <view class="title-left">严选律师</view>
        <view class="title-right" @click="$commonUtil.routeNavTo('module-lawyer/lawyer-strict-list/lawyer-strict-list')">
          <template v-if="userInfo.address && userInfo.address.city">
            <image class="location-img" mode="aspectFill" src="@/static/common/location-active.png" />
            <text>{{ userInfo.address.city }}</text>
          </template>
          <image class="arrow-left-img" mode="aspectFill" src="@/static/index/icon-arrowRight-b.png" />
        </view>
      </view>

      <scroll-view class="scroll-x strict-scroll-x" scroll-x enhanced :show-scrollbar="false" :scroll-into-view="scrollXIntoViewId" lower-threshold="10" @scrolltolower="strictSelectScrollToLowerEvt">
        <view v-for="(sItemList, index) in strictSelectLawyerList" :id="'s-' + index" :key="index" class="scroll-x-item">
          <view class="strict-item-wrap">
            <view v-for="(sItem, idx) in sItemList" :key="idx" class="strict-item" @click="$commonUtil.routeNavTo('module-lawyer/lawyer-detail/lawyer-detail', { lawyerId: sItem.user_id });">
              <view class="lawyer-avatar">
                <u-lazy-load img-mode="aspectFill" height="160" border-radius="20" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="sItem.avatar" />
                <view class="work-year">执业{{ sItem.work_year }}年</view>
              </view>
              <view class="lawyer-info-wrap">
                <view class="lawyer-name-wrap">
                  <text>{{ sItem.nickname }}</text>
                  <image v-if="sItem.is_guarantee" class="badge-img" mode="aspectFill" src="@/static/common/approve-badge-active.png" />
                </view>
                <view class="lawyer-loc">
                  <text style="margin-right: 8rpx;">{{ sItem.province }}</text>
                  <text>{{ sItem.city }}</text>
                </view>
                <view class="lawyer-evaluate">
                  <text>好评</text>
                  <text style="color: #666; margin: 0 8rpx;">{{ sItem.praise_number }}</text>
                  <text>次</text>
                </view>
                <view class="lawyer-server">
                  <text>已服务</text>
                  <text style="color: #666; margin: 0 8rpx;">{{ sItem.enterprise_number }}</text>
                  <text>家企业</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="strictSelectLawyerList.length" class="scroll-x-item scroll-more-btnWrap">
          <view class="scroll-more-btn" @click="$commonUtil.routeNavTo('module-lawyer/lawyer-strict-list/lawyer-strict-list')">
            <image class="icon-arrow-right" mode="aspectFill" src="@/static/index/scroll-x-arrowRight.png" />
            <image class="icon-arrow-more" mode="aspectFill" src="@/static/index/scroll-x-more.png" />
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 导航模块 -->
    <view class="nav-module" :style="{ top: uNavbarHeight + 'px' }">
      <view class="nav-wrap">
        <view class="nav-item" :class="{ 'nav-item-active': navActiveIndex === 0 }" @click="changeNav(0)">
          <text>{{ selectedServerOrderTypeInfo.enterprise_demand_type || '综合服务' }}</text>
          <image v-if="navActiveIndex === 0" class="icon-sort" mode="aspectFill" src="@/static/index/order-sort-active.png" />
          <image v-else class="icon-sort" mode="aspectFill" src="@/static/index/order-sort-inactive.png" />
        </view>
        <view class="nav-div" />
        <view class="nav-item" :class="{ 'nav-item-active': navActiveIndex === 1 }" @click="changeNav(1)">企业普法</view>
      </view>
    </view>

    <!-- 综合排序类型选择器 -->
    <u-select v-model="isShowOrderTypeSelect" :list="serverOrderTypeList" label-name="enterprise_demand_type" value-name="enterprise_demand_type_id" :default-value="[0]" confirm-color="#0085FF" safe-area-inset-bottom @confirm="confirmServerOrderTypeSelect" />

    <!-- 服务中心 -->
    <!-- <scroll-view v-show="navActiveIndex === 0" class="scroll-y server-order-module" :style="{ height: (windowHeight - uNavbarHeight - navModuleHeight) + 'px' }" :scroll-y="navContentScrollY" scroll-with-animation enhanced :show-scrollbar="false" upper-threshold="0" @scrolltoupper="navContentScrollY = false" @scrolltolower="serverOrderScrollToLowerEvt"> -->
    <view v-show="navActiveIndex === 0" class="server-order-module" :style="{ minHeight: (windowHeight - uNavbarHeight - navModuleHeight) + 'px' }">
      <view class="server-order-wrap">
        <view v-for="(sItem, sIndex) in serverOrderList" :key="sIndex" class="server-order-item">
          <view class="server-order-box" @click="navToOrderDetail(sItem.process_type, sItem.demand_id)">
            <view class="server-header">
              <view class="user-avatar">
                <u-lazy-load img-mode="aspectFill" height="64" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="sItem.user.avatar" />
                <image v-if="sItem.user.enterprise_vip_level_icon" class="vip-badge" mode="aspectFill" :src="sItem.user.enterprise_vip_level_icon" />
              </view>
              <view class="user-info">
                <view class="user-name">{{ sItem.user.nickname }}</view>
                <view class="user-time">{{ sItem.created_at }}</view>
              </view>
              <!-- 订单状态 -->
              <view v-if="sItem.status === 30 || sItem.status === 40 || sItem.status === 90 || sItem.status === 93" class="order-status">已结束</view>
              <view v-else class="order-status order-status-active">{{ sItem.process_type ? '报名中' : '服务中' }}</view>
            </view>

            <view class="order-info">
              <view class="order-demand">{{ sItem.demand_type }}({{ sItem.num }}份)</view>
              <view class="vip-price">{{ sItem.process_type ? sItem.price.value : '会员免费' }}</view>
            </view>

            <view class="order-type">
              <text>案件类型：</text>
              <text class="type-value">{{ sItem.lawyer_tag }}</text>
            </view>

            <view v-if="sItem.process_type" class="order-type">
              <text>律师地域：</text>
              <text class="type-value">{{ sItem.lawyer_area }}</text>
            </view>

            <view class="order-status-info">
              <view v-if="sItem.status === 23 && sItem.countDownTimestamp > 0" class="give-count-down">
                <text>交付倒计时：</text>
                <q-count-down :timestamp="sItem.countDownTimestamp" :show-days="sItem.is_enterprise_risk ? true : false" separator="zh" font-size="30" color="#FE5F48" separator-color="#FE5F48" />
              </view>
              <!-- (sItem.status === 30 || sItem.order_status === 40 || sItem.order_status === 90 || sItem.order_status === 93) &&  -->
              <view v-else-if="sItem.countDownTimestamp > 0" class="give-finish">
                <image class="timeline-img" mode="aspectFill" src="@/static/index/server-order-timeline.png" />
                <view class="give-step-wrap">
                  <view class="give-step">律师已交付</view>
                  <view class="give-step">
                    <text>服务总时长：</text>
                    <q-count-down :timestamp="sItem.countDownTimestamp" :show-days="sItem.is_enterprise_risk ? true : false" separator="zh" :autoplay="false" font-size="30" color="#FE5F48" separator-color="#FE5F48" />
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 匹配律师列表 -->
          <view v-if="sItem.process_type" class="server-order-lawyer" @click="navToOrderDetail(sItem.process_type, sItem.demand_id)">
            <template v-if="sItem.offer_num">
              <view class="lawyer-left">
                <view v-for="(lItem, lIndex) in sItem.offer_lawyer_info" :key="lIndex" class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="lItem.avatar" />
                </view>
                <view class="lawyer-name">已匹配{{ sItem.offer_num }}位律师</view>
              </view>
              <view class="lawyer-right">
                <text>查看详情</text>
                <image class="icon-arrow-right" mode="aspectFill" src="@/static/index/icon-arrowRight-b.png" />
              </view>
            </template>

            <template v-else>
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="'/static/index/server-order-defAvatar.png'" />
                </view>
                <view class="lawyer-name">等待匹配律师…</view>
              </view>
              <view class="lawyer-right">
                <text>查看详情</text>
                <image class="icon-arrow-right" mode="aspectFill" src="@/static/index/icon-arrowRight-b.png" />
              </view>
            </template>
          </view>
          <!-- 匹配律师 -->
          <view v-else class="server-order-lawyer" @click="navToLawyerDetail(sItem.lawyer.user_id)">
            <template v-if="sItem.lawyer.user_id">
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="sItem.lawyer.avatar" />
                </view>
                <view class="lawyer-name">{{ sItem.lawyer.nickname }}</view>
              </view>
              <view class="lawyer-right">
                <text>查看律师详情</text>
                <image class="icon-arrow-right" mode="aspectFill" src="@/static/index/icon-arrowRight-b.png" />
              </view>
            </template>

            <template v-else>
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="'/static/index/server-order-defAvatar.png'" />
                </view>
                <view class="lawyer-name">正在匹配律师中…</view>
              </view>
            </template>
          </view>
        </view>
      </view>

      <!-- 空数据 -->
      <view v-if="!serverOrderList.length" class="empty-wrap">
        <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="@/static/common/empty-data.png" />
        <view class="null-text">暂无订单数据</view>
        <view class="null-btn" @click="refreshServerOrderList">刷新一下</view>
      </view>
    </view>
    <!-- </scroll-view> -->

    <!-- 企业普法 -->
    <!-- <scroll-view v-show="navActiveIndex === 1" class="scroll-y popularize-module" :style="{ height: (windowHeight - uNavbarHeight - navModuleHeight + subFilterWrapHeight) + 'px' }" :scroll-y="navContentScrollY" scroll-with-animation enhanced :show-scrollbar="false" upper-threshold="0" @scrolltoupper="navContentScrollY = false" @scrolltolower="popLawScrollToLowerEvt"> -->
    <view v-show="navActiveIndex === 1" class="popularize-module">
      <view class="popularize-wrap">
        <view v-for="(pItem, pIndex) in popLawKnowledgeList" :key="pIndex" class="popularize-item">
          <view class="popularize-header">
            <view class="user-avatar">
              <u-lazy-load img-mode="aspectFill" height="60" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="pItem.user.avatar" />
            </view>
            <view class="user-name">{{ pItem.user.nickname }}</view>
            <view class="popularize-read">{{ pItem.read }}阅读</view>
          </view>
          <view class="popularize-body">
            <view class="popularize-titleWrap">
              <text class="popularize-tag" style="color: #0085FF; margin-right: 8rpx;">#{{ pItem.lawyer_tag }}</text>
              <text class="popularize-title">{{ pItem.title }}</text>
            </view>

            <view class="popularize-content">
              <text v-if="pItem.shortContent && !pItem.isShowMoreContent">{{ pItem.shortContent }}</text>
              <text v-else>{{ pItem.content }}</text>
              <text v-if="pItem.shortContent" class="more-btn" @click="changePKMoreContent(pIndex)">{{ pItem.isShowMoreContent ? '收起' : '展开' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- </scroll-view> -->

    <!-- 评价弹框 -->
    <u-popup v-model="isShowEvaluatePopup" mode="center" width="600" z-index="10074" border-radius="30" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-evaluate-box" @click="navToLawyerDetail(evaluatePopupInfo.user_id)">
        <view class="evaluate-header">
          <view class="evaluate-left">
            <u-lazy-load img-mode="aspectFill" height="60" border-radius="30" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="evaluatePopupInfo.avatar" />
          </view>
          <view class="evaluate-middle">
            <view class="user-name">{{ evaluatePopupInfo.nickname }}</view>
            <view class="user-rate">
              <u-rate :current="evaluatePopupInfo.star" :count="5" :disabled="true" size="20" gutter="4" active-icon="star-fill" inactive-icon="star-fill" active-color="#FFC324" inactive-color="#dadada" />
            </view>
          </view>
        </view>
        <view class="evaluate-content">
          <text>{{ evaluatePopupInfo.content }}</text>
        </view>
        <view class="evaluate-bottom">
          <text>{{ evaluatePopupInfo.vip }}</text>
          <text>{{ evaluatePopupInfo.created_at }}</text>
        </view>
        <view class="evaluate-call-btn" @click.stop="isShowEvaluatePopup = false; $refs.kefuRef.openKefuPopup()">点击咨询</view>
      </view>
    </u-popup>

    <!-- 已买服务的弹框 -->
    <view v-if="userId && !readKeFuGuide && isShowOfficKefuPopup" class="black-mask" @click="closeKefuGuidePopup" />
    <view v-if="userId && userInfo.enterprise_vip_expired_at && !readKeFuGuide && isShowOfficKefuPopup" class="kefu-buyed-popup">
      <image class="bottom-triangle" mode="aspectFill" src="@/static/index/bottom-triangle-f.png" />
      <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="closeKefuGuidePopup" />

      <view class="kefu-wrap">
        <image class="kufu-left" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />
        <view class="kefu-right">
          <view class="kefu-right-key">{{ userInfo.enterprise_vip_expired_at ? '法务管家' : '法律顾问' }}-{{ officKefuInfo.customer_name }}</view>
          <view class="kefu-right-value">hi，想要更优质的企业法律服务，找我就对了～～～</view>
        </view>
      </view>
      <view class="btn-wrap">
        <view class="btn-item" @click="clickBtn(1)">
          <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-wxLogo-f.png" />
          <text>微信</text>
        </view>
        <view class="btn-item" @click="clickBtn(2)">
          <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-call-f.png" />
          <text>电话</text>
        </view>
      </view>
    </view>
    <!-- 未买服务的弹框 -->
    <view v-if="userId && !userInfo.enterprise_vip_expired_at && !readKeFuGuide && isShowOfficKefuPopup" class="kefu-nobuy-popup">
      <image class="header-img" mode="aspectFill" src="@/static/index/kufu-popup-header-1.png" />
      <view class="upopup-content-wrap">
        <view class="phone-title">全国服务热线</view>
        <view v-if="appExplainInfo.customer_service_mobile" class="phone-call" @click="$commonUtil.callPhone(appExplainInfo.customer_service_mobile)">
          <image class="icon-call" mode="aspectFill" src="@/static/common/phone-call-f.png" />
          <text>{{ appExplainInfo.customer_service_mobile }}</text>
        </view>
      </view>
      <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="closeKefuGuidePopup" />
    </view>

    <!-- 客服拖拽按钮 -->
    <kefu-drag-button v-if="readKeFuGuide" :isDock="true" :navbarHeight="uNavbarHeight" />
    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" @loginSucEvt="onLoginSucEvt" />
    <!-- 客服 popup -->
    <kefu-popup ref="kefuRef" />
  </view>
</template>

<script>
import qCountDown from './components/q-count-down/q-count-down';
import mpAuthUtil from '@/common/utils/mpAuthUtil';
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Index',
  components: { qCountDown },
  data() {
    return {
      safeAreaHeight: this.$store.state.safeAreaHeight,
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,
      windowHeight: 0, // 屏幕高度 px
      uNavbarHeight: 0, // 顶部导航栏高度 px
      navModuleStickTop: 0, // 导航模块吸顶距离
      navModuleHeight: 0, // 导航模块高度 px
      subFilterWrapHeight: 0, // 子过滤高度 px
      navModuleIsStickTop: false, // 导航模块是否吸顶
      navContentScrollY: false, // 导航内容区是否可滚动

      scrollXIntoViewId: '', // scrollX 滚动到元素 id
      bSwiperActiveIndex: 0, // banner swiper 激活的下标
      bannerList: [], // banner 列表

      serverOrderNum: 28957, // 服务次数

      todayDynamicList: [], // 今日动态列表
      strictSelectLawyerList: [], // 严选律师列表
      strictSelectLawyerTotal: 0, // 严选律师总数

      popLawKnowledgePage: 1, // 企业普法知识当前页数
      popLawKnowledgeList: [], // 企业普法知识列表
      popLawKnowledgeTotal: 0, // 企业普法知识总数
      isNextPopLawLoading: false, // 是否正在加载下一页企业普法

      serverOrderPage: 1, // 服务订单当前页数
      serverOrderList: [], // 服务订单列表
      serverOrderTotal: 0, // 服务订单总数
      isNextServerOrderLoading: false, // 是否正在加载下一页服务订单

      serverOrderTypeList: [{ 'enterprise_demand_type': '综合服务', 'enterprise_demand_type_id': 0 }], // 服务订单类型列表
      isShowOrderTypeSelect: false, // 是否显示订单类型 select
      selectedServerOrderTypeInfo: {}, // 选中的服务订单类型信息

      navActiveIndex: 0, // 当前激活的导航下标

      evaluatePopupInfo: null, // 评价弹窗信息
      isShowEvaluatePopup: false, // 是否显示评价弹框

      isLeftScrollXNavToSuc: false, // 是否左滑跳转成功

      isShowkeFuPopup: true, // 是否显示客服弹框
      isShowOfficKefuPopup: true, // 是否显示客服模块
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo', 'officKefuInfo' ]),
    ...mapState('userModule', [ 'userInfo', 'readKeFuGuide', 'userLocInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  watch: {
    appExplainInfo: {
      // immediate: true,
      handler: function(newVal) {
        const { order_count } = newVal;
        order_count && (this.serverOrderNum = order_count);

        // 暂时隐藏
        this._randomAddServerOrderNum();
      }
    },
  },
  onLoad() {
    uni.showLoading({ title: '加载中', mask: true });
    // if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框

    this._getIndexBannerList();
    this._getTodayDynamicList();
    this._getStrictSelectLawyerList();
    this._getPopLawKnowledgeList();
    this._getServerOrderTypeList();
    this._getServerOrderList();
    // if (this.userId) this._getCurLocCityInfo();

    // 监听全局的自定义事件 | 刷新严选律师
    uni.$on('refreshIndexStrictSelectLawyerEvt', data => {
      this._getStrictSelectLawyerList();
    });
  },
  async mounted() {
    // const uNavbarHeight = await this.$commonUtil.calcUNavNodeHeight();
    // this.uNavbarHeight = uNavbarHeight;

    // 窗口高度
    // const [err, systemInfo] = await uni.getSystemInfo();
    // this.windowHeight = systemInfo.windowHeight;

    // 计算导航栏吸顶距离
    // const uNavbarNodeRef = uni.createSelectorQuery().select('.nav-module');
    // uNavbarNodeRef.boundingClientRect(rect => {
    //   const navModuleStickTop = rect.top - uNavbarHeight;
    //   this.navModuleHeight = rect.height;
    //   this.navModuleStickTop = navModuleStickTop;
    // }).exec();

    // 计算子过滤接单吸顶距离
    // const uFilterNodeRef = uni.createSelectorQuery().select('.sub-filter-wrap');
    // uFilterNodeRef.boundingClientRect(rect => {
    //   this.subFilterWrapHeight = rect.height;
    // }).exec();
  },
  onPullDownRefresh() {
    this._getStrictSelectLawyerList();
    this._getServerOrderList();
  },
  onReachBottom() {
    const { navActiveIndex, serverOrderList, serverOrderTotal, popLawKnowledgeList, popLawKnowledgeTotal } = this;
    // 加载下一页服务订单
    if (navActiveIndex === 0) {
      if (serverOrderList.length >= serverOrderTotal || this.isNextServerOrderLoading) return;
      this._getServerOrderList(++this.serverOrderPage);
    // 加载下一页企业普法
    } else if (navActiveIndex === 1) {
      if (popLawKnowledgeList.length >= popLawKnowledgeTotal || this.isNextPopLawLoading) return;
      this._getPopLawKnowledgeList(++this.popLawKnowledgePage);
    }
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title: `一站式企业法律服务中心`,
      path: currentRoute,
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  onPageScroll(res) {
    const { scrollTop } = res;
    // if (scrollTop >= this.navModuleStickTop) {
    //   this.navContentScrollY = true;
    //   this.navModuleIsStickTop = true;
    // } else {
    //   this.navContentScrollY = false;
    //   this.navModuleIsStickTop = false;
    // }
  },
  methods: {
    ...mapActions('userModule', ['setReadKeFuGuideAction', 'setUserLocInfoAction']),
    /**
     * 获取当前位置城市信息
     */
    async _getCurLocCityInfo() {
      const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation');

      if (authSetResult) {
        const [error, locResult] = await uni.getLocation({ type: 'gcj02' });
        // 当前位置信息
        if (locResult) {
          try {
            const param = { lng: locResult.longitude, lat: locResult.latitude };
            const { data: curLocCityData } = await this.$api.getCurLocCityInfo(param);
            this.setUserLocInfoAction(curLocCityData);
            await loginUtil.fetchUserInfo(); // 重新拉取个人信息
            this._getStrictSelectLawyerList();
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    /**
     * 伪随机增加服务数子
     */
    _randomAddServerOrderNum() {
      function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      // setInterval(() => {
      //   const randomNum = getRandom(1, 5);
      //   this.serverOrderNum = this.serverOrderNum + randomNum;
      // }, 10000);
    },
    /**
     * 获取 banner 列表
     */
    async _getIndexBannerList() {
      try {
        const { data: bannerData } = await this.$api.getIndexBannerList();
        this.bannerList = bannerData.banners2;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取今日动态列表
     */
    async _getTodayDynamicList() {
      try {
        const { data: todayDynamicData } = await this.$api.getTodayDynamicList();
        const todayDynamicList = [];

        const len = todayDynamicData.length;
        const n = 2; // 假设每行显示 2 个
        const lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
        for (let i = 0; i < lineNum; i++) {
        // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          const tempList = todayDynamicData.slice(i * n, i * n + n);
          todayDynamicList.push(tempList);
        }

        this.todayDynamicList = todayDynamicList;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取服务订单分类列表
     */
    async _getServerOrderTypeList() {
      try {
        const { data: serverOrderTypeData } = await this.$api.getServerOrderTypeList();
        this.serverOrderTypeList.push(...serverOrderTypeData);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取服务订单
     */
    async _getServerOrderList(page = 1) {
      if (this.isNextServerOrderLoading) return;
      this.isNextServerOrderLoading = true;

      let param = { is_join: 0, page };
      // 存在筛选订单类型
      this.selectedServerOrderTypeInfo.enterprise_demand_type_id && (param.demand_type_id = this.selectedServerOrderTypeInfo.enterprise_demand_type_id);

      try {
        const { data: serverOrderData } = await this.$api.getServerOrderList(param);
        (page === 1) && (this.serverOrderList = []); // 请求第一页，先清空数组

        this.navModuleIsStickTop && (this.navContentScrollY = true);

        const serverOrderItems = serverOrderData.items.map(item => {
          let countDownTimestamp = 0;
          // 交付倒计时
          if (item.status === 23) {
            countDownTimestamp = item.due_at_timestamp - Math.floor(+new Date() / 1000);
          // 总服务时长
          } else {
            if (item.lawyer_submit_at_timestamp && item.lawyer_recv_at_timestamp) {
              countDownTimestamp = item.lawyer_submit_at_timestamp - item.lawyer_recv_at_timestamp;
            }
          }
          // 倒计时
          item.countDownTimestamp = countDownTimestamp;
          return item;
        });

        this.serverOrderList.push(...serverOrderItems);
        this.serverOrderTotal = serverOrderData.total;
        (page === 1) && (this.serverOrderPage = 1); // 重回第一页
        this.isNextServerOrderLoading = false;
      } catch (error) {
        this.isNextServerOrderLoading = false;
        if (error.code === 1009) this._getServerOrderList();
        console.log(error);
      }
    },
    /**
     * 确认服务订单类型
     */
    confirmServerOrderTypeSelect(event) {
      this.selectedServerOrderTypeInfo.enterprise_demand_type = event[0].label;
      this.selectedServerOrderTypeInfo.enterprise_demand_type_id = event[0].value;

      uni.showLoading({ title: '加载中', mask: true });
      this.serverOrderList = [];
      // uni.pageScrollTo({ scrollTop: this.navModuleStickTop, duration: 300 });
      this._getServerOrderList();
    },
    /**
     * 刷新服务订单信息
     */
    refreshServerOrderList() {
      uni.showLoading({ title: '加载中', mask: true });
      this.serverOrderList = [];
      this._getServerOrderList();
    },
    /**
     * 服务订单触发底部事件 加载下一页
     */
    // serverOrderScrollToLowerEvt() {
    //   const { serverOrderList, serverOrderTotal } = this;
    //   if (serverOrderList.length >= serverOrderTotal) return;
    // this._getServerOrderList(++this.serverOrderPage);
    // },
    /**
     * 企业普发触发底部事件 加载下一页
     */
    // popLawScrollToLowerEvt() {
    //   const { popLawKnowledgeList, popLawKnowledgeTotal } = this;
    //   if (popLawKnowledgeList.length >= popLawKnowledgeTotal) return;
    //   this._getPopLawKnowledgeList(++this.popLawKnowledgePage);
    // },
    /**
     * 获取企业普法知识列表
     */
    async _getPopLawKnowledgeList(page = 1) {
      if (this.isNextPopLawLoading) return;
      this.isNextPopLawLoading = true;

      try {
        const { data: popLawKnowledgeData } = await this.$api.getPopLawKnowledgeList({ page });
        // 对后端返回的数据加工一下
        const popLawKnowledgeItems = popLawKnowledgeData.items.map(item => {
          item.isShowMoreContent = false; // 是否展示更多内容
          item.shortContent = ''; // 概要内容
          // 内容长度判断
          if (item.content.length > 144) {
            item.shortContent = item.content.substr(0, 140) + '...';
          }
          return item;
        });

        this.popLawKnowledgeList.push(...popLawKnowledgeItems);
        this.popLawKnowledgeTotal = popLawKnowledgeData.total;
        this.isNextPopLawLoading = false;
      } catch (error) {
        this.isNextPopLawLoading = false;
        console.log(error);
      }
    },
    /**
     * 获取严选律师列表
     */
    async _getStrictSelectLawyerList() {
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: strictSelectLawyerData } = await this.$api.getStrictSelectLawyerList({ rand: 1, page: 1 });
        const strictSelectLawyerList = [];

        const len = strictSelectLawyerData.items.length;
        const n = 2; // 假设每行显示 2 个
        const lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
        for (let i = 0; i < lineNum; i++) {
          // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
          const tempList = strictSelectLawyerData.items.slice(i * n, i * n + n);
          strictSelectLawyerList.push(tempList);
        }

        this.strictSelectLawyerList = strictSelectLawyerList;
        this.strictSelectLawyerTotal = strictSelectLawyerData.total;
        uni.stopPullDownRefresh();
      } catch (error) {
        console.log(error);
        if (error.code === 1009) {
          this.$refs.authLoginRef.openAuthLoginPopup();
          this._getStrictSelectLawyerList();
        }
      }
    },
    /**
     * 监听登录成功事件
     */
    onLoginSucEvt(loginStatus) {
      this._getStrictSelectLawyerList();
    },
    /**
     * 滚动到右边时触发
     */
    strictSelectScrollToLowerEvt() {
      this.scrollXIntoViewId = ``;
      if (this.isLeftScrollXNavToSuc) return;
      this.isLeftScrollXNavToSuc = true;
      this.$commonUtil.routeNavTo('module-lawyer/lawyer-strict-list/lawyer-strict-list');

      setTimeout(() => {
        this.scrollXIntoViewId = `s-${ this.strictSelectLawyerList.length - 2 }`;
        this.isLeftScrollXNavToSuc = false;
      }, 1000);
      uni.vibrateShort({ type: 'medium' });
    },
    /**
     * banner swipwer切换
     */
    bannerSwiperChange(event) {
      const { current } = event.detail;
      this.bSwiperActiveIndex = current;
    },
    /**
     * 点击 banner
     */
    clickBanner() {
      uni.switchTab({ url: '/pages/tabbar/center/center' });
    },
    /**
     * 点击动态项
     */
    clickDynamicItem(dynItem) {
      if (dynItem.button === 'buy') uni.switchTab({ url: '/pages/tabbar/center/center' });
      if (dynItem.button === 'evaluate') {
        this.evaluatePopupInfo = dynItem.user;
        this.isShowEvaluatePopup = true;
      }
    },
    /**
     * 展开一项动态更多内容
     */
    changePKMoreContent(pIndex) {
      this.popLawKnowledgeList[pIndex].isShowMoreContent = !this.popLawKnowledgeList[pIndex].isShowMoreContent;
    },
    /**
     * 点击 btn
     */
    clickBtn(btnType = 1) {
      if (!this.officKefuInfo) return;

      if (btnType === 1) {
        this.$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: this.officKefuInfo.customer_id });
      } else if (btnType === 2) {
        this.$commonUtil.callPhone(this.officKefuInfo.mobile);
      }
    },
    /**
     * 关闭客服指南弹框
     */
    closeKefuGuidePopup() {
      this.isShowOfficKefuPopup = false;
      this.setReadKeFuGuideAction(true);
      this._getCurLocCityInfo();
    },
    /**
     * 进入律师详情页面
     */
    navToLawyerDetail(lawyerId) {
      if (!lawyerId) return;
      this.isShowEvaluatePopup = false;
      this.$commonUtil.routeNavTo('module-lawyer/lawyer-detail/lawyer-detail', { lawyerId });
    },
    /**
     * 进入订单详情页面
     */
    navToOrderDetail(processType, demandOrderId) {
      if (!processType || !demandOrderId) return;
      this.$commonUtil.routeNavTo('module-common/order-detail/order-detail', { demandOrderId });
    },
    /**
     * 切换分类导航
     */
    async changeNav(nIndex) {
      if (this.navActiveIndex === nIndex && nIndex === 0) {
        this.isShowOrderTypeSelect = true;
      }
      this.navActiveIndex = nIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
