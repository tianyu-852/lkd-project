<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :title="contractDetail.name" title-width="340" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- <view class="contract-module">
      <view class="preview-btn" @click="navToWebviewWord(contractDetail.contract_path)">
        <image class="icon-eye" src="../static/icon-eye-f.png" />
        <text>预览合同</text>
      </view>
    </view> -->

    <view class="contract-module" @click="$commonUtil.previewImg([contractDetail.contract_sign_img], contractDetail.contract_sign_img)">
      <image class="contract-img" mode="widthFix" :src="contractDetail.contract_sign_img" />
    </view>

    <view class="btns-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="submit-btn" @click="openSumbitPopup">提交VIP信息</view>
    </view>

    <!-- 权益 -->
    <view class="rights-module" :class="{ 'rights-module-active': isOpenRightModule }" :style="{ top: uNavbarHeight + 'px', bottom: bottomBtnsHeight + 'px' }">
      <view class="view-btn" :class="{ 'view-btn-active': isOpenRightModule }" @click="isOpenRightModule = !isOpenRightModule">
        <image class="icon-view" mode="aspectFill" src="../static/icon-view.png" />
        <text v-if="!isOpenRightModule" style="margin-left: 8rpx;">查看</text>
      </view>
      <!-- <view class="btn-wrap">
        <view class="finish-btn">完成</view>
      </view> -->
      <view class="rights-wrap">
        <view v-for="(vItem, vIndex) in contractDetail.vip_equities" :key="vIndex" class="rights-item">
          <view>{{ vItem.remark }}</view>
          <view>{{ vItem.num >= 9999 ? '不限' : vItem.num }}</view>
        </view>
      </view>
    </view>

    <view v-if="isOpenRightModule" class="mask" @click="isOpenRightModule = !isOpenRightModule" />

    <!-- 提交 popup -->
    <u-popup v-model="isShowSubmitPopup" mode="center" width="540" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-submit-box" @click.stop="$commonUtil.stopPropagation">
        <view class="submit-header">
          <image class="icon-del" mode="aspectFill" src="../static/icon-popup-delB.png" @click="isShowSubmitPopup = !isShowSubmitPopup" />
          <view class="contract-name">{{ contractDetail.name }}</view>
        </view>
        <view class="input-wrap">
          <!-- 客户姓名 -->
          <view class="input-item">
            <view class="input-key">客户姓名</view>
            <input v-model="clientInfo.name" class="input" maxlength="20" placeholder="输入客户姓名" placeholder-style="color: #999; font-size: 30rpx;">
          </view>
          <!-- 手机号码 -->
          <view class="input-item">
            <view class="input-key">手机号码</view>
            <input v-model="clientInfo.mobile" class="input" maxlength="11" placeholder="输入手机号码" placeholder-style="color: #999; font-size: 30rpx;">
          </view>
          <!-- VIP等级 -->
          <view class="input-item">
            <view class="input-key">VIP等级</view>
            <view class="input-value">{{ clientInfo.vipName }}</view>
          </view>
          <!-- 合同有效期 -->
          <view class="input-item">
            <view class="input-key">VIP有效期</view>
            <view v-if="clientInfo.vipExpiredTime" class="input-value" @click="isShowVipExpiredPicker = true">{{ clientInfo.vipExpiredTime }}</view>
            <view v-else class="input-value" style="color: #999;" @click="isShowVipExpiredPicker = true">请选择</view>
          </view>
          <!-- 合同金额 -->
          <view class="input-item">
            <view class="input-key">VIP金额</view>
            <view class="input-value">
              <text style="margin-right: 10rpx;">￥</text>
              <input v-model="clientInfo.price" class="input" maxlength="15" :cursor-spacing="30" placeholder="请输入合同金额" placeholder-style="color: #999; font-size: 30rpx;">
            </view>
          </view>

          <view class="confirm-btn" @click="submitClientVipInfo">确认</view>
        </view>
      </view>
    </u-popup>

    <!-- vip过期时间 -->
    <u-picker
      v-model="isShowVipExpiredPicker"
      mode="time"
      :start-year="$dayjs().year()"
      :end-year="$dayjs().add(3, 'y').year()"
      :default-time="vipExpiredPickerDefaultTime"
      @confirm="vipExpiredPickerConfirmEvt"
    />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ContractSignEdit',
  components: {},
  data() {
    return {
      sellLoadImg400: this.$store.state.sellLoadImg400,
      uNavbarHeight: 0, // 顶部导航栏高度 px
      bottomBtnsHeight: 0, // 底部按钮高度 px

      signType: 0, // 签署类型 1: 在线签署 2：邮寄签署

      contractTmpId: 0, // 合同模板 id
      contractDetail: {}, // 合同详情
      isOpenRightModule: false, // 是否打开权益模块

      isShowSubmitPopup: false, // 是否显示提交 popup
      isShowVipExpiredPicker: false, // 是否显示vip过期 picker
      vipExpiredPickerDefaultTime: '', // vip过期默认时间
      // 客户信息
      clientInfo: {
        name: '',
        mobile: '',
        price: '',
        vipId: '', // vip id
        vipName: '', // vip 名称
        vipExpiredTime: '', // vip 过期时间
      },
    };
  },
  computed: {
    ...mapState(['systemInfo']),
    ...mapGetters(['sysSafeAreaHeight', 'sysScreenHeight']),
  },
  onLoad() {
    const { signType, contractTmpId } = this.$Route.query;
    signType && (this.signType = signType);
    contractTmpId && (this.contractTmpId = contractTmpId);

    this._getContractTmpDetail();
  },
  onReady() {
    this.vipExpiredPickerDefaultTime = this.$dayjs().add(1, 'y').add(1, 'd').format('YYYY-MM-DD');
    this.clientInfo.vipExpiredTime = this.vipExpiredPickerDefaultTime; // vip 过期时间
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
    this.bottomBtnsHeight = await this.$commonUtil.calcNodeHeight('.btns-module');
  },
  methods: {
    /**
     * 获取待签署合同详情
     */
    async _getContractTmpDetail() {
      if (!this.contractTmpId) return;
      const param = { sales_contract_template_id: this.contractTmpId };

      try {
        const { data: contractDetailData } = await this.$api.getContractTmpDetail(param);
        this.contractDetail = contractDetailData;
        // vip 套餐价格
        this.clientInfo.price = this.contractDetail.enterprise_vip_price;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开提交 popup
     */
    openSumbitPopup() {
      this.clientInfo.vipId = this.contractDetail.enterprise_vip_id;
      this.clientInfo.vipName = this.contractDetail.enterprise_vip_name;
      this.isShowSubmitPopup = true;
    },
    /**
     * 监听 vip过期时间确定事件
     */
    vipExpiredPickerConfirmEvt(event) {
      this.clientInfo.vipExpiredTime = `${ event.year }-${ event.month }-${ event.day }`;
    },
    /**
     * 提交客户 vip 信息
     */
    submitClientVipInfo() {
      if (!this.signType) return this.$u.toast('请选择签署类型');
      if (!this.clientInfo.name.trim()) return this.$u.toast('请输入客户姓名');
      if (!this.clientInfo.mobile.trim()) return this.$u.toast('请输入客户手机号');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.clientInfo.mobile.trim()))) return this.$u.toast('请输入正确的手机号');
      if (!this.clientInfo.vipId) return this.$u.toast('请选择vip等级');
      if (!this.clientInfo.vipExpiredTime) return this.$u.toast('请选择vip有效期');
      if (!this.clientInfo.price.trim()) return this.$u.toast('请输入vip价格');

      // 处理权益列表
      const contractVipRights = this.contractDetail.vip_equities.map(item => {
        let obj = { vip_privilege_id: item.vip_privilege_id, num: item.num };
        return obj;
      });

      this._createClientVipInfo(contractVipRights);
    },
    /**
     * 创建客户信息
     */
    async _createClientVipInfo(contractVipRights) {
      uni.showLoading({ title: '提交中', mask: true });

      const param = {
        sign_type: Number(this.signType), // 签署类型
        sales_contract_template_id: Number(this.contractTmpId),
        customer_name: this.clientInfo.name.trim(),
        customer_mobile: this.clientInfo.mobile.trim(),
        enterprise_vip_id: this.clientInfo.vipId,
        contract_effective: this.clientInfo.vipExpiredTime,
        contract_money: this.clientInfo.price.trim(),
        contract_interests_info: JSON.stringify(contractVipRights)
      };

      try {
        const { data: contractOrderData } = await this.$api.createClientVipInfo(param);
        // 合同订单 id
        const contractOrderId = contractOrderData.contract_order_id;

        // 进入企业信息提交页面
        setTimeout(() => {
          // this.$commonUtil.routeNavTo('contractSignSubmit', { contractOrderId });
          this.$Router.replace({ name: 'contractSignSubmit', params: { contractOrderId } });
        }, 500);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 进入 文档预览页面 待删除
     */
    navToWebviewWord(webSrc) {
      this.$Router.push({ name: 'webviewWord', params: { webSrc } });
    }
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
