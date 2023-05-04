<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#fff' }" title="创建合同" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="base-module">
      <!-- 抬头类型 -->
      <view class="select-item">
        <view class="select-key">订单类型</view>
        <view class="type-wrap">
          <view v-for="(tItem, tIndex) in typeList" :key="tIndex" class="type-item" :class="{ 'type-item-active': activeTypeIndex === tIndex }" @click="activeTypeIndex = tIndex">{{ tItem.name }}</view>
        </view>
      </view>

      <!-- 企业名称 -->
      <view class="order-item">
        <view class="order-title">企业名称</view>
        <input v-model="contractOrderInfo.enterpriseName" class="input" cursor-spacing="30" placeholder="请输入企业名称" placeholder-style="color: #bbb; font-size: 30rpx;" @input="$u.debounce(_searchEnterpriseList, 500)">
        <!-- 搜索结果 -->
        <view v-if="searchEnterpriseList.length" class="search-wrap">
          <view v-for="(sItem, sIndex) in searchEnterpriseList" :key="sIndex" class="search-item" @click="selectEnterpriseItem(sItem)">
            <view class="search-name">{{ sItem.name }}</view>
            <view class="search-num">{{ sItem.credit_code }}</view>
          </view>
        </view>
      </view>
      <!-- 企业信用代码 -->
      <view v-if="contractOrderInfo.creditCode" class="order-item">
        <view class="order-title">企业信用代码</view>
        <view class="order-value">{{ contractOrderInfo.creditCode }}</view>
        <!-- <view class="order-value" style="color: #bbb;">请先输入企业名称</view> -->
      </view>
      <!-- 联系人 -->
      <view class="order-item">
        <view class="order-title">联系人</view>
        <input v-model="contractOrderInfo.contactName" class="input" cursor-spacing="30" placeholder="请输入联系人" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 联系电话 -->
      <view class="order-item">
        <view class="order-title">联系电话</view>
        <input v-model="contractOrderInfo.contactMobile" class="input" cursor-spacing="30" placeholder="请输入联系电话" placeholder-style="color: #bbb; font-size: 30rpx;">
      </view>
      <!-- 购买法律服务套餐 -->
      <view class="order-item">
        <view class="order-title">购买法律服务套餐</view>
        <view class="select-wrap">
          <view>请选择服务套餐</view>
          <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>

    <view class="divide-ver" />

    <view class="contract-module">
      <!-- 合同签署类型 -->
      <view class="contract-nav-wrap">
        <view class="contract-nav-item" :class="{ 'contract-nav-item-active': contractOrderInfo.signType === 1 }" @click="contractOrderInfo.signType = 1">
          <text>在线签订合同</text>
          <view v-if="contractOrderInfo.signType === 1" class="bottom-line" />
        </view>
        <view class="contract-nav-item" :class="{ 'contract-nav-item-active': contractOrderInfo.signType === 2 }" @click="contractOrderInfo.signType = 2">
          <text>上传合同照片</text>
          <view v-if="contractOrderInfo.signType === 2" class="bottom-line" />
        </view>
        <view class="contract-nav-item" :class="{ 'contract-nav-item-active': contractOrderInfo.signType === 3 }" @click="contractOrderInfo.signType = 3">
          <text>未签合同已付款</text>
          <view v-if="contractOrderInfo.signType === 3" class="bottom-line" />
        </view>
      </view>

      <view class="contract-option-wrap">
        <!-- 在线签订合同 -->
        <view v-if="contractOrderInfo.signType === 1" class="one-option-wrap">
          <view class="serial-option">
            <text>合同编号：</text>
            <text>暂未识别</text>
          </view>
        </view>
        <!-- 上传合同照片 -->
        <view v-else-if="contractOrderInfo.signType === 2" class="two-option-wrap">
          <view class="bianhao-option" @click="isShowSerialNumListPopup = true">
            <text>合同编号：</text>
            <view class="bianhao-select">
              <text style="color: #999;">请选择合同编号</text>
              <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
            </view>
          </view>
          <view class="rawmail-option">
            <text>邮寄合同原件：</text>
            <view class="rawmail-input">
              <input style="flex: 1;" placeholder="请填写快递单号" placeholder-style="color: #999; font-size: 30rpx;">
              <image class="icon-scan" mode="aspectFill" src="../static/icon-scan.png" />
              <text style="color: #0085FF;">扫描</text>
            </view>
          </view>

          <!-- 快递项 -->
          <view class="express-option">
            <view class="express-header">
              <view class="header-left">
                <text>已签收</text>
                <text style="margin-left: 20rpx;">06-06 20:23</text>
              </view>
              <view class="header-right">
                <text>查看物流</text>
              </view>
            </view>

            <view class="express-content">【代收点】您的快件已签收，签收人在【江南文苑西门超市(滨文路江南文苑西门超市691-1)】领取</view>
          </view>

          <!-- 请上传合同图片 -->
          <view class="upload-module" style="margin-top: 20rpx;">
            <view class="upload-title">请上传合同图片</view>

            <view class="image-wrap">
              <view v-for="(iItem, iIndex) of contractOrderInfo.contractImages" :key="iIndex" class="image-item">
                <image class="image" mode="aspectFill" :src="iItem" @click="$commonUtil.previewImg(contractOrderInfo.contractImages, iItem)" />
                <image class="icon-del" mode="aspectFill" src="../static/icon-image-del.png" @click="contractOrderInfo.contractImages.splice(iIndex, 1)" />
              </view>
              <view class="image-empty" @click="chooseContractImage">
                <image class="icon-camera" mode="aspectFill" src="../static/icon-camera-fill.png" />
              </view>
            </view>
          </view>
        </view>
        <!-- 未签合同已付款 -->
        <view v-else-if="contractOrderInfo.signType === 3" class="three-option-wrap">
          未签合同已付款
        </view>
      </view>

      <view class="payment-wrap">
        <view class="payment-title">是否已<text style="color: #FE5F48;">付款</text></view>
        <view class="payment-status-wrap">
          <view v-for="(pItem, pIndex) in contractPayStatusList" :key="pIndex" class="payment-status-item" :class="{ 'payment-status-item-active': contractPayStatusIndex === pIndex }" @click="contractPayStatusIndex = pIndex">{{ pItem.name }}</view>
          <view class="payment-status-item payment-invite-item">邀请支付</view>
        </view>
      </view>
    </view>

    <!-- 请上传打款截图 -->
    <view class="upload-module" style="padding: 0 24rpx; margin">
      <view class="upload-title">请上传打款截图</view>

      <view class="image-wrap">
        <view v-for="(iItem, iIndex) of contractOrderInfo.payImages" :key="iIndex" class="image-item">
          <image class="image" mode="aspectFill" :src="iItem" @click="$commonUtil.previewImg(contractOrderInfo.payImages, iItem)" />
          <image class="icon-del" mode="aspectFill" src="../static/icon-image-del.png" @click="contractOrderInfo.payImages.splice(iIndex, 1)" />
        </view>
        <view class="image-empty" @click="choosePayImage">
          <image class="icon-camera" mode="aspectFill" src="../static/icon-camera-fill.png" />
        </view>
      </view>
    </view>

    <view class="bottom-btns">
      <view class="create-btn" @click="submitCreateContractOrder">创建订单</view>
    </view>

    <!-- 合同套餐列表 popup -->
    <u-popup v-model="isShowContractServeListPopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }">
      <view class="upopup-contractServe-box" @click.stop="$commonUtil.stopPropagation">
        <view class="contractServe-header">选择购买法律服务套餐</view>

        <view class="contractServe-body">
          <view class="contractServe-title">优惠价格</view>
          <view class="contractServe-wrap">
            <view v-for="(cItem, cIndex) in 6" :key="cIndex" class="contractServe-item" :class="{ 'contractServe-item-active': 1 === cIndex }">
              <view class="contractServe-name">基础版优惠价</view>
              <view class="contractServe-price">4998元/年</view>
            </view>
          </view>

          <view class="contractServe-title" style="margin-top: 30rpx;">公开价格</view>
          <view class="contractServe-wrap">
            <view v-for="(cItem, cIndex) in 6" :key="cIndex" class="contractServe-item">
              <view class="contractServe-name">基础版原价</view>
              <view class="contractServe-price">6998元/年</view>
            </view>
          </view>
        </view>
        <view class="divide-ver" />
        <view class="contractServe-cancel-btn">取消</view>
      </view>
    </u-popup>

    <!-- 合同编号列表 popup -->
    <u-popup v-model="isShowSerialNumListPopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }">
      <view class="upopup-serialnum-box" @click.stop="$commonUtil.stopPropagation">
        <view class="serialnum-header">
          <text>请选择合同编号</text>
          <view class="confirm-btn" @click="confirmSerialNumItem">确定</view>
        </view>
        <scroll-view scroll-y class="serialnum-wrap">
          <view v-for="(sItem, sIndex) in 20" :key="sIndex" class="serialnum-item" :class="{ 'serialnum-item-active': activeSerialNumIndex === sIndex }" @click="changeSerialNumItem(sItem, sIndex)">
            <text>lkd13243453453</text>
            <image v-if="activeSerialNumIndex === sIndex" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
          </view>
        </scroll-view>
        <view class="divide-ver" />
        <view class="serialnum-cancel-btn">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import fileUtil from '@/common/utils/fileUtil';

export default {
  name: 'ContractCreate',
  data() {
    return {
      typeList: [ { name: '企业', type: 1 }, { name: '个人', type: 2 } ], // 订单类型列表
      activeTypeIndex: 0, // 激活的抬头类型下标

      contractOrderInfo: {
        enterpriseName: '', // 企业名称
        creditCode: '', // 企业证件号
        contactName: '', // 联系人姓名
        contactMobile: '', // 联系人手机号
        signType: 2, // 合同签署类型
        contractImages: [], // 合同照片
        payImages: [], // 打款截图照片
      },

      contractPayStatusList: [{ name: '已付款', status: 1 }, { name: '暂缓', status: 2 }], // 合同支付状态列表
      contractPayStatusIndex: 0, // 合同支付状态下标

      searchEnterpriseList: [], // 搜索企业列表

      isShowContractServeListPopup: true, // 是否显示合同服务列表 popup
      contractServeList: [], // 合同服务套餐列表

      contractSerialNumList: [], // 合同编号列表
      activeSerialNumIndex: -1, // 选中的编号下标
      isShowSerialNumListPopup: false, // 是否显示合同编号列表 popup
    };
  },
  onLoad() {
    this._getContractOrderSerialNumList();
  },
  methods: {
    /**
     * 根据关键字搜索企业列表
     */
    async _searchEnterpriseList() {
      if (!this.contractOrderInfo.enterpriseName.trim()) {
        // 重置信用代码 & 法人
      //   this.enterpriseApproveInfo.enterpriseCreditCode = '';
      //   this.enterpriseApproveInfo.enterpriseLegalPersonName = '';
      //   this.searchEnterpriseList = [];
      //   return;
      }

      const param = { page: 1, size: 200, word: this.contractOrderInfo.enterpriseName.trim() };
      // 重置信用代码 & 法人
      // this.enterpriseApproveInfo.enterpriseCreditCode = '';
      // this.enterpriseApproveInfo.enterpriseLegalPersonName = '';

      try {
        const { data: enterpriseData } = await this.$api.searchEnterpriseList(param);
        enterpriseData.items && (this.searchEnterpriseList = enterpriseData.items);
        !this.searchEnterpriseList.length && this.$u.toast('未搜索到相应结果');
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择企业项
     */
    selectEnterpriseItem(enterpriseItem) {
      this.contractOrderInfo.creditCode = enterpriseItem.credit_code;
      this.contractOrderInfo.enterpriseName = enterpriseItem.name;
      this.searchEnterpriseList = [];
    },
    /**
     * 获取合同编号列表
     */
    async _getContractOrderSerialNumList() {
      const param = { page: 1, size: 200 };

      try {
        const { data: orderSerialNumData } = await this.$api.getContractOrderSerialNumList(param);

        // this.allianceActivityInfo = allianceActivityData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 改变选择合同编号项
     */
    changeSerialNumItem(serialnumItem, serialnumIndex) {
      this.activeSerialNumIndex = serialnumIndex;
    },
    /**
     * 确定选择合同编号项
     */
    confirmSerialNumItem() {
      if (this.activeSerialNumIndex < 0) return this.$u.toast('请先选择合同编号');
      this.isShowSerialNumListPopup = false;
    },
    /**
     * 选择合同图片
     */
    async chooseContractImage() {
      const [error, imgRes] = await uni.chooseMedia({ count: 9, mediaType: ['image'] });
      if (error) return;

      const _contractImages = []; // 合约图片
      // 上传文件到 oss
      for (const fItem of imgRes.tempFiles) {
        const imageUrl = await fileUtil.uploadFile(fItem.tempFilePath);
        _contractImages.push(imageUrl);
      }
      this.contractOrderInfo.contractImages.push(..._contractImages);
    },
    /**
     * 选择打款截图图片
     */
    async choosePayImage() {
      const [error, imgRes] = await uni.chooseMedia({ count: 9, mediaType: ['image'] });
      if (error) return;

      const _payImages = []; // 支付图片
      // 上传文件到 oss
      for (const fItem of imgRes.tempFiles) {
        const imageUrl = await fileUtil.uploadFile(fItem.tempFilePath);
        _payImages.push(imageUrl);
      }
      this.contractOrderInfo.payImages.push(..._payImages);
    },
    /**
     * 提交创建合同订单
     */
    async submitCreateContractOrder() {
      if (!this.contractOrderInfo.enterpriseName.trim()) return this.$u.toast('请输入企业名称');
      if (!this.contractOrderInfo.contactName.trim()) return this.$u.toast('请输入联系人姓名');
      if (!this.contractOrderInfo.contactMobile.trim()) return this.$u.toast('请输入联系人手机号');

      // uni.showLoading({ title: '创建中', mask: true });

      const param = {
        order_type: this.typeList[this.activeTypeIndex].type, // 订单类型
        enterprise_name: this.contractOrderInfo.enterpriseName.trim(), // 企业名称
        contact_person: this.contractOrderInfo.contactName.trim(), // 联系人姓名
        contact_phone: this.contractOrderInfo.contactMobile.trim(), // 联系人姓名
        sign_type: this.contractOrderInfo.signType, // 签署类型
        contract_images: JSON.stringify(this.contractOrderInfo.contractImages), // 合同照片
        pay_images: JSON.stringify(this.contractOrderInfo.payImages), // 支付照片
        pay_status: this.contractPayStatusList[this.contractPayStatusIndex].status, // 支付状态
      };

      console.log(param);

      try {
        // const { data: createResData } = await this.$api.createContractOrder(param);
        // this.allianceActivityInfo = allianceActivityData;
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
