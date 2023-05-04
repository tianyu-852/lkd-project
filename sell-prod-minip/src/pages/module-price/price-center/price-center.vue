<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#F5F5F5' }" title="邀请支付" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 个人套餐 -->
    <view class="person-vip-module">
      <view class="header-wrap">
        <view class="title">法律咨询套餐</view>
      </view>
      <view class="person-vip-wrap">
        <view v-for="(pItem, pIndex) in personVipPriceList" :key="pIndex" class="person-vip-item" :class="{ 'person-vip-item-active': personVipActiveIndexInfo.pIndex === pIndex }" @click="choosePersonVip(pIndex)">
          <image class="icon-price" mode="aspectFill" src="../static/price-person.png" />
          <text class="price">{{ pItem.price }}元/{{ pItem.vip_name }}</text>
          <image class="icon-feiji" mode="aspectFill" src="../static/icon-feiji.png" />
        </view>
      </view>
    </view>

    <!-- 企业套餐 -->
    <view class="company-vip-module">
      <view class="header-wrap">
        <view class="title">标准化法律服务套餐</view>
        <view style="color: #0085FF;" @click="$Router.push({ name: 'priceDiff', params: { diffImg: companyDiffImg } })">对比图示</view>
      </view>
      <view class="company-vip-wrap">
        <view v-for="(pGItem, pGIndex) in companyVipPriceList" :key="pGIndex" class="company-vip-item">
          <view class="vip-header">
            <view class="vip-header-left">
              <image class="icon-company-price" mode="aspectFill" src="../static/price-company.png" />
              <text>{{ pGItem.name }}</text>
            </view>
            <view class="vip-header-right" @click="$commonUtil.previewImg([companyVipPriceList[pGIndex].share_image.url], companyVipPriceList[pGIndex].share_image.url)">
              <text>查看详情</text>
              <image class="icon-arrow-right" mode="aspectFill" src="../static/icon-arrow-right.png" />
            </view>
          </view>
          <view class="vip-body">
            <view v-for="(pItem, pIndex) in pGItem.vip_list" :key="pIndex" class="vip-body-item" :class="{ 'vip-body-item-active': companyVipActiveIndexInfo.pGIndex === pGIndex && companyVipActiveIndexInfo.pIndex === pIndex }" @click="chooseCompanyVip(pGIndex, pIndex)">
              <text>{{ pItem.version === '2' ? '原价' : '优惠价' }}：</text>
              <text class="price">{{ pItem.price }}元/年</text>
              <image class="icon-feiji" mode="aspectFill" src="../static/icon-feiji.png" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分享方式 popup -->
    <u-popup v-model="isShowShareModePopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-share-box" @click.stop="$commonUtil.stopPropagation">
        <view class="type-item" style="font-size: 28rpx; color: #999;">选择支付方式</view>
        <view v-for="(tItem, tIndex) in shareModePopupList" :key="tIndex" class="type-item" :class="{ 'type-item-active': activeShareModeIndex === tIndex }" @click="chooseShareMode(tIndex)">{{ tItem.name }}</view>
        <!-- <view class="divide-ver" /> -->
        <!-- <view class="share-btn" @click="confirmShare">分享</view> -->
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

    <!-- 海报分享方式 popup -->
    <u-popup v-model="isShowPosterPopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }" @close="onShareModePopupCloseEvt">
      <view class="upopup-poster-box">
        <image class="pay-img" mode="aspectFit" show-menu-by-longpress :src="posterPath" @click="$commonUtil.previewImg([posterPath], posterPath)" />
        <view class="save-btn">长按图片分享、转发或保存</view>
      </view>
    </u-popup>

    <!-- 绘制海报工具 -->
    <painter :palette="paletteData" @imgOK="painterImgOK($event)" @imgErr="painterImgErr" />
    <!-- 绘制的海报 popup -->
    <!-- <view v-if="isShowPosterPopup" class="poster-popup">
      <image class="poster-img" mode="aspectFit" :src="posterPath" @click="$commonUtil.previewImg([posterPath], posterPath)" />
      <view class="save-poster-btn" @click.stop="saveImageToPhotosAlbum">保存海报</view>
    </view> -->

    <!-- poster mask -->
    <!-- <view v-if="isShowPosterPopup" class="poster-popup-mask" @click="isShowPosterPopup = false" /> -->
  </view>
</template>

<script>
import paletteTmp from './paletteTmp';
import mpAuthUtil from '@/common/utils/mpAuthUtil';

export default {
  name: 'PriceCenter',
  data() {
    return {
      paletteTmp: paletteTmp, // 公司 palette 模板
      paletteData: null, // palette 数据
      bankAccountInfo: {}, // 银行账户信息

      personVipPriceList: [], // 个人 vip 价格列表
      companyVipPriceList: [], // 企业 vip 价格列表
      companyDiffImg: '', // 企业 vip 价格对比图
      companyVipActiveIndexInfo: { pGIndex: -1, pIndex: -1, }, // 企业套餐激活下标信息
      personVipActiveIndexInfo: { pIndex: -1, }, // 个人套餐激活下标信息
      shareVipType: 0, // 分享 Vip类型 1：个人 2：企业

      isShowShareModePopup: false, // 是否打开分享方式弹框
      shareModePopupList: [{ name: '对公打款' }, { name: '二维码支付(微信)' }, { name: '二维码支付(支付宝)' }, { name: '分享海报支付' }], // 分享方法 弹框
      activeShareModeIndex: -1, // 选中的分享方式下标

      isShowBankInfoPopup: false, // 是否打开银行信息 popup
      isShowWxPayPopup: false, // 是否打开微信支付 popup
      isShowAliPayPopup: false, // 是否打开支付宝支付 popup
      wxPayImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022730-1659167460258-Zr1pdz.jpeg', // 微信支付图片
      aliPayImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022730-1659167480236-ar7Qrt.jpeg', // 支付宝支付图片

      isShowPosterPopup: false, // 是否打开海报分享 popup
      posterPath: '', // 海报路径
    };
  },
  onLoad() {
    this._getShareVipList(1);
    this._getShareVipList(2);
    this._getBankAccountInfo();
  },
  methods: {
    /**
     * 获取套餐价格分享列表
     */
    async _getShareVipList(priceType = 1) {
      const param = { type: priceType };

      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: vipPriceData } = await this.$api.getShareVipList(param);
        if (priceType === 1) {
          this.personVipPriceList = vipPriceData;
        } else if (priceType === 2) {
          this.companyVipPriceList = vipPriceData.data;
          this.companyDiffImg = vipPriceData.total_url;
        }
      } catch (error) {
        console.log(error);
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
     * 选择个人套餐分享项
     */
    choosePersonVip(pIndex) {
      this.personVipActiveIndexInfo.pIndex = pIndex;
      this.shareVipType = 1;
      this.isShowShareModePopup = true;
    },
    /**
     * 选择企业套餐分享项
     */
    chooseCompanyVip(pGIndex, pIndex) {
      this.companyVipActiveIndexInfo.pGIndex = pGIndex;
      this.companyVipActiveIndexInfo.pIndex = pIndex;
      this.shareVipType = 2;
      this.isShowShareModePopup = true;
    },
    /**
     * 选择分享方式
     */
    chooseShareMode(sTypeIndex) {
      this.activeShareModeIndex = sTypeIndex;
      this.confirmShare();
    },
    /**
     * 监听分享方式关闭事件
     */
    onShareModePopupCloseEvt() {
      this.companyVipActiveIndexInfo = { pGIndex: -1, pIndex: -1 };
      this.personVipActiveIndexInfo = { pIndex: -1 };
      this.activeShareModeIndex = -1;
      this.shareVipType = 0;
    },
    /**
     * 确认分享
     */
    async confirmShare() {
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
    /**
     * 绘制海报
     */
    _drawSharePoster(posterBgImage, qrcodeUrl) {
      this.paletteTmp.views[0].url = posterBgImage;
      this.paletteTmp.views[1].url = qrcodeUrl;
      this.paletteData = this.paletteTmp;
    },
    /**
     * 绘图成功
     */
    painterImgOK(event) {
      const { path } = event.detail;
      this.isShowShareModePopup = false;
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
