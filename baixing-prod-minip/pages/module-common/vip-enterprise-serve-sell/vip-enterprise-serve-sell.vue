<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" immersive title="企业法务" title-color="#fff" :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- banner -->
    <view class="banner-momdule">
      <image style="width: 100%; height: 100%;" mode="aspectFill" :src="vipEnterpriseServeList[activeVipIndex].images_introduce.top_image" />
    </view>

    <view class="content-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 45 + 50 + 'px' }">
      <view class="content-title">企业法律服务年度套餐</view>
      <view class="content-subtitle">合同漏洞、劳资纠纷、股权纠纷、债权债务</view>

      <!-- 存在分享 vip 项 -->
      <view v-if="shareEnterprisevipId && vipEnterpriseServeList.length" class="share-vip-module">
        <text>{{ vipEnterpriseServeList[0].title == '优享版·月' ? '优享版·首月体验' : vipEnterpriseServeList[0].title }}</text>
        <!-- <text>/￥{{ vipEnterpriseServeList[0].price }}</text> -->
        <image class="active-gou-img" mode="aspectFill" src="../static/active-gou.png" />
      </view>

      <scroll-view v-else class="scroll-x vip-scroll-x" scroll-x enhanced :show-scrollbar="false">
        <view v-for="(sItem, sIndex) in vipEnterpriseServeList" :key="sIndex" class="scroll-x-item">
          <view class="vipServe-wrap" :class="{ 'vipServe-wrap-active': activeVipIndex === sIndex }" @click="changeVipServer(sIndex)">
            <text>{{ sItem.title == '优享版·月' ? '优享版·首月体验' : sItem.title }}</text>
            <text>￥{{ sItem.price }}</text>
            <image v-if="activeVipIndex === sIndex" class="active-gou-img" mode="aspectFill" src="../static/active-gou.png" />
          </view>
        </view>
      </scroll-view>

      <!-- 优惠输入区域 -->
      <view v-if="userInfo.sales_affair.user_id && !vipEnterpriseSellerShareStr && !sellerShareFormDetail" class="discount-module">
        <view class="discount-item">
          <view class="discount-item-title">限时优惠</view>
          <input v-model="vipEnterpriseServeList[activeVipIndex].discountDesc" class="discount-item-input" cursor-spacing="30" placeholder="请输入限时优惠文案" placeholder-style="color: #999; font-size: 28rpx;">
        </view>
        <view class="discount-item">
          <view class="discount-item-title">金额设置</view>
          <input v-model="vipEnterpriseServeList[activeVipIndex].discountPrice" class="discount-item-input" cursor-spacing="30" :placeholder="'请输入优惠金额 (默认' + vipEnterpriseServeList[activeVipIndex].price + '元)'" placeholder-style="color: #999; font-size: 28rpx;">
        </view>
        <view class="discount-item">
          <view class="discount-item-title">服务截止时间</view>
          <view class="discount-item-input" @click="isShowEndDatePicker = true">{{ vipEnterpriseServeList[activeVipIndex].discountDay }}</view>
        </view>
      </view>
      <!-- 存在销售分享的标识 -->
      <view v-if="sellerShareFormDetail" class="discount-module">
        <view class="discount-item">
          <view class="discount-item-title">限时优惠</view>
          <view class="discount-item-desc">{{ sellerShareFormDetail[vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id].desc }}</view>
        </view>
        <view class="discount-item">
          <view class="discount-item-title">服务截止时间</view>
          <view class="discount-item-desc">{{ sellerShareFormDetail[vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id].day | dateFormatFilter }}</view>
        </view>
      </view>

      <!-- 支付优惠套餐按钮 -->
      <view v-if="vipEnterpriseSellerShareStr && vipEnterpriseServeList.length" class="pay-btns">
        <view class="pay-btn" @click="buyVipEnterpriseServe">
          <text v-if="sellerShareFormDetail">￥{{ sellerShareFormDetail[vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id].price || 0 }}</text>
          <text v-else>￥{{ vipEnterpriseServeList[activeVipIndex].price || 0 }}</text>
          <text style="margin-left: 20rpx;">立即支付</text>
        </view>
        <view class="pay-protocol">
          <text>购买前即表示同意</text>
          <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.enterprise_vip_agreement_url)">《百姓律师企业服务协议》</text>
        </view>
      </view>

      <!-- 图片 -->
      <view class="img-module">
        <view v-for="(iItem, iIndex) in vipEnterpriseServeList[activeVipIndex].images_introduce.total_image" :key="iIndex" @click="previewServeDetailImg(iIndex)">
          <image style="width: 100%; display: block;" mode="widthFix" :src="iItem" />
        </view>
      </view>

      <!-- 用户评价 -->
      <view class="comment-module">
        <view class="title-wrap"><view class="title-left">服务评价</view></view>
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
    </view>

    <!-- 邀请按钮 -->
    <view v-if="userInfo.sales_affair.user_id && !vipEnterpriseSellerShareStr && !sellerShareFormDetail" class="btn-bottom" :style="{ paddingBottom: (sysSafeAreaHeight || 20) + 'px' }">
      <label class="share-label" for="shareBtnId">
        <view class="share-btn">邀请用户支付</view>
      </label>
    </view>

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />

    <u-picker
      v-model="isShowEndDatePicker"
      mode="time"
      :start-year="$dayjs().year()"
      :end-year="$dayjs().add(5, 'y').year()"
      :default-time="vipEnterpriseServeList[activeVipIndex].discountDay"
      @confirm="vipEndDatePickerConfirmEvt"
    />

    <!-- 购买成功 popup -->
    <u-popup v-model="isShowBuySucPopup" mode="center" width="544" border-radius="24" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-buySuc-box" @click.stop="$commonUtil.stopPropagation">
        <image class="header-img" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022108-1665200575422-93hRrf.png" />
        <view class="buySuc-wrap">
          <text>请耐心等待</text>
          <text>法务管家联系</text>
          <view class="buySuc-btn" @click="$commonUtil.backPage">我已知晓</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'VipEnterpriseServeSell',
  filters: {
    dateFormatFilter(value) {
      return dayjs().add(value + 1, 'd').format('YYYY-MM-DD');
    }
  },
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px

      vipEnterpriseServeList: [], // vip 企业套餐列表
      activeVipIndex: 0, // 选中的企业套餐下标

      serverSpecEvaluateList: [], // 服务套餐评价列表
      isShowBuySucPopup: false, // 是否显示购买成功 popup
    
      isShowEndDatePicker: false, // 是否显示vip过期 picker
      shareEnterprisevipId: '', // 分享的企业 vip id
      vipEnterpriseSellerShareStr: '', // 销售分享标识
      sellerShareFormDetail: null, // 销售分享产品详情
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
    console.log('路由：', routeParam)
    // 分享 vip id
    if (routeParam.shareEnterprisevipId) this.shareEnterprisevipId = routeParam.shareEnterprisevipId;
    // 销售分享标识
    if (routeParam.vipEnterpriseSellerShareStr) this.vipEnterpriseSellerShareStr = routeParam.vipEnterpriseSellerShareStr;
    
    // 销售分享的优惠套餐
    this.vipEnterpriseSellerShareStr && this._getSellerShareFormDetail(this.vipEnterpriseSellerShareStr);

    this._getVipEnterpriseServe();
    this._getVipEnterpriseServeComment();
  },
  async onShareAppMessage() {
    const { userInfo, vipEnterpriseServeList, activeVipIndex } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();
    const shareEnterprisevipId = vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id
    // 销售身份
    if (userInfo.sales_affair.user_id) {
      // 检查价格是否是数字类型
      if (vipEnterpriseServeList.some(item => item.discountPrice.trim() && !(/^\d+(\.\d+)?$/.test(item.discountPrice.trim())))) return this.$u.toast('请输入正确的套餐价格');
      if (vipEnterpriseServeList.some(item => this.$dayjs(item.discountDay.trim()).diff(this.$dayjs(), 'd') <= 0)) return this.$u.toast('请选择合理套餐结束日期');

      const form_data = {};
      // 组织参数
      vipEnterpriseServeList.forEach(item => {
        form_data[item.husbandman_enterprise_vip_id] = {
          desc: item.discountDesc.trim(),
          price: item.discountPrice.trim() || item.price,
          // day: item.discountDay.trim() || item.day
          day: this.$dayjs(item.discountDay.trim() + 1).diff(this.$dayjs(), 'd')
        }
      });
      
      const param = {
        user_id: userInfo.sales_affair.user_id,
        form_data: JSON.stringify(form_data)
      }
      const { data: sellerFlagData } = await this.$api.sellerCreateShareVipEnterpriseServeFormApi(param);

      return {
        title:'一站式企业法律服务',
        path: `${ currentRoute }?vipEnterpriseSellerShareStr=${ sellerFlagData.share_affairs_str }&shareEnterprisevipId=${ shareEnterprisevipId }`,
        imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221011-1665468302906-K531Fw.png'
      }
    } else {
      return {
        title:'一站式企业法律服务',
        path: `${ currentRoute }`,
        imageUrl: `https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221011-1665468302906-K531Fw.png?shareEnterprisevipId=${ shareEnterprisevipId }`
      }
    }
  },
  methods: {
    /**
     * 获取 vip 企业套餐列表
     */
    async _getVipEnterpriseServe(page = 1) {
      uni.showLoading({ title: '加载中', mask: true });
      const param = { page };

      try {
        const { data: vipEnterpriseServeData } = await this.$api.getVipEnterpriseServeApi(param);
        let vipEnterpriseServeItems = vipEnterpriseServeData.data.map(item => {
          item.discountPrice = ''; // 优惠价格
          item.discountDesc = ''; // 优惠文案
          item.discountDay = `${ this.$dayjs().add(item.day + 1, 'd').format('YYYY-MM-DD') }`; // 优惠天数
          return item;
        });

        // 存在分享 vip id
        if (this.shareEnterprisevipId) {
          const findVipEnterpriseItem = vipEnterpriseServeItems.find(item => item.husbandman_enterprise_vip_id === Number(this.shareEnterprisevipId));
          if (findVipEnterpriseItem) {
            vipEnterpriseServeItems = [findVipEnterpriseItem];
          } else {
            vipEnterpriseServeItems = vipEnterpriseServeItems[0];
          }
        }
        
        this.vipEnterpriseServeList = vipEnterpriseServeItems
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取销售分享企业 vip 套餐优惠表单详情
     */
    async _getSellerShareFormDetail(share_affairs_str) {
      if (!share_affairs_str) return;
      const param = { share_affairs_str };

      try {
        const { data: sellerShareFormData } = await this.$api.getSellerShareFormDetailApi(param);
        this.sellerShareFormDetail = sellerShareFormData.form_data
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取 vip 企业套餐评论列表
     */
    async _getVipEnterpriseServeComment() {
      try {
        const { data: commentData } = await this.$api.getVipEnterpriseServeCommentApi();
        this.serverSpecEvaluateList = commentData.data
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择 vip 服务规格
     */
    changeVipServer(vipIndex) {
      this.activeVipIndex = vipIndex;
    },
    /**
     * 监听 vip过期时间确定事件
     */
    vipEndDatePickerConfirmEvt(event) {
      const { activeVipIndex } = this;
      this.vipEnterpriseServeList[activeVipIndex].discountDay = `${ event.year }-${ event.month }-${ event.day }`
    },
    /**
     * 预览服务规格详情图片
     */
    previewServeDetailImg(imgIndex) {
      if (imgIndex !== 1) return;
      const imgSrc = this.vipEnterpriseServeList[this.activeVipIndex].images_introduce.popup_image
      this.$commonUtil.previewImg([imgSrc], imgSrc);
    },
    /**
     * 购买 vip 企业套餐
     */
    async buyVipEnterpriseServe() {
      const { userId, vipEnterpriseServeList, activeVipIndex } = this;
      // 未登录进入登录页面
      if (!userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

      const husbandman_enterprise_vip_id = vipEnterpriseServeList[activeVipIndex].husbandman_enterprise_vip_id
      // 确定是否购买
      const already_buy = vipEnterpriseServeList[activeVipIndex].already_buy
      if (already_buy) return this.$u.toast('你已购买了该套餐');
      uni.showLoading({ title: '购买中', mask: true });

      try {
        const param = { husbandman_enterprise_vip_id: husbandman_enterprise_vip_id };
        // 存在销售分享标识 & 参数添加销售标识
        this.vipEnterpriseSellerShareStr.trim() && (param.share_affairs_str = this.vipEnterpriseSellerShareStr.trim());

        const { data: orderData } = await this.$api.postVipEnterpriseServeOrderApi(param);
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
          // this.$u.toast('购买成功');
          this.isShowBuySucPopup = true;
          // 重新拉取个人信息
          loginUtil.fetchUserInfo();
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
