<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="banner-momdule">
      <view class="factor-module">
        <view class="factor-title">案源套餐选择</view>
        <!-- 销售未分享 -->
        <template v-if="!sellerShareFormDetail">
          <!-- 案源地区 -->
          <view class="cell-item" @click="$refs.regionPopupRef._openRegionPopup()">
            <view class="cell-left">案源地区</view>
            <view class="cell-right">
              <view v-if="caseSourceRegion.provinceName && caseSourceRegion.cityName">{{ caseSourceRegion.provinceName === caseSourceRegion.cityName ? '' : (caseSourceRegion.provinceName + '-') }}{{ caseSourceRegion.cityName }}</view>
              <view v-else style="color: #999;">请选择案源地区</view>
              <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
            </view>
          </view>
          <!-- 匹配数量 -->
          <view class="cell-item">
            <view class="cell-left">匹配数量</view>
            <view class="cell-right">
              <view v-for="(oItem, oIndex) in vipCaseSourceServeList" :key="oIndex" class="opt-item" :class="{ 'opt-item-active': activeVipCaseSourceIndex === oIndex }" @click="activeVipCaseSourceIndex = oIndex">{{ oItem.name }}</view>
            </view>
          </view>
          <!-- 套餐类型 -->
          <view class="cell-item">
            <view class="cell-left">套餐类型</view>
            <view class="cell-right">
              <view v-for="(tItem, tIndex) in vipCaseSourceServeList[activeVipCaseSourceIndex].list" :key="tIndex" class="opt-item" :class="{ 'opt-item-active': activeVipCaseSourceTypeIndex === tIndex }" @click="activeVipCaseSourceTypeIndex = tIndex">{{ tItem.unit }}</view>
            </view>
          </view>
        </template>
        <!-- 销售已分享 -->
        <template v-else>
          <!-- 案源地区 -->
          <view class="cell-item">
            <view class="cell-left">案源地区</view>
            <view class="cell-right">
              <view v-if="sellerShareRegion.provinceName && sellerShareRegion.cityName">{{ sellerShareRegion.provinceName === sellerShareRegion.cityName ? '' : (sellerShareRegion.provinceName + '-') }}{{ sellerShareRegion.cityName }}</view>
            </view>
          </view>
          <!-- 套餐类型 -->
          <view class="cell-item">
            <view class="cell-left">套餐类型</view>
            <view class="cell-right">
              <view>{{ vipCaseSourceServeList[sellerShareVipIndex].name }}/{{ vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].unit }}</view>
            </view>
          </view>
          <!-- 匹配数量 -->
          <view class="cell-item">
            <view class="cell-left">匹配数量</view>
            <view class="cell-right">
              <view>{{ vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].num * vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].day }}条</view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <view class="base-module discount-module">
      <template v-if="!sellerShareFormDetail && userInfo.sales_affair && userInfo.sales_affair.user_id">
        <view class="discount-item">
          <view class="discount-item-title">限时优惠</view>
          <input v-model="vipCaseSourceServeList[activeVipCaseSourceIndex].list[activeVipCaseSourceTypeIndex].discountDesc" class="discount-item-input" cursor-spacing="30" placeholder="请输入限时优惠文案" placeholder-style="color: #999; font-size: 28rpx;">
        </view>

        <view class="discount-item">
          <view class="discount-item-title">金额设置</view>
          <input v-model="vipCaseSourceServeList[activeVipCaseSourceIndex].list[activeVipCaseSourceTypeIndex].discountPrice" class="discount-item-input" cursor-spacing="30" :placeholder="'请输入优惠金额 (默认' + vipCaseSourceServeList[activeVipCaseSourceIndex].list[activeVipCaseSourceTypeIndex].price + '元)'" placeholder-style="color: #999; font-size: 28rpx;">
        </view>

        <view class="discount-item">
          <view class="discount-item-title">服务截止时间</view>
          <view class="discount-item-input" @click="isShowEndDatePicker = true">{{ vipCaseSourceServeList[activeVipCaseSourceIndex].list[activeVipCaseSourceTypeIndex].discountDay }}</view>
        </view>
      </template>
      <!-- 存在销售分享的标识 -->
      <template v-else-if="sellerShareFormDetail">
        <view v-if="sellerShareFormDetail[vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].source_match_package_id].desc" class="discount-item">
          <view class="discount-item-title">限时优惠</view>
          <view class="discount-item-desc">{{ sellerShareFormDetail[vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].source_match_package_id].desc }}</view>
        </view>
        <view class="discount-item">
          <view class="discount-item-title">服务截止时间</view>
          <view class="discount-item-desc">{{ sellerShareFormDetail[vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].source_match_package_id].day | dateFormatFilter }}</view>
        </view>
      </template>

      <template v-if="!sellerShareFormDetail && userInfo.sales_affair.user_id">
        <label v-if="caseSourceRegion.provinceName && caseSourceRegion.cityName" class="share-label" for="shareBtnId">
          <view class="pay-btn">邀请用户支付</view>
        </label>
        <view v-else class="pay-btn" @click="$u.toast('请选择案源地区')">邀请用户支付</view>
      </template>
      <view v-else-if="sellerShareFormDetail" class="pay-btn" @click="confirmBuyVipCaseSourceServe">
        <text>￥</text>
        <text>{{ sellerShareFormDetail[vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex].source_match_package_id].price }}元</text>
        <text style="margin-left: 10rpx;">立即支付</text>
      </view>
      
      <!-- 协议 -->
      <view v-if="sellerShareFormDetail" class="protocol-wrap">
        <text>开通既表示同意</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.case_match_agreement)">《案源服务协议》</text>
        <text>与</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.case_match_refund_agreement)">《案源线索返款规则》</text>
      </view>
    </view>

    <view class="base-module detail-module">
      <view class="base-title">案源套餐选择</view>
      <view @click.stop="$commonUtil.previewImg([vipCaseSourceServeImg], vipCaseSourceServeImg)">
        <image style="width: 100%; display: block;" mode="widthFix" :src="vipCaseSourceServeImg" />
      </view>
    </view>

    <u-picker
      v-model="isShowEndDatePicker"
      mode="time"
      :start-year="$dayjs().year()"
      :end-year="$dayjs().add(5, 'y').year()"
      :default-time="vipCaseSourceServeList[activeVipCaseSourceIndex].list[activeVipCaseSourceTypeIndex].discountDay"
      @confirm="onVipEndDatePickerConfirmEvt"
    />

    <!-- 地区 popup -->
    <region-popup ref="regionPopupRef" :isAutoGetCurLoc="false" @confirmCityEvt="onRegionPopupConfirmEvt" />
    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';
import dayjs from 'dayjs';

export default {
  name: 'VipCaseSourceServe',
  filters: {
    dateFormatFilter(value) {
      return dayjs().add(value, 'd').format('YYYY-MM-DD');
    }
  },
  data() {
    return {
      vipCaseSourceServeList: [], // 案源套餐列表
      activeVipCaseSourceIndex: 0, // 选中的案源套餐 下标
      activeVipCaseSourceTypeIndex: 0, // 选中的案源套餐 类型下标
      // 案源地区
      caseSourceRegion: {
        provinceName: '',
        cityName: '',
        caseSource_province_id: '',
        caseSource_city_id: '',
      },

      isShowEndDatePicker: false, // 是否显示 vip 过期 picker
      vipCaseSourceServeImg: '', // 案源套餐详情图片

      sellerShareStr: '', // 销售分享标识
      sellerShareVipIndex: -1, // 销售分享 套餐下标
      sellerShareVipTypeIndex: -1, // 销售分享 套餐类型下标
      // 销售分享 案源地区信息
      sellerShareRegion: {
        provinceName: '',
        cityName: '',
        caseSource_province_id: '',
        caseSource_city_id: '',
      },
      sellerShareFormDetail: null, // 销售分享 案源套餐 详情
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

    // 销售分享标识
    if (routeParam.sellerShareStr) this.sellerShareStr = routeParam.sellerShareStr;
    // 销售分享地区
    if (routeParam.sellerShareProvince && routeParam.sellerShareCity) {
      this.sellerShareRegion.caseSource_province_id = routeParam.sellerShareProvinceId;
      this.sellerShareRegion.caseSource_city_id = routeParam.sellerShareCityId;
      this.sellerShareRegion.provinceName = routeParam.sellerShareProvince;
      this.sellerShareRegion.cityName = routeParam.sellerShareCity;
    }
    // 销售分享 套餐下标
    if (Number(routeParam.sellerShareVipIndex) > -1) {
      this.sellerShareVipIndex = Number(routeParam.sellerShareVipIndex);
    }
    // 销售分享 套餐类型下标
    if (Number(routeParam.sellerShareVipTypeIndex) > -1) {
      this.sellerShareVipTypeIndex = Number(routeParam.sellerShareVipTypeIndex);
    }
    // 未登录进入登录页面
    if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

    // 获取销售分享的 优惠套餐
    this.sellerShareStr && this._getSellerShareFormDetail(this.sellerShareStr);
    this._getVipCaseSourceServe();
  },
  async onShareAppMessage() {
    const { userInfo, vipCaseSourceServeList } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    // 拉平案源套餐 列表
    const _vipCaseSourceServeFlatList = []
    vipCaseSourceServeList.forEach((item => {
      _vipCaseSourceServeFlatList.push(...item.list)
    }));
    
    // 销售身份
    if (userInfo.sales_affair.user_id) {
      if (_vipCaseSourceServeFlatList.some(item => item.discountPrice.trim() && !(/^\d+(\.\d+)?$/.test(item.discountPrice.trim())))) return this.$u.toast('请输入正确的套餐价格');
      if (_vipCaseSourceServeFlatList.some(item => this.$dayjs(item.discountDay.trim()).diff(this.$dayjs(), 'd') <= 0)) return this.$u.toast('请选择合理套餐结束日期');

      const form_data = {};
      // 组织参数
      _vipCaseSourceServeFlatList.forEach(item => {
        form_data[item.source_match_package_id] = {
          desc: item.discountDesc.trim(),
          price: item.discountPrice.trim() || item.price,
          day: this.$dayjs(`${ item.discountDay.trim() } 00:00:00`).diff(this.$dayjs().startOf('d'), 'd')
        }
      });
      const param = { user_id: userInfo.sales_affair.user_id, form_data: JSON.stringify(form_data) }
      const { data: sellerFlagData } = await this.$api.sellerCreateShareVipCaseSourceServeFormApi(param);

      return {
        title: '律快答智慧法律服务生态',
        path: `${ currentRoute }?sellerShareStr=${ sellerFlagData.share_affairs_str }&sellerShareVipIndex=${ this.activeVipCaseSourceIndex }&sellerShareVipTypeIndex=${ this.activeVipCaseSourceTypeIndex }&sellerShareProvince=${ this.caseSourceRegion.provinceName }&sellerShareCity=${ this.caseSourceRegion.cityName }&sellerShareProvinceId=${ this.caseSourceRegion.caseSource_province_id }&sellerShareCityId=${ this.caseSourceRegion.caseSource_city_id }`,
        imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023110-1673344050855-e43Xjp.png'
      }
    } else {
      return {
        title: '律快答智慧法律服务生态',
        path: `${ currentRoute }`,
        imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023110-1673344050855-e43Xjp.png'
      }
    }
  },
  methods: {
    /**
     * 获取 案源vip 列表
     */
    async _getVipCaseSourceServe() {
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: vipCaseSourceServeData } = await this.$api.getVipCaseSourceServeApi();

        // 套餐先分组
        let vipCaseSourceGroup = {}
        vipCaseSourceServeData.data.forEach(item => {
          if (Object.keys(vipCaseSourceGroup).indexOf('' + item.field) === -1) {
            vipCaseSourceGroup[item.field] = {};
            vipCaseSourceGroup[item.field].name = `日均 ${ item.num } 条`;
            vipCaseSourceGroup[item.field].list = [];
          }
          //对应插入属性值
          vipCaseSourceGroup[item.field].list.push(item);
        });

        // 重新组织 vip案源 套餐
        const _vipCaseSourceServeList = [];
        for (let groupKey in vipCaseSourceGroup) {
          _vipCaseSourceServeList.push({
            name: vipCaseSourceGroup[groupKey].name,
            type: groupKey,
            list: vipCaseSourceGroup[groupKey].list.map(item => {
              item.discountPrice = ''; // 优惠价格
              item.discountDesc = ''; // 优惠文案
              item.discountDay = `${ this.$dayjs().add(item.day, 'd').format('YYYY-MM-DD') }`; // 优惠天数
              return item;
            })
          });
        }
        this.vipCaseSourceServeList = _vipCaseSourceServeList;
        this.vipCaseSourceServeImg = vipCaseSourceServeData.image_introduce;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取销售分享 案源vip 套餐优惠表单详情
     */
    async _getSellerShareFormDetail(share_affairs_str) {
      if (!share_affairs_str) return;
      const param = { share_affairs_str };
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: sellerShareFormData } = await this.$api.getSellerShareFormDetailApi(param);
        this.sellerShareFormDetail = sellerShareFormData.form_data
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听 vip 过期时间 picker 确定事件
     */
    onVipEndDatePickerConfirmEvt(event) {
      this.vipCaseSourceServeList[this.activeVipCaseSourceIndex].list[this.activeVipCaseSourceTypeIndex].discountDay = `${ event.year }-${ event.month }-${ event.day }`
    },
    /**
     * 监听地区 popup 组件 确定城市 evt
     */
    onRegionPopupConfirmEvt(cityData) {
      this.caseSourceRegion.caseSource_province_id = cityData.province_id;
      this.caseSourceRegion.caseSource_city_id = cityData.city_id;
      this.caseSourceRegion.provinceName = cityData.province;
      this.caseSourceRegion.cityName = cityData.city;
    },

    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
    /**
     * 购买 案源vip 套餐
     */
    async confirmBuyVipCaseSourceServe() {
      const { userId, vipCaseSourceServeList, sellerShareVipIndex, sellerShareVipTypeIndex, sellerShareRegion } = this;
      if (!userId) return uni.navigateTo({ url: '/pagesV1/common/login' }); // 未登录进入登录页面

      uni.showLoading({ title: '购买中', mask: true });

      const vipCaseSrouceServeItem = vipCaseSourceServeList[sellerShareVipIndex].list[sellerShareVipTypeIndex];
      const param = { source_match_package_id: vipCaseSrouceServeItem.source_match_package_id, province_id: sellerShareRegion.caseSource_province_id, city_id: sellerShareRegion.caseSource_city_id };
      // 存在销售分享标识 & 参数添加销售标识
      this.sellerShareStr.trim() && (param.share_affairs_str = this.sellerShareStr.trim());

      try {
        const { data: orderData } = await this.$api.postVipCaseSourceServeOrderApi(param);
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
          uni.$emit('toastEvt', { msg: '购买成功,请下载「律快答律师端」APP体验' }); // 触发全局的 toast 事件
          setTimeout(() => {
            this.$commonUtil.backPage();
          }, 2000);
          // 重新拉取个人信息
          loginUtil.fetchUserInfo();
        }
      } catch (error) {
        console.log(error);
      }
    }
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
