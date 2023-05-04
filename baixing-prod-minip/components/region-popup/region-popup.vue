<template>
  <view v-if="isShowRegionPopup" class="region-popup-module" :style="{ zIndex }" @click="isShowRegionPopup = false">
    <view class="region-popup" :style="{ paddingBottom: sysSafeAreaHeight + 'px', height: '720rpx' }">
      <!-- 左侧城市导航 -->
      <view class="sidenav-wrap">
        <view v-for="(nItem, nIndex) in regionDataList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': regionFactorActiveInfo.regionParentIndex === nIndex }" @click.stop="changeRegionSideNav(nIndex)">{{ nItem.name }}</view>
        <!-- 侧边导航条 -->
        <view class="sidenav-line-outer" :style="{ top: (regionFactorActiveInfo.regionParentIndex * 100) + 'rpx' }">
          <view class="sidenav-line-inner" />
        </view>
      </view>
      <!-- 右侧城市数据 -->
      <view class="content-wrap region-wrap">
        <!-- 定位 -->
        <view v-if="regionFactorActiveInfo.regionParentIndex === 0" class="loc-wrap">
          <view class="loc-header">
            <view class="loc-left">当前定位</view>
          </view>
          <view class="loc-item" :class="{ 'loc-item-active': regionFactorActiveInfo.regionChildIndex === -1 && curLocCityInfo }" @click.stop="clickGetCurLocCityInfo">
            <image class="location-img" mode="aspectFill" src="@/static/common/location-active.png" />
            <text v-if="!curLocCityInfo">暂无</text>
            <text v-else>{{ curLocCityInfo.city }}</text>
            <image v-if="regionFactorActiveInfo.regionChildIndex === -1" class="active-gou-img" mode="aspectFill" src="@/static/common/factor-active-gou.png" />
          </view>
        </view>
        <!-- 热门城市 -->
        <view class="hot-wrap">
          <view class="hot-header">
            <view class="hot-left">{{ regionDataList[regionFactorActiveInfo.regionParentIndex].name }}</view>
          </view>
          <view class="city-wrap">
            <view v-for="(cItem, cIndex) in regionDataList[regionFactorActiveInfo.regionParentIndex].cities" :key="cIndex" class="city-item" :class="{ 'city-item-active': regionFactorActiveInfo.regionChildIndex === cIndex }" :style="cItem.name && cItem.name.length > 5 ? 'font-size: 24rpx;' : ''" @click.stop="changeRegionCityFactor(cIndex)">
              <text>{{ cItem.name }}</text>
              <image v-if="regionFactorActiveInfo.regionChildIndex === cIndex" class="active-gou-img" mode="aspectFill" src="@/static/common/factor-active-gou.png" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import mpAuthUtil from '@/common/utils/mpAuthUtil';

export default {
  name: 'FastPubPhonePopup',
  props: {
    isAutoGetCurLoc: { type: Boolean, default: true }, // 是否自动获取当前位置
    zIndex: { type: Number, default: 999 }
  },
  data() {
    return {
      curLocCityInfo: null, // 当前所在城市信息

      regionDataList: [], // 地区数据列表
      isShowRegionPopup: false, // 是否限时地区 popup
      regionFactorActiveInfo: { regionParentIndex: 0, regionChildIndex: -2 }, // 地区条件确定的下标信息
    };
  },
  computed: {
    ...mapGetters(['sysSafeAreaHeight']),

    ...mapGetters('userModule', ['userId']),
  },
  created() {
    this._getRegionList();
    this.isAutoGetCurLoc && this._getCurLocCityInfo();

    // 监听全局的轻提示事件
    uni.$on('toastEvt', data => {
      console.log('登录');
      this._getCurLocCityInfo();
    });
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
            const { data: curLocCityData } = await this.$api.getCurLocCityInfoApi(param);
            this.curLocCityInfo = curLocCityData;
          } catch (error) {
            console.log(error);
          }
        } else {
          // 获取不到 经纬度 通过 手机号获取
          const { data: curLocCityData } = await this.$api.getLocCityInfoApi({ lng: '-1', lat: '-1' });
          this.curLocCityInfo = {
            province: curLocCityData.province,
            city: curLocCityData.city,
            provinceId: curLocCityData.province_id,
            cityId: curLocCityData.city_id,
          };

        }
        this.regionFactorActiveInfo.regionParentIndex = 0;
        this.regionFactorActiveInfo.regionChildIndex = -1;
        // 确定城市信息
        const cityInfo = { province_id: this.curLocCityInfo.provinceId, city_id: this.curLocCityInfo.cityId, province: this.curLocCityInfo.province, city: this.curLocCityInfo.city, };
        this.$emit('confirmCityEvt', cityInfo);
      }
    },
    /**
     * 点击获取当前位置城市信息
     */
    async clickGetCurLocCityInfo() {
      const { curLocCityInfo } = this;
      if (curLocCityInfo) {
        this.regionFactorActiveInfo.regionParentIndex = 0;
        this.regionFactorActiveInfo.regionChildIndex = -1;
        
        // 确定城市信息
        const cityInfo = { province_id: curLocCityInfo.provinceId, city_id: curLocCityInfo.cityId, province: curLocCityInfo.province, city: curLocCityInfo.city, };
        this.$emit('confirmCityEvt', cityInfo);
        this._closeRegionPopup();
        return;
      }

      const authSetResult = await mpAuthUtil.getMpAuthSetting('userLocation');
      if (authSetResult) {
        const [error, locResult] = await uni.getLocation({ type: 'gcj02' });
        if (locResult) {
          try {
            const param = { lng: locResult.longitude, lat: locResult.latitude };
            const { data: curLocCityData } = await this.$api.getCurLocCityInfoApi(param);
            this.curLocCityInfo = curLocCityData;
          } catch (error) {
            console.log(error);
          }
        } else {
          // 获取不到 经纬度 通过 手机号获取
          const { data: curLocCityData } = await this.$api.getLocCityInfoApi({ lng: '-1', lat: '-1' });
          this.curLocCityInfo = {
            province: curLocCityData.province,
            city: curLocCityData.city,
            provinceId: curLocCityData.province_id,
            cityId: curLocCityData.city_id,
          };
        }
      }
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

        // regionData.cities.unshift({ name: '热门', cities: [{ province_id: 0, city_id: 0, province: '全国', name: '全国', }, ...regionData.hots.map(item => { item.name = item.city; item.district_id = item.city_id; return item; })] });
        regionData.cities.unshift({ name: '热门', cities: [...regionData.hots.map(item => { item.name = item.city; item.district_id = item.city_id; return item; })] });
        this.regionDataList = regionData.cities;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开弹框
     */
    _openRegionPopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.isShowRegionPopup = true;
    },
    /**
     * 关闭弹框
     */
    _closeRegionPopup() {
      this.isShowRegionPopup = false;
    },

    /**
     * 改变侧边栏 地区导航选项
     */
    changeRegionSideNav(regionParentIndex) {
      // 地区条件 父下标
      this.regionFactorActiveInfo.regionParentIndex = regionParentIndex;
      // 地区条件 子下标 -2 
      this.regionFactorActiveInfo.regionChildIndex = -2;
    },

    /**
     * 选择 地区城市选项
     */
    changeRegionCityFactor(regionChildIndex) {
      this.regionFactorActiveInfo.regionChildIndex = regionChildIndex; // 设置地区子下标
      const activeRegionParentObj = this.regionDataList[this.regionFactorActiveInfo.regionParentIndex];
      const regionCity = activeRegionParentObj.cities[this.regionFactorActiveInfo.regionChildIndex];
      // 确定城市信息
      const cityInfo = { province_id: regionCity.province_id, city_id: regionCity.city_id, province: regionCity.province, city: regionCity.name, };

      this.$emit('confirmCityEvt', cityInfo);
      this._closeRegionPopup();
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
