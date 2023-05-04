<template>
  <view>
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="法律服务中心" :title-size="36" title-color="#333" title-bold />
    <!-- #endif -->

    <view class="header-module" :style="{ top: uNavbarHeight + 'px' }">
      <!-- 发布案源导航 -->
      <view class="nav-wrap">
        <view class="nav-item" @click="openFastPubPhonePopup">
          <image class="nav-icon" mode="aspectFill" src="/static/center/center-tel_zixun.png" />
          <text>电话咨询</text>
        </view>
        <view v-for="(pNavItem, pNavIndex) in pubOrderNavList" :key="pNavIndex" class="nav-item" @click="navToOrderCreatePage(pNavItem)">
          <image class="nav-icon" mode="aspectFill" :src="pNavItem.icon" />
          <text>{{ pNavItem.name }}</text>
        </view>
        <!-- <view class="nav-item" @click="navToMenuPage('/pages/module-common/vip-enterprise-serve/vip-enterprise-serve')">
          <image class="nav-icon" mode="aspectFill" src="/static/center/center-qiye-vip.png" />
          <text>企业法务</text>
        </view> -->
      </view>
    </view>

    <!-- 条件导航 -->
    <view class="factor-wrap" :style="{ top: uNavbarHeight + 67 + 'px' }">
      <view class="factor-nav-wrap">
        <!-- 订单类型条件 -->
        <view class="factor-item order-type-item" :class="{ 'factor-item-active': orderTypeOptActiveIndex > -1 }" @click.stop="openFactorPopup('orderTypeFactor')">
          <view v-if="orderTypeOptActiveIndex > -1">{{ orderTypeOptList[orderTypeOptActiveIndex].enterprise_demand_type }}</view>
          <view v-else>订单类型</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'orderTypeFactor' && isOpenFactorPopup }" mode="aspectFill" :src="orderTypeOptActiveIndex > -1 ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
          <!-- 订单类型选项 popup -->
          <view v-if="isOpenFactorPopup && factorPopupType === 'orderTypeFactor'" class="order-type-popup">
            <view v-for="(tItem, tIndex) in orderTypeOptList" :key="tIndex" class="order-type-opt" :class="{ 'order-type-opt-active': orderTypeOptActiveIndex === tIndex }" @click.stop="changeOrderTypeFactor(tIndex)">
              <text>{{ tItem.enterprise_demand_type }}</text>
            </view>
            <image class="triangle-top-f" mode="aspectFill" src="@/static/common/triangle-top-f.png" />
          </view>
        </view>

        <!-- 地区条件 -->
        <!-- <view class="factor-item" :class="{ 'factor-item-active': regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) }" @click.stop="openFactorPopup('regionFactor')">
          <text v-if="regionFactorActiveInfo.regionChildIndex > -1">{{ regionDataList[regionFactorActiveInfo.regionParentIndex].cities[regionFactorActiveInfo.regionChildIndex].name }}</text>
          <text v-else-if="regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo">{{ curLocCityInfo.city }}</text>
          <text v-else>全国</text>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'regionFactor' && isOpenFactorPopup }" mode="aspectFill" :src="regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
        </view> -->

        <!-- 我的订单 条件 -->
        <view class="factor-item my-order-item" @click.stop="changeMyselfOrderFactor">
          <image v-if="isActiveMyselfOrder" class="icon-radio" mode="aspectFill" src="@/static/center/radio-active.png" />
          <image v-else class="icon-radio" mode="aspectFill" src="@/static/center/radio-inactive.png" />
          <text :style="{'color': isActiveMyselfOrder ? '#0085FF' : '#666'}">我的订单</text>
        </view>
      </view>

      <!-- 条件过滤弹框 -->
      <view class="factor-option-popup" :style="{ height: isOpenFactorPopup && ['regionFactor'].includes(factorPopupType) ? '720rpx' : 0 }">
        <!-- 地区条件选项 -->
        <template v-if="factorPopupType === 'regionFactor'">
          <!-- 左侧城市导航 -->
          <view class="sidenav-wrap">
            <view v-for="(nItem, nIndex) in regionDataList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': tempFactorActiveInfo.tempParentIndex === nIndex }" @click="changeRegionSideNav(nIndex)">{{ nItem.name }}</view>
            <!-- 侧边导航条 -->
            <view class="sidenav-line-outer" :style="{ top: (tempFactorActiveInfo.tempParentIndex * 100) + 'rpx' }">
              <view class="sidenav-line-inner" />
            </view>
          </view>
          <!-- 右侧城市数据 -->
          <view class="content-wrap region-wrap">
            <!-- 定位 -->
            <view class="loc-wrap">
              <view class="loc-header">
                <view class="loc-left">当前定位</view>
              </view>

              <view class="loc-item" :class="{ 'loc-item-active': regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo }" @click="clickGetCurLocCityInfo">
                <image class="location-img" mode="aspectFill" src="@/static/common/location-active.png" />
                <text v-if="!curLocCityInfo">暂无</text>
                <text v-else>{{ curLocCityInfo.city }}</text>
              </view>
            </view>
            <!-- 热门城市 -->
            <view class="hot-wrap">
              <view class="hot-header">
                <view class="hot-left">{{ regionDataList[tempFactorActiveInfo.tempParentIndex].name }}</view>
              </view>
              <view class="city-wrap">
                <view v-for="(cItem, cIndex) in regionDataList[tempFactorActiveInfo.tempParentIndex].cities" :key="cIndex" class="city-item" :class="{ 'city-item-active': tempFactorActiveInfo.tempChildIndex === cIndex }" :style="cItem.name && cItem.name.length > 5 ? 'font-size: 24rpx;' : ''" @click="changeRegionCityFactor(cIndex)">
                  <text>{{ cItem.name }}</text>
                  <image v-if="tempFactorActiveInfo.tempChildIndex === cIndex" class="active-gou-img" mode="aspectFill" src="@/static/common/factor-active-gou.png" />
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>

      <!-- 黑色背景 mask -->
      <view v-if="isOpenFactorPopup" class="factor-mask" @click="isOpenFactorPopup = false; factorPopupType = '';" />
    </view>

    <!-- 案源订单 -->
    <view class="order-module">
      <view class="server-order-wrap">
        <view v-for="(sItem, sIndex) in caseSourceList" :key="sIndex" class="server-order-item">
          <view class="server-order-box">
            <!-- 订单头部信息 -->
            <view class="order-header">
              <view class="user-avatar">
                <u-lazy-load img-mode="aspectFill" height="64" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="sItem.user.avatar" />
              </view>
              <view class="user-info">
                <view class="user-name">{{ sItem.user.nickname }}</view>
              </view>
              <view class="order-price">{{ sItem.price.value }}</view>
            </view>

            <!-- 订单父类型 -->
            <view class="order-status-info">
              <view class="order-parType">{{ sItem.demand_type }}({{ sItem.num }}份)</view>
              <!-- 订单状态 -->
              <view v-if="[30, 40, 90, 93].includes(sItem.status)" class="order-status">已结束</view>
              <view v-else-if="sItem.process_type" class="order-status" style="color: #FE5F48;">进行中</view>
              <view v-else class="order-status" style="color: #FF9B00;">服务中</view>
            </view>

            <!-- 发布时间 -->
            <view class="order-time">
              <text>发布时间：</text>
              <text class="time-value">{{ sItem.created_at }}</text>
            </view>

            <!-- 案件类型 -->
            <view class="order-subType">
              <text>案件类型：</text>
              <text class="type-value">{{ sItem.lawyer_tag }}</text>
            </view>

            <!-- 律师地域 -->
            <view class="order-subType">
              <text>律师地域：</text>
              <text class="type-value">{{ sItem.lawyer_area }}</text>
            </view>

            <!-- 订单服务信息 -->
            <view v-if="sItem.countDownTimestamp > 0" class="order-serve-info">
              <view v-if="sItem.status === 23 && sItem.countDownTimestamp > 0" class="give-count-down">
                <text>交付倒计时：</text>
                <q-count-down :timestamp="sItem.countDownTimestamp" :show-days="sItem.is_enterprise_risk ? true : false" separator="zh" font-size="30" color="#FE5F48" separator-color="#FE5F48" />
              </view>
              <view v-else-if="sItem.countDownTimestamp > 0" class="serve-finish">
                <image class="timeline-img" mode="aspectFill" src="@/static/center/server-order-timeline.png" />
                <view class="serve-step-wrap">
                  <view class="serve-step">律师已交付</view>
                  <view class="serve-step">
                    <text>服务总时长：</text>
                    <q-count-down :timestamp="sItem.countDownTimestamp" :show-days="sItem.is_enterprise_risk ? true : false" separator="zh" :autoplay="false" font-size="30" color="#FE5F48" separator-color="#FE5F48" />
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 匹配律师列表 -->
          <view v-if="sItem.process_type" class="match-order-lawyer" @click="navToOrderDetail(sItem.demand_id)">
            <template v-if="sItem.offer_num">
              <view class="lawyer-left">
                <view v-for="(lItem, lIndex) in sItem.offer_lawyer_info" :key="lIndex" class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="lItem.avatar" />
                </view>
                <view class="lawyer-name">已匹配{{ sItem.offer_num }}位律师</view>
              </view>
              <view class="lawyer-right">
                <text>查看详情</text>
                <u-icon name="arrow-right" color="#0060FF" :size="20" />
              </view>
            </template>

            <template v-else>
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="'/static/center/server-order-defAvatar.png'" />
                </view>
                <view class="lawyer-name">等待匹配律师…</view>
              </view>
              <!-- <view class="lawyer-right">
                <text>查看详情</text>
                <u-icon name="arrow-right" color="#0060FF" :size="20" />
              </view> -->
            </template>
          </view>

          <!-- 匹配律师 -->
          <view v-else class="match-order-lawyer" @click="navToLawyerDetail(sItem.lawyer.user_id)">
            <template v-if="sItem.lawyer.user_id">
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="sItem.lawyer.avatar" />
                </view>
                <view class="lawyer-name">{{ sItem.lawyer.nickname }}</view>
              </view>
              <view class="lawyer-right">
                <text>查看律师详情</text>
                <u-icon name="arrow-right" color="#0060FF" :size="20" />
              </view>
            </template>

            <template v-else>
              <view class="lawyer-left">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="'/static/center/server-order-defAvatar.png'" />
                </view>
                <view class="lawyer-name">正在匹配律师中…</view>
              </view>
            </template>
          </view>
        </view>
      </view>

      <!-- 空数据 -->
      <view v-if="!isLoadingNextCaseSource && !caseSourceList.length" class="empty-wrap">
        <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" />
        <view class="empty-text">暂无数据</view>
      </view>
    </view>

    <!-- 快速发布电话咨询 popup -->
    <fast-pubPhone-popup :zIndex="1100" ref="fastPubPhonePopupRef" />

    <tab-bar :selected="2" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import mpAuthUtil from '@/common/utils/mpAuthUtil';
import qCountDown from './components/q-count-down/q-count-down';

// 临时条件初始下标信息
const tempFactorInitInfo = { tempParentIndex: 0, tempChildIndex: -1 };

export default {
  name: 'Center',
  components: { qCountDown },
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px
      curLocCityInfo: null, // 当前所在城市信息
      
      // 发布案源订单列表
      pubOrderNavList: [
        { name: '合同文书', icon: '/static/center/center-contract_wenshu.png', navIndex: 1 },
        { name: '委托打官司', icon: '/static/center/center-entrust_daguansi.png', navIndex: 2 },
      ],

      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'orderTypeFactor', 'regionFactor'
      regionDataList: [], // 地区数据列表
      regionFactorActiveInfo: { regionParentIndex: 0, regionChildIndex: -1 }, // 地区条件确定的下标信息
      tempFactorActiveInfo: { ...tempFactorInitInfo }, // 临时条件选中的下标信息

      orderTypeOptList: [{ 'enterprise_demand_type': '综合排序', 'enterprise_demand_type_id': 0 }], // 订单类型列表
      orderTypeOptActiveIndex: -1, // 订单类型激活下标

      isActiveMyselfOrder: 0, // 是否激活我自己的订单 0：未激活 1: 激活

      caseSourcePage: 1, // 案源列表当前页数
      caseSourceTotal: 0, // 案源列表总数
      caseSourceList: [], // 案源列表
      isLoadingNextCaseSource: false, // 是否正在加载下一页案源订单
    }
  },
  computed: {
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
    this._getCurLocCityInfo();
    this._getRegionList();
    this._getCaseSourceOrderTypeList();
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();

    // #ifdef MP-KUAISHOU
    setTimeout(() => {
      const headerModuleNodeRef = uni.createSelectorQuery().in(this).select('.u-navbar');
      headerModuleNodeRef.boundingClientRect(rect => {
        this.uNavbarHeight = rect.bottom;
      }).exec();
    }, 1000);
    // #endif
  },
  onShow() {
  },
  onPullDownRefresh() {
    this._getCaseSourceList();
  },
  onReachBottom() {
    const { caseSourceList, caseSourceTotal } = this;
    if (caseSourceList.length >= caseSourceTotal) return;
    // 加载下一页案源列表
    this._getCaseSourceList(++this.caseSourcePage);
  },
  methods: {
    /**
     * 获取当前位置城市信息
     */
    async _getCurLocCityInfo() {
      // const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation');

      // if (authSetResult) {
      //   const [error, locResult] = await uni.getLocation({ type: 'gcj02' });
      //   // 当前位置信息
      //   if (locResult) {
      //     try {
      //       const param = { lng: locResult.longitude, lat: locResult.latitude };
      //       const { data: curLocCityData } = await this.$api.getCurLocCityInfoApi(param);
      //       this.curLocCityInfo = curLocCityData;
      //     } catch (error) {
      //       console.log(error);
      //     }
      //   }
      // }

      // 获取法律中心案源列表
      this._getCaseSourceList();
    },
    /**
     * 点击获取当前位置城市信息
     */
    async clickGetCurLocCityInfo() {
      const { curLocCityInfo } = this;
      // 获取当前所在城市严选律师列表
      if (curLocCityInfo) {
        // 先重置地区筛选条件下标信息
        this.regionFactorActiveInfo.regionParentIndex = 0;
        this.regionFactorActiveInfo.regionChildIndex = -1;

        this._getCaseSourceList();
        this.closeFactorPopup();
        return;
      }

      // #ifdef MP-WEIXIN
      const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation');
      // #endif
      if (!authSetResult) return;

      const [error, locResult] = await uni.getLocation({ type: 'gcj02' });
      if (!locResult) return;

      try {
        const param = { lng: locResult.longitude, lat: locResult.latitude };
        const { data: curLocCityData } = await this.$api.getCurLocCityInfoApi(param);
        this.curLocCityInfo = curLocCityData;

        // 先重置地区筛选条件下标信息
        this.regionFactorActiveInfo.regionParentIndex = 0;
        this.regionFactorActiveInfo.regionChildIndex = -1;

        this._getCaseSourceList();
        this.closeFactorPopup();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取案源订单类型列表
     */
    async _getCaseSourceOrderTypeList() {
      try {
        const { data: orderTypeData } = await this.$api.getCauseSourceOrderTypeApi();
        if (this.orderTypeOptList.length > 1) return;
        this.orderTypeOptList.push(...orderTypeData);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await this.$api.getRegionListApi();
        regionData.cities.unshift({ name: '热门', cities: regionData.hots.map(item => { item.name = item.city; item.district_id = item.city_id; return item; }) });
        this.regionDataList = regionData.cities;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取法律中心案源列表
     */
    async _getCaseSourceList(page = 1) {
      const { regionFactorActiveInfo, curLocCityInfo } = this;

      if (this.isLoadingNextCaseSource) return;
      this.isLoadingNextCaseSource = true;
      if (page === 1) {
        uni.showLoading({ title: '加载中', mask: true });
        this.caseSourcePage = 1;
      }

      const param = { page, is_join: 0 }

      // 添加地区城市 factor
      if (regionFactorActiveInfo.regionChildIndex >= 0) {
        const activeRegionParentObj = this.regionDataList[regionFactorActiveInfo.regionParentIndex];
        const regionCityId = activeRegionParentObj.cities[regionFactorActiveInfo.regionChildIndex].district_id;
        // 添加城市参数
        regionCityId && (param.city_id = regionCityId);
      // 若未添加地区筛选条件 & 存在了当前所在城市信息 则添加所在城市 id
      } else if (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) {
        param.city_id = curLocCityInfo.cityId;
      }

      // 添加订单类型 factor
      if (this.orderTypeOptActiveIndex > -1) {
        const demandTypeId = this.orderTypeOptList[this.orderTypeOptActiveIndex].enterprise_demand_type_id;
        param.demand_type_id = demandTypeId;
      }

      // 添加是否我自己的订单 factor
      if (this.isActiveMyselfOrder > 0) {
        param.is_user_released = 1;
      }
      
      try {
        const { data: caseSourceData } = await this.$api.getCauseSourceListApi(param);
        (page === 1) && (this.caseSourceList = []); // 请求第一页，先清空数组
        
        const caseSourceItems = caseSourceData.items.map(item => {
          let countDownTimestamp = 0;
          // 交付倒计时
          if (item.status === 23) {
            countDownTimestamp = item.due_at_timestamp - Math.floor(+new Date() / 1000);
          // 服务总时长
          } else {
            if (item.lawyer_submit_at_timestamp && item.lawyer_recv_at_timestamp) {
              countDownTimestamp = item.lawyer_submit_at_timestamp - item.lawyer_recv_at_timestamp;
            }
          }
          // 倒计时
          item.countDownTimestamp = countDownTimestamp;
          return item;
        });
        
        this.caseSourceList.push(...caseSourceItems);
        this.caseSourceTotal = caseSourceData.total;
        this.isLoadingNextCaseSource = false;
        uni.stopPullDownRefresh();
      } catch (error) {
        this.isLoadingNextCaseSource = false;
        console.log(error);
      }
    },
    /**
     * 打开条件弹框
     * @param {String} factorPopupType 条件弹框类型
     */
    openFactorPopup(factorPopupType) {
      if (this.isOpenFactorPopup && this.factorPopupType === factorPopupType) return this.closeFactorPopup();

      this.factorPopupType = factorPopupType; // 弹框类型
      // 为临时条件信息赋值 地区类型
      if (factorPopupType === 'regionFactor') {
        this.tempFactorActiveInfo.tempParentIndex = this.regionFactorActiveInfo.regionParentIndex;
        this.tempFactorActiveInfo.tempChildIndex = this.regionFactorActiveInfo.regionChildIndex;
      // 为临时条件信息赋值 订单类型
      } else if (factorPopupType === 'orderTypeFactor') {
      }

      this.isOpenFactorPopup = true;
    },
    /**
     * 关闭条件弹框 & 重置一些条件值
     */
    closeFactorPopup() {
      this.isOpenFactorPopup = false;
      this.factorPopupType = '';
      this.tempFactorActiveInfo = { ...tempFactorInitInfo };
    },
    /**
     * 改变侧边栏 地区导航选项
     */
    changeRegionSideNav(regionParentIndex) {
      // 临时条件选中的父下标
      this.tempFactorActiveInfo.tempParentIndex = regionParentIndex;
      // 临时条件选中的子下标 = (临时条件选中的父下标 === 已选择的地区父下标) ? 已选择的地区子下标 : -1
      this.tempFactorActiveInfo.tempChildIndex = this.tempFactorActiveInfo.tempParentIndex === this.regionFactorActiveInfo.regionParentIndex
        ? this.regionFactorActiveInfo.regionChildIndex
        : -1;
    },
    /**
     * 选择 地区城市选项
     */
    changeRegionCityFactor(regionChildIndex) {
      this.regionFactorActiveInfo.regionParentIndex = this.tempFactorActiveInfo.tempParentIndex; // 设置地区父下标
      this.regionFactorActiveInfo.regionChildIndex = regionChildIndex; // 设置地区子下标

      this.closeFactorPopup();
      this._getCaseSourceList();
      this.caseSourceList = [];
    },
    /**
     * 选择 订单类型选项
     */
    changeOrderTypeFactor(orderTypeIndex) {
      this.orderTypeOptActiveIndex = orderTypeIndex;
      this.closeFactorPopup();
      this._getCaseSourceList();
      this.caseSourceList = [];
    },
    /**
     * 选择 我自己的订单
     */
    changeMyselfOrderFactor() {
      this.isActiveMyselfOrder = this.isActiveMyselfOrder === 1 ? 0 : 1;
      this.closeFactorPopup();
      this._getCaseSourceList();
      this.caseSourceList = [];
    },

    /**
     * 导航去订单发布页面
     */
    navToOrderCreatePage(pNavItem) {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$commonUtil.routeNavTo('module-order/order-create/order-create', { activePTypeIndex: pNavItem.navIndex });
    },

    /**
		 * 导航进入菜单页面
		 */
		navToMenuPage(pagePath) {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
			uni.navigateTo({ url: pagePath });
		},

    /**
     * 打开快速发布电话咨询弹框
     */
    openFastPubPhonePopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();
    },
    /**
     * 前往律师主页
     */
    navToLawyerDetail(userId) {
      if (!userId) return;
			uni.navigateTo({ url: `/pagesV1/index/lawyerPage?id=${ userId }` });
		},
    /**
     * 前往订单详情页面
     */
    navToOrderDetail(demandId) {
      if (!demandId) return;
      this.$commonUtil.routeNavTo('module-order/order-detail/order-detail', { demandId });
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
