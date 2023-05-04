<template>
  <view class="order-center">
    <view class="header-module" :style="{ top: uNavbarHeight + 'px'}">
      <!-- 条件导航 -->
      <view class="factor-nav-wrap">
        <view class="factor-item" @click.stop="openFactorPopup('priceTypeFactor')">
          <view v-if="priceTypeFactorInfo.priceTypeIndex > -1" style="color: #0085FF;">{{ priceTypeFactorInfo.priceTypeFactorList[priceTypeFactorInfo.priceTypeIndex].price }}</view>
          <view v-else>套餐类型</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'priceTypeFactor' && isOpenFactorPopup }" mode="aspectFill" src="../../../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" style="margin-left: 50rpx;" @click.stop="openFactorPopup('payStatusFactor')">
          <view v-if="[-1, 0].includes(payStatusFactorInfo.payStatusIndex)">支付状态</view>
          <view v-else style="color: #0085FF;">{{ payStatusFactorInfo.payStatusFactorList[payStatusFactorInfo.payStatusIndex].name }}</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'payStatusFactor' && isOpenFactorPopup }" mode="aspectFill" src="../../../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" style="margin-left: auto;" @click.stop="openFactorPopup('timeFactor')">
          <view v-if="[-1, 0].includes(timeFactorInfo.timeFactorIndex)">筛选</view>
          <view v-else style="color: #0085FF;">{{ timeFactorInfo.timeFactorList[timeFactorInfo.timeFactorIndex].name }}</view>
          <image class="icon-sort" mode="aspectFill" src="../../../static/icon-sort-inactive.png" />
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

    <!-- 订单列表 -->
    <view class="order-module" :style="{ marginTop: headerModuleHeight + 'px' }">
      <view v-for="(oItem, oIndex) in 20" :key="oIndex" class="order-item">
        <view class="order-header">
          <image class="icon-price" mode="aspectFill" src="../../../static/price-company.png" />
          <text class="client-name">{{ '浙江律快答网络科技有限公司' }}</text>
          <text class="pay-status">{{ '已支付' }}</text>
        </view>
        <view class="order-sell-item">
          <view class="vip-name">服务套餐：{{ '基础版5998元/年' }}</view>
          <view class="sell-name">销售：{{ '李天天' }}</view>
        </view>
        <view class="order-time-item">
          <view class="order-time-wrap">
            <view class="client-phone">手机号码：18923357453</view>
            <view class="order-time">{{ '2022-07-09 12:34' }}</view>
          </view>
          <!-- <view class="order-btn" @click="openSignModePopup">提交合同</view> -->
          <view class="order-btn" @click="openPayModePopup">邀请支付</view>
        </view>
      </view>
    </view>

    <!-- <u-empty v-if="!priceShareOrderList.length" class="empty-img" text="暂无数据" mode="list" /> -->

    <painter :palette="paletteData" @imgOK="painterImgOK($event)" @imgErr="painterImgErr" />

    <!-- 签署方式 popup -->
    <u-popup v-model="isShowSignModePopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-share-box" @click.stop="$commonUtil.stopPropagation">
        <view class="type-item" style="font-size: 28rpx; color: #999;">选择签署合同方式</view>
        <view v-for="(tItem, tIndex) in signModePopupList" :key="tIndex" class="type-item" :class="{ 'type-item-active': activeSignModeIndex === tIndex }" @click="chooseSignModeItem(tIndex)">{{ tItem.name }}</view>
      </view>
    </u-popup>

    <!-- 分享方式 popup -->
    <u-popup v-model="isShowShareModePopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-share-box" @click.stop="$commonUtil.stopPropagation">
        <view class="type-item" style="font-size: 28rpx; color: #999;">选择支付方式</view>
        <view v-for="(tItem, tIndex) in shareModePopupList" :key="tIndex" class="type-item" :class="{ 'type-item-active': activeShareModeIndex === tIndex }" @click="chooseShareMode(tIndex)">{{ tItem.name }}</view>
      </view>
    </u-popup>

    <!-- 银行信息方式 popup -->
    <u-popup v-model="isShowBankInfoPopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-bankinfo-box">
        <view class="bankinfo-item">银行账户：{{ bankAccountInfo.account }}</view>
        <view class="bankinfo-item">开通户行：{{ bankAccountInfo.open_account }}</view>
        <view class="bankinfo-item">银行卡号：{{ bankAccountInfo.account_name }}</view>
        <view class="copy-btn" @click="copyBankInfo">复制卡号信息</view>
      </view>
    </u-popup>

    <!-- 微信方式 popup -->
    <u-popup v-model="isShowWxPayPopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-payimg-box">
        <image class="pay-img" mode="aspectFit" show-menu-by-longpress :src="wxPayImg" @click="$commonUtil.previewImg([wxPayImg], wxPayImg)" />
        <view class="save-btn">长按图片分享、转发或保存</view>
      </view>
    </u-popup>

    <!-- 支付宝方式 popup -->
    <u-popup v-model="isShowAliPayPopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-payimg-box">
        <image class="pay-img" mode="aspectFit" show-menu-by-longpress :src="aliPayImg" @click="$commonUtil.previewImg([aliPayImg], aliPayImg)" />
        <view class="save-btn">长按图片分享、转发或保存</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import mpAuthUtil from '@/common/utils/mpAuthUtil';

export default {
  name: 'OrderList',
  props: {
    uNavbarHeight: { type: Number, default: 0 }, // 顶部导航栏高度 px
  },
  data() {
    return {
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
      },

      priceShareOrderList: [], // 套餐分享订单列表
      priceShareOrderPage: 1, // 套餐分享订单当前页数
      priceShareOrderTotal: 0, // 套餐分享订单总数
      isNextLoading: false, // 是否正在加载下一页

      isShowSignModePopup: false, // 是否打开签署方式弹框
      signModePopupList: [{ name: '在线签订' }, { name: '线下邮寄' }], // 签署方式列表
      activeSignModeIndex: -1, // 选中的签署方式下标

      isShowShareModePopup: false, // 是否打开分享方式弹框
      shareModePopupList: [{ name: '对公打款' }, { name: '二维码支付(微信)' }, { name: '二维码支付(支付宝)' }, { name: '分享海报支付' }], // 分享方法 弹框
      activeShareModeIndex: -1, // 选中的分享方式下标

      paletteData: null, // palette 数据
      isShowBankInfoPopup: false, // 是否打开银行信息 popup
      isShowWxPayPopup: false, // 是否打开微信支付 popup
      isShowAliPayPopup: false, // 是否打开支付宝支付 popup
      bankAccountInfo: {}, // 银行账户信息
      wxPayImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022730-1659167460258-Zr1pdz.jpeg', // 微信支付图片
      aliPayImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022730-1659167480236-ar7Qrt.jpeg', // 支付宝支付图片
    };
  },
  created() {
    this._getBankAccountInfo();
  },
  mounted() {
    // header module 高度
    const uNavbarNodeRef = this.createSelectorQuery().select('.header-module');
    uNavbarNodeRef.boundingClientRect(rect => {
      this.headerModuleHeight = rect.height;
    }).exec();
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
     * 获取银行账户信息
     */
    async _getBankAccountInfo() {
      try {
        const { data: bankAccountData } = await this.$api.getBankAccountInfo();
        this.bankAccountInfo = bankAccountData;
      } catch (error) {
        console.log(error);
      }
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
      // this._getPriceShareOrderList();
    },
    /**
     * 选择支付状态条件
     */
    choosePayStatusFactor(pItem, pIndex) {
      this.payStatusFactorInfo.payStatusIndex = pIndex;
      this.payStatusFactorInfo.payStatus = pItem.status;
      this.isOpenFactorPopup = false;
      // this._getPriceShareOrderList();
    },
    /**
     * 选择时间条件
     */
    chooseTimeFactor(pItem, pIndex) {
      this.timeFactorInfo.timeFactorIndex = pIndex;
      this.timeFactorInfo.timeSort = pItem.sort;
      this.isOpenFactorPopup = false;
      // this._getPriceShareOrderList();
    },
    /**
     * 打开签署方式 popup
     */
    openSignModePopup() {
      this.isShowSignModePopup = true;
    },
    /**
     * 选择签署方式
     */
    chooseSignModeItem(signModeIndex) {
      this.activeSignModeIndex = signModeIndex;
      if (this.activeSignModeIndex === 0) {
        this.$commonUtil.routeNavTo('contractSignList', { signType: 1 });
      } else if (this.activeSignModeIndex === 1) {
        this.$commonUtil.routeNavTo('contractSignList', { signType: 2 });
      }
      this.isShowSignModePopup = false;
      setTimeout(() => {
        this.activeSignModeIndex = -1;
      }, 1000);
    },
    /**
     * 打开支付方式 popup
     */
    openPayModePopup(pGIndex, pIndex) {
      // this.companyVipActiveIndexInfo.pGIndex = pGIndex;
      // this.companyVipActiveIndexInfo.pIndex = pIndex;
      // this.shareVipType = 2;
      this.isShowShareModePopup = true;
    },
    /**
     * 选择支付分享方式
     */
    chooseShareMode(sTypeIndex) {
      this.activeShareModeIndex = sTypeIndex;
      this.confirmPayShareMode();
    },
    /**
     * 监听分享方式关闭事件
     */
    onShareModePopupCloseEvt() {
      // this.companyVipActiveIndexInfo = { pGIndex: -1, pIndex: -1 };
      // this.personVipActiveIndexInfo = { pIndex: -1 };
      this.activeShareModeIndex = -1;
      // this.shareVipType = 0;
    },
    /**
     * 确认支付分享方式
     */
    async confirmPayShareMode() {
      const { activeShareModeIndex } = this;
      if (activeShareModeIndex < 0) return this.$u.toast('请选择分享方法');

      // 对公打款
      if (activeShareModeIndex === 0) {
        this.isShowShareModePopup = false;
        this.isShowBankInfoPopup = true;
      // 微信支付
      } else if (activeShareModeIndex === 1) {
        this.isShowShareModePopup = false;
        this.isShowWxPayPopup = true;
      // 支付宝支付
      } else if (activeShareModeIndex === 2) {
        this.isShowShareModePopup = false;
        this.isShowAliPayPopup = true;
      // 分享海报
      } else if (activeShareModeIndex === 3) {
        // 企业 vip 小程序二维码
        if (this.shareVipType === 2) {
          const companyVipGroupInfo = this.companyVipPriceList[this.companyVipActiveIndexInfo.pGIndex];
          console.log(companyVipGroupInfo);

          const posterBgImage = companyVipGroupInfo.share_image.not_qrcode_url;
          const companyVipId = companyVipGroupInfo.vip_list[this.companyVipActiveIndexInfo.pIndex].enterprise_vip_id;

          uni.showLoading({ title: '生成中', mask: true });
          const param = { type: 2, vip_id: companyVipId };

          try {
            const { data: qRcodeData } = await this.$api.getShareVipQRcode(param);
            const qrcodeUrl = qRcodeData.url;
            this._drawSharePoster(posterBgImage, qrcodeUrl);
          } catch (error) {
            console.log(error);
          }
        // 个人 vip 小程序二维码
        } else if (this.shareVipType === 1) {
          const personVipInfo = this.personVipPriceList[this.personVipActiveIndexInfo.pIndex];
          const posterBgImage = personVipInfo.share_url;
          const personVipId = personVipInfo.vip_id;

          uni.showLoading({ title: '生成中', mask: true });
          const param = { type: 1, vip_id: personVipId };

          try {
            const { data: qRcodeData } = await this.$api.getShareVipQRcode(param);
            const qrcodeUrl = qRcodeData.url;
            this._drawSharePoster(posterBgImage, qrcodeUrl);
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    /**
     * 复制银行卡信息
     */
    copyBankInfo() {
      const { bankAccountInfo } = this;
      uni.setClipboardData({ data: `银行账户：${ bankAccountInfo.account }\n\n开通户行：${ bankAccountInfo.open_account }\n\n银行卡号：${ bankAccountInfo.account_name }` });
      this.isShowBankInfoPopup = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
