<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="backPrevPage" />
      </view>
    </u-navbar>

    <!-- 存在分享企业套餐 -->
    <template v-if="shareProductTypeList.includes('3')">
      <view class="banner-momdule">
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="@/static/center/center-buy-banner.png" />
      </view>
      <view class="company-content-module">
        <scroll-view class="scroll-y content-scroll-y" scroll-y enhanced :show-scrollbar="false" scroll-with-animation>
          <!-- 个人价格 -->
          <template v-if="shareProductTypeList.includes('1') || shareProductTypeList.includes('2')">
            <view class="person-product-module">
              <view class="product-title">法律咨询套餐</view>
              <view class="person-product-items">
                <view v-if="shareProductTypeList.includes('1')" class="person-product-item" :class="{ 'person-product-item-active': selectedProductVipInfo.type === 'person' && selectedProductVipInfo.index === 0 }" @click="selectProductVip('person', 0)">
                  <image class="icon-vip" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-08-16/9c4021ff9df2faa5f70b8d2fe0f96b21.png" />
                  <view>{{ personVipPriceList.find(item => item.vip_name === '月卡').price || 0 }}元/月（30天不限次电话咨询）</view>
                </view>
                <view v-if="shareProductTypeList.includes('2')" class="person-product-item" :class="{ 'person-product-item-active': selectedProductVipInfo.type === 'person' && selectedProductVipInfo.index === 1 }" @click="selectProductVip('person', 1)">
                  <image class="icon-vip" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-08-16/9c4021ff9df2faa5f70b8d2fe0f96b21.png" />
                  <view>
                    <view>{{ personVipPriceList.find(item => item.vip_name === '年卡').price || 0 }}元/年（全年不限次电话咨询）</view>
                    <view style="font-size: 28rpx; color: #FF5555;">赠送价值2000元知名律所律师函一份</view>
                    <view />
                  </view>
                </view>

                <view class="divider-hor" />
              </view>
            </view>
          </template>

          <!-- 公司价格 -->
          <view class="company-product-module">
            <view class="product-title">
              <text>标准化法律服务套餐</text>
              <text style="font-size: 30rpx; font-weight: 400; color: #0085FF; margin-left: auto;" @click="$commonUtil.routeNavTo('module-price/price-diff/price-diff', { diffImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202297-1662537802492-eipj2h.png' })">对比图示</text>
            </view>

            <view class="company-product-items">
              <view v-for="(pItem, pIndex) in companyVipPriceList" :key="pIndex" class="company-product-item" :class="{ 'company-product-item-active': selectedProductVipInfo.type === 'company' && selectedProductVipInfo.index === pIndex }" @click="selectProductVip('company', pIndex)">{{ pItem.title }}</view>
            </view>

            <image v-if="selectedProductVipInfo.type === 'company'" class="company-product-img" mode="widthFix" :src="companyVipPriceList[selectedProductVipInfo.index].introduction_image" @click="$commonUtil.previewImg([companyVipPriceList[selectedProductVipInfo.index].introduction_image], companyVipPriceList[selectedProductVipInfo.index].introduction_image)" />
          </view>
        </scroll-view>
      </view>
    </template>

    <!-- 不存在分享企业套餐 -->
    <template v-else-if="!shareProductTypeList.includes('3')">
      <view class="banner-momdule">
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-08-16/5384ccc936a8a7312d363f3b9d30c2f9.png" />
      </view>

      <view class="person-content-module">
        <view class="person-vip-title">优选律师 专业解答 隐私保障</view>
        <!-- 个人套餐体 -->
        <view class="person-vip-wrap">
          <view v-if="shareProductTypeList.includes('1')" class="person-vip-item" @click="selectProductVip('person', 0)">
            <image class="icon-vip" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-08-16/9c4021ff9df2faa5f70b8d2fe0f96b21.png" />
            <view class="person-vip">
              <view class="person-vip-price">{{ personVipPriceList.find(item => item.vip_name === '月卡').price }}元/月卡</view>
              <view>30天不限次电话咨询</view>
            </view>
            <image v-if="selectedProductVipInfo.type === 'person' && selectedProductVipInfo.index === 0" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
            <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
          </view>
          <view v-if="shareProductTypeList.includes('2')" class="person-vip-item" @click="selectProductVip('person', 1)">
            <image class="icon-vip" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-08-16/9c4021ff9df2faa5f70b8d2fe0f96b21.png" />
            <view class="person-vip">
              <view class="person-vip-price">{{ personVipPriceList.find(item => item.vip_name === '年卡').price }}元/年卡</view>
              <view>全年不限次电话咨询</view>
              <view style="font-size: 28rpx; color: #FF5555;">赠送价值2000元知名律所律师函一份</view>
            </view>
            <image v-if="selectedProductVipInfo.type === 'person' && selectedProductVipInfo.index === 1" class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-active.png" />
            <image v-else class="icon-gou" mode="aspectFill" src="@/static/common/icon-gou-inactive.png" />
          </view>
        </view>
        <view class="person-vip-footer">
          <text>服务时长：24小时</text>
          <text>平均响应时间：55秒</text>
        </view>
      </view>
    </template>

    <view class="btn-bottom">
      <view class="pay-btn" @click="buyProductVip">
        <text v-if="selectedProductVipInfo.type === 'person'">￥{{ personVipPriceList[selectedProductVipInfo.index].price || 0 }}</text>
        <text v-else-if="selectedProductVipInfo.type === 'company'">￥{{ companyVipPriceList[selectedProductVipInfo.index].price || 0 }}</text>
        <text style="margin-left: 20rpx;">立即支付</text>
      </view>
      <view class="pay-protocol">
        <text>开通前请阅读</text>
        <text style="color: #0085FF;" @click="routerToWebView('https://oss.lawkd.com/document/enterprise_vip_service_20220427.html')">【年度法律服务套餐服务协议】</text>
        <text>和</text>
        <text style="color: #0085FF;" @click="routerToWebView('https://oss.lawkd.com/document/enterprise_vip_server_explain_20220427.html')">【服务说明】</text>
      </view>
    </view>

    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" @loginSucEvt="onLoginSucEvt" />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'ProductPay',
  data() {
    return {
      enterSrc: '', // 进入来源 productCenter

      personVipPriceList: [], // 个人 vip 价格列表
      companyVipPriceList: [], // 企业 vip 价格列表

      shareProductTypeList: [], // 销售分享的产品类型列表
      companyVipIsDiscount: 0, // 企业套餐是否优惠 0、1
      sellerFlag: '', // 销售标识

      selectedProductVipInfo: { type: '', index: -1, }, // 选中的产品信息 type: person(个人) company(企业)
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    // console.log(routeParam);

    // 小程序分享卡片进入页面
    if (routeParam.shareProductType) {
      this.shareProductTypeList = routeParam.shareProductType.split(',');
      // 存在分享企业套餐 默认选中企业套餐 第一项
      if (this.shareProductTypeList.includes('3')) { this.selectedProductVipInfo.type = 'company'; this.selectedProductVipInfo.index = 0; }
      this.companyVipIsDiscount = routeParam.qiyeIsDiscount;
      this.sellerFlag = routeParam.sellerFlag;
      // 若是群聊设置进入该页面 记录进入来源 避免照成页面栈重复
      routeParam.enterSrc && (this.enterSrc = routeParam.enterSrc);
    }
    // 非产品分享中心页面进入 & 无用户 id 弹起授权登录
    if (!this.enterSrc && !this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框

    this._getShareVipList(1);
    this._getShareVipList(2);
  },
  methods: {
    /**
     * 监听登录成功事件
     */
    onLoginSucEvt() {
      this._getShareVipList(1);
      this._getShareVipList(2);
    },
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
          const _companyVipList = vipPriceData.data.map(item => item.vip_list).flat();
          // 加工处理企业 vip 列表
          if (this.companyVipIsDiscount === '1') {
            this.companyVipPriceList = _companyVipList.filter(item => item.version === '5');
          } else {
            this.companyVipPriceList = _companyVipList.filter(item => item.version === '2');
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择产品 vip
     */
    selectProductVip(productType, productIndex) {
      this.selectedProductVipInfo.type = productType;
      this.selectedProductVipInfo.index = productIndex;
    },
    /**
     * 购买产品 vip 套餐
     */
    async buyProductVip() {
      if (this.enterSrc === 'productCenter') return this.$u.toast('当前处于预览模式，无法发起支付');
      if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      if (!this.selectedProductVipInfo.type) return this.$u.toast('请选择产品套餐');
      let orderNo = ''; // 订单号
      uni.showLoading({ title: '购买中', mask: true });

      try {
        // 企业 vip 购买
        if (this.selectedProductVipInfo.type === 'company') {
          // 确定企业 vip id
          const enterpriseVipId = this.companyVipPriceList[this.selectedProductVipInfo.index].enterprise_vip_id;
          const param = { enterprise_vip_id: enterpriseVipId, share_affairs_str: this.sellerFlag };

          const { data: orderData } = await this.$api.getServerSpecPayOrder(param);
          orderNo = orderData.order_no;

          // console.log('企业：', orderNo);
        // 个人 vip 购买
        } else if (this.selectedProductVipInfo.type === 'person') {
          // 确定个人 vip id
          const personVipId = this.personVipPriceList[this.selectedProductVipInfo.index].vip_id;
          const param = { vip_id: personVipId, share_affairs_str: this.sellerFlag };
          const { data: orderData } = await this.$api.getPersonVipPayOrder(param);

          orderNo = orderData.order_no;

          // console.log('个人：', orderNo);
        }

        if (!orderNo) return this.$u.toast('创建订单失败');
        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrder({ type: 1, order_no: orderNo });
        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });
        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        if (payResult) {
          loginUtil.fetchUserInfo(); // 重新拉取个人信息
          uni.switchTab({ url: '/pages/tabbar/index/index' });
          uni.$emit('toastEvt', { msg: '购买成功' }); // 触发全局的 toast 事件
          // this.$store.dispatch('userModule/removeUserTokenAndUserInfoAction');
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 回退上一页
     */
    backPrevPage() {
      if (!this.enterSrc) this.$store.dispatch('userModule/removeUserTokenAndUserInfoAction');
      this.$commonUtil.backClick();
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;

      uni.navigateTo({
        url: '/pages/module-common/web-view/web-view',
        success: res => {
          res.eventChannel.emit('webViewEvt', { navTitle: '', webUrl });
        }
      });
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
