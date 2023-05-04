<template>
  <view class="main">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar :is-back="false" title="企业认证" title-color="#fff" immersive :border-bottom="false" background="{ background: transparent }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->
    
    <view class="banner-module">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022113-1667460678634-3wxHCH.png" />
    </view>

    <view class="content-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 44 + 10 + 'px' }">
      <!-- 企业类型 -->
      <view class="content-item">
        <view class="item-title">企业类型</view>
        <view class="enterprise-type-wrap">
          <view v-for="(tItem, tIndex) in enterpriseTypeList" :key="tIndex" :class="[ 'enterprise-type-item', activieEnterpriseTypeIndex === tIndex ? 'enterprise-type-item-active' : '' ]" @click="activieEnterpriseTypeIndex = tIndex">{{ tItem.name }}</view>
        </view>
      </view>

      <!-- 企业名称 -->
      <view class="content-item">
        <view class="item-title">企业名称<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <image class="icon-search" mode="aspectFill" src="../static/icon-search-9.png" />
          <input v-model="enterpriseApproveInfo.enterpriseName" class="input-text" cursor-spacing="30" placeholder="模糊搜索，例如“律快答”" placeholder-style="color: #999; font-size: 30rpx;" @input="$u.debounce(_searchEnterpriseList, 500)">
          <image v-if="enterpriseApproveInfo.enterpriseName" class="icon-del" mode="aspectFill" src="../static/icon-del.png" @click="delEnterpriseItem" />
          <!-- 搜索企业结果列表 -->
          <scroll-view v-if="searchEnterpriseList.length" scroll-y class="scroll-y search-wrap" @scrolltolower="onSearchEnterpriseScrolltolowerEvt">
            <view v-for="(sItem, sIndex) in searchEnterpriseList" :key="sIndex" class="search-item" @click="selectEnterpriseItem(sItem)">
              <view class="search-name">{{ sItem.name }}</view>
              <view class="search-num">{{ sItem.creditCode }}</view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 统一社会信用代码（不可编辑） -->
      <view v-if="enterpriseApproveInfo.enterpriseCreditCode" class="content-item">
        <view class="item-title">统一社会信用代码（不可编辑）</view>
        <view class="input-wrap">
          <view class="input-wrap" style="color: #bbb;">{{ enterpriseApproveInfo.enterpriseCreditCode }}</view>
        </view>
      </view>

      <!-- 法人名称（不可编辑） -->
      <view v-if="enterpriseApproveInfo.enterpriseLegalPersonName" class="content-item">
        <view class="item-title">法人名称（不可编辑）</view>
        <view class="input-wrap" style="color: #bbb;">{{ enterpriseApproveInfo.enterpriseLegalPersonName }}</view>
      </view>

      <template v-if="activieEnterpriseTypeIndex === 1">
        <!-- 营业执照上的负责人/法人/经营者姓名 -->
        <view class="content-item">
          <view class="item-title">营业执照上的负责人/法人/经营者姓名<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
          <view class="input-wrap">
            <input v-model="enterpriseApproveInfo.operatePersonName" class="input-text" cursor-spacing="30" placeholder="请输入营业执照上的负责人/法人/经营者姓名" placeholder-style="color: #999; font-size: 30rpx;">
          </view>
          <view v-if="!enterpriseApproveInfo.operatePersonName" style="color: #FE5F48; font-size: 24rpx; margin-top: 8rpx;">营业执照上的负责人/法人/经营者姓名不能为空</view>
        </view>

        <!-- 营业执照上的负责人/法人/经营者身份证号 -->
        <view class="content-item">
          <view class="item-title">营业执照上的负责人/法人/经营者身份证号<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
          <view class="input-wrap">
            <input v-model="enterpriseApproveInfo.operatePersonIdNum" class="input-text" :maxlength="18" cursor-spacing="30" placeholder="请输入营业执照上的负责人/法人/经营者身份证号" placeholder-style="color: #999; font-size: 30rpx;">
          </view>
          <view v-if="!enterpriseApproveInfo.operatePersonIdNum" style="color: #FE5F48; font-size: 24rpx; margin-top: 8rpx;">营业执照上的负责人/法人/经营者身份证号不能为空</view>
        </view>
      </template>
      
      <!-- 使用人名称 -->
      <view class="content-item">
        <view class="item-title">使用人名称<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <input v-model="enterpriseApproveInfo.userName" class="input-text" cursor-spacing="30" placeholder="请填写使用人名称" placeholder-style="color: #999; font-size: 30rpx;">
        </view>
        <view v-if="!enterpriseApproveInfo.userName" style="color: #FE5F48; font-size: 24rpx; margin-top: 8rpx;">使用人名称不能为空</view>
      </view>

      <!-- 使用人手机号 -->
      <view class="content-item">
        <view class="item-title">使用人手机号<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <input v-model="enterpriseApproveInfo.userMobile" class="input-text" :maxlength="11" cursor-spacing="30" placeholder="请填写使用人手机号" placeholder-style="color: #999; font-size: 30rpx;">
        </view>
        <view v-if="!enterpriseApproveInfo.userMobile" style="color: #FE5F48; font-size: 24rpx; margin-top: 8rpx;">使用人手机号不能为空</view>
      </view>

      <!-- 验证码 -->
      <view class="content-item">
        <view class="item-title">验证码<text style="color: #FE5F48; margin-left: 16rpx;">*</text></view>
        <view class="input-wrap">
          <input v-model="enterpriseApproveInfo.verifyCode" class="input-text" type="number" :maxlength="6" cursor-spacing="30" placeholder="请填写验证码" placeholder-style="color: #999; font-size: 30rpx;">
          <view class="code-btn" :class="{ 'code-btn-disable': isDisableSMSCodeBtn }" @click="sendEnterpriseApproveSMSCode">{{ smsCodeText }}</view>
        </view>
        <view v-if="!enterpriseApproveInfo.verifyCode" style="color: #FE5F48; font-size: 24rpx; margin-top: 8rpx;">验证码不能为空</view>
      </view>
    </view>

    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="approve-btn" :class="{ 'approve-btn-active': canApproveStatus }" @click="sumbitApprove">立即认证</view>
    </view>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="获取验证码" end-text="获取验证码" @start="onSMSCodeStart" @change="onSMSCodeChange" @end="onSMSCodeEnd" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProfileEnterpriseApprove',
  data() {
    return {
      enterpriseTypeList: [{ type: 1, name: '企业' }, { type: 2, name: '个体户' }], // 企业类型列表
      activieEnterpriseTypeIndex: 0, // 选中的企业类型下标
      enterpriseApproveInfo: {
        enterpriseName: '', // 企业名称
        enterpriseLegalPersonName: '', // 企业法人
        enterpriseCreditCode: '', // 企业统一社会信用代码
        userName: '', // 使用人姓名
        userMobile: '', // 使用人手机号
        verifyCode: '', // 验证码

        operatePersonName: '', // 经营者姓名
        operatePersonIdNum: '', // 经营者身份证号
      },

      userEnterpriseInfo: {}, // 用户企业信息

      searchEnterpriseList: [], // 搜索企业列表
      searchEnterprisePage: 1, // 搜索企业 page

      smsCodeText: '获取验证码',
      isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮

      sellerUserId: '', // 销售端用户 id
    };
  },
  computed: {
    ...mapState(['systemInfo']),
    ...mapState('userModule', [ 'userToken', 'userInfo' ]),
    
    ...mapGetters(['sysScreenHeight', 'sysSafeAreaHeight']),
    ...mapGetters('userModule', ['userId']),
    // 认证按钮状态
    canApproveStatus() {
      let _status = false;
      // 企业类型
      if (this.activieEnterpriseTypeIndex === 0) {
        if (this.enterpriseApproveInfo.enterpriseName.trim()
          && this.enterpriseApproveInfo.enterpriseCreditCode.trim()
          && this.enterpriseApproveInfo.enterpriseLegalPersonName.trim()
          && this.enterpriseApproveInfo.userName.trim()
          && this.enterpriseApproveInfo.userMobile.trim()
          && this.enterpriseApproveInfo.verifyCode.trim()
        ) { _status = true; }
      // 个体户类型
      } else if (this.activieEnterpriseTypeIndex === 1) {
        if (this.enterpriseApproveInfo.enterpriseName.trim()
          && this.enterpriseApproveInfo.operatePersonName.trim()
          && this.enterpriseApproveInfo.operatePersonIdNum.trim()
          && this.enterpriseApproveInfo.userName.trim()
          && this.enterpriseApproveInfo.userMobile.trim()
          && this.enterpriseApproveInfo.verifyCode.trim()
        ) { _status = true; }
      }

      return _status;
    }
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    routeParam.seller_user_id && (this.sellerUserId = routeParam.seller_user_id)
    
  },
  onShow() {
    this._getEnterpriseInfo();
  },
  async onShareAppMessage() {
    const { userInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title:'一站式企业法律服务',
      path: `${ currentRoute }?seller_user_id=${ userInfo.sales_affair.user_id }`,
      imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221011-1665468302906-K531Fw.png'
    }
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
        
        // 企业类型
        if (enterpriseData.enterprise_type) this.activieEnterpriseTypeIndex = enterpriseData.enterprise_type === 1 ? 0 : 1;
        // 企业名称
        this.enterpriseApproveInfo.enterpriseName = enterpriseData.enterprise_name;
        // 企业统一社会信用代码
        this.enterpriseApproveInfo.enterpriseCreditCode = enterpriseData.credit_code;
        // 使用人姓名
        this.enterpriseApproveInfo.userName = enterpriseData.contacts_name;
        // 使用人手机号
        this.enterpriseApproveInfo.userMobile = enterpriseData.contacts_phone;
        // 企业法人身份证号
        this.enterpriseApproveInfo.operatePersonIdNum = enterpriseData.legal_id_card;
        // 企业法人姓名
        this.enterpriseApproveInfo.enterpriseLegalPersonName = enterpriseData.legal_person;
        // 个体户
        if (enterpriseData.enterprise_type === 2) {
          // 经营者姓名
          this.enterpriseApproveInfo.operatePersonName = enterpriseData.legal_person;
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 根据关键字搜索企业列表
     */
    async _searchEnterpriseList(page = 1) {
      if (!this.enterpriseApproveInfo.enterpriseName.trim()) {
        // 重置信用代码 & 法人
        this.enterpriseApproveInfo.enterpriseCreditCode = '';
        this.enterpriseApproveInfo.enterpriseLegalPersonName = '';
        this.searchEnterprisePage = 1;
        this.searchEnterpriseList = [];
        return;
      }

      const param = { page: page, size: 20, keyword: this.enterpriseApproveInfo.enterpriseName.trim() };
      // 重置信用代码 & 法人
      this.enterpriseApproveInfo.enterpriseCreditCode = '';
      this.enterpriseApproveInfo.enterpriseLegalPersonName = '';

      try {
        const { data: enterpriseData } = await this.$api.searchEnterpriseList(param);
        enterpriseData.items && (this.searchEnterpriseList.push(...enterpriseData.items));
        !this.searchEnterpriseList.length && this.$u.toast('未搜索到相应结果');
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听搜索企业 scrollView 滚动到底部 事件
     */
    onSearchEnterpriseScrolltolowerEvt() {
      this._searchEnterpriseList(++this.searchEnterprisePage);
    },
    /**
     * 选择企业项
     */
    selectEnterpriseItem(enterpriseItem) {
      this.enterpriseApproveInfo.enterpriseCreditCode = enterpriseItem.creditCode;
      this.enterpriseApproveInfo.enterpriseLegalPersonName = enterpriseItem.legalPersonName;
      this.enterpriseApproveInfo.enterpriseName = enterpriseItem.name;
      this.searchEnterpriseList = [];
    },
    /**
     * 删除企业
     */
    delEnterpriseItem() {
      this.enterpriseApproveInfo.enterpriseCreditCode = '';
      this.enterpriseApproveInfo.enterpriseLegalPersonName = '';
      this.enterpriseApproveInfo.enterpriseName = '';
      this.searchEnterprisePage = 1;
      this.searchEnterpriseList = [];
    },
    /**
     * 发送 企业认证短信验证码
     */
    async sendEnterpriseApproveSMSCode() {
      if (this.isDisableSMSCodeBtn) return;
      if (!this.enterpriseApproveInfo.userMobile.trim()) return this.$u.toast('请输入手机号码');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.enterpriseApproveInfo.userMobile.trim()))) return this.$u.toast('请输入正确的手机号码');

      uni.showLoading({ title: '正在获取验证码', mask: true });

      try {
        const data = await this.$api.getEnterpriseApproveSMSCode({ mobile: this.enterpriseApproveInfo.userMobile.trim() });
        console.log(data)

        this.$refs.uCode.start();
        this.isDisableSMSCodeBtn = true;
        this.$u.toast('验证码已发送');
      } catch (error) {
        this.isDisableSMSCodeBtn = false;
        this.$refs.uCode.reset();
        console.log(error);
      }
    },
    /**
     * 监听验证码发送开始事件
     */
    onSMSCodeStart() {
      this.isDisableSMSCodeBtn = false;
    },
    /**
     * 监听验证码发送变化事件
     */
    onSMSCodeChange(text) {
      this.smsCodeText = text;
    },
    /**
     * 监听验证码发送结束事件
     */
    onSMSCodeEnd() {
      this.isDisableSMSCodeBtn = false;
    },
    /**
     * 提交认证
     */
    async sumbitApprove() {
      if (!this.canApproveStatus) return;
      // 企业类型
      if (this.activieEnterpriseTypeIndex === 0) {
        if (!this.enterpriseApproveInfo.enterpriseName.trim()) return this.$u.toast('请输入企业名称');
        if (!this.enterpriseApproveInfo.enterpriseCreditCode.trim()) return this.$u.toast('请重新选择企业');
        if (!this.enterpriseApproveInfo.enterpriseLegalPersonName.trim()) return this.$u.toast('请重新选择企业');
      // 个体户类型
      } else if (this.activieEnterpriseTypeIndex === 1) {
        if (!this.enterpriseApproveInfo.enterpriseName.trim()) return this.$u.toast('请输入企业名称');
        if (!this.enterpriseApproveInfo.operatePersonName.trim()) return this.$u.toast('请输入经营者姓名');
        if (!this.enterpriseApproveInfo.operatePersonIdNum.trim()) return this.$u.toast('请输入经营者身份证号');
        if (!(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(this.enterpriseApproveInfo.operatePersonIdNum.trim()))) return this.$u.toast('请输入正确的身份证号');
      }
      
      if (!this.enterpriseApproveInfo.userName.trim()) return this.$u.toast('请输入使用人名称');
      if (!this.enterpriseApproveInfo.userMobile.trim()) return this.$u.toast('请输入使用人手机号');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.enterpriseApproveInfo.userMobile.trim()))) return this.$u.toast('请输入正确的手机号码');
      if (!this.enterpriseApproveInfo.verifyCode.trim()) return this.$u.toast('请输入验证码');


      // console.log('继续');
      // return;
      uni.showLoading({ title: '提交中', mask: true });

      // 企业认证类型
      const enterpriseType = this.enterpriseTypeList[this.activieEnterpriseTypeIndex].type;
      const param = {
        type: enterpriseType, // 企业类型
        enterprise_name: this.enterpriseApproveInfo.enterpriseName.trim(), // 企业名称
        legal_person: enterpriseType === 1 ? this.enterpriseApproveInfo.enterpriseLegalPersonName.trim() : this.enterpriseApproveInfo.operatePersonName.trim(), // 企业法人姓名
        legal_id_card: this.enterpriseApproveInfo.operatePersonIdNum.trim(), // 企业法人身份证号
        credit_code: this.enterpriseApproveInfo.enterpriseCreditCode.trim(), // 企业统一社会信用代码
        use_name: this.enterpriseApproveInfo.userName.trim(), // 使用人姓名
        use_phone: this.enterpriseApproveInfo.userMobile.trim(), // 使用人手机号
        code: this.enterpriseApproveInfo.verifyCode.trim(), // 验证码
        is_update: this.userEnterpriseInfo.step ? 1 : 0, // 是否更新

        seller_user_id: this.sellerUserId, // 销售端 id
      };

      try {
        const { data: enterpriseData } = await this.$api.setEnterpriseInfo(param);
        // 修改企业信息的话 step === 1
        if (this.userEnterpriseInfo.step) {
          uni.redirectTo({ url: '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity' });
        } else {
          this.$commonUtil.routeNavTo('module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity');
        }
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
