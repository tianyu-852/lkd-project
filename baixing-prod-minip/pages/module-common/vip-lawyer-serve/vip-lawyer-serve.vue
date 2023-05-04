<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- banner -->
    <view class="banner-momdule">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221118-1668735753648-0YDESD.png" />
    </view>

    <view class="content-module" :style="{ paddingBottom: (sysSafeAreaHeight || 15) + 'px' }">

      <view class="content-item">
        <view class="content-item-title">优选律师</view>
        <!-- <view class="content-item-title" style="color: #595241; font-size: 28rpx; font-weight: 400;">每日订单保障，轻松挣外块，若未达到平台无条件赔付</view> -->

        <view class="content-vip-box">
          <!-- 套餐 父类型 -->
          <view class="vipType-nav-wrap">
            <view v-for="(tNavItem, tNavIndex) in lawyerVipServeList" :key="tNavIndex" class="type-nav-item" :class="{ 'type-nav-item-active': activeLawyerVipTypeIndex === tNavIndex, 'type-nav-item-prev': activeLawyerVipTypeIndex - 1 === tNavIndex, 'type-nav-item-next': activeLawyerVipTypeIndex + 1 === tNavIndex }" @click="changeLawyerVipTypeNav(tNavIndex)">
              <view class="type-nav-inner">
                <text>{{ tNavItem.name }}</text>
                <view v-if="activeLawyerVipTypeIndex === tNavIndex" class="bottom-line" />
              </view>
            </view>
          </view>

          <!-- 套餐列表-->
          <view class="vipType-subNav-wrap" :class="{ 'vipType-subNav-wrap-first': activeLawyerVipTypeIndex === 0, 'vipType-subNav-wrap-last': activeLawyerVipTypeIndex === lawyerVipServeList.length - 1 }">
            <view class="vip-serve-desc">匹配订单次数：系统订单推送后，成功接单计为1次</view>
            <view class="vip-serve-menu">
              <view v-for="(vItem, vIndex) in lawyerVipServeList[activeLawyerVipTypeIndex].list" :key="vIndex" class="vip-serve-item" :class="{ 'vip-serve-item-active': activeVipServeIndex === vIndex }" @click="changeVipLawyerServe(vIndex)">
                <view v-if="vItem.version === 3" class="vip-serve-tag">{{ vItem.name }}</view>
                <text v-if="!sellerShareFormDetail">{{ vItem.price }}元/{{ vItem.day_unit }}</text>
                <!-- 销售优惠价 -->
                <text v-else>{{ sellerShareFormDetail[vItem.optimization_plan_id].price }}元/{{ vItem.day_unit }}</text>
                <image v-if="activeVipServeIndex === vIndex" class="checked-image" src="../static/active-gou-square-yellow.png" />
              </view>
            </view>
            <!-- <view v-if="lawyerVipServeList.length" class="vip-serve-income">预计平台收益：{{ lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex] | incomeDescFilter }}</view> -->
          </view>
        </view>

        <!-- 优惠输入区域 -->
        <view v-if="!sellerShareFormDetail && userInfo.sales_affair && userInfo.sales_affair.user_id" class="discount-module">
          <view class="discount-item">
            <view class="discount-item-title">限时优惠</view>
            <input v-model="lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].discountDesc" class="discount-item-input" cursor-spacing="30" placeholder="请输入限时优惠文案" placeholder-style="color: #999; font-size: 28rpx;">
          </view>
          <view class="discount-item">
            <view class="discount-item-title">金额设置</view>
            <view class="discount-input-wrap">
              <input v-model="lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].discountPrice" class="discount-item-input" cursor-spacing="30" :placeholder="'请输入优惠金额 (默认' + lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].price + '元)'" placeholder-style="color: #999; font-size: 28rpx;">
              <view class="offset-checkbox" style="display: flex; align-item: center; justify-content: center; font-size: 22rpx; color: #999; margin-top: 20rpx;"><u-checkbox v-model="sellerSharePayMode" :name="6" active-color="#7f5400" icon-size="18" /><text style="margin-left: -20rpx; font-size: 28rpx; color: #333;" @click="sellerSharePayMode = !sellerSharePayMode">余额抵扣</text></view>
            </view>
          </view>
          <view class="discount-item">
            <view class="discount-item-title">服务截止时间</view>
            <view class="discount-item-input" @click="isShowEndDatePicker = true">{{ lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].discountDay }}</view>
          </view>
        </view>
        <!-- 存在销售分享的标识 -->
        <view v-else-if="sellerShareFormDetail" class="discount-module">
          <view v-if="sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].desc" class="discount-item">
            <view class="discount-item-title">限时优惠</view>
            <view class="discount-item-desc">{{ sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].desc }}</view>
          </view>
          <view class="discount-item">
            <view class="discount-item-title">服务截止时间</view>
            <view class="discount-item-desc">{{ sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].day | dateFormatFilter }}</view>
          </view>
        </view>

        <!-- 邀请用户支付 -->
        <!-- <label v-if="!sellerShareFormDetail && userInfo.sales_affair.user_id" class="share-label" for="shareBtnId">
          <view class="share-btn">邀请用户支付</view>
        </label> -->
        <view v-if="!sellerShareFormDetail && userInfo.sales_affair.user_id" class="share-btn-wrap" >
          <view class="share-btn" @click="isShowSelectLawyerPopup = true">选择律师，代支付</view>

          <label style="flex: 1" for="shareBtnId">
            <view class="share-btn">律师身份支付</view>
          </label>
        </view>
        <!-- 用户支付按钮 -->
        <template v-else-if="sellerShareFormDetail">
          <view class="pay-btn" @click="openPayPopup">
          <!-- <view class="pay-btn" @click="confirmBuyVipLawyerServe"> -->
            <text>￥</text>
            <text>{{ sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].price }}元</text>
            <text style="margin-left: 10rpx;">立即支付</text>
          </view>
          <view v-if="sellerSharePayOrderNo" style="display: flex; align-item: center; justify-content: center; font-size: 22rpx; color: #999; margin-top: 20rpx;"><u-checkbox v-model="lawyerProtocolAgree" :name="1" shape="circle" active-color="#7f5400" icon-size="18" /><text style="margin-left: -20rpx;" @click="lawyerProtocolAgree = !lawyerProtocolAgree">勾选即表示同意</text><text style="color: #333;" @click="routerToWebView(appConfigInfo.lawyer_vip_agreement)">《律师服务协议》</text></view>
          <view v-else-if="!sellerSharePayMode" style="display: flex; align-item: center; justify-content: center; font-size: 22rpx; color: #999; margin-top: 20rpx;"><u-checkbox v-model="lawyerProtocolAgree" :name="1" shape="circle" active-color="#7f5400" icon-size="18" /><text style="margin-left: -20rpx;" @click="lawyerProtocolAgree = !lawyerProtocolAgree">勾选即表示同意</text><text style="color: #333;" @click="routerToWebView(appConfigInfo.lawyer_vip_agreement)">《律师服务协议》</text></view>
        </template>
      </view>

      <u-picker
        v-model="isShowEndDatePicker"
        mode="time"
        :start-year="$dayjs().year()"
        :end-year="$dayjs().add(5, 'y').year()"
        :default-time="vipEnterpriseServeList[activeVipIndex].discountDay"
        @confirm="onVipEndDatePickerConfirmEvt"
      />
      
      <view class="content-item" style="margin-top: 30rpx;">
        <view class="content-item-title">专属特权 高效创收</view>
        <view class="content-explain-row">
          <view class="content-explain-row-item">
            <view class="circle-gou"><u-icon name="checkmark" size="18" ></u-icon></view>
            <text>订单广场，碎片时间随心接单</text>
          </view>
        </view>
        <view class="content-explain-row">
          <view class="content-explain-row-item">
            <view class="circle-gou"><u-icon name="checkmark" size="18" ></u-icon></view>
            <text>法律小铺，社区化运营，精准转化</text>
          </view>
        </view>
        <view class="content-explain-row">
          <view class="content-explain-row-item">
            <view class="circle-gou"><u-icon name="checkmark" size="18" ></u-icon></view>
            <text>社区解答优先展示</text>
          </view>
        </view>
        <view class="content-explain-row">
          <view class="content-explain-row-item">
            <view class="circle-gou"><u-icon name="checkmark" size="18" ></u-icon></view>
            <text>律师列表优先推荐</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />

    <!-- 支付方式 popup -->
    <u-popup v-model="isShowPayModePopup" mode="bottom" border-radius="30" safe-area-inset-bottom closeable :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view v-if="sellerShareFormDetail" class="upopup-pubPhone-box" @click.stop="$commonUtil.stopPropagation">
        <view class="mode-header">请选择支付方式</view>
        <view class="pay-title">实付金额</view>
        <view class="pay-money">
          <span>￥</span>
          <span class="money">{{ sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].price }}</span>
        </view>

        <view class="line-hor" />

        <view class="mode-wrap">
          <view class="mode-item">
            <image class="mode-icon" src="../static/payMode-wallet.png" />
            <view class="info-wrap" @click="switchPayMode(0)">
              <view class="info-name">钱包支付</view>
              <view class="info-desc">可用余额：{{ userInfo.balance }}元</view>
            </view>
            <view class="checkbox">
              <u-checkbox v-model="isCheckWalletPay" :disabled="Number(userInfo.balance) < Number(sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].price)" :name="0" shape="circle" active-color="#0085FF" icon-size="30rpx" @change="onWalletPayCheckboxChangeEvt" />
            </view>
          </view>
          <view class="mode-item">
            <image class="mode-icon" src="../static/payMode-wechat.png" />
            <view class="info-wrap" @click="switchPayMode(1)">
              <view class="info-name">微信支付</view>
              <view v-if="Number(userInfo.balance) < Number(sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].price)" class="info-desc">
                <span style="margin-right: 16rpx;">钱包余额抵扣：{{ userInfo.balance }}元</span>
                <view @click.stop="">
                  <u-checkbox v-model="isCheckWalletDeductPay" :disabled="Number(userInfo.balance) > Number(sellerShareFormDetail[lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].optimization_plan_id].price)" :name="3" shape="circle" active-color="#0085FF" icon-size="18rpx" />
                </view>
              </view>
              <view v-else class="info-desc">钱包余额无需抵扣</view>
            </view>
            <view class="checkbox">
              <u-checkbox v-model="isCheckWechatPay" :name="2" shape="circle" active-color="#0085FF" icon-size="18" @change="onWechatPayCheckboxChangeEvt" />
            </view>
          </view>
        </view>
        <!-- 支付按钮 -->
        <view class="pay-btn" @click="confirmBuyVipLawyerServe">立即支付</view>
        <view style="display: flex; align-item: center; justify-content: center; font-size: 22rpx; color: #999; margin-top: 30rpx;"><u-checkbox v-model="lawyerProtocolAgree" :name="1" shape="circle" active-color="#0085FF" :icon-size="20" /><text style="margin-left: -20rpx;" @click="lawyerProtocolAgree = !lawyerProtocolAgree">勾选即表示同意</text><text style="color: #333;" @click="routerToWebView(appConfigInfo.lawyer_vip_agreement)">《律师服务协议》</text></view>
      </view>
    </u-popup>

    <!-- 支付密码弹框 -->
    <u-popup v-if="isShowPasswordPopup" v-model="isShowPasswordPopup" mode="center" border-radius="20">
      <view class="upopup-passwrod-box" @click.stop="$commonUtil.stopPropagation">
        <view class="header-passwrod">请输入支付密码</view>

        <u-message-input dot-fill focus :maxlength="6" @finish="onPasswordFinishEvt" />
      </view>
    </u-popup>

    <!-- 选择律师账号 popup -->
    <u-popup v-model="isShowSelectLawyerPopup" mode="center" border-radius="20">
      <view class="upopup-lawyer-box" @click.stop="$commonUtil.stopPropagation">
        <view class="header-lawyer">请选择律师</view>

        <view class="lawyer-item">
          <view class="lawyer-title">律师姓名</view>
          <view class="input-wrap">
            <input v-model="lawyerPopupLawyerName" class="input-text" cursor-spacing="30" placeholder="输入律师姓名" placeholder-style="color: #999; font-size: 30rpx;">
            <!-- 搜索企业结果列表 -->
            <view v-if="lawyerPopupSearchLawyerList.length" class="search-wrap">
              <view v-for="(sItem, sIndex) in lawyerPopupSearchLawyerList" :key="sIndex" class="search-item" @click="selectlawyerItem(sItem)">
                <view class="search-name">{{ sItem.nickname }}</view>
                <view class="search-num">手机号: {{ sItem.mobile }}</view>
              </view>
            </view>
          </view>
          <u-button type="primary" size="mini" @click="searchLawyer">搜索</u-button>
        </view>
        <view v-if="lawyerPopupSelectLawyer" class="lawyer-item">
          <view class="lawyer-title" style="color: #0085FF;">已选律师：</view>
          <view class="lawyer-wrap">
            <view class="search-name">{{ lawyerPopupSelectLawyer.nickname }}</view>
            <view class="search-num">手机号: {{ lawyerPopupSelectLawyer.mobile }}</view>
          </view>
        </view>

        <view v-if="lawyerPopupSelectLawyer" class="lawyer-item">
          <view class="lawyer-title">抵扣金额</view>
          <view class="input-wrap">
            <input v-model="lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex].debtRemark" class="input-text" style="width: 100%;" cursor-spacing="30" placeholder="输入抵扣金额（可选）" placeholder-style="color: #999; font-size: 30rpx;">
          </view>
        </view>

        <label v-if="lawyerPopupSelectLawyer" for="shareBtnId">
          <view class="share-btn">邀请支付</view>
        </label>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';
import dayjs from 'dayjs';

export default {
  name: 'VipLawyerServe',
  filters: {
    incomeDescFilter(lawyerVipItem) {
      const _income = (20 * lawyerVipItem.num * lawyerVipItem.day) - lawyerVipItem.price
      const _incomeDesc = `20 * ${ lawyerVipItem.num } * ${ lawyerVipItem.day } - ${ lawyerVipItem.price } = ${ _income }元`
      return _incomeDesc;
    },
    dateFormatFilter(value) {
      return dayjs().add(value, 'd').format('YYYY-MM-DD');
    },
    numToFixedFilter(num, s) {
      var times = Math.pow(10, s)
      var des = num * times + 0.5
      des = parseInt(des, 10) / times
      return des + ''
    }
  },
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,

      lawyerVipServeList: [], // 律师套餐列表
      activeVipServeIndex: 0, // 选中的的律师套餐 下标
      activeLawyerVipTypeIndex: 0, // 选中的律师套餐 类型下标
      isNeedGuaranteeMoney: 1, // 是否需要交保障金

      isShowEndDatePicker: false, // 是否显示 vip 过期 picker

      sellerShareStr: '', // 销售分享标识
      sellerShareVipTypeIndex: -1, // 销售分享 套餐类型下标
      sellerShareVipIndex: -1, // 销售分享 套餐下标
      sellerShareFormDetail: null, // 销售分享 律师套餐 详情
      sellerSharePayMode: false, // 销售分享 支付方式 false: 微信支付 true: 可选择支付方式
      sellerSharePayOrderNo: '', // 销售分享 支付订单号

      lawyerProtocolAgree: false, // 律师协议

      isShowSelectLawyerPopup: false, // 是否显示选择律师 popup
      lawyerPopupLawyerName: '', // 选择律师 popup 姓名
      lawyerPopupSearchLawyerList: '', // 选择律师 popup 搜索列表
      lawyerPopupSelectLawyer: null, // 确定的律师

      isShowPayModePopup: false, // 是否打开支付方式 popup
      isCheckWalletPay: false, // 钱包支付 方式
      isCheckWechatPay: true, // 微信支付 方式
      isCheckWalletDeductPay: false, // 钱包抵扣

      isShowPasswordPopup: false, // 是否显示输入密码弹框
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
    console.log(routeParam)

    // 销售分享标识
    if (routeParam.sellerShareStr) this.sellerShareStr = routeParam.sellerShareStr;

    // 销售分享 套餐类型下标
    if (Number(routeParam.sellerShareVipTypeIndex) > -1) {
      this.sellerShareVipTypeIndex = Number(routeParam.sellerShareVipTypeIndex);
      this.activeLawyerVipTypeIndex = this.sellerShareVipTypeIndex
    }
    // 销售分享 套餐下标
    if (Number(routeParam.sellerShareVipIndex) > -1) {
      this.sellerShareVipIndex = Number(routeParam.sellerShareVipIndex);
      this.activeVipServeIndex = this.sellerShareVipIndex; 
    }

    // 销售分享 支付方式
    if (routeParam.sellerSharePayMode) {
      if (routeParam.sellerSharePayMode === 'true') {
        this.sellerSharePayMode = true;
      } else {
        this.sellerSharePayMode = false;
      }
    }

    // 销售分享支付订单号
    if (routeParam.sellerSharePayOrderNo) this.sellerSharePayOrderNo = routeParam.sellerSharePayOrderNo;

    // 未登录进入登录页面
    if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
    // 获取销售分享的 优惠套餐
    this.sellerShareStr && this._getSellerShareFormDetail(this.sellerShareStr);
    this._getgetVipLawyerServe();
  },
  async onShareAppMessage() {
    const { userInfo, lawyerVipServeList } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();
    // 拉平律师套餐 列表
    const _lawyerVipServeFlatList = []
    lawyerVipServeList.forEach((item => {
      _lawyerVipServeFlatList.push(...item.list)
    }));

    // 销售身份
    if (userInfo.sales_affair.user_id) {
      // 检查价格是否是数字类型
      if (_lawyerVipServeFlatList.some(item => item.discountPrice.trim() && !(/^\d+(\.\d+)?$/.test(item.discountPrice.trim())))) return this.$u.toast('请输入正确的套餐价格');
      if (_lawyerVipServeFlatList.some(item => item.debtRemark.trim() && !(/^\d+(\.\d+)?$/.test(item.debtRemark.trim())))) return this.$u.toast('请输入正确的抵扣价格');
      if (_lawyerVipServeFlatList.some(item => this.$dayjs(item.discountDay.trim()).diff(this.$dayjs(), 'd') <= 0)) return this.$u.toast('请选择合理套餐结束日期');

      const form_data = {};
      // 组织参数
      _lawyerVipServeFlatList.forEach(item => {
        form_data[item.optimization_plan_id] = {
          desc: item.discountDesc.trim(),
          price: item.discountPrice.trim() || item.price,
          debt_remark: item.debtRemark.trim() || '', // 余额抵扣备注
          day: this.$dayjs(`${ item.discountDay.trim() } 00:00:00`).diff(this.$dayjs().startOf('d'), 'd')
        }
      });
      
      const param = { user_id: userInfo.sales_affair.user_id, form_data: JSON.stringify(form_data) }
      const { data: sellerFlagData } = await this.$api.sellerCreateShareVipLawyerServeFormApi(param);

      let payOrderNo = ''; // 支付订单号
      // 待支付 | 生成待支付订单
      if (this.isShowSelectLawyerPopup && this.lawyerPopupSelectLawyer) {
        const lawyerVipServeItem = this.lawyerVipServeList[this.activeLawyerVipTypeIndex].list[this.activeVipServeIndex]
        const orderParam = { type: 5, optimization_plan_id: lawyerVipServeItem.optimization_plan_id, is_combined_payment: 0 };
        // 律师 id
        this.lawyerPopupSelectLawyer && (orderParam.user_id = this.lawyerPopupSelectLawyer.user_id);
        // 存在销售分享标识 & 参数添加销售标识
        sellerFlagData.share_affairs_str && (orderParam.share_affairs_str = sellerFlagData.share_affairs_str);

        const { data: orderData } = await this.$api.postVipLawyerServeOrderApi(orderParam);
        payOrderNo = orderData.order_no; // 订单号
        if (!payOrderNo) return this.$u.toast('创建订单失败');
        this.isShowSelectLawyerPopup = false;
      }

      return {
        title: '律快答智慧法律生态',
        path: `${ currentRoute }?sellerShareStr=${ sellerFlagData.share_affairs_str }&sellerShareVipTypeIndex=${ this.activeLawyerVipTypeIndex }&sellerShareVipIndex=${ this.activeVipServeIndex }&sellerSharePayMode=${ this.sellerSharePayMode }&sellerSharePayOrderNo=${ payOrderNo }`,
        imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221116-1668564399712-En0txS.png'
      }
    } else {
      return {
        title: '律快答智慧法律生态',
        path: `${ currentRoute }`,
        imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221116-1668564399712-En0txS.png'
      }
    }
  },
  methods: {
    /**
     * 获取 vip 律师套餐列表
     */
    async _getgetVipLawyerServe() {
      uni.showLoading({ title: '加载中', mask: true });
      
      try {
        // const { data: vipLawyerServeData } = await this.$api.getVipLawyerServeApi();
        const { data: vipLawyerServeData } = await this.$api.getVipLawyerServeMinipApi();
        // 套餐先分组
        let vipLawyerGroup = {};
        vipLawyerServeData.data.forEach(item => {
          if (Object.keys(vipLawyerGroup).indexOf('' + item.field) === -1) {
            vipLawyerGroup[item.field] = {};
            vipLawyerGroup[item.field].name = `日均${ item.num }次`;
            vipLawyerGroup[item.field].list = [];
          }
          //对应插入属性值
          vipLawyerGroup[item.field].list.push(item);
        });

        // 重新组织 vip 律师套餐
        const _vipLawyerServeList = [];
        for (let groupKey in vipLawyerGroup) {
          _vipLawyerServeList.push({
            name: vipLawyerGroup[groupKey].name,
            type: groupKey,
            list: vipLawyerGroup[groupKey].list.map(item => {
              item.discountPrice = ''; // 优惠价格
              item.offsetPrice = ''; // 余额抵扣价格
              item.discountDesc = ''; // 优惠文案
              item.debtRemark = ''; // 抵扣备注
              item.discountDay = `${ this.$dayjs().add(item.day, 'd').format('YYYY-MM-DD') }`; // 优惠天数
              return item;
            })
          });
        }
        this.lawyerVipServeList = _vipLawyerServeList;

        // 存在销售分享 vip && 排除其他的vip套餐
        if (this.sellerShareVipTypeIndex > -1) {
          const sellerShareLawyerServe = this.lawyerVipServeList[this.sellerShareVipTypeIndex].list[this.sellerShareVipIndex]
          this.lawyerVipServeList[this.sellerShareVipTypeIndex].list = [sellerShareLawyerServe]
          this.activeVipServeIndex = 0; // 默认选中第一个
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取销售分享 律师vip 套餐优惠表单详情
     */
    async _getSellerShareFormDetail(share_affairs_str) {
      if (!share_affairs_str) return;
      const param = { share_affairs_str };
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: sellerShareFormData } = await this.$api.getSellerShareFormDetailApi(param);
        this.sellerShareFormDetail = sellerShareFormData.form_data;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 切换律师套餐类型导航
     */
    changeLawyerVipTypeNav(tNavIndex) {
      if (this.sellerShareFormDetail) {
        // if (this.sellerShareVipTypeIndex !== tNavIndex) return this.$u.toast('不可切换');
        if (this.sellerShareVipTypeIndex !== tNavIndex) return;
      } else {
        this.activeLawyerVipTypeIndex = tNavIndex;
        this.activeVipServeIndex = 0;
      }
    },
    /**
     * 选择 vip 律师套餐
     */
    changeVipLawyerServe(vipIndex) {
      this.activeVipServeIndex = vipIndex;
    },
    /**
     * 监听 vip 过期时间 picker 确定事件
     */
    onVipEndDatePickerConfirmEvt(event) {
      this.lawyerVipServeList[this.activeLawyerVipTypeIndex].list[this.activeVipServeIndex].discountDay = `${ event.year }-${ event.month }-${ event.day }`;
    },
    /**
     * 打开支付 popup
     */
    openPayPopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' }); // 未登录进入登录页面
      // if (this.userInfo.type !== 1) return this.$u.toast('请先成为律师身份才能购买');
      // 销售已经生成支付订单
      if (this.sellerSharePayOrderNo) return this.confirmBuyVipLawyerServe();
      
      // 多种支付
      if (this.sellerSharePayMode) {
        this.isShowPayModePopup = true;
      // 微信支付
      } else {
        this.confirmBuyVipLawyerServe();
      }
    },
    /**
     * 购买 vip 律师套餐
     */
    async confirmBuyVipLawyerServe() {
      const { userId, lawyerVipServeList, activeLawyerVipTypeIndex, activeVipServeIndex } = this;
      if (!userId) return uni.navigateTo({ url: '/pagesV1/common/login' }); // 未登录进入登录页面
      // if (this.userInfo.type !== 1) return this.$u.toast('请先成为律师身份才能购买');
      if (!this.isCheckWalletPay && !this.isCheckWechatPay) return this.$u.toast('请选择支付方式');
      if (!this.lawyerProtocolAgree) return this.$u.toast('请先勾选律师协议');

      // 钱包余额支付
      if (this.isCheckWalletPay) return this.isShowPasswordPopup = true;

      let payOrderParam = {};
      // 需要自己生成支付订单
      if (!this.sellerSharePayOrderNo) {
        const lawyerVipServeItem = lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex];
        payOrderParam = { type: 5, optimization_plan_id: lawyerVipServeItem.optimization_plan_id, is_combined_payment: 0 };
        // 存在销售分享标识 & 参数添加销售标识
        this.sellerShareStr.trim() && (payOrderParam.share_affairs_str = this.sellerShareStr.trim());
        // 组合支付
        if (this.isCheckWechatPay && this.isCheckWalletDeductPay) (payOrderParam.is_combined_payment = 1);
      }

      uni.showLoading({ title: '购买中', mask: true });
      try {

        let payOrderNo = ''; // 订单号
        if (this.sellerSharePayOrderNo) {
          payOrderNo = this.sellerSharePayOrderNo.trim(); // 销售分享的订单号
        } else {
          // 自己生成订单号
          const { data: orderData } = await this.$api.postVipLawyerServeOrderApi(payOrderParam);
          payOrderNo = orderData.order_no;
        }

        if (!payOrderNo) return this.$u.toast('创建订单失败');

        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrderApi({ type: 1, order_no: payOrderNo });

        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });

        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        if (payResult) {
          this.isShowPayModePopup = false;
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
    },
    /**
     * 监听密码输入完成事件 钱包余额支付
     */
    async onPasswordFinishEvt(passwordValue) {
      const { lawyerVipServeList, activeLawyerVipTypeIndex, activeVipServeIndex } = this;

      const lawyerVipServeItem = lawyerVipServeList[activeLawyerVipTypeIndex].list[activeVipServeIndex]
      const param = { type: 5, optimization_plan_id: lawyerVipServeItem.optimization_plan_id, is_combined_payment: 0 };
      // 存在销售分享标识 & 参数添加销售标识
      this.sellerShareStr.trim() && (param.share_affairs_str = this.sellerShareStr.trim());

      uni.showLoading({ title: '购买中', mask: true });
      try {
        const { data: orderData } = await this.$api.postVipLawyerServeOrderApi(param);
        const orderNo = orderData.order_no; // 订单号
        if (!orderNo) return this.$u.toast('创建订单失败');

        // 获取微信支付参数 type = 0: 余额支付
        await this.$api.payOrderApi({ type: 0, order_no: orderNo, deal_password: passwordValue });
        this.isShowPasswordPopup = false;
        this.isShowPayModePopup = false;
        uni.$emit('toastEvt', { msg: '购买成功,请下载「律快答律师端」APP体验' }); // 触发全局的 toast 事件
        setTimeout(() => {
          this.$commonUtil.backPage();
        }, 2000);
        loginUtil.fetchUserInfo(); // 重新拉取个人信息
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听钱包支付 checkbox change 事件
     */
    onWalletPayCheckboxChangeEvt(detail) {
      if (detail.value) this.isCheckWechatPay = false;
    },
    /**
     * 监听钱包支付 checkbox change 事件
     */
    onWechatPayCheckboxChangeEvt(detail) {
      if (detail.value) this.isCheckWalletPay = false;
    },
    /**
     * 切换支付方式
     */
    switchPayMode(type) {
      // 钱包支付
      if (type === 0) {
        if (Number(this.userInfo.balance) < Number(this.sellerShareFormDetail[this.lawyerVipServeList[this.activeLawyerVipTypeIndex].list[this.activeVipServeIndex].optimization_plan_id].price)) return;
        this.isCheckWalletPay = !this.isCheckWalletPay; 
        if (this.isCheckWalletPay) this.isCheckWechatPay = false;
      // 微信支付
      } else if (type === 1) {
        this.isCheckWechatPay = !this.isCheckWechatPay;
        if (this.isCheckWechatPay) this.isCheckWalletPay = false;
      }
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },

    /**
     * 搜索律师
     */
    async searchLawyer() {
      if (!this.lawyerPopupLawyerName.trim()) return this.$u.toast('请输入搜索律师姓名');
      const param = { search: this.lawyerPopupLawyerName.trim() };
      uni.showLoading({ title: '搜索中', mask: true });

      try {
        const { data: searchData } = await this.$api.searchLawyerApi(param);
        this.lawyerPopupSearchLawyerList = searchData
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择律师
     */
    selectlawyerItem(lawyerItem) {
      this.lawyerPopupSelectLawyer = lawyerItem;
      this.lawyerPopupSearchLawyerList = [];
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
