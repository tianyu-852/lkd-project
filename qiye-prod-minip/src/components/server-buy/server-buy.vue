<template>
  <view>
    <!-- banner -->
    <view class="banner-momdule">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="@/static/center/center-buy-banner.png" />
    </view>

    <view class="content-module">
      <view v-show="isShowTabnav" class="tabnav-wrap" :style="{ opacity: sTabnavOpactiy }">
        <view v-for="(tItem, tIndex) in scrollTabList" :key="tIndex" class="tabnav-item" :class="{ 'tabnav-item-active': curActiveSTabIndex === tIndex }" @click="changeSTabnav(tIndex)">{{ tItem.name }}</view>
        <!-- 底部导航条 -->
        <view class="tabnav-line-outer" :style="{ left: ((100 / scrollTabList.length) * curActiveSTabIndex) + '%' }">
          <view class="tabnav-line-inner" />
        </view>
      </view>

      <!-- 分享按钮 -->
      <label for="shareBtnId">
        <image class="share-btn-img" mode="aspectFill" src="@/static/center/center-share.png" />
      </label>

      <scroll-view
        class="scroll-y content-scroll-y"
        scroll-y
        enhanced
        scroll-with-animation
        :scroll-top="scrollYViewTop"
        :show-scrollbar="false"
        @scroll="scrollYScrollEvt"
      >
        <!-- 服务描述图片 -->
        <!-- <view class="server-desc-module" @click="previewServerSpecImg(iItem, iIndex)">
          <image style="width: 100%; height: 100%; border-radius: 24rpx;" mode="aspectFill" src="@/static/center/center-server-desc.png" />
        </view> -->

        <view class="vip-level-module">
          <view class="vip-level-title">全国8000+律师</view>
          <view class="vip-level-subtitle">为您的企业建立风险防范机制</view>

          <scroll-view class="scroll-x vipLevel-scroll-x" scroll-x enhanced :show-scrollbar="false">
            <!-- <view v-for="(sItem, sIndex) in serverSpecList.filter(val => val.version === '2')" :key="sIndex" class="scroll-x-item"> -->
            <view v-for="(sItem, sIndex) in serverSpecList" :key="sIndex" class="scroll-x-item">
              <view class="vipLevel-wrap" :class="{ 'vipLevel-wrap-active': selectedServerSpecIndex === sIndex }" @click="changeServerSpec(sIndex)">
                <text>{{ sItem.title }}{{ sItem.version === '5' ? '(优惠)' : '' }}</text>
                <text>{{ sItem.price }}元/年</text>
                <image v-if="selectedServerSpecIndex === sIndex" class="active-gou-img" mode="aspectFill" src="@/static/center/spec-active-gou.png" />
              </view>
            </view>
          </scroll-view>

          <!-- 卡片分享 或者 二维码扫描 则显示购买按钮 -->
          <view v-if="isShareEnter || qrcodeScanInfo.s" class="buy-btn" @click="buyServerSpec(serverSpecList[selectedServerSpecIndex].enterprise_vip_id)">
            <text>限时特惠购买</text>
          </view>

          <view v-else class="buy-btn" @click="$refs.kefuRef.openKefuPopup()">
            <text>联系客服 获取更多优惠</text>
            <image class="icon-arrowRight" mode="aspectFill" src="@/static/common/arrow-right-f.png" />
          </view>
        </view>

        <view class="divider-hor" />

        <!-- 会员权益详情 -->
        <view class="base-module vip-module">
          <view class="title-wrap"><view class="title-left">会员权益详情</view></view>
          <view class="vip-wrap">
            <view v-for="(iItem, iIndex) in serverSpecImgList" :key="iIndex" class="vip-rights-img" @click="previewServerSpecImg(iItem, iIndex)">
              <image style="width: 100%; height: 100%;" mode="widthFix" :src="iItem.url" />
            </view>
          </view>
        </view>

        <!-- <view class="divider-hor" /> -->

        <!-- 服务保障 -->
        <!-- <view class="base-module safe-module">
          <view class="title-wrap"><view class="title-left">服务保障</view></view>

          <scroll-view class="scroll-x safe-scroll-x" scroll-x enhanced :show-scrollbar="false">
            <view v-for="(sItem, sIndex) in serverSpecSafeImgList" :key="sIndex" class="scroll-x-item">
              <view class="safe-imgWrap" @click="$commonUtil.previewImg(serverSpecSafeImgList, sItem)">
                <image class="safe-img" style="height: 100%;" mode="heightFix" :src="sItem" />
              </view>
            </view>
          </scroll-view>
        </view> -->
        <!-- <view class="divider-hor" /> -->

        <!-- 服务流程 -->
        <view class="base-module flow-module" style="height: 3704rpx;" @click="$commonUtil.previewImg([serverSpecDetailImg], serverSpecDetailImg)">
          <image class="flow-img" mode="aspectFill" :src="serverSpecDetailImg" />
        </view>

        <view class="divider-hor" />

        <!-- 用户评价 -->
        <view class="base-module comment-module">
          <view class="title-wrap"><view class="title-left">服务评价（{{ serverSpecEvaluateCount }}）</view></view>
          <view class="comment-item-wrap">
            <view v-for="(cItem, cIndex) in serverSpecEvaluateList" :key="cIndex" class="comment-item">
              <view class="comment-left">
                <view class="user-avatar" @click="$commonUtil.previewImg(['https://res.hehu.hanhan.tech/test/cat-blue.jpg'], 'https://res.hehu.hanhan.tech/test/cat-blue.jpg')">
                  <u-lazy-load img-mode="aspectFill" height="60" border-radius="30" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="cItem.user.avatar" />
                </view>
              </view>
              <view class="comment-right">
                <view class="comment-header">
                  <view class="header-left">
                    <view class="user-name-wrap">
                      <view class="user-name">{{ cItem.user.nickname }}</view>
                      <text style="margin-left: 16rpx; color: #999;">{{ cItem.user.enterprise_vip }}</text>
                    </view>
                    <view class="user-rate">
                      <u-rate :current="cItem.star" :count="5" :disabled="true" size="20" gutter="4" active-icon="star-fill" inactive-icon="star-fill" active-color="#FFC324" inactive-color="#dadada" />
                    </view>
                  </view>
                  <view class="header-right">{{ cItem.created_at }}</view>
                </view>
                <view class="comment-content">
                  <text>{{ cItem.content }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 购买服务弹框 注：暂未使用 -->
    <u-popup v-model="isShowBuyServerPopup" mode="bottom" border-radius="24" :mask-close-able="false" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-buyServer-box" @click.stop="$commonUtil.stopPropagation">
        <image class="icon-del" mode="aspectFill" src="@/static/common/icon-del-3.png" @click="closeBuyServerPopup" />
        <view class="buyServer-title">企业律云年度服务套餐</view>
        <view class="spec-wrap">
          <view v-for="(sItem, sIndex) in serverSpecList.filter(val => val.version === '2')" :key="sIndex" class="spec-item" :class="{ 'spec-item-active': selectedServerSpecIndex === sIndex }" @click="changeServerSpec(sIndex)">
            <text>{{ sItem.title }}</text>
            <text>{{ sItem.price }}元/年</text>
            <image v-if="selectedServerSpecIndex === sIndex" class="active-gou-img" mode="aspectFill" src="@/static/center/spec-active-gou.png" />
          </view>
        </view>
        <!-- 联系按钮 -->
        <template v-if="serverSpecList.length && !userInfo.is_customer_service">
          <view v-if="sellShareServerSpec && sellShareServerSpecIndex === selectedServerSpecIndex" class="buy-btn" @click="buyServerSpec(sellShareServerSpec.enterprise_vip_id)">
            <text>限时特惠{{ sellShareServerSpec.price }}元</text>
          </view>
          <view v-else class="buy-btn" @click="buyServerSpec(serverSpecList[selectedServerSpecIndex].enterprise_vip_id)">
            <text>确认协议并支付</text>
          </view>
          <!-- 购买协议 -->
          <view class="buy-protocol-wrap">
            <view class="buy-protocol">
              <text class="check-desc">开通前请阅读</text>
              <text class="check-desc" style="color: #0085FF;" @click="routerToWebView(appExplainInfo.vip_introduction)">【年度法律服务套餐服务协议】</text>
              <text class="check-desc">和</text>
              <text class="check-desc" style="color: #0085FF;" @click="routerToWebView(appExplainInfo.vip_server_explain)">【服务说明】</text>
            </view>
          </view>
        </template>
        <!-- 客服显示这里 -->
        <view v-if="serverSpecList.length && userInfo.is_customer_service" class="sell-share-btns">
          <label class="share-label" for="shareBtnId">
            <view class="sell-share-btn" style="margin-right: 10rpx" @click="isShareDiscountPirce = false">分享原价<text>{{ serverSpecList[selectedServerSpecIndex].price }}元</text></view>
          </label>

          <label class="share-label" for="shareBtnId">
            <view class="sell-share-btn" @click="isShareDiscountPirce = true">分享优惠<text>{{ discountServerSpec.price }}元</text></view>
          </label>
        </view>
      </view>
    </u-popup>

    <!-- 购买成功 popup -->
    <u-popup v-model="isShowBuySucPopup" mode="center" width="512" border-radius="38" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-buySuc-box" @click.stop="$commonUtil.stopPropagation">
        <view class="buySuc-wrap">
          <image class="buySuc-img" mode="aspectFill" src="@/static/center/server-buy-sucPopup.png" />
          <view class="buySuc-btnWrap" @click="confirmViewServer">
            <text>前往会员中心</text>
            <image class="arrow-img" mode="aspectFill" src="@/static/center/server-buy-arrowRight.png" />
          </view>
        </view>
        <!-- <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="isShowOfficKefuPopup = false" /> -->
      </view>
    </u-popup>

    <!-- 立即开通拖拽 按钮 -->
    <!-- <server-buy-dragBtn ref="openDragBtnRef" :isHide="scrollYViewISScrolling" @btnClick="onOpenDragBtnClickEvt" /> -->

    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" />

    <!-- 客服 popup -->
    <kefu-popup ref="kefuRef" :headerImgType="2" />

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
  </view>
</template>

<script>
// import serverBuyDragBtn from './components/server-buy-dragBtn/server-buy-dragBtn';
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ServerBuy',
  // components: { serverBuyDragBtn },
  props: {
    // 是否跳过验证是否登录
    isSkipVerifyLogin: { type: Boolean, default: false },
    // 是否是分享进入
    isShareEnter: { type: Boolean, default: false },
    // 微信二维码扫码信息
    qrcodeScanInfo: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,
      isAgreeBuyProtocol: true, // 是否同意购买协议

      isShowBuyServerPopup: false, // 是否显示购买服务 popup
      isShowBuySucPopup: false, // 是否显示购买成功 popup

      selectedServerSpecIndex: 0, // 选中的服务规格下标
      serverSpecList: [], // 服务套餐列表
      serverSpecImgList: [], // 服务套餐规格详情图片列表
      serverSpecSafeImgList: [], // 诚信保障图片
      serverSpecFullImg: '', // 服务套餐规格完整图片
      serverSpecDetailImg: '', // 服务套餐详情图片
      serverSpecEvaluateCount: 0, // 服务套餐评价总数
      serverSpecEvaluateList: [], // 服务套餐评价列表

      scrollTabList: [
        { name: '会员权益', moduleSelector: '.vip-level-module', moduleOffsetTop: 0, },
        // { name: '服务保障', moduleSelector: '.safe-module', moduleOffsetTop: 0, },
        { name: '服务流程', moduleSelector: '.flow-module', moduleOffsetTop: 0, },
        { name: '服务评价', moduleSelector: '.comment-module', moduleOffsetTop: 0, },
      ],
      isShowTabnav: false, // 是否显示导航 tab
      sTabnavOpactiy: 0, // 导航 tab 透明度
      curActiveSTabIndex: 0, // 当前激活的

      scrollYViewTop: 0, // 设置 scrollViewY 竖向滚动条位置
      scrollYViewISScrolling: false, // scrollViewY 是否滚动中
      scrollYViewEndTimer: null, // scrollY 滚动 timer

      isShowLoginPopup: false, // 是否显示登录 popup
      isShareDiscountPirce: false, // 是否分享是优惠价格

      sellShareServerSpecId: 0, // 销售分享服务规格 id
      sellShareServerSpecIndex: -1, // 销售分享服务规格 index

      isShowOfficKefuDesc: true, // 是否显示客服更多内容
      isShowOfficKefuModule: true, // 是否显示客服模块
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
    /**
     * 优惠价格信息
     */
    discountServerSpec() {
      if (!this.serverSpecList.length) return;

      const selectedServerSpecTitle = this.serverSpecList[this.selectedServerSpecIndex].title;
      return this.serverSpecList.find(item => {
        return item.version === '3' && item.title === selectedServerSpecTitle;
      });
    },
    /**
     * 优惠价格信息
     */
    sellShareServerSpec() {
      if (!this.serverSpecList.length || !this.sellShareServerSpecId) return null;

      return this.serverSpecList.find(item => item.enterprise_vip_id === this.sellShareServerSpecId);
    }
  },
  created() {
    this._getServerSpecList();
  },
  methods: {
    /**
     * 获取节点的信息
     */
    _getNodeRectFields(selector) {
      return new Promise((resolve) => {
        let NodeRef = uni.createSelectorQuery().in(this).select(selector);
        NodeRef.fields({ size: true, rect: true, scrollOffset: true }, res => {
          resolve(res.top);
        }).exec();
      });
    },
    /**
     * scrollY 滚动事件
     */
    scrollYScrollEvt(event) {
      this.scrollYViewISScrolling = true; // 设置滚动中
      // 伪处理滚动结束事件
      if (this.scrollYViewEndTimer) {
        clearTimeout(this.scrollYViewEndTimer);
        this.scrollYViewEndTimer = null;
      }
      this.scrollYViewEndTimer = setTimeout(() => {
        this.scrollYViewISScrolling = false; // 滚动已结束
      }, 300);

      const { scrollTop } = event.detail;

      if (scrollTop > 30) {
        let opacity = scrollTop / this.scrollTabList[0].moduleOffsetTop;
        this.sTabnavOpactiy = opacity > 1 ? 1 : opacity;
        this.isShowTabnav = true;
      } else {
        this.sTabnavOpactiy = 0;
        this.isShowTabnav = false;
      }

      for (let tIndex in this.scrollTabList) {
        // 增加 4，是解决长屏手机滑动 tabnav 未联动跳转问题
        if (scrollTop >= this.scrollTabList[tIndex].moduleOffsetTop - 4) {
          this.curActiveSTabIndex = Number(tIndex);
        }
      }
    },
    /**
     * 改变scrollView中 tabnav
     */
    changeSTabnav(tabIndex) {
      this.scrollYViewTop = 0;
      this.scrollYViewTop = this.scrollTabList[tabIndex].moduleOffsetTop;
    },
    /**
     * 获取服务规格套餐
     */
    async _getServerSpecList() {
      try {
        const { data: serverSpecData } = await this.$api.getServerSpecList();
        // 过滤出 原价vip 列表
        const _serverSpecList = serverSpecData.enterprise_vip.filter(val => val.version === '2');

        // 存在微信二维码扫码信息
        if (this.qrcodeScanInfo.v) {
          // 查找到二维码分享的 vipId 项
          const findedShareVipObj = serverSpecData.enterprise_vip.find(item => item.enterprise_vip_id === Number(this.qrcodeScanInfo.v));
          // console.log(findedShareVipObj);
          if (findedShareVipObj) {
            // 取出 vip 层级 id
            const vipLevelId = findedShareVipObj.vip_level_id;
            // 取出 原价vip 下标
            const findRawVipIndex = serverSpecData.enterprise_vip.findIndex(item => (item.vip_level_id === vipLevelId) && (item.version === '2'));
            // console.log(findRawVipIndex);
            _serverSpecList[findRawVipIndex] = findedShareVipObj;
            this.selectedServerSpecIndex = findRawVipIndex; // 修改 vip 选中下标
          }
        }
        this.serverSpecList = _serverSpecList; // vip 套餐列表

        this.serverSpecEvaluateCount = serverSpecData.evaluate.count; // 服务套餐评价总数
        this.serverSpecEvaluateList = serverSpecData.evaluate.data; // 服务套餐评价列表
        this.serverSpecImgList = serverSpecData.images.separate; // 规格列表图片
        this.serverSpecFullImg = serverSpecData.images.all; // 规格完整图片
        this.serverSpecDetailImg = serverSpecData.images.bottom; // 商品详情图
        this.serverSpecSafeImgList = serverSpecData.images.certificate; // 诚信保障图
        // scrollViewY 距离顶部距离
        const contentScrollYTop = await this._getNodeRectFields('.content-scroll-y');

        for (let tIndex in this.scrollTabList) {
          this._getNodeRectFields(this.scrollTabList[tIndex].moduleSelector).then(resTop => {
            const moduleOffsetTop = (resTop - contentScrollYTop - 44 < 0) ? 0 : (resTop - contentScrollYTop - 44);
            // const moduleOffsetTop = resTop - contentScrollYTop;
            this.$set(this.scrollTabList, tIndex, { ...this.scrollTabList[tIndex], ...{ moduleOffsetTop } });
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 预览服务规格详情图片
     */
    previewServerSpecImg(serverSpecImgItem) {
      if (serverSpecImgItem.behavior_url) return this.$commonUtil.previewImg([serverSpecImgItem.behavior_url], serverSpecImgItem.behavior_url);
      this.$commonUtil.previewImg([this.serverSpecFullImg], this.serverSpecFullImg);
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
    /**
     * 选择服务规格
     */
    changeServerSpec(specIndex) {
      this.selectedServerSpecIndex = specIndex;
    },
    /**
     * 购买服务套餐
     */
    async buyServerSpec(payVipId) {
      if (!this.isAgreeBuyProtocol) return this.$u.toast('请先阅读并同意协议');
      if (this.selectedServerSpecIndex < 0) return this.$u.toast('请先选择服务套餐');
      if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      const enterpriseVipId = payVipId;
      if (!enterpriseVipId) return;

      uni.showLoading({ title: '购买中', mask: true });

      const param = { enterprise_vip_id: enterpriseVipId };
      // 若是销售分享二维码购买 则 添加加密字符串
      if (this.qrcodeScanInfo.s) param.share_affairs_str = this.qrcodeScanInfo.s;

      try {
        const { data: orderData } = await this.$api.getServerSpecPayOrder(param);
        const orderNo = orderData.order_no; // 订单号
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

        this.isShowBuyServerPopup = false;
        if (payResult) {
          // this.$u.toast('购买成功');
          this.isShowBuySucPopup = true;

          // 重新拉取个人信息
          // loginUtil.fetchUserInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 确定查看购买服务信息
     */
    confirmViewServer() {
      this.isShowBuySucPopup = false;
      // 重新拉取个人信息
      loginUtil.fetchUserInfo();
    },
    /**
     * 监听立即开通按钮点击事件
     * 暂未使用
     */
    onOpenDragBtnClickEvt() {
      if (this.isSkipVerifyLogin) return this.$u.toast('请前往小程序使用完整服务');

      if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      this.isShowBuyServerPopup = true;
    },
    /**
     * 关闭购买服务 popup
     */
    closeBuyServerPopup() {
      this.isShowBuyServerPopup = false;
      this.$refs.openDragBtnRef.openOfficKefuPopup();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
