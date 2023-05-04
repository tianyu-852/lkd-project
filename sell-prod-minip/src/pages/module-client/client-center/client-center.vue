<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#F5F5F5' }" title="客户管理" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="factor-module" :style="{ top: uNavbarHeight + 'px' }">
      <image class="icon-calendar" mode="aspectFill" src="../static/icon-calendar.png" @click="isShowCalendarPopup = true" />
      <view v-if="factorTimeInfo.startTime && factorTimeInfo.endTime" class="time-text time-text-active" @click="isShowCalendarPopup = true">
        <text>{{ factorTimeInfo.startTime }}</text>
        <text style="margin: 0 6rpx;">至</text>
        <text>{{ factorTimeInfo.endTime }}</text>
      </view>
      <view v-else class="time-text" @click="isShowCalendarPopup = true">选择日期</view>
      <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-3.png" @click="isShowCalendarPopup = true" />
    </view>

    <view class="client-module">
      <view v-for="(cItem, cIndex) in clientList" :key="cIndex" class="client-item">
        <view class="client-info-wrap" @click="clientList[cIndex].isExpandStep = !clientList[cIndex].isExpandStep">
          <view class="client-info-left">
            <u-lazy-load img-mode="aspectFill" height="80" border-radius="40" :loading-img="sellLoadImg400" :error-img="sellLoadImg400" :image="'/static/common/avatar-man.png'" />
          </view>
          <view class="client-info-middle">
            <view class="enterprise-name">
              <text>{{ cItem.enterprise_name }}</text>
            </view>
            <view class="client-phone">
              <text style="margin-right: 10rpx;">{{ cItem.customer_name }}</text>
              <text>{{ cItem.customer_mobile }}</text>
            </view>
          </view>
          <view class="client-info-right">
            <view v-if="!cItem.isExpandStep" class="contract-status" :style="{ background: contractStatusColorFunc(cItem.status) }">{{ cItem.status | contractStatusFilter }}</view>
          </view>
        </view>

        <view class="client-other-info">
          <view class="client-time">{{ cItem.created_at }}</view>
          <view v-if="userInfo.type !== 1" class="client-name">
            <text>{{ cItem.is_alliance ? '加盟商' : '销售' }}：</text>
            <text>{{ cItem.initiator_name }}</text>
          </view>
        </view>

        <view class="divide-hor" />

        <!-- 步骤条 -->
        <view v-if="cItem.isExpandStep" class="client-step-wrap">
          <!-- 合同 -->
          <view class="client-step-item">
            <image v-if="cItem.status > 2" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
            <view v-else class="step-dot-outer" :class="{ 'step-dot-outer-ing': true }">
              <view class="step-dot-inner" />
            </view>
            <view class="step-title" :class="{ 'step-title-active': [1, 2].includes(cItem.status) }">{{ cItem.title }}</view>
            <view class="step-btns">
              <view v-if="cItem.status === 1" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">创建企业信息</view>
              <view v-else-if="cItem.status === 2" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">发起签署</view>
            </view>
          </view>
          <!-- 客户签订 -->
          <view class="client-step-item">
            <image v-if="cItem.status > 9" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
            <view v-else class="step-dot-outer" :class="{ 'step-dot-outer-ing': true }">
              <view class="step-dot-inner" />
            </view>
            <view class="step-title" :class="{ 'step-title-active': [3, 4, 5, 6, 7, 8, 9].includes(cItem.status) }">客户签订</view>
            <view class="step-btns">
              <view v-if="cItem.status === 3" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">在线签订中</view>
              <view v-else-if="cItem.status === 4" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">邮寄中</view>
              <view v-else-if="cItem.status === 5" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">客户已签收</view>
              <view v-else-if="cItem.status === 6" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">客户寄回中</view>
              <view v-else-if="cItem.status === 7" class="step-btn" style="background: #0085FF;" @click.stop="navToFuncPage(cItem)">上传截图</view>
              <view v-else-if="cItem.status === 8" class="step-btn" style="background: #FFBC28;" @click.stop="navToFuncPage(cItem)">财务审核中</view>
              <view v-else-if="cItem.status === 9" class="step-btn" style="background: #FE5F48;" @click.stop="navToFuncPage(cItem)">财务已驳回</view>
            </view>
          </view>
          <!-- 分配法律管家 -->
          <view class="client-step-item">
            <image v-if="cItem.status > 10" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
            <view v-else class="step-dot-outer" :class="{ 'step-dot-outer-ing': true }">
              <view class="step-dot-inner" />
            </view>
            <view v-if="cItem.status <= 10" class="step-title" :class="{ 'step-title-active': [10].includes(cItem.status) }">分配法律管家</view>
            <view v-else class="step-title step-qrcode" :class="{ 'step-title-active': [10].includes(cItem.status) }">
              <text>已分配法律管家：</text>
              <text>{{ cItem.legal_affairs_four_name }}</text>
              <image class="icon-qrcode" mode="aspectFill" src="../static/icon-qrcode-b.png" @click="openQrcodePopup(cItem)" />
              <text style="color: #0085FF;" @click="openQrcodePopup(cItem)">二维码</text>
            </view>
          </view>
          <!-- 待法律管家开户 -->
          <view class="client-step-item">
            <image v-if="cItem.status > 12" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
            <view v-else class="step-dot-outer" :class="{ 'step-dot-outer-ing': true }">
              <view class="step-dot-inner" />
            </view>
            <view class="step-title" :class="{ 'step-title-active': [11, 12].includes(cItem.status) }">待法律管家开户</view>
          </view>
          <!-- 已完成 -->
          <view class="client-step-item">
            <image v-if="cItem.status > 13" class="icon-gou" mode="aspectFill" src="../static/icon-gou.png" />
            <view v-else class="step-dot-outer" :class="{ 'step-dot-outer-ing': true }">
              <view class="step-dot-inner" />
            </view>
            <view class="step-title" :class="{ 'step-title-active': [13].includes(cItem.status) }">已完成</view>
          </view>
        </view>

        <!-- 展开区域 -->
        <view class="client-spread-wrap" @click="clientList[cIndex].isExpandStep = !clientList[cIndex].isExpandStep">
          <text>{{ cItem.isExpandStep ? '收起' : '展开' }}</text>
          <image class="icon-arrowBottom" :class="{ 'icon-arrowBottom-actvie': cItem.isExpandStep }" mode="aspectFill" src="../static/icon-arrow-bottom-9.png" />
        </view>
      </view>
    </view>

    <!-- 日历选择 -->
    <u-calendar v-model="isShowCalendarPopup" mode="range" :change-year="false" safe-area-inset-bottom @change="onCalendarchangeEvt" />

    <!-- 二维码 popup -->
    <u-popup v-model="isShowQrcodePopup" mode="center" width="620" border-radius="24" closeable :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-qrcode-box" @click.stop="$commonUtil.stopPropagation">
        <view class="title">{{ qrcodePopupInfo.legal_affairs_four_name }}</view>
        <view class="sub-title">法律管家</view>
        <image class="qrcode-img" mode="widthFix" show-menu-by-longpress :src="qrcodePopupInfo.legal_affairs_four_qrcode" />
      </view>
    </u-popup>

    <u-empty v-if="!clientList.length" class="empty-img" text="暂无客户" mode="list" />
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { contractStatusList } from '@/common/const';

export default {
  name: 'ClientCenter',
  filters: {
    // 合同状态文案
    contractStatusFilter(value) {
      const _contractStatus = contractStatusList[value]?.name || '未知';
      return _contractStatus;
    },
  },
  data() {
    return {
      sellLoadImg400: this.$store.state.sellLoadImg400,
      uNavbarHeight: 0, // 顶部导航栏高度 px

      clientList: [], // 客户列表
      clientPage: 1, // 客户当前页数
      clientTotal: 0, // 客户总数
      isNextLoading: false, // 是否正在加载下一页

      isShowCalendarPopup: false, // 是否显示日历 popup
      isShowQrcodePopup: false, // 是否显示二维码 popup
      qrcodePopupInfo: {}, // 二维码弹框信息

      // 时间条件
      factorTimeInfo: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
      },
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),
  },
  onLoad() {
    this._getContractList();
  },
  onShow() {
    this._getContractList();
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
  },
  onPullDownRefresh() {
    this.clientPage = 1;
    this._getContractList();
  },
  onReachBottom() {
    const { clientList, clientTotal } = this;
    if (clientList.length >= clientTotal) return;
    this._getContractList(++this.clientPage);
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
        is_open_account: 2,
        sort: 1, // 1: 倒序
      };

      page === 1 && uni.showLoading({ title: '加载中', mask: true });
      page === 1 && (this.contractList = []); // 请求第一页，先清空数组

      try {
        const { data: clientData } = await this.$api.getContractList(param);
        (page === 1) && (this.clientList = []); // 请求第一页，先清空数组
        this.clientList.push(...clientData.data.map(item => { item.isExpandStep = false; return item; }));
        this.clientTotal = clientData.total;
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
     * 监听日期选择事件
     */
    onCalendarchangeEvt(event) {
      this.factorTimeInfo.startTime = event.startDate;
      this.factorTimeInfo.endTime = event.endDate;
      this._getContractList();
    },
    /**
     * 打开二维码 popup
     */
    openQrcodePopup(clientInfo) {
      this.qrcodePopupInfo = clientInfo;
      this.isShowQrcodePopup = true;
    },
    /**
     * 导航进入功能页面
     */
    async navToFuncPage(contractItem) {
      if (contractItem.status === 1) {
        if (this.userInfo.type !== 1) return this.$u.toast('请等待销售创建');
        // 进入企业信息提交页面
        this.$commonUtil.routeNavTo('contractSignSubmit', { contractOrderId: contractItem.contract_order_id });
      } else if (contractItem.status === 2) {
        if (this.userInfo.type !== 1) return this.$u.toast('请等待销售发起');

        const [error, res] = await uni.showModal({ title: '提示', content: '发出 「e签宝」在线签署短信通知', confirmColor: '#0085FF', cancelColor: '#666' });
        if (res.confirm) this._launchESignFlow(contractItem);

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
     * 发起 e签宝 签署
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

      try {
        const { data: launchData } = await this.$api.launchESignFlow(param);
        this._getContractList();
        this.$u.toast('已发出签署短信通知');
      } catch (error) {
        console.log(error);
      }
    },
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
