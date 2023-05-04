<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 工具菜单 -->
    <view v-if="userInfo.type !== 3" class="tool-module">
      <view class="menu-item" @click="$commonUtil.routeNavTo('contractSignList', { signType: 1 })">
        <image class="icon-tool" mode="aspectFill" src="../static/icon-contract-sign.png" />
        <text>合同签署</text>
      </view>
      <view class="menu-item" @click="$commonUtil.routeNavTo('contractSignList', { signType: 2 })">
        <image class="icon-tool" mode="aspectFill" src="../static/icon-contract-mail.png" />
        <text>合同邮寄</text>
      </view>
      <!-- <view class="menu-item" @click="$u.toast('待开发')"> -->
      <!-- <view class="menu-item" @click="$commonUtil.routeNavTo('contractTemplate')">
        <image class="icon-tool" mode="aspectFill" src="../static/icon-contract-temp.png" />
        <text>合同模版管理</text>
      </view> -->
    </view>

    <!-- 条件 -->
    <view class="factor-module" :style="{ top: uNavbarHeight + 'px' }">
      <view class="factor-nav-box">
        <!-- <view class="factor-item" @click.stop="openFactorPopup('statusFactor')">
          <view :style="{ color: factorStatusActiveIndex > -1 ? '#0085FF' : '#666' }">{{ factorStatusList[factorStatusActiveIndex].name || '合同状态' }}</view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'statusFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view> -->
        <view class="factor-item" @click.stop="openFactorPopup('timeFactor')">
          <view class="factor-time-wrap">
            <view v-if="factorTimeInfo.startTime && factorTimeInfo.endTime" class="time-value-wrap">
              <text>{{ factorTimeInfo.startTime }}</text>
              <text class="time-value-divide">-</text>
              <text>{{ factorTimeInfo.endTime }}</text>
            </view>
            <text v-else>选择日期</text>
          </view>
          <image class="icon-triangle" :class="{ 'icon-triangle-active': factorPopupType === 'timeFactor' && isOpenFactorPopup }" mode="aspectFill" src="../static/icon-triangleBottom-inactive.png" />
        </view>
        <view class="factor-item" @click.stop="openFactorPopup('sortFactor')">
          <view :style="{ color: factorSort > 0 ? '#0085FF' : '#666' }">{{ factorSort | sortTextFilter }}</view>
          <image class="icon-sort" mode="aspectFill" src="../static/icon-sort-inactive.png" />
        </view>
      </view>

      <!-- 选项模块 -->
      <view class="factor-options-box" :style="{ height: isOpenFactorPopup ? factorOptionsBoxHeight + 'rpx' : 0 }">
        <view v-if="factorPopupType === 'statusFactor'" class="factor-status-wrap">
          <view v-for="(sItem, sIndex) in factorStatusList" :key="sIndex" class="factor-status-item" :class="{ 'factor-status-item-active': factorStatusActiveIndex === sIndex }" @click="changeStatusFactor(sIndex)">{{ sItem.name }}</view>
        </view>
        <view v-if="factorPopupType === 'timeFactor'" class="time-factor-wrap">
          <view class="time-wrap">
            <view class="time-item" :class="{ 'time-item-active': factorTimeInfo.activeIndex === 0 }" @click="changeTimeFactor(0)">{{ factorTimeInfo.tempStartTime || '选择开始时间' }}</view>
            <text class="time-divide">至</text>
            <view class="time-item" :class="{ 'time-item-active': factorTimeInfo.activeIndex === 1 }" @click="changeTimeFactor(1)">{{ factorTimeInfo.tempEndTime || '选择结束时间' }}</view>
          </view>
          <!-- 开始时间 picker -->
          <time-picker v-show="factorTimeInfo.activeIndex === 0" ref="startTimeRef" :default-time="$dayjs().subtract(1, 'd').format('YYYY-MM-DD')" @changeTimePick="onChangeStartTimePickEvt" />
          <!-- 结束时间 picker -->
          <time-picker v-show="factorTimeInfo.activeIndex === 1" ref="endTimeRef" @changeTimePick="onChangeEndTimePickEvt" />
          <!-- 完成按钮 -->
          <view class="finish-btn" @click="confirmTimeFactor">完成</view>
        </view>
      </view>
    </view>

    <!-- 合同列表 -->
    <view class="contract-module" :style="{ minHeight: (sysScreenHeight - uNavbarHeight - 44) + 'px' }">
      <view v-for="(cItem, cIndex) in contractList" :key="cIndex" class="contract-item">
        <view class="contract-wrap">
          <view class="contract-left">
            <view class="contract-name">{{ cItem.title }}</view>
            <!-- <view class="contract-time">
              <text>{{ cItem.created_at }}</text>
              <text class="contract-user">{{ cItem.customer_name }}</text>
            </view> -->
          </view>
          <view class="contract-right">
            <!-- 已创建完企业信息 待选择签署方式 -->
            <view v-if="cItem.status === 2" class="contract-status" @click.stop="navToFuncPage(cItem)">{{ cItem.sign_type === 1 ? '发起签署' : '发起邮寄' }}</view>
            <view v-else class="contract-status" :style="{ background: contractStatusColorFunc(cItem.status === 12 ? 13 : cItem.status) }" @click.stop="navToFuncPage(cItem)">{{ cItem.status === 12 ? 13 : cItem.status | contractStatusFilter }}</view>
          </view>
        </view>

        <view class="client-info-wrap">
          <view class="client-name">
            <text>客户：</text>
            <text>{{ cItem.customer_name }}</text>
          </view>
          <view class="client-name">
            <text>企业：</text>
            <text>{{ cItem.enterprise_name }}</text>
          </view>

          <view v-if="userInfo.type !== 1" class="xiaoshou">
            <text>{{ cItem.is_alliance ? '加盟商' : '销售' }}：</text>
            <text>{{ cItem.initiator_name }}</text>
          </view>

          <view class="create-time">{{ cItem.created_at }}</view>
        </view>
      </view>

      <u-empty v-if="!contractList.length" class="empty-img" text="数据为空" mode="list" />

      <!-- 蒙层 -->
      <view v-if="isOpenFactorPopup" class="factor-mask" @click.stop="closeFactorPopup" />
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { contractStatusList } from '@/common/const';
import timePicker from './components/time-picker/time-picker';
import dayjs from 'dayjs';

export default {
  name: 'ContractCenter',
  components: { timePicker, },
  filters: {
    sortTextFilter(value) {
      let _sortText = '时间顺序';
      (value === 0) && (_sortText = '时间顺序');
      (value === 1) && (_sortText = '时间正序');
      (value === 2) && (_sortText = '时间倒序');
      return _sortText;
    },
    // 合同日期
    contractTimeFilter(value) {
      return dayjs(value).format('YYYY-MM-DD');
    },
    // 合同状态文案
    contractStatusFilter(value) {
      const _contractStatus = contractStatusList[value]?.name || '未知';
      return _contractStatus;
    },
  },
  data() {
    return {
      uNavbarHeight: 0, // 顶部导航栏高度 px

      isOpenFactorPopup: false, // 是否显示条件过滤弹框
      factorPopupType: '', // 条件弹框类型 'statusFactor' 'timeFactor', 'sortFactor'
      factorStatusList: [
        { name: '待审核', status: 0 },
        { name: '已通过', status: 1 },
        { name: '已驳回', status: 2 },
        { name: '全部状态', status: -1 }
      ], // 状态条件列表

      factorStatusActiveIndex: 0, // 选中的状态条件下标
      // 时间条件
      factorTimeInfo: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        tempStartTime: '', // 临时开始时间
        tempEndTime: '', // 临时结束时间
        activeIndex: 0, // 选中下标
      },
      // 时间排序条件
      factorSort: 0,

      contractList: [], // 合同列表
      contractPage: 1, // 合同当前页数
      contractTotal: 0, // 合同总数
      isNextLoading: false, // 是否正在加载下一页
    };
  },
  computed: {
    ...mapState(['systemInfo']),
    ...mapState('userModule', ['userInfo']),
    ...mapGetters(['sysScreenHeight']),
    // 条件选项高度
    factorOptionsBoxHeight() {
      let _height = 0;
      (this.factorPopupType === 'statusFactor') && (_height = 400);
      (this.factorPopupType === 'timeFactor') && (_height = 730);
      return _height;
    }
  },
  onLoad() {
    // 初始选择时间为前一天
    this.factorTimeInfo.tempStartTime = this.$dayjs().subtract(1, 'd').format('YYYY-MM-DD');

    this._getContractList();
  },
  onShow() {
    this._getContractList();
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
  },
  onPullDownRefresh() {
    this.contractPage = 1;
    this._getContractList();
  },
  onReachBottom() {
    const { contractList, contractTotal } = this;
    if (contractList.length >= contractTotal) return;
    this._getContractList(++this.contractPage);
  },
  methods: {
    /**
     * 获取合同列表
     */
    async _getContractList(page = 1) {
      if (this.isNextLoading) return;
      this.isNextLoading = true;

      const param = {
        page,
        start_time: (this.factorTimeInfo.startTime && this.factorTimeInfo.endTime) ? `${ this.factorTimeInfo.startTime } 00:00:00` : undefined,
        end_time: (this.factorTimeInfo.startTime && this.factorTimeInfo.endTime) ? `${ this.factorTimeInfo.endTime } 23:59:59` : undefined,
        sort: [0, 2].includes(this.factorSort) ? 1 : undefined, // 1: 倒序
      };

      page === 1 && uni.showLoading({ title: '加载中', mask: true });
      page === 1 && (this.contractList = []); // 请求第一页，先清空数组

      try {
        const { data: contractData } = await this.$api.getContractList(param);
        this.contractList.push(...contractData.data);
        this.contractTotal = contractData.total;
        this.isNextLoading = false;

        uni.stopPullDownRefresh();
      } catch (error) {
        this.isNextLoading = false;
        console.log(error);
      }
    },
    /**
     * 合同状态颜色
     */
    contractStatusColorFunc(value) {
      const _contractStatusColor = contractStatusList[value]?.color || '#0085FF';
      return _contractStatusColor;
    },
    /**
     * 导航进入菜单页面
     */
    navToMenuPage() {
      this.$Router.push({ name: 'contractSignList' });
    },
    /**
     * 导航进入其他页面
     */
    async navToFuncPage(contractItem) {
      if (contractItem.status === 0) {
        this.$u.toast('合同出错');
      // 进入企业信息提交页面
      } else if (contractItem.status === 1) {
        if (this.userInfo.type !== 1) return this.$u.toast('请等待销售创建');

        this.$commonUtil.routeNavTo('contractSignSubmit', { contractOrderId: contractItem.contract_order_id });
      // 发起合同签署
      } else if (contractItem.status === 2) {
        if (this.userInfo.type !== 1) return this.$u.toast('请等待销售发起');

        // 在线 e签宝 签署
        if (contractItem.sign_type === 1) {
          const [error, res] = await uni.showModal({ title: '提示', content: '发出 「e签宝」在线签署短信通知', confirmColor: '#0085FF', cancelColor: '#666' });
          if (res.confirm) this._launchESignFlow(contractItem);
        // 邮寄签署
        } else if (contractItem.sign_type === 2) {
          this.$commonUtil.routeNavTo('contractExpressSubmit', { contractOrderId: contractItem.contract_order_id });
        }
      } else if (contractItem.status === 3) {
        this.$u.toast('请等待客户签署');
      // 进入快递详情页面
      } else if ([4, 6].includes(contractItem.status)) {
        this.$commonUtil.routeNavTo('contractExpressDetail', { contractOrderId: contractItem.contract_order_id, mailType: [4].includes(contractItem.status) ? 1 : 2 });
      // 进入快递信息提交页面
      } else if ([5].includes(contractItem.status)) {
        this.$commonUtil.routeNavTo('contractExpressSubmit', { contractOrderId: contractItem.contract_order_id });
      // 上传打款截图
      } else if (contractItem.status === 7) {
        if (this.userInfo.type !== 1) return this.$u.toast('请等待销售上传');

        uni.navigateTo({
          url: `/pages/module-contract/contract-pay-image/contract-pay-image?contractOrderId=${ contractItem.contract_order_id }`,
          events: {
            postPayImageEvt: data => {
              const { postPayImageStatus } = data;
              postPayImageStatus && this.$u.toast('上传截图成功，等待财务审核');
              this._getContractList();
            }
          }
        });
      // 财务去审核
      } else if (contractItem.status === 8) {
        if (this.userInfo.type !== 3) return this.$u.toast('请等待财务审核');

        uni.navigateTo({
          url: `/pages/module-contract/contract-finance-check/contract-finance-check?contractOrderId=${ contractItem.contract_order_id }`,
          events: {
            financeCheckEvt: data => {
              console.log(data);

              const { financeCheckStatus } = data;
              financeCheckStatus && this.$u.toast('财务审核完成');
              this._getContractList();
            }
          }
        });
      // 财务驳回
      } else if (contractItem.status === 9) {
        this.$commonUtil.routeNavTo('contractFinanceRefuse', { contractOrderId: contractItem.contract_order_id });
      }
    },
    /**
     * 发起 e签宝 签署短信通知
     */
    async _launchESignFlow(contractItem) {
      const param = {
        type: 1, // 甲方类型 1：平台
        file_id: contractItem.file_id, // 文件 id

        rec_type: 2, // 乙方类型 2：企业
        rec_name: contractItem.signtory_name.trim(), // 签署人-姓名
        rec_account: contractItem.signtory_mobile.trim(), // 签署人-手机号
        rec_cert_no: contractItem.signtory_id_card.trim(), // 签署人-身份证号
        rec_legal_rep_cert_type: 'CRED_PSN_CH_IDCARD', // 签署人-个人证件类型

        rec_org_name: contractItem.enterprise_name.trim(), // 企业-名称
        rec_org_cert_no: contractItem.credit_code.trim(), // 企业-统一社会信用代码
        rec_legal_rep_name: contractItem.legal_person_name.trim(), // 企业-法人姓名
        rec_legal_rep_cert_no: contractItem.legal_person_id_card.trim(), // 企业-法人身份证号

        order_no: contractItem.contract_order_no, // 订单号
      };

      console.log(param);

      try {
        const { data: launchData } = await this.$api.launchESignFlow(param);
        this._getContractList();
        this.$u.toast('已发出签署短信通知');
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开条件弹框
     */
    openFactorPopup(factorType) {
      if (factorType === 'sortFactor') {
        this.factorSort = this.factorSort === 2 ? 0 : ++this.factorSort;
        this.isOpenFactorPopup = false;
        this._getContractList();
        return;
      }

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
     * 改变状态条件
     */
    changeStatusFactor(sIndex) {
      this.factorStatusActiveIndex = sIndex;
      this.closeFactorPopup();
      // todo 调取请求接口
    },
    /**
     * 监听开始时间改变事件
     */
    onChangeStartTimePickEvt(_startTime) {
      this.factorTimeInfo.tempStartTime = this.$dayjs(_startTime).format('YYYY-MM-DD');
    },
    /**
     * 监听结束时间改变事件
     */
    onChangeEndTimePickEvt(_endTime) {
      this.factorTimeInfo.tempEndTime = this.$dayjs(_endTime).format('YYYY-MM-DD');
    },
    /**
     * 选择时间条件
     */
    changeTimeFactor(timeItemIndex) {
      this.factorTimeInfo.activeIndex = timeItemIndex;

      if (this.factorTimeInfo.activeIndex === 1 && !this.factorTimeInfo.endTime) {
        // 记录临时结束时间
        this.factorTimeInfo.tempEndTime = this.$dayjs().format('YYYY-MM-DD');
      }
    },
    /**
     * 确定时间选择条件
     */
    confirmTimeFactor() {
      if (!this.factorTimeInfo.tempStartTime) return this.$u.toast('请选择结束时间');
      if (!this.factorTimeInfo.tempEndTime) return this.$u.toast('请选择结束时间');
      if (!this.$dayjs(this.factorTimeInfo.tempEndTime).isAfter(this.$dayjs(this.factorTimeInfo.tempStartTime))) return this.$u.toast('结束时间需大于开始时间');
      // 确定开始时间
      this.factorTimeInfo.startTime = this.$dayjs(this.factorTimeInfo.tempStartTime).format('YYYY-MM-DD');
      // 确定结束时间
      this.factorTimeInfo.endTime = this.$dayjs(this.factorTimeInfo.tempEndTime).format('YYYY-MM-DD');

      this.closeFactorPopup();
      this._getContractList();
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
