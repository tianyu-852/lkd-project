<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="我的团队" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="team-module">
      <u-swipe-action
        v-for="(tItem, tIndex) in teamMemberList"
        :key="tIndex"
        :index="tIndex"
        :show="tItem.isShow"
        :options="teamOptions"
        :disabled="userInfo.admin ? false : true"
        vibrate-short
        @open="onSwipeActionOpen"
        @click="onSwipeActionClick"
      >
        <view class="team-item">
          <view class="team-left">
            <u-lazy-load img-mode="aspectFill" height="100" border-radius="10" :loading-img="sellLoadImg400" :error-img="sellLoadImg400" :image="tItem.sex === 1 ? '/static/common/avatar-man.png' : '/static/common/avatar-woman.png'" />
          </view>
          <view class="team-right">
            <view class="team-name">
              <text>{{ tItem.name }}</text>
              <view v-if="tItem.is_administrator" class="team-tag">管理员</view>
            </view>
            <view class="team-info">
              <text>{{ '销售专员' }}-{{ tItem.mobile }}</text>
            </view>
          </view>
        </view>
      </u-swipe-action>
    </view>

    <u-empty v-if="!teamMemberList.length" class="empty-img" text="暂无成员" mode="list" />

    <!-- 添加按钮 -->
    <view v-if="userInfo.admin" class="plus-btn" @click="isShowPlusModal = true">
      <image class="icon-plus" mode="aspectFill" src="../static/icon-team-plus.png" />
      <text>添加新成员</text>
    </view>

    <!-- 添加成员 modal -->
    <u-modal
      v-model="isShowPlusModal"
      title="新增销售"
      :title-style="{ fontSize: '32rpx', color: '#333' }"
      show-cancel-button
      confirm-text="添加"
      confirm-color="#0085FF"
      @confirm="onPlusModalConfirmEvt"
    >
      <view class="umodal-plus-box">
        <view class="input-item">
          <input v-model="sellerPlusInfo.name" class="input" maxlength="4" placeholder="请填写姓名" placeholder-style="color: #999; font-size: 28rpx;">
        </view>
        <view class="input-item">
          <input v-model="sellerPlusInfo.mobile" class="input" maxlength="11" placeholder="请填写手机号码" placeholder-style="color: #999; font-size: 28rpx;">
          <view class="code-btn" :class="{ 'code-btn-disable': isDisableSMSCodeBtn }" @click="sendSMSCode">{{ smsCodeText }}</view>
        </view>
        <view class="input-item">
          <input v-model="sellerPlusInfo.smsCode" class="input" maxlength="6" placeholder="请填写验证码" placeholder-style="color: #999; font-size: 28rpx;">
        </view>
        <view class="radio-item">
          <u-radio-group v-model="sellerPlusInfo.sex">
            <u-radio v-for="(item, index) in sexRadioList" :key="index" :name="item.value">{{ item.name }}</u-radio>
          </u-radio-group>
        </view>
      </view>
    </u-modal>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="发送验证码" end-text="发送验证码" @start="onSMSCodeStart" @change="onSMSCodeChange" @end="onSMSCodeEnd" />
  </view>
</template>

<script>
import { mapState } from 'vuex';

const initSellerPlusInfo = { name: '', mobile: '', smsCode: '', sex: 1, };

export default {
  components: {},
  data() {
    return {
      sellLoadImg400: this.$store.state.sellLoadImg400,
      teamOptions: [{ text: '删除', style: { backgroundColor: '#FE5F48', fontSize: '32rpx' } }],

      teamMemberList: [], // 团队成员列表
      teamMemberPage: 1, // 团队成员当前页数
      teamMemberTotal: 0, // 团队成员总数
      isNextLoading: false, // 是否正在加载下一页

      isShowDelModal: false, // 是否显示删除 modal
      selectedDelTeamIndex: - 1, // 选中的待删除团队成员下标

      isShowPlusModal: false, // 是否显示添加 modal
      smsCodeText: '发送验证码',
      isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮
      // 新增销售人员信息
      sellerPlusInfo: { ...initSellerPlusInfo },

      sexRadioList: [
        { name: '男', value: 1, },
        { name: '女', value: 2, },
      ],
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),
  },
  onLoad() {
    this._getTeamMemberList();
  },
  onReachBottom() {
    const { teamMemberList, teamMemberTotal } = this;
    if (teamMemberList.length >= teamMemberTotal) return;
    this._getTeamMemberList(++this.teamMemberPage);
  },
  methods: {
    /**
     * 获取团队列表
     */
    async _getTeamMemberList(page = 1) {
      const param = { page };
      if (this.isNextLoading) return;
      this.isNextLoading = true;

      try {
        const { data: teamMemberData } = await this.$api.getTeamMemberList(param);
        (page = 1) && (this.teamMemberList = []);
        this.teamMemberList.push(...teamMemberData.data.map(item => { item.isShow = false; return item; }));
        this.teamMemberTotal = teamMemberData.total;
        this.isNextLoading = false;
      } catch (error) {
        this.isNextLoading = false;
        console.log(error);
      }
    },
    /**
     * SwipeAction 组件触发打开状态时
     */
    onSwipeActionOpen(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.teamMemberList[index].isShow = true;
      this.teamMemberList.map((val, idx) => {
        if (index !== idx) this.teamMemberList[idx].isShow = false;
      });
    },
    /**
     * SwipeAction 组件点击时触发
     */
    onSwipeActionClick(tIndex) {
      this.selectedDelTeamIndex = tIndex;
      this.isShowDelModal = true;
    },
    /**
     * 监听删除 modal 取消事件
     */
    onDelModalCancelEvt() {
      this.teamMemberList[this.selectedDelTeamIndex].isShow = false;
      this.selectedDelTeamIndex = -1;
    },
    /**
     * 监听删除成员 modal 确认事件
     */
    async onDelModalConfirmEvt() {
      if (this.selectedDelTeamIndex < 0) return;
      const sellerId = this.teamMemberList[this.selectedDelTeamIndex].customer_id;
      uni.showLoading({ title: '删除中', mask: true });
      const param = { customer_id: sellerId };

      try {
        const data = await this.$api.delTeamSeller(param);
        this.teamMemberList.splice(this.selectedDelTeamIndex, 1)[0];
        this.$u.toast('删除成功');
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 发送短信验证码
     */
    async sendSMSCode() {
      if (this.isDisableSMSCodeBtn) return;
      if (!this.sellerPlusInfo.mobile.trim()) return this.$u.toast('请输入手机号码');
      uni.showLoading({ title: '正在获取验证码', mask: true });

      try {
        const data = await this.$api.getPlusSellerSMSCode({ mobile: this.sellerPlusInfo.mobile.trim() });
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
     * 添加销售人员
     */
    async onPlusModalConfirmEvt() {
      if (!this.sellerPlusInfo.name.trim()) { this.$u.toast('请填写姓名'); return this.isShowPlusModal = true; }
      if (!this.sellerPlusInfo.mobile.trim()) { this.$u.toast('请填写手机号码'); return this.isShowPlusModal = true; }
      if (!this.sellerPlusInfo.smsCode.trim()) { this.$u.toast('请填写验证码'); return this.isShowPlusModal = true; }
      uni.showLoading({ title: '添加中', mask: true });

      const param = {
        name: this.sellerPlusInfo.name.trim(),
        mobile: this.sellerPlusInfo.mobile.trim(),
        code: this.sellerPlusInfo.smsCode.trim(),
        sex: this.sellerPlusInfo.sex,
      };
      try {
        const data = await this.$api.plusTeamSeller(param);
        this.$u.toast('添加成功');
        this.sellerPlusInfo = { ...initSellerPlusInfo };
        this._getTeamMemberList();
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
