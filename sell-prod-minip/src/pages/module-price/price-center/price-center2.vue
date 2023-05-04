<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#F5F5F5' }" title="价格分享" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 头部 -->
    <view class="header-module" :style="{ top: uNavbarHeight + 'px'}">
      <!-- 分享按钮 -->
      <view class="btn-wrap">
        <view class="btn-item" @click="openPriceSharePopup(1)">
          <image class="icon-price" mode="aspectFill" src="../static/price-person.png" />
          <text>分享个人套餐</text>
        </view>
        <view class="btn-item" @click="openPriceSharePopup(2)">
          <image class="icon-price" mode="aspectFill" src="../static/price-company.png" />
          <text>分享企业套餐</text>
        </view>
      </view>

      <!-- 条件导航 -->
      <view class="factor-nav-wrap">
        <view class="factor-item" @click.stop="openFactorPopup('priceTypeFactor')">
          <view v-if="priceTypeFactorInfo.priceTypeIndex > -1" style="color: #0085FF;">{{ priceTypeFactorInfo.priceTypeFactorList[priceTypeFactorInfo.priceTypeIndex].price }}</view>
          <view v-else>套餐类型</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'priceTypeFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" style="margin-left: 50rpx;" @click.stop="openFactorPopup('payStatusFactor')">
          <view v-if="[-1, 0].includes(payStatusFactorInfo.payStatusIndex)">支付状态</view>
          <view v-else style="color: #0085FF;">{{ payStatusFactorInfo.payStatusFactorList[payStatusFactorInfo.payStatusIndex].name }}</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'payStatusFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" style="margin-left: auto;" @click.stop="openFactorPopup('timeFactor')">
          <view v-if="[-1, 0].includes(timeFactorInfo.timeFactorIndex)">筛选</view>
          <view v-else style="color: #0085FF;">{{ timeFactorInfo.timeFactorList[timeFactorInfo.timeFactorIndex].name }}</view>
          <image class="icon-sort" mode="aspectFill" src="../static/icon-sort-inactive.png" />
        </view>
      </view>

      <!-- 条件过滤 popup -->
      <view v-if="isOpenFactorPopup" class="factor-filter-popup" :style="{ top: headerModuleHeight + 'px' }">
        <!-- 套餐类型 -->
        <view v-if="factorPopupType === 'priceTypeFactor'" class="price-factor-wrap">
          <view v-for="(pItem, pIndex) in priceTypeFactorInfo.priceTypeFactorList" :key="pIndex" class="price-factor-item" :class="{ 'price-factor-item-active': priceTypeFactorInfo.priceTypeIndex === pIndex }" @click="choosePriceTypeFactor(pItem, pIndex)">
            <text v-if="pItem.title" class="price-title">{{ pItem.title }}</text>
            <text class="price">{{ pItem.price }}</text>
          </view>
        </view>
        <!-- 支付状态 -->
        <view v-if="factorPopupType === 'payStatusFactor'" class="pay-factor-wrap">
          <view v-for="(pItem, pIndex) in payStatusFactorInfo.payStatusFactorList" :key="pIndex" class="pay-factor-item" :class="{ 'pay-factor-item-active': payStatusFactorInfo.payStatusIndex === pIndex }" @click="choosePayStatusFactor(pItem, pIndex)">
            <text class="pay-status-name">{{ pItem.name }}</text>
          </view>
        </view>
        <!-- 时间条件 -->
        <view v-if="factorPopupType === 'timeFactor'" class="time-factor-wrap">
          <view v-for="(pItem, pIndex) in timeFactorInfo.timeFactorList" :key="pIndex" class="time-factor-item" :class="{ 'time-factor-item-active': timeFactorInfo.timeFactorIndex === pIndex }" @click="chooseTimeFactor(pItem, pIndex)">
            <text class="time-status-name">{{ pItem.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- factor mask -->
    <view v-if="isOpenFactorPopup" class="factor-popup-mask" @click.stop="closeFactorPopup" />

    <!-- 客户列表 -->
    <view class="client-module" :style="{ marginTop: headerModuleHeight + 'px' }">
      <view v-for="(oItem, oIndex) in priceShareOrderList" :key="oIndex" class="client-item">
        <view class="client-header">
          <image v-if="oItem.type === 2" class="icon-price" mode="aspectFill" src="../static/price-company.png" />
          <image v-else class="icon-price" mode="aspectFill" src="../static/price-person.png" />
          <text>{{ oItem.type === 2 ? '企业' : '个人' }}套餐：{{ oItem.vip_name }}</text>
        </view>
        <view class="client-body">
          <view class="client-body-item">
            <view class="client-name">{{ oItem.nickname || '未获取到用户信息' }}</view>
            <view v-if="oItem.pay_status === 2" class="pay-status" style="color: #00D157;">已支付</view>
            <view v-else class="pay-status" style="color: #FE5F48;">未支付</view>
          </view>
          <view class="client-body-item">
            <view v-if="oItem.mobile" class="client-phone">{{ oItem.mobile }}</view>
            <view class="create-time">{{ oItem.created_at }}</view>
          </view>
        </view>
      </view>
    </view>

    <u-empty v-if="!priceShareOrderList.length" class="empty-img" text="暂无数据" mode="list" />

    <painter :palette="paletteData" @imgOK="painterImgOK($event)" @imgErr="painterImgErr" />
    <!-- 绘制的海报 popup -->
    <view v-if="isShowPosterPopup" class="poster-popup">
      <image class="poster-img" mode="aspectFill" :src="posterPath" @click="$commonUtil.previewImg([posterPath], posterPath)" />
      <view class="save-poster-btn" @click.stop="saveImageToPhotosAlbum">保存海报</view>
    </view>
    <!-- poster mask -->
    <view v-if="isShowPosterPopup" class="poster-popup-mask" @click="isShowPosterPopup = false" />

    <!-- 价格分享 popup -->
    <u-popup v-model="isShowPricePopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onPriceCloseEvt">
      <view class="upopup-price-box" @click.stop="$commonUtil.stopPropagation">
        <view class="price-header">
          <view class="share-title">{{ sharePopupType === 1 ? '分享个人套餐' : '分享企业套餐' }}</view>
          <view class="share-btn" @click="openSharePosterPopup">分享</view>
        </view>

        <!-- 个人套餐列表 -->
        <view v-if="sharePopupType === 1" class="price-wrap">
          <view v-for="(pGItem, pGIndex) in personVipPriceList" :key="pGIndex" class="price-group-item">
            <view v-for="(pItem, pIndex) in pGItem" :key="pIndex" class="price-item" :class="{ 'price-item-active': activePriceIndexInfo.pGIndex === pGIndex && activePriceIndexInfo.pIndex === pIndex }" @click="choosePrice(pGIndex, pIndex)">
              <text class="price">{{ pItem.price }}元/{{ pItem.vip_name }}</text>
            </view>
          </view>
        </view>

        <!-- 企业套餐列表 -->
        <view v-if="sharePopupType === 2" class="price-wrap">
          <view v-for="(pGItem, pGIndex) in companyVipPriceList" :key="pGIndex" class="price-group-item">
            <view v-for="(pItem, pIndex) in pGItem" :key="pIndex" class="price-item" :class="{ 'price-item-active': activePriceIndexInfo.pGIndex === pGIndex && activePriceIndexInfo.pIndex === pIndex }" @click="choosePrice(pGIndex, pIndex)">
              <text class="price-title">{{ pItem.title }}{{ pItem.version === '5' ? '优惠价' : '原价' }}</text>
              <text class="price">{{ pItem.price }}元/年</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import companyPaletteTmp from './companyPaletteTmp';
import personPaletteTmp from './personPaletteTmp';
import mpAuthUtil from '@/common/utils/mpAuthUtil';

export default {
  name: 'PriceCenter',
  data() {
    return {
      uNavbarHeight: 0, // 顶部导航栏高度 px
      headerModuleHeight: 0, // 头部模块高度 px

      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'priceTypeFactor' 'payStatusFactor', 'timeFactor'
      // 套餐类型条件
      priceTypeFactorInfo: {
        priceTypeFactorList: [], // 套餐类型条件列表
        priceTypeIndex: -1, // 选中下标
        priceTypeId: '', // 套餐类型 id
        priceType: '', // 套餐类型 1 个人 2 企业
      },
      // 支付状态条件
      payStatusFactorInfo: {
        payStatusFactorList: [{ name: '全部状态', status: 0 }, { name: '未支付', status: 1 }, { name: '已支付', status: 2 }], // 支付状态条件列表
        payStatusIndex: -1, // 支付状态下标
        payStatus: '', // 支付状态
      },
      // 时间条件
      timeFactorInfo: {
        timeFactorList: [{ name: '综合排序', sort: 1 }, { name: '时间正序', sort: 0 }, { name: '时间倒序', sort: 1 }], // 支付状态条件列表
        timeFactorIndex: -1, // 选中下标
        timeSort: 1, // 时间排序

        startTime: '', // 开始时间
        endTime: '', // 结束时间
        tempStartTime: '', // 临时开始时间
        tempEndTime: '', // 临时结束时间
      },

      priceShareOrderList: [], // 套餐分享订单列表
      priceShareOrderPage: 1, // 套餐分享订单当前页数
      priceShareOrderTotal: 0, // 套餐分享订单总数
      isNextLoading: false, // 是否正在加载下一页

      isShowPricePopup: false, // 是否打开价格分享 popup
      personVipPriceList: [], // 个人 vip 价格列表
      companyVipPriceList: [], // 企业 vip 价格列表
      sharePopupType: 1, // 分享套餐 popup 类型 1：个人 2：企业
      activePriceIndexInfo: { pGIndex: -1, pIndex: -1, }, // 激活价格下标信息

      personPaletteTmp: personPaletteTmp, // 个人 palette 模板
      companyPaletteTmp: companyPaletteTmp, // 公司 palette 模板
      paletteData: null, // palette 数据

      isShowPosterPopup: false, // 是否打开海报分享 popup
      posterPath: '', // 海报路径
    };
  },
  onLoad() {
    this._getPriceShareOrderList();
    this._getShareVipList(1);
    this._getShareVipList(2);

    // console.log(this.$Route);
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
    // 头部 module 高度
    this.headerModuleHeight = await this.$commonUtil.calcNodeHeight('.header-module');
  },
  onReachBottom() {
    const { priceShareOrderList, priceShareOrderTotal } = this;
    if (priceShareOrderList.length >= priceShareOrderTotal) return;
    this._getPriceShareOrderList(++this.priceShareOrderPage);
  },
  methods: {
    /**
     * 获取销售套餐分享订单列表
     */
    async _getPriceShareOrderList(page = 1) {
      if (this.isNextLoading) return;
      this.isNextLoading = true;

      page === 1 && uni.showLoading({ title: '加载中', mask: true });
      page === 1 && (this.priceShareOrderList = []); // 请求第一页，先清空数组
      page === 1 && (this.priceShareOrderPage = 1); // 重回第一页

      const param = {
        page,
        pay_status: this.payStatusFactorInfo.payStatus, // 支付状态
        sort: this.timeFactorInfo.timeSort
      };

      // 添加套餐类型条件
      if (this.priceTypeFactorInfo.priceTypeIndex > -1) {
        param.vip_id = this.priceTypeFactorInfo.priceTypeId;
        param.type = this.priceTypeFactorInfo.priceType;
      }

      try {
        const { data: priceShareOrderData } = await this.$api.getPriceShareOrderList(param);
        this.priceShareOrderList.push(...priceShareOrderData.data);
        this.priceShareOrderTotal = priceShareOrderData.total;
        this.isNextLoading = false;
      } catch (error) {
        console.log(error);
        this.isNextLoading = false;
      }
    },
    /**
     * 获取套餐价格分享列表
     */
    async _getShareVipList(priceType = 1) {
      const param = { type: priceType };

      try {
        const { data: vipPriceData } = await this.$api.getShareVipList(param);
        if (priceType === 1) {
          this.personVipPriceList = [vipPriceData];
          // 个人套餐 factor 列表
          const _personVipPriceList = vipPriceData.map(item => {
            let obj = {};
            obj.type = 1;
            obj.title = '';
            obj.price = `${ item.price }元/${ item.vip_name }`;
            obj.vip_id = item.vip_id;
            return obj;
          });
          this.priceTypeFactorInfo.priceTypeFactorList.unshift(..._personVipPriceList);
        } else if (priceType === 2) {
          this.companyVipPriceList = vipPriceData;
          // 企业套餐 factor 列表
          const _companyVipPriceList = vipPriceData.flat().map(item => {
            let obj = {};
            obj.type = 2;
            obj.title = item.version === '2' ? `${ item.title }原价` : `${ item.title }优惠价`;
            obj.price = `${ item.price }元/年`;
            obj.vip_id = item.enterprise_vip_id;
            return obj;
          });
          this.priceTypeFactorInfo.priceTypeFactorList.push(..._companyVipPriceList);
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开价格分享 popup
     */
    openPriceSharePopup(popupType) {
      this.sharePopupType = popupType;
      this.isShowPricePopup = true;
    },
    /**
     * 监听价格关闭事件
     */
    onPriceCloseEvt() {
      this.activePriceIndexInfo = { pGIndex: -1, pIndex: -1 };
    },
    /**
     * 选择价格
     */
    choosePrice(pGIndex, pIndex) {
      this.activePriceIndexInfo.pGIndex = pGIndex;
      this.activePriceIndexInfo.pIndex = pIndex;
    },
    /**
     * 打开条件弹框
     */
    openFactorPopup(factorType) {
      if (this.isOpenFactorPopup && this.factorPopupType !== factorType) return this.factorPopupType = factorType;
      this.factorPopupType = factorType;

      this.isOpenFactorPopup = !this.isOpenFactorPopup;
    },
    /**
     * 关闭条件弹框
     */
    closeFactorPopup() {
      this.isOpenFactorPopup = false;
    },
    /**
     * 选择套餐类型条件
     */
    choosePriceTypeFactor(pItem, pIndex) {
      this.priceTypeFactorInfo.priceTypeIndex = pIndex;
      this.priceTypeFactorInfo.priceTypeId = pItem.vip_id;
      this.priceTypeFactorInfo.priceType = pItem.type;
      this.isOpenFactorPopup = false;
      this._getPriceShareOrderList();
    },
    /**
     * 选择支付状态条件
     */
    choosePayStatusFactor(pItem, pIndex) {
      this.payStatusFactorInfo.payStatusIndex = pIndex;
      this.payStatusFactorInfo.payStatus = pItem.status;
      this.isOpenFactorPopup = false;
      this._getPriceShareOrderList();
    },
    /**
     * 选择时间条件
     */
    chooseTimeFactor(pItem, pIndex) {
      this.timeFactorInfo.timeFactorIndex = pIndex;
      this.timeFactorInfo.timeSort = pItem.sort;
      this.isOpenFactorPopup = false;
      this._getPriceShareOrderList();
    },
    /**
     * 打开分享套餐海报 popup
     */
    async openSharePosterPopup() {
      const { personVipPriceList, companyVipPriceList, sharePopupType, activePriceIndexInfo } = this;

      // 企业律云二维码
      if (sharePopupType === 2) {
        const companyVipId = companyVipPriceList[activePriceIndexInfo.pGIndex][activePriceIndexInfo.pIndex].enterprise_vip_id;
        const param = { type: 2, vip_id: companyVipId };
        uni.showLoading({ title: '生成中', mask: true });
        try {
          const { data: qRcodeData } = await this.$api.getShareVipQRcode(param);
          const qrcodeUrl = qRcodeData.url;
          // console.log(qrcodeUrl);
          this._drawSharePoster(qrcodeUrl);
        } catch (error) {
          console.log(error);
        }
      // 百姓律师二维码
      } else if (sharePopupType === 1) {
        console.log(personVipPriceList);
        const personVipId = personVipPriceList[activePriceIndexInfo.pGIndex][activePriceIndexInfo.pIndex].vip_id;
        console.log(personVipId);
        const param = { type: 1, vip_id: personVipId };

        uni.showLoading({ title: '生成中', mask: true });
        try {
          const { data: qRcodeData } = await this.$api.getShareVipQRcode(param);
          const qrcodeUrl = qRcodeData.url;
          this._drawSharePoster(qrcodeUrl);
        } catch (error) {
          console.log(error);
        }
      }
    },
    /**
     * 绘制海报
     */
    _drawSharePoster(qrcodeUrl) {
      // 企业律云分享海报
      if (this.sharePopupType === 2) {
        this.companyPaletteTmp.views[1].url = qrcodeUrl;
        this.paletteData = this.companyPaletteTmp;
        // this.personPaletteTmp.views[1].url = qrcodeUrl;
        // this.paletteData = this.personPaletteTmp;
      // 百姓律师分享海报
      } else if (this.sharePopupType === 1) {
        this.personPaletteTmp.views[1].url = qrcodeUrl;
        this.paletteData = this.personPaletteTmp;
      }
    },
    /**
     * 绘图成功
     */
    painterImgOK(event) {
      const { path } = event.detail;
      console.log(path);
      this.isShowPricePopup = false;
      this.posterPath = path;
      this.isShowPosterPopup = true;
      this.$u.toast('分享海报绘制成功');
    },
    /**
     * 绘图失败
     */
    painterImgErr() { uni.hideLoading(); },
    /**
     * 保存海报到相册
     */
    async saveImageToPhotosAlbum() {
      if (!this.posterPath) return this.$u.toast('生成海报失败');
      // #ifdef MP-WEIXIN
      const authSetResult = await mpAuthUtil.getMpAuthSetting('writePhotosAlbum');
      if (!authSetResult) return;
      // #endif
      const [error, res] = await uni.saveImageToPhotosAlbum({ filePath: this.posterPath });
      if (!res) return this.isShowPosterPopup = false;
      this.isShowPosterPopup = false;
      this.$u.toast('已保存至相册');
    }
  }
};
</script>

<style>
  page {
    background: #F5F5F5;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
