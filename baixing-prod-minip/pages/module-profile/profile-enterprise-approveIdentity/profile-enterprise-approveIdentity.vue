<template>
  <view class="main" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 35 + 44 + 10 + 'px' }">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar back-icon-color="#333" title-color="#333" :border-bottom="false" title="完成身份认证" />
    <!-- #endif -->

    <!-- 验证方式 -->
    <view class="base-module">
      <view class="base-title">验证方式</view>
      <view class="verify-type-wrap">
        <view v-for="(vItem, vIndex) in verifyTypeList" :key="vIndex" :class="[ 'verify-type-item', activieVerifyTypeIndex === vIndex ? 'verify-type-item-active' : '' ]" @click="activieVerifyTypeIndex = vIndex">{{ vItem.name }}</view>
      </view>
      <view class="verify-type-explain">
        <text v-if="activieVerifyTypeIndex === 0">平台会向你的银行账户打款，验证你资料的准确性。请提供和营业执照上的负责人/法人/经营者名称一致的个人银行账户或与营业执照主体名称一致的对公银行账户。请确认以下信息是否正确，如有误请点击下方“修改企业信息”按钮进行修改</text>
        <text v-else-if="activieVerifyTypeIndex === 1">请确认以下信息是否正确，如有误请点击下方</text>
      </view>
    </view>

    <view class="divide-ver" />

    <!-- 不可编辑 -->
    <view class="base-module noEdit-module">
      <!-- 验证类型（不可编辑） -->
      <view class="content-item">
        <view class="item-title">验证类型（不可编辑）</view>
        <view v-if="userEnterpriseInfo.enterprise_type === 1" class="input-wrap" style="color: #bbb;">企业</view>
        <view v-else-if="userEnterpriseInfo.enterprise_type === 2" class="input-wrap" style="color: #bbb;">个体户</view>
      </view>

      <!-- 企业名称（不可编辑） -->
      <view class="content-item">
        <view class="item-title">企业名称（不可编辑）</view>
        <view class="input-wrap" style="color: #bbb;">{{ userEnterpriseInfo.enterprise_name }}</view>
      </view>

      <!-- 营业执照上的负责人/法人/经营者姓名（不可编辑） -->
      <view v-if="userEnterpriseInfo.enterprise_type === 2" class="content-item">
        <view class="item-title">营业执照上的负责人/法人/经营者姓名（不可编辑）</view>
        <view class="input-wrap" style="color: #bbb;">{{ userEnterpriseInfo.legal_person }}</view>
      </view>
    </view>

    <view class="divide-ver" />

    <!-- <view v-if="activieVerifyTypeIndex === 1" class="base-module faceApprove-module">
      营业执照上的负责人/法人/经营者姓名
      <view class="content-item">
        <view class="item-title">营业执照上的负责人/法人/经营者姓名<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <input v-model="faceVerifyInfo.userName" class="input-text" cursor-spacing="30" placeholder="请输入营业执照上的负责人/法人/经营者姓名" placeholder-style="color: #999; font-size: 30rpx;">
        </view>
      </view>

      营业执照上的负责人/法人/经营者身份证号
      <view class="content-item">
        <view class="item-title">营业执照上的负责人/法人/经营者身份证号<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <input v-model="faceVerifyInfo.userIdNum" class="input-text" cursor-spacing="30" placeholder="请输入营业执照上的负责人/法人/经营者身份证号" placeholder-style="color: #999; font-size: 30rpx;">
        </view>
      </view>
    </view> -->

    <!-- 银行 -->
    <view v-if="activieVerifyTypeIndex === 0" class="base-module bank-module">
      <view class="content-item">
        <view class="item-title">
          <text>银行卡类型</text>
          <image class="icon-tanhao" mode="aspectFill" src="../static/icon-!.png" />
          <text @click="routerToWebView('https://h5.lawkd.com/enprister-approve-remitIssue')">常见问题</text>
        </view>
        <view class="bankCard-type-wrap">
          <view v-for="(bItem, bIndex) in bankCardTypeList" :key="bIndex" :class="[ 'bankCard-type-item', activieBankCardTypeIndex === bIndex ? 'bankCard-type-item-active' : '' ]" @click="activieBankCardTypeIndex = bIndex">{{ bItem.name }}</view>
        </view>
      </view>

      <!-- 开户银行名称 -->
      <view class="content-item">
        <view class="item-title">开户银行名称</view>
        <view class="select-wrap" @click="openBankOptPopup">
          <view v-if="selectedBankInfo.name" class="select-value">{{ selectedBankInfo.name }}</view>
          <view v-else class="select-value" style="color: #999;">请选择开户总行</view>
          <u-icon name="arrow-right" color="#999" />
        </view>
      </view>

      <!-- 银行卡号 -->
      <view class="content-item">
        <view class="item-title">银行卡号</view>
        <view class="input-wrap">
          <!-- <input v-model="bankCardNum" class="input-text" cursor-spacing="30" placeholder="请填写银行卡号" placeholder-style="color: #999; font-size: 30rpx;"> -->
          <input class="input-text" cursor-spacing="30" type="number" placeholder="请填写银行卡号" placeholder-style="color: #999; font-size: 30rpx;" @input="onBankCardInputEvt">
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view v-if="activieVerifyTypeIndex === 0" class="submit-btn" @click="openSubmitConfirmModal">提交</view>
      <view v-else-if="activieVerifyTypeIndex === 1" class="submit-btn" @click="startFaceVerify">开启认证</view>
      <view class="edit-btn" @click="navToModifyEnterpriseInfo">
        <text>修改企业信息</text>
      </view>
    </view>

    <!-- 银行列表 popup -->
    <u-popup v-model="isShowBankListPopup" mode="bottom" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .2)' }">
      <view class="upopup-bank-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-header">
          <view class="cancel-btn" @click="isShowBankListPopup = false">取消</view>
          <view class="upopup-title">选择银行名称</view>
          <view class="cancel-btn" style="color: #0085FF;" @click="isShowBankListPopup = false">确认</view>
        </view>
        
        <view class="input-wrap">
          <image class="icon-search" mode="aspectFill" src="../static/icon-search-9.png" />
          <input v-model="searchBankKeyword" class="input-text" cursor-spacing="30" placeholder="请输入开户银行名称" placeholder-style="color: #999; font-size: 30rpx;" @input="$u.debounce(searchBankList, 500)">
        </view>

        <scroll-view scroll-y class="bank-wrap-scrollView">
          <view v-for="(bItem, bIndex) in bankFilterDataList" :key="bIndex" class="bank-item" @click="selectBankOpt(bItem)">
            <text>{{ bItem.name }}</text>
            <image v-if="activebankOptIndex === bIndex" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
          </view>
        </scroll-view>
      </view>
    </u-popup>

    <!-- 提交确认 modal -->
    <u-modal
      v-model="isShowConfirmSumitModal"
      :show-title="false"
      show-cancel-button
      cancel-text="返回修改"
      confirm-text="确认提交"
      cancel-color="#666"
      confirm-color="#333"
      @confirm="onSubmitModalConfirmEvt"
    >
      <view class="umodal-submit-box">
        <view class="umodal-title">平台将向如下银行账户打款</view>
        <view class="bank-info">账户名：{{ userEnterpriseInfo.enterprise_name }}</view>
        <view class="bank-info">银行卡号：{{ bankCardNum }}</view>
      </view>
    </u-modal>

    <!-- 认证成功 popup -->
    <u-popup v-model="isShowApproveSuccessPopup" mode="center" width="520" border-radius="24" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-success-box" @click.stop="$commonUtil.stopPropagation">
        <view class="success-img-wrap">
          <image class="icon-success" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022830-1661842812641-sAMsXm.png" />
        </view>
        <view class="info-item" style="font-size: 32rpx; margin-bottom: 16rpx;">恭喜您，企业账号</view>
        <view class="info-item" style="font-size: 42rpx; font-weight: 500; margin-bottom: 16rpx; color: #0085FF;">已认证成功</view>
        <view class="info-item" style="font-size: 32rpx; margin-bottom: 16rpx; color: #999;">为您的企业规范迈出第一步</view>
        <view class="ok-btn" @click="$commonUtil.backPage">知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { startEid } from '@/pages/module-common/mp_ecard_sdk/main';

export default {
  name: 'ProfileEnterpriseApproveIdentity',
  data() {
    return {
      verifyTypeList: [{ type: 1, name: '打款认证' }, { type: 2, name: '人脸识别' }], // 验证方式列表
      activieVerifyTypeIndex: 0, // 选中的企业类型下标

      bankCardTypeList: [{ type: 1, name: '个人银行卡' }, { type: 2, name: '对公银行卡' }], // 银行卡类型
      activieBankCardTypeIndex: 0, // 选中的银行卡类型下标

      userEnterpriseInfo: {}, // 用户企业信息

      bankDataList: [], // 银行数据列表
      bankFilterDataList: [], // 银行过滤数据列表
      activebankOptIndex: -1, // 选中的银行下标
      selectedBankInfo: {}, // 选中的银行信息
      searchBankKeyword: '', // 搜索关键字
      isShowBankListPopup: false, // 是否显示银行列表 popup

      bankCardNum: '', // 银行卡号码
      
      isShowConfirmSumitModal: false, // 是否显示确认提交 popup

      faceVerifyInfo: { userName: '', userIdNum: '', }, // 人脸认证信息

      isShowApproveSuccessPopup: false, // 是否显示认证成功 popup
    };
  },
  computed: {
    ...mapState('userModule', [ 'userToken', 'userInfo' ]),
    ...mapGetters(['sysScreenHeight', 'sysSafeAreaHeight']),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    routeParam.verifyTypeIndex && (this.activieVerifyTypeIndex = Number(routeParam.verifyTypeIndex))
    
    this._getEnterpriseInfo();
    this._getBankList();
  },
  methods: {
    /**
     * 获取用户企业信息
     */
    async _getEnterpriseInfo() {
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: enterpriseData } = await this.$api.getEnterpriseInfo();
        this.userEnterpriseInfo = enterpriseData;
        // 企业类型删除个人银行卡
        if (this.userEnterpriseInfo.enterprise_type === 1) {
          this.bankCardTypeList.shift();
        }
        // 已经完成企业认证 打开 认证成功 popup
        if (this.userEnterpriseInfo.is_certification) this.isShowApproveSuccessPopup = true;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取银行列表
     */
    async _getBankList() {
      try {
        const { data: bankData } = await this.$api.getBankList();
        this.bankDataList = bankData;
        this.bankFilterDataList = bankData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开银行 popup
     */
    openBankOptPopup() {
      this.isShowBankListPopup = true;
    },
    /**
     * 选择银行项
     */
    selectBankOpt(bankOpt) {
      const { bankFilterDataList } = this;
      const findbankOptIndex = bankFilterDataList.findIndex(item => item.id === bankOpt.id);
      this.activebankOptIndex = findbankOptIndex;
      this.selectedBankInfo = bankOpt;
      // this.isShowBankListPopup = false;
    },
    /**
     * 监听银行卡号 输入事件
     */
    onBankCardInputEvt(event) {
      this.bankCardNum = event.detail.value;
    },
    /**
     * 关键字模糊搜索银行列表
     */
    searchBankList() {
      const { searchBankKeyword, bankDataList, selectedBankInfo } = this;
      // 模糊查询
      const reg =  new RegExp(searchBankKeyword.trim());
      const bankFilterArr = [];
      for (var i = 0; i < bankDataList.length; i++) {
        if (reg.test(bankDataList[i].name)) {
          bankFilterArr.push(bankDataList[i]);
        }
      }
      this.bankFilterDataList = bankFilterArr;
      // 存在已选择的银行项
      if (selectedBankInfo.id) {
        const findbankOptIndex = this.bankFilterDataList.findIndex(item => item.id === selectedBankInfo.id);
        console.log(findbankOptIndex)
        // 在过滤后的银行列表中找到了 已选择的银行项 
        findbankOptIndex > -1 && (this.activebankOptIndex = findbankOptIndex);
      }
    },
    /**
     * 打开提交确认 modal
     */
    openSubmitConfirmModal() {
      if (!this.selectedBankInfo.id) return this.$u.toast('请选择开户银行');
      if (!this.bankCardNum.trim()) return this.$u.toast('请输入银行卡号码');
      if (!(/^[1-9]\d{9,29}$/.test(this.bankCardNum.trim()))) return this.$u.toast('请输入正确的银行卡号码');
      this.isShowConfirmSumitModal = true;
    },
    /**
     * 点击 提交 modal 确认事件触发
     */
     onSubmitModalConfirmEvt() {
      this._sumbitEnterpriseBankVerifyInfo();
    },
    /**
     * 提交企业银行认证信息
     */
    async _sumbitEnterpriseBankVerifyInfo() {
      // 银行卡类型
      const bankCardType = this.bankCardTypeList[this.activieBankCardTypeIndex].type;

      const param = {
        type: 2, // 企业打款认证类型
        company_name: bankCardType === 1 ? this.userEnterpriseInfo.contacts_name : this.userEnterpriseInfo.enterprise_name, // 公司名
        bank_card: this.bankCardNum.trim(), // 银行卡号
        opening_bank_name: this.selectedBankInfo.id, // 银行卡代号
        // opening_bank_name: '0000000000', // 银行卡代号
      }

      console.log(param)
      uni.showLoading({ title: '提交中', mask: true });

      try {
        const { data: bankVerifyData } = await this.$api.postEnterpriseBankVerifyInfo(param);
        // this.$commonUtil.routeNavTo('module-profile/profile-enterprise-approveVerify/profile-enterprise-approveVerify');
        uni.redirectTo({ url: '/pages/module-profile/profile-enterprise-approveVerify/profile-enterprise-approveVerify' });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 开启人脸认证
     */
    async startFaceVerify() {
      const param = { name: this.faceVerifyInfo.userName.trim(), id_card: this.faceVerifyInfo.userIdNum.trim() }
      uni.showLoading({ title: '', mask: true });
      const _this = this;

      try {
        const { data: faceVerifyEidData } = await this.$api.getQcloudFaceVerifyEidToken(param);
        const eidToken = faceVerifyEidData.EidToken;
        // 开始「E证通」认证
        startEid({ data: { token: eidToken }, verifyDoneCallback(res) {
            const { token, verifyDone } = res;
            // 人脸认证成功执行
            verifyDone && token && _this._getQcloudFaceVerifyEidResult(token);
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取腾讯人脸认证 「E证通」认证结果
     */
    async _getQcloudFaceVerifyEidResult(EidResultToken) {
      const param = { eid_token: EidResultToken };
      uni.showLoading({ title: '', mask: true });

      try {
        const { data: faceVerifyResultData } = await this.$api.getQcloudFaceVerifyEidResult(param);
        this._getEnterpriseInfo();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 导航去修改企业信息
     */
    async navToModifyEnterpriseInfo() {
      const [error, res] = await uni.showModal({ title: '提示', confirmColor: '#0085FF', content: '请确认是否修改企业信息？' });
      if (!res.confirm) return;

      const pages = getCurrentPages();
        const lastpage = pages[pages.length - 2];
        // 上个页面是「企业信息填写」页面则回退
        if (lastpage.route === 'pages/module-profile/profile-enterprise-approve/profile-enterprise-approve') {
          this.$commonUtil.backPage();
        } else {
          uni.redirectTo({ url: '/pages/module-profile/profile-enterprise-approve/profile-enterprise-approve' });
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
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
