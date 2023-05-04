<template>
  <view class="main">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="百姓律师" :title-size="36" title-color="#333" title-bold />
    <!-- #endif -->

    <!-- 头部 banner 广告位 -->
    <view v-if="headerAdvertSeat.length" class="advert-banner-module">
      <swiper autoplay interval="5000" style="width: 100%; height: 100%;">
        <swiper-item v-for="(aItem, aIndex) in [headerAdvertSeat[0]]" :key="aIndex" @click="navToLawyerDetail(aItem.user_info.user_id)">
          <image style="width: 100%; height: 100%;" mode="aspectFill" :src="aItem.banner" />
        </swiper-item>
      </swiper>
    </view>

    <!-- <view class="recommend-module">
      <view class="recommend-header">
        <view>为你推荐</view>
        <view style="color: #0085FF;" @click="navToPage('/pages/module-common/entrust-lawsuit/entrust-lawsuit')"><u-icon name="plus" color="#0085FF" size="20" style="margin-right: 8rpx;" />委托打官司</view>
      </view>
      <scroll-view v-if="curLocCityInfo" class="scroll-x recommend-scroll-x" scroll-x enhanced :show-scrollbar="false" :scroll-into-view="scrollXIntoViewId" lower-threshold="10">
        <view v-for="(rItem, rIndex) in nearLawyerList" :key="rIndex" class="scroll-x-item">
          <view class="recommend-item-wrap" @click="navToLawyerDetail(rItem.user_id)">
            <view class="lawyer-avatar">
              <u-lazy-load img-mode="aspectFill" height="72" border-radius="12" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="rItem.avatar" />
            </view>
            <view class="lawyer-nickname">
              <span>{{ rItem.nickname }}</span>
              <view v-if="rItem.is_guarantee" class="youxuan-tag">优</view>
            </view>
            <view v-if="userId" class="lawyer-loc">距您{{ rItem.location_distance }}km</view>
          </view>
        </view>
      </scroll-view>

      <view v-else class="open-loc" @click="_getCurLocCityInfo">
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023210-1676018023628-BJ92Ej.png" />
      </view>
    </view> -->

    <!-- <view class="division-line" /> -->

    <!-- 条件过滤模块 -->
    <view class="factor-module" :style="{ top: uNavbarHeight + 'px' }">
      <view class="factor-item" :class="{ 'factor-item-active': regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) }" @click.stop="openFactorPopup('regionFactor')">
        <text v-if="regionFactorActiveInfo.regionChildIndex > -1">{{ regionDataList[regionFactorActiveInfo.regionParentIndex].cities[regionFactorActiveInfo.regionChildIndex].name }}</text>
        <text v-else-if="regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo">{{ curLocCityInfo.city }}</text>
        <text v-else>选择地区</text>
        <image class="triangle-bottom" :class="{ 'triangle-bottom-active': factorPopupType === 'regionFactor' && isOpenFactorPopup }" mode="aspectFill" :src="regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
      </view>
      <view class="factor-item" :class="{ 'factor-item-active': caseFactorActiveInfo.caseChildIndex > -1 }" @click.stop="openFactorPopup('caseFactor')">
        <text v-if="caseFactorActiveInfo.caseChildIndex > -1">{{ caseTypeDataList[caseFactorActiveInfo.caseParentIndex].lawyer_tags[caseFactorActiveInfo.caseChildIndex].lawyer_tag }}</text>
        <text v-else>擅长类型</text>
        <image class="triangle-bottom" :class="{ 'triangle-bottom-active': factorPopupType === 'caseFactor' && isOpenFactorPopup }" mode="aspectFill" :src="caseFactorActiveInfo.caseChildIndex > -1 ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
      </view>
      <view class="factor-item" :class="{ 'factor-item-active': orderByFactorActiveIndex > -1 }" @click.stop="openFactorPopup('orderbyFactor')">
        <text v-if="orderByFactorActiveIndex > -1">{{ orderByFactorList[orderByFactorActiveIndex].name }}</text>
        <text v-else>排序方式</text>
        <image class="triangle-bottom" :class="{ 'triangle-bottom-active': factorPopupType === 'orderbyFactor' && isOpenFactorPopup }" mode="aspectFill" :src="orderByFactorActiveIndex > -1 ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
      </view>
      
      <!-- 条件过滤弹框 -->
      <view class="factor-option-popup">
        <!-- 地区条件选项 -->
        <view v-if="factorPopupType === 'regionFactor'" :style="{ height: isOpenFactorPopup ? '640rpx' : 0 }" class="region-factor-wrap">
          <view class="left-sidenav">
            <view v-for="(nItem, nIndex) in regionDataList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': tempFactorActiveInfo.tempParentIndex === nIndex }" @click="changeRegionSideNav(nIndex)">{{ nItem.name }}</view>
            <!-- 侧边导航条 -->
            <view class="sidenav-line-outer" :style="{ top: (tempFactorActiveInfo.tempParentIndex * 100) + 'rpx' }">
              <view class="sidenav-line-inner" />
            </view>
          </view>
          <!-- 右侧城市数据 -->
          <view class="right-region-content">
            <!-- 定位 -->
            <view class="loc-wrap">
              <view class="loc-header">
                <view class="loc-left">当前定位</view>
              </view>
              <view class="loc-item" :class="{ 'loc-item-active': regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo }" @click="_getCurLocCityInfo">
                <image class="location-img" mode="aspectFill" src="@/static/common/location-active.png" />
                <text v-if="!curLocCityInfo">暂无</text>
                <text v-else>{{ curLocCityInfo.city }}</text>
              </view>
            </view>
            <!-- 城市 -->
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
        </view>

        <!-- 案件条件选项 -->
        <view v-else-if="factorPopupType === 'caseFactor'" :style="{ height: isOpenFactorPopup ? '640rpx' : 0 }" class="caseType-factor-wrap">
          <view class="left-sidenav">
            <view v-for="(nItem, nIndex) in caseTypeDataList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': tempFactorActiveInfo.tempParentIndex === nIndex }" @click="changeCaseSideNav(nIndex)">{{ nItem.lawyer_tag_group }}</view>
            <view class="sidenav-line-outer" :style="{ top: (tempFactorActiveInfo.tempParentIndex * 100) + 'rpx' }">
              <view class="sidenav-line-inner" />
            </view>
          </view>
          <view class="right-type-content">
            <view class="case-header">
              <view class="case-left">{{ caseTypeDataList[tempFactorActiveInfo.tempParentIndex].lawyer_tag_group }}</view>
            </view>
            <view class="type-wrap">
              <view v-for="(tItem, tIndex) in caseTypeDataList[tempFactorActiveInfo.tempParentIndex].lawyer_tags" :key="tIndex" class="type-item" :class="{ 'type-item-active': tempFactorActiveInfo.tempChildIndex === tIndex }" @click="changeCaseTypeFactor(tIndex)">
                <text>{{ tItem.lawyer_tag }}</text>
                <image v-if="tempFactorActiveInfo.tempChildIndex === tIndex" class="active-gou-img" mode="aspectFill" src="@/static/common/factor-active-gou.png" />
              </view>
            </view>
          </view>
        </view>

        <!-- 排序条件选项 -->
        <view v-else-if="factorPopupType === 'orderbyFactor'" class="orderby-factor-wrap">
          <view v-for="(oItem, oIndex) in orderByFactorList" :key="oItem.orderby" class="orderby-factor-item" :class="{ 'orderby-factor-item-active': oIndex === orderByFactorActiveIndex }" @click="changeOrderbyFactor(oIndex)">{{ oItem.name }}</view>
        </view>
      </view>

      <!-- 条件蒙层 -->
      <view v-if="isOpenFactorPopup" class="factor-mask" @click="closeFactorPopup" />
    </view>

    <!-- 律师模块 -->
    <view class="lawyer-module">
      <view v-for="(sItem) in findLawyerList" :key="sItem.user_id" class="lawyer-item" @click="navToLawyerDetail(sItem.user_id)">
        <view class="lawyer-left">
          <view class="lawyer-avatar">
            <u-lazy-load img-mode="aspectFill" height="140" border-radius="20" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="sItem.avatar" />
          </view>
          <view v-if="sItem.location_distance" class="loc-distance">距您{{ sItem.location_distance }}km</view>
          <view v-else class="loc-distance-btn" @click.stop="$u.toast('已提醒律师开启定位')">查看距离</view>
        </view>
        <view class="lawyer-right">
          <view class="lawyer-right-header">
            <view class="lawyer-name-wrap">
              <text>{{ sItem.nickname }}</text>
              <!-- <view v-if="sItem.is_guarantee" class="youxuan-tag">优选</view> -->
              <view v-if="sItem.is_ad" class="youxuan-tag">优选</view>
            </view>
            <view class="contact-btn">向Ta咨询</view>
          </view>
          <view class="serve-data">
            <text>执业{{ sItem.work_year }}年</text>
            <text style="margin: 0 2rpx;">｜</text>
            <text>{{ sItem.city }}</text>
          </view>
          <view class="company-name">{{ sItem.lawyer_office }}</view>
          <view class="tag-wrap">
            <view v-for="(tItem, tIndex) in sItem.lawyer_tags.slice(0, 3)" :key="tIndex" class="tag-item">{{ tItem }}</view>
          </view>
        </view>

        <view v-if="sItem.is_ad" class="ad-tag">{{ appConfigInfo.adv_config.adv_txt }}</view>
      </view>
    </view>

    <tab-bar :selected="1" />
  </view>
</template>

<script>
import mpAuthUtil from '@/common/utils/mpAuthUtil';
import { mapState, mapGetters } from 'vuex';

// 临时条件初始下标信息
const tempFactorInitInfo = { tempParentIndex: 0, tempChildIndex: -1 };

export default {
  name: 'FindPage',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px

      curLocCityInfo: null, // 当前所在城市信息
      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'regionFactor', 'caseFactor'，orderbyFactor
      
      regionDataList: [], // 地区数据列表
      regionFactorActiveInfo: { regionParentIndex: 0, regionChildIndex: -1 }, // 地区条件确定的下标信息

      caseTypeDataList: [], // 案件类型数据列表
      caseFactorActiveInfo: { caseParentIndex: 0, caseChildIndex: -1 }, // 案件类型条件确定的下标信息

      tempFactorActiveInfo: { ...tempFactorInitInfo }, // 临时条件选中的下标信息

      orderByFactorList: [{ orderby: 0, name: '综合排序' }, { orderby: 1, name: '离我最近' }, { orderby: 2, name: '优选律师' }], // 排序方式条件列表
      orderByFactorActiveIndex: -1, // 激活的排序 下标

      nearLawyerList: [], // 附近 律师列表
      findLawyerList: [], // find 律师列表
      findLawyerPage: 1, // find 律师当前页数
      findLawyerTotal: 0, // find 律师总数
      isNextLoading: false, // 是否正在加载下一页
      isFirstLoading: true, // 是否第一次加载数据

      headerAdvertSeat: [], // 头部广告位
    }
  },
  computed: {
    ...mapState(['appConfigInfo']),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysScreenHeight', 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
    this._getCurLocCityInfo(false);
    this._getRegionList();
    this._getCaseTypeList();
    
    this._getFindHeaderAdvertData();
  },
  onReachBottom() {
    const { findLawyerList, findLawyerTotal } = this;
    if (findLawyerList.length >= findLawyerTotal) return;
    this._getFindLawyerList(++this.findLawyerPage);
  },
  onPullDownRefresh() {
    // this._getNearLawyerList();
    this._getFindLawyerList();
    this._getFindHeaderAdvertData();
  },
  mounted() {
    this.$commonUtil.calcNodeHeight().then(res => { this.uNavbarHeight = res; });

    // #ifdef MP-KUAISHOU
    setTimeout(() => {
      const headerModuleNodeRef = uni.createSelectorQuery().in(this).select('.u-navbar');
      headerModuleNodeRef.boundingClientRect(rect => {
        this.uNavbarHeight = rect.bottom;
      }).exec();
    }, 1000);
    // #endif
  },
  methods: {
    /**
     * 获取当前位置城市信息
     */
    async _getCurLocCityInfo(isAutoOpenModal = true) {
      const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation', isAutoOpenModal);
      this.closeFactorPopup();
      
      if (authSetResult) {
        const [error, locResult] = await uni.getLocation({ type: 'gcj02' });
        console.log(locResult)
        
        // 当前位置信息
        if (locResult) {
          try {
            const param = { lng: locResult.longitude, lat: locResult.latitude };
            const { data: curLocCityData } = await this.$api.getCurLocCityInfoApi(param);
            this.curLocCityInfo = curLocCityData;
          } catch (error) {
            console.log(error);
          }
        }
      }

      // 获取 near 律师列表
      // this._getNearLawyerList();
      // 获取 find 律师列表
      this._getFindLawyerList();
    },
    /**
     * 获取地区数据列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await this.$api.getRegionListApi();
        // 重组数据结构
        regionData.cities.forEach(item => {
          item.cities.forEach(itm => {
            itm.province_id = item.district_id;
            itm.city_id = itm.district_id;
            itm.province = item.name;
          });
        });

        regionData.cities.unshift({ name: '热门', cities: [...regionData.hots.map(item => { item.name = item.city; item.district_id = item.city_id; return item; })] });
        this.regionDataList = regionData.cities;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取案件类型列表
     */
    async _getCaseTypeList() {
      try {
        const { data: caseTypeData } = await this.$api.getCaseTypeListApi({ is_have_hot: 1 });
        this.caseTypeDataList = caseTypeData;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取附近律师列表
     */
    async _getNearLawyerList() {
      try {
        const { data: nearLawyerData } = await this.$api.getFindNearbyLawyerList();
        this.nearLawyerList = nearLawyerData;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取查找律师头部 广告
     */
    async _getFindHeaderAdvertData() {
      const param = { user_id: this.userId, lawyer_tag_id: 0 };
      try {
        const { data: lawyerAdvertSeatData } = await this.$api.getLawyerAdvertSeatData(param);
        const advertSeatId = 496639967716708353; // 找律师头部位置 id
        const lawyerAdvertSeat = lawyerAdvertSeatData.find(item => item.advertisement_position_id == advertSeatId);
        if (lawyerAdvertSeat && lawyerAdvertSeat.advertisement.length) {
          this.headerAdvertSeat = lawyerAdvertSeat.advertisement;
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取 find 律师列表
     */
    async _getFindLawyerList(page = 1) {
      const { isNextLoading, regionFactorActiveInfo, caseFactorActiveInfo, curLocCityInfo } = this;
      if (isNextLoading) return;
      this.isNextLoading = true;
      page === 1 && uni.showLoading({ title: '加载中', mask: true });

      const param = { page, sort_type: 0, is_guarantee: 0 };
      // console.log(param)

      // 筛选条件包含地区
      if (regionFactorActiveInfo.regionChildIndex >= 0) {
        const activeRegionParentObj = this.regionDataList[regionFactorActiveInfo.regionParentIndex];
        const regionCityId = activeRegionParentObj.cities[regionFactorActiveInfo.regionChildIndex].district_id;
        // 添加城市参数
        regionCityId && (param.city_id = regionCityId);
      // 若未添加地区筛选条件 并且 存在了当前所在城市信息 则添加所在城市 id
      } else if (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) {
        param.city_id = curLocCityInfo.cityId;
      }

      // 筛选条件包含案件类型
      if (caseFactorActiveInfo.caseChildIndex >= 0) {
        const activeCaseTypeParentObj = this.caseTypeDataList[caseFactorActiveInfo.caseParentIndex];
        const caseTypeId = activeCaseTypeParentObj.lawyer_tags[caseFactorActiveInfo.caseChildIndex].lawyer_tag_id;
        // 添加案件类型参数
        caseTypeId && (param.lawyer_tag_id = caseTypeId);
      }
      // 排序类型
      if (this.orderByFactorActiveIndex > -1) {
        param.order_by = this.orderByFactorList[this.orderByFactorActiveIndex].orderby;
        // 优选律师
        (param.order_by === 2) && (param.is_guarantee = 1);
      }

      try {
        const { data: lawyerData } = await this.$api.getFindLawyerList(param);

        (page === 1) && (this.findLawyerList = []); // 请求第一页，先清空数组
        this.findLawyerList.push(...lawyerData.data);
        this.findLawyerTotal = lawyerData.total;
        this.isNextLoading = false;
        this.isFirstLoading = false;
        uni.stopPullDownRefresh();
      } catch (error) {
        this.isNextLoading = false;
        this.isFirstLoading = false;
        console.log(error);
      }
    },

    /**
     * 打开条件弹框
     * @param {String} factorPopupType
     */
    openFactorPopup(factorPopupType) {
      if (this.isOpenFactorPopup && this.factorPopupType === factorPopupType) return this.closeFactorPopup();
      this.factorPopupType = factorPopupType; // 弹框类型
      // 为临时条件信息赋值 地区类型
      if (factorPopupType === 'regionFactor') {
        this.tempFactorActiveInfo.tempParentIndex = this.regionFactorActiveInfo.regionParentIndex;
        this.tempFactorActiveInfo.tempChildIndex = this.regionFactorActiveInfo.regionChildIndex;
      // 为临时条件信息赋值 案件类型
      } else if (factorPopupType === 'caseFactor') {
        this.tempFactorActiveInfo.tempParentIndex = this.caseFactorActiveInfo.caseParentIndex;
        this.tempFactorActiveInfo.tempChildIndex = this.caseFactorActiveInfo.caseChildIndex;
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
     * 改变 地区导航 侧边栏
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
      // 临时条件也赋值一份
      this.tempFactorActiveInfo.tempParentIndex = this.regionFactorActiveInfo.regionParentIndex;
      this.tempFactorActiveInfo.tempChildIndex = this.regionFactorActiveInfo.regionChildIndex;

      this.closeFactorPopup();
      this._getFindLawyerList();
      this.findLawyerList = [];
    },

    /**
     * 改变 案件类型导航 侧边栏
     */
    changeCaseSideNav(caseParentIndex) {
      // 临时条件选中的父下标
      this.tempFactorActiveInfo.tempParentIndex = caseParentIndex;
      // 临时条件选中的子下标 = 临时条件选中的父下标 === 已选择的案件类型父下标 ? 已选择的案件类型子下标 : -1
      this.tempFactorActiveInfo.tempChildIndex = this.tempFactorActiveInfo.tempParentIndex === this.caseFactorActiveInfo.caseParentIndex
        ? this.caseFactorActiveInfo.caseChildIndex
        : -1;
    },
    /**
     * 选择 案件类型选项
     */
    changeCaseTypeFactor(caseChildIndex) {
      this.caseFactorActiveInfo.caseParentIndex = this.tempFactorActiveInfo.tempParentIndex; // 设置地区父下标
      this.caseFactorActiveInfo.caseChildIndex = caseChildIndex;
      // 临时条件也赋值一份
      this.tempFactorActiveInfo.tempParentIndex = this.caseFactorActiveInfo.caseParentIndex;
      this.tempFactorActiveInfo.tempChildIndex = this.caseFactorActiveInfo.caseChildIndex;

      this.closeFactorPopup();
      this._getFindLawyerList();
      this.findLawyerList = [];
    },
    /**
     * 选择 排序方式选项
     */
    changeOrderbyFactor(orderbyIndex) {
      this.orderByFactorActiveIndex = orderbyIndex
      this.closeFactorPopup();
      this._getFindLawyerList();
      this.findLawyerList = [];
    },
    /**
		 * 导航进入页面
		 */
		navToPage(pagePath) {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
			uni.navigateTo({ url: pagePath });
		},
    /**
     * 前往用户主页
     */
    navToLawyerDetail(userId) {
			uni.navigateTo({ url: `/pagesV1/index/lawyerPage?id=${ userId }` });
		},
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
