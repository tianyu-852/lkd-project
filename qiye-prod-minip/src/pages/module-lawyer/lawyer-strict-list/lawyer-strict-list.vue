<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="严选律师" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <!-- 条件过滤模块 -->
    <view class="factor-module">
      <view class="factor-item" :class="{ 'factor-item-active': regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) }" @click.stop="openFactorPopup('regionFactor')">
        <text v-if="regionFactorActiveInfo.regionChildIndex > -1">{{ regionDataList[regionFactorActiveInfo.regionParentIndex].cities[regionFactorActiveInfo.regionChildIndex].name }}</text>
        <text v-else-if="regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo">{{ curLocCityInfo.city }}</text>
        <text v-else>选择地区</text>
        <image class="triangle-bottom" :class="{ 'triangle-bottom-active': factorPopupType === 'regionFactor' && isOpenFactorPopup }" mode="aspectFill" :src="regionFactorActiveInfo.regionChildIndex > -1 || (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
      </view>
      <view class="factor-item" :class="{ 'factor-item-active': caseFactorActiveInfo.caseChildIndex > -1 }" @click.stop="openFactorPopup('caseFactor')">
        <text v-if="caseFactorActiveInfo.caseChildIndex > -1">{{ caseTypeDataList[caseFactorActiveInfo.caseParentIndex].lawyer_tags[caseFactorActiveInfo.caseChildIndex].lawyer_tag }}</text>
        <text v-else>案件类型</text>
        <image class="triangle-bottom" :class="{ 'triangle-bottom-active': factorPopupType === 'caseFactor' && isOpenFactorPopup }" mode="aspectFill" :src="caseFactorActiveInfo.caseChildIndex > -1 ? '/static/common/triangle-bottom-active.png' : '/static/common/triangle-bottom-inactive.png'" />
      </view>

      <!-- 条件过滤弹框 -->
      <view class="factor-option-popup" :style="{ height: isOpenFactorPopup ? '860rpx' : 0 }">
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
                <view class="loc-right" @click="closeFactorPopup">
                  <image class="arrow-up" mode="aspectFill" src="@/static/common/arrow-up-3.png" />
                  <text>收起</text>
                </view>
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
                <view v-for="(cItem, cIndex) in regionDataList[tempFactorActiveInfo.tempParentIndex].cities" :key="cIndex" class="city-item" :class="{ 'city-item-active': tempFactorActiveInfo.tempChildIndex === cIndex }" :style="cItem.name && cItem.name.length > 5 ? 'font-size: 24rpx;' : ''" @click="changeRegionCity(cIndex)">
                  <text>{{ cItem.name }}</text>
                  <image v-if="tempFactorActiveInfo.tempChildIndex === cIndex" class="active-gou-img" mode="aspectFill" src="@/static/lawyer/factor-active-gou.png" />
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 案件条件选项 -->
        <template v-else-if="factorPopupType === 'caseFactor'">
          <view class="sidenav-wrap">
            <view v-for="(nItem, nIndex) in caseTypeDataList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': tempFactorActiveInfo.tempParentIndex === nIndex }" @click="changeCaseSideNav(nIndex)">{{ nItem.lawyer_tag_group }}</view>
            <!-- 侧边导航条 -->
            <view class="sidenav-line-outer" :style="{ top: (tempFactorActiveInfo.tempParentIndex * 100) + 'rpx' }">
              <view class="sidenav-line-inner" />
            </view>
          </view>
          <view class="content-wrap case-wrap">
            <view class="case-header">
              <view class="case-left">{{ caseTypeDataList[tempFactorActiveInfo.tempParentIndex].lawyer_tag_group }}</view>
              <view class="case-right" @click="closeFactorPopup">
                <image class="arrow-up" mode="aspectFill" src="@/static/common/arrow-up-3.png" />
                <text>收起</text>
              </view>
            </view>
            <view class="type-wrap">
              <view v-for="(tItem, tIndex) in caseTypeDataList[tempFactorActiveInfo.tempParentIndex].lawyer_tags" :key="tIndex" class="type-item" :class="{ 'type-item-active': tempFactorActiveInfo.tempChildIndex === tIndex }" @click="changeCaseType(tIndex)">
                <text>{{ tItem.lawyer_tag }}</text>
                <image v-if="tempFactorActiveInfo.tempChildIndex === tIndex" class="active-gou-img" mode="aspectFill" src="@/static/lawyer/factor-active-gou.png" />
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <!-- 律师模块 -->
    <view class="lawyer-module" :style="{ top: uNavbarHeight + 'px' }">
      <view v-for="(sItem) in strictSelectLawyerList" :key="sItem.user_id" class="lawyer-item" @click="$commonUtil.routeNavTo('module-lawyer/lawyer-detail/lawyer-detail', { lawyerId: sItem.user_id });">
        <view class="lawyer-left">
          <view class="lawyer-avatar">
            <u-lazy-load img-mode="aspectFill" height="160" border-radius="10" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="sItem.avatar" />
          </view>
          <view class="work-year">执业{{ sItem.work_year }}年</view>
        </view>
        <view class="lawyer-right">
          <view class="lawyer-right-header">
            <view class="lawyer-name-wrap">
              <text>{{ sItem.nickname }}</text>
              <image v-if="sItem.is_guarantee" class="badge-img" mode="aspectFill" src="@/static/common/approve-badge-active.png" />
            </view>
            <view class="contact-btn">向Ta咨询</view>
          </view>
          <view class="company-name">{{ sItem.lawyer_office }}</view>
          <view class="serve-data">
            <text>已服务</text>
            <text class="data-num">{{ sItem.enterprise_number }}</text>
            <text>家企业</text>
            <text style="margin-left: 10rpx;">好评</text>
            <text class="data-num">{{ sItem.praise_number }}</text>
            <text>次</text>
          </view>
          <view class="tag-wrap">
            <view v-for="(tItem, tIndex) in sItem.lawyer_tags.slice(0, 3)" :key="tIndex" class="tag-item">{{ tItem }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空数据 -->
    <view v-if="!isFirstLoading && !isNextLoading && !strictSelectLawyerList.length" class="empty-wrap">
      <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="@/static/common/empty-data.png" />
      <view class="null-text">暂无相关数据</view>
    </view>

    <!-- 蒙层 -->
    <view v-if="isOpenFactorPopup" class="factor-mask" @click="closeFactorPopup" />
  </view>
</template>

<script>
import mpAuthUtil from '@/common/utils/mpAuthUtil';

// 临时条件初始下标信息
const tempFactorInitInfo = { tempParentIndex: 0, tempChildIndex: -1 };

export default {
  name: 'LawyerStrictList',
  data() {
    return {
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,
      uNavbarHeight: 0, // 顶部导航栏高度 px

      curLocCityInfo: null, // 当前所在城市信息

      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'regionFactor', 'caseFactor'

      regionDataList: [], // 地区数据列表
      regionFactorActiveInfo: { regionParentIndex: 0, regionChildIndex: -1 }, // 地区条件确定的下标信息
      caseTypeDataList: [], // 案件类型数据列表
      caseFactorActiveInfo: { caseParentIndex: 0, caseChildIndex: -1 }, // 案件类型条件确定的下标信息
      tempFactorActiveInfo: { ...tempFactorInitInfo }, // 临时条件选中的下标信息

      strictSelectLawyerList: [], // 严选律师列表
      strictSelectLawyerPage: 1, // 严选律师当前页数
      strictSelectLawyerTotal: 0, // 严选律师总数
      isNextLoading: false, // 是否正在加载下一页
      isFirstLoading: true, // 是否第一次加载数据
    };
  },
  onLoad() {
    this._getCurLocCityInfo();
    this._getRegionList();
    this._getCaseTypeList();
  },
  onReachBottom() {
    const { strictSelectLawyerList, strictSelectLawyerTotal } = this;
    if (strictSelectLawyerList.length >= strictSelectLawyerTotal) return;
    // 加载下一页严选律师
    this._getStrictSelectLawyerList(++this.strictSelectLawyerPage);
  },
  mounted() {
    this.$commonUtil.calcUNavNodeHeight().then(res => { this.uNavbarHeight = res; });
  },
  methods: {
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
            this.curLocCityInfo = curLocCityData;
          } catch (error) {
            console.log(error);
          }
        }
      }

      // 获取严选律师列表
      this._getStrictSelectLawyerList();
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

        this._getStrictSelectLawyerList();
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
        const { data: curLocCityData } = await this.$api.getCurLocCityInfo(param);
        this.curLocCityInfo = curLocCityData;

        // 先重置地区筛选条件下标信息
        this.regionFactorActiveInfo.regionParentIndex = 0;
        this.regionFactorActiveInfo.regionChildIndex = -1;

        this._getStrictSelectLawyerList();
        this.closeFactorPopup();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await this.$api.getRegionList();
        regionData.cities.unshift({ name: '热门', cities: regionData.hots.map(item => { item.name = item.city; item.district_id = item.city_id; return item; }) });
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
        const { data: caseTypeData } = await this.$api.getCaseTypeList({ is_have_hot: 1 });
        this.caseTypeDataList = caseTypeData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取严选律师列表
     */
    async _getStrictSelectLawyerList(page = 1) {
      const { isNextLoading, regionFactorActiveInfo, caseFactorActiveInfo, curLocCityInfo } = this;
      if (isNextLoading) return;
      this.isNextLoading = true;
      page === 1 && uni.showLoading({ title: '加载中', mask: true });

      const param = { page };

      // 筛选条件包含地区
      if (regionFactorActiveInfo.regionChildIndex >= 0) {
        const activeRegionParentObj = this.regionDataList[regionFactorActiveInfo.regionParentIndex];
        const regionCityId = activeRegionParentObj.cities[regionFactorActiveInfo.regionChildIndex].district_id;
        // 添加城市参数
        regionCityId && (param.city_id = regionCityId);
      // 若未添加地区筛选条件 并且 存在了当前所在城市信息 则添加所在城市 id
      } else if (regionFactorActiveInfo.regionChildIndex < 0 && curLocCityInfo) {
        param.city_id = curLocCityInfo.city_id;
      }

      // 筛选条件包含案件类型
      if (caseFactorActiveInfo.caseChildIndex >= 0) {
        const activeCaseTypeParentObj = this.caseTypeDataList[caseFactorActiveInfo.caseParentIndex];
        const caseTypeId = activeCaseTypeParentObj.lawyer_tags[caseFactorActiveInfo.caseChildIndex].lawyer_tag_id;
        // 添加案件类型参数
        caseTypeId && (param.lawyer_tag_id = caseTypeId);
      }

      try {
        const { data: strictSelectLawyerData } = await this.$api.getStrictSelectLawyerList(param);
        (page === 1) && (this.strictSelectLawyerList = []); // 请求第一页，先清空数组
        this.strictSelectLawyerList.push(...strictSelectLawyerData.items);
        this.strictSelectLawyerTotal = strictSelectLawyerData.total;
        this.isNextLoading = false;
        this.isFirstLoading = false;
      } catch (error) {
        this.isNextLoading = false;
        this.isFirstLoading = false;
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
    changeRegionCity(regionChildIndex) {
      this.regionFactorActiveInfo.regionParentIndex = this.tempFactorActiveInfo.tempParentIndex; // 设置地区父下标
      this.regionFactorActiveInfo.regionChildIndex = regionChildIndex; // 设置地区子下标
      // 临时条件也赋值一份
      this.tempFactorActiveInfo.tempParentIndex = this.regionFactorActiveInfo.regionParentIndex;
      this.tempFactorActiveInfo.tempChildIndex = this.regionFactorActiveInfo.regionChildIndex;

      this.closeFactorPopup();
      this._getStrictSelectLawyerList();
      this.strictSelectLawyerList = [];
    },
    /**
     * 改变侧边栏 案件类型导航选项
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
    changeCaseType(caseChildIndex) {
      this.caseFactorActiveInfo.caseParentIndex = this.tempFactorActiveInfo.tempParentIndex; // 设置地区父下标
      this.caseFactorActiveInfo.caseChildIndex = caseChildIndex;
      // 临时条件也赋值一份
      this.tempFactorActiveInfo.tempParentIndex = this.caseFactorActiveInfo.caseParentIndex;
      this.tempFactorActiveInfo.tempChildIndex = this.caseFactorActiveInfo.caseChildIndex;

      this.closeFactorPopup();
      this._getStrictSelectLawyerList();
      this.strictSelectLawyerList = [];
    },
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
