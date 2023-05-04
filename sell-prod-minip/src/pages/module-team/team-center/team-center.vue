<template>
  <view class="main" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 35 + 10 + 'px' }">
    <u-navbar :is-back="false" :border-bottom="false" title="我的团队" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 数据概况 -->
    <view class="data-module">
      <view class="title-wrap">
        <text>团队数据概况</text>
        <view class="data-filter-nav" @click="isShowTimeFactorPopup = !isShowTimeFactorPopup">
          <text>{{ timeFactorList[selectedTimeFactorIndex].name }}</text>
          <image class="icon-arrow-bottom" mode="aspectFill" src="@/static/profile/icon-arrow-bottom.png" />

          <view v-if="isShowTimeFactorPopup" class="time-filter-wrap">
            <view v-for="(tItem, tIndex) in timeFactorList" :key="tIndex" class="time-filter-item" :class="{ 'time-filter-item-active': selectedTimeFactorIndex === tIndex}" @click.stop="confirmTimeFactor(tIndex)">{{ tItem.name }}</view>
          </view>
        </view>
      </view>
      <view class="data-wrap">
        <view class="data-item-line">
          <!-- 合同金额 -->
          <view class="data-item">
            <text class="data-num">34,455</text>
            <text class="data-title">合同金额</text>
          </view>
          <view class="ver-line" />
          <!-- 已付款 -->
          <view class="data-item">
            <text class="data-num" style="color: #00CB31;">34</text>
            <text class="data-title">已付款</text>
          </view>
          <view class="ver-line" />
          <!-- 待付款 -->
          <view class="data-item">
            <text class="data-num" style="color: #FE5F48;">23</text>
            <text class="data-title">待付款</text>
          </view>
        </view>
        <view class="data-item-line">
          <!-- 合同金额 -->
          <view class="data-item">
            <text class="data-num">3,231</text>
            <text class="data-title">已发合同</text>
          </view>
          <view class="ver-line" />
          <!-- 已付款 -->
          <view class="data-item">
            <text class="data-num" style="color: #00CB31;">45</text>
            <text class="data-title">已签订</text>
          </view>
          <view class="ver-line" />
          <!-- 待付款 -->
          <view class="data-item">
            <text class="data-num" style="color: #FE5F48;">78</text>
            <text class="data-title">未签订</text>
          </view>
        </view>
      </view>
    </view>

    <view class="hor-divide" />

    <!-- 团队成员 -->
    <view class="team-module">
      <view class="title-wrap">
        <text>团队成员</text>
        <view class="dot-wrap">
          <image class="icon-dot" mode="aspectFill" src="../static/icon-dot.png" @click="isShowActionPopup = !isShowActionPopup" />
          <view v-if="isShowActionPopup" class="action-wrap">
            <view class="action-item" @click.stop="selectActionOption(1)">管理</view>
            <view class="action-item" @click.stop="selectActionOption(2)">添加</view>
            <view class="action-item" @click.stop="selectActionOption(3)">删除</view>
            <view class="action-item" @click.stop="selectActionOption(4)">继承</view>
          </view>
        </view>
      </view>

      <!-- 继承对象 -->
      <view v-if="activeActionOption === 4" class="inheritor-wrap" @click="isShowInheritorPopup = true">
        <view>请选择继承对象</view>
        <view class="inheritor-user">{{ selectedInheritorIndex >= 0 ? teamMemberList[selectedInheritorIndex].name : '' }}</view>
        <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
      </view>

      <view class="team-wrap">
        <view v-for="(tItem, tIndex) in teamMemberList" :key="tIndex" class="team-item" @click="selectTeamMemberOption(tIndex)">
          <view class="team-user">
            <template v-if="[1, 3, 4].includes(activeActionOption)">
              <image class="icon-gou" mode="aspectFill" :src="tItem.isSelected ? '../static/icon-gou-active.png' : '../static/icon-gou-inactive.png'" />
            </template>
            <!-- 成员信息 -->
            <view class="user-info-wrap">
              <view class="user-info-box">
                <view class="user-avatar">
                  <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="sellLoadImg400" :error-img="sellLoadImg400" :image="tItem.sex === 1 ? '/static/common/avatar-man.png' : '/static/common/avatar-woman.png'" />
                </view>
                <view class="user-info">
                  <view class="user-name">{{ tItem.name }}<view class="user-tag">管理员</view></view>
                  <view class="user-phone">销售专员-{{ 18062542145 }}</view>
                </view>
              </view>
              <!-- 已选订单数 -->
              <view v-if="activeActionOption === 4" class="selected-orderNum">已选<text style="color: #0085FF; margin: 0 10rpx;">12</text>个订单</view>
            </view>

            <image class="icon-arrow" :class="{ 'icon-arrow-active': tItem.isExpand }" mode="aspectFill" src="../static/icon-arrow.png" />
          </view>

          <view v-if="tItem.isExpand" class="team-user-data">
            <!-- 继承订单 -->
            <view v-if="activeActionOption === 4" class="order-wrap">
              <view v-for="(oItem, oIndex) in 10" :key="oIndex" class="order-item" @click.stop="selectInheritOrderItem(tIndex, oIndex)">
                <image class="icon-gou" mode="aspectFill" :src="false ? '../static/icon-gou-active.png' : '../static/icon-gou-inactive.png'" />
                <view class="order-name">杭州网易云音乐科技有限公司</view>
                <view class="order-status">未完成</view>
              </view>
            </view>
            <view v-else class="data-wrap">
              <view class="data-item-line">
                <!-- 合同金额 -->
                <view class="data-item">
                  <text class="data-num">34,455</text>
                  <text class="data-title">合同金额</text>
                </view>
                <view class="ver-line" />
                <!-- 已付款 -->
                <view class="data-item">
                  <text class="data-num" style="color: #00CB31;">34</text>
                  <text class="data-title">已付款</text>
                </view>
                <view class="ver-line" />
                <!-- 待付款 -->
                <view class="data-item">
                  <text class="data-num" style="color: #FE5F48;">23</text>
                  <text class="data-title">待付款</text>
                </view>
              </view>
              <view class="data-item-line">
                <!-- 合同金额 -->
                <view class="data-item">
                  <text class="data-num">3,231</text>
                  <text class="data-title">已发合同</text>
                </view>
                <view class="ver-line" />
                <!-- 已付款 -->
                <view class="data-item">
                  <text class="data-num" style="color: #00CB31;">45</text>
                  <text class="data-title">已签订</text>
                </view>
                <view class="ver-line" />
                <!-- 待付款 -->
                <view class="data-item">
                  <text class="data-num" style="color: #FE5F48;">78</text>
                  <text class="data-title">未签订</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部行为按钮 -->
    <view v-if="[1, 3, 4].includes(activeActionOption)" class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view v-if="[3, 4].includes(activeActionOption)" class="tip-wrap">
        <!-- 删除总数 -->
        <view v-if="activeActionOption === 3" class="del-tip-wrap">
          <text>已选({{ toBeDelTeamMemberList.length }})：</text>
          <text v-for="(nItem, nIndex) in toBeDelTeamMemberList" :key="nIndex">{{ nItem.name }}{{ nIndex + 1 === toBeDelTeamMemberList.length ? '' : '、' }}</text>
        </view>
        <!-- 继承订单数 -->
        <view v-else-if="activeActionOption === 4" class="del-tip-wrap">
          <text>已选 {{ 24 }} 个订单</text>
        </view>
      </view>
      <view class="btn-wrap">
        <view class="cancel-btn" @click="cancelActionOption">取消</view>
        <view v-if="activeActionOption === 1" class="confirm-btn" @click="openSetTeamAdminModal">设为管理员</view>
        <view v-else-if="activeActionOption === 3" class="confirm-btn" style="background: #FE5F48;" @click="openDelTeamMemberModal">删除</view>
        <view v-else-if="activeActionOption === 4" class="confirm-btn" @click="openInheritOrderModal">继承</view>
      </view>
    </view>

    <!-- 黑色蒙层 -->
    <view v-if="isShowActionPopup" class="mask-black" @click="closeActionPopup" />

    <!-- 转移管理员 modal -->
    <u-modal
      v-model="isShowTransferAdminModal"
      :show-title="false"
      :content-style="{ color: '#333', fontSize: '32rpx' }"
      show-cancel-button
      confirm-color="#0085FF"
      @confirm="onTransferModalConfirmEvt"
    >
      <view class="umodal-transfer-box">
        <view style="margin-bottom: 12rpx;">是否确认将管理员</view>
        <view>转移给 <text style="color: #0085FF; margin-left: 10rpx;">{{ toBeTransferTeamAdmin.name }}</text>？</view>
      </view>
    </u-modal>

    <!-- 删除团队成员 modal -->
    <u-modal
      v-model="isShowDelModal"
      :show-title="false"
      :content-style="{ color: '#333', fontSize: '32rpx' }"
      show-cancel-button
      confirm-text="删除"
      confirm-color="#0085FF"
      @confirm="onDelModalConfirmEvt"
    >
      <view class="umodal-del-box">
        <view class="del-user-wrap">
          <text>是否删除：</text>
          <text v-for="(nItem, nIndex) in toBeDelTeamMemberList" :key="nIndex">{{ nItem.name }}{{ nIndex + 1 === toBeDelTeamMemberList.length ? '' : '、' }}</text>
        </view>
      </view>
    </u-modal>

    <!-- 继承订单 modal -->
    <u-modal
      v-model="isShowInheritModal"
      title="再次确认"
      show-cancel-button
      confirm-color="#0085FF"
      @confirm="onInheritModalConfirmEvt"
    >
      <view class="umodal-inherit-box">
        <view>是否将<text style="color: #FE5F48; margin: 10rpx;">12</text>个订单继承至<text style="color: #0085FF; margin: 10rpx;">张晓晓</text>?</view>
      </view>
    </u-modal>

    <!-- 选择继承人 popup -->
    <u-popup v-model="isShowInheritorPopup" mode="center" width="540" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-inheritor-box" @click.stop="$commonUtil.stopPropagation">
        <view class="header-title">请选择继承人</view>
        <scroll-view scroll-y class="inheritor-wrap">
          <view v-for="(tItem, tIndex) in teamMemberList" :key="tIndex" class="inheritor-item" @click.stop="selectedInheritorIndex = tIndex">
            <view class="user-avatar">
              <u-lazy-load img-mode="aspectFill" height="80" border-radius="10" :loading-img="sellLoadImg400" :error-img="sellLoadImg400" :image="tItem.sex === 1 ? '/static/common/avatar-man.png' : '/static/common/avatar-woman.png'" />
            </view>
            <view class="user-info">
              <view class="user-name">{{ tItem.name }}<view class="user-tag">管理员</view></view>
              <view class="user-phone">销售专员-{{ 18062542145 }}</view>
            </view>
            <image class="icon-gou" mode="aspectFill" :src="selectedInheritorIndex === tIndex ? '../static/icon-gou-active.png' : '../static/icon-gou-inactive.png'" />
          </view>
        </scroll-view>
        <view class="set-inheritor-btn" @click="setInheritor">设为继承人</view>
      </view>
    </u-popup>

    <!-- 添加销售 -->
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
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

const initSellerPlusInfo = { name: '', mobile: '', smsCode: '', sex: 1 };

export default {
  data() {
    return {
      sellLoadImg400: this.$store.state.sellLoadImg400,
      isShowTimeFactorPopup: false, // 是否显示时间条件 popup
      timeFactorList: [
        { name: '本月', status: 2, },
        { name: '近7日', status: 1, },
        { name: '上月', status: 3, },
      ], // 时间条件列表
      selectedTimeFactorIndex: 0, // 选中的时间条件下标

      teamMemberList: [
        { id: 1, isExpand: false, isSelected: false, name: '李浩凡', },
        { id: 2, isExpand: false, isSelected: false, name: '张韵天', },
        { id: 3, isExpand: false, isSelected: false, name: '王泽云', },
        { id: 4, isExpand: false, isSelected: false, name: '吴夕瑶', },
        { id: 5, isExpand: false, isSelected: false, name: '赵弘琪', },
        { id: 6, isExpand: false, isSelected: false, name: '韩圣乔', },
        { id: 7, isExpand: false, isSelected: false, name: '孙风烟', },
        { id: 8, isExpand: false, isSelected: false, name: '周文辰', },
        { id: 9, isExpand: false, isSelected: false, name: '曾羽海', },
      ], // 团队成员列表
      teamMemberPage: 1, // 团队成员当前页数
      teamMemberTotal: 0, // 团队成员总数
      isNextLoading: false, // 是否正在加载下一页

      isShowActionPopup: false, // 是否显示 行为 popup
      activeActionOption: 0, // 激活的行为项 1: 管理，2: 添加，3: 删除，4: 继承

      isShowTransferAdminModal: false, // 是否显示转移管理员 modal
      isShowDelModal: false, // 是否显示删除 modal
      isShowInheritModal: false, // 是否显示继承 modal

      isShowInheritorPopup: false, // 是否显示继承人 popup
      selectedInheritorIndex: -1, // 选中的继承人下标

      // 新增销售人员信息
      sellerPlusInfo: { ...initSellerPlusInfo },
      isShowPlusModal: false, // 是否显示添加 modal
      smsCodeText: '发送验证码',
      isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮

      sexRadioList: [
        { name: '男', value: 1, },
        { name: '女', value: 2, },
      ],
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),
    ...mapGetters(['sysSafeAreaHeight']),
    // 待删除的成员列表
    toBeDelTeamMemberList() {
      const _delTeamMemberList = this.teamMemberList.filter(item => item.isSelected);
      return _delTeamMemberList;
    },
    // 待转移团队管理员
    toBeTransferTeamAdmin() {
      const _transferTeamAdmin = this.teamMemberList.find(item => item.isSelected);
      return _transferTeamAdmin;
    },
  },
  onLoad() {
    // this._getTeamMemberList();
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
     * 确定时间条件
     */
    confirmTimeFactor(timeFactorIndex) {
      this.selectedTimeFactorIndex = timeFactorIndex;
      this.isShowTimeFactorPopup = false;
    },
    /**
     * 选择行为项
     */
    selectActionOption(aOption) {
      this.isShowActionPopup = false;
      // 打开添加销售 modal
      if (aOption === 2) return this.isShowPlusModal = true;

      this.activeActionOption = aOption;
    },
    /**
     * 取消行为项 重置数据
     */
    cancelActionOption() {
      this.activeActionOption = 0;
      this.teamMemberList.forEach(item => item.isSelected = false);
    },
    /**
     * 关闭行为 popup
     */
    closeActionPopup() {
      this.isShowActionPopup = false;
    },
    /**
     * 选择团队成员项
     */
    selectTeamMemberOption(tIndex) {
      const { activeActionOption } = this;
      // 展开/收起 成员项数据
      if (!activeActionOption) {
        this.teamMemberList[tIndex].isExpand = !this.teamMemberList[tIndex].isExpand;
        return;
      // 管理
      } else if (activeActionOption === 1) {
        console.log('管理');
        this.teamMemberList.forEach(item => item.isSelected = false);
        this.teamMemberList[tIndex].isSelected = true;
      // 删除
      } else if (activeActionOption === 3) {
        console.log('删除');
        this.teamMemberList[tIndex].isSelected = !this.teamMemberList[tIndex].isSelected;
      // 继承
      } else if (activeActionOption === 4) {
        console.log('继承');
        this.teamMemberList[tIndex].isExpand = !this.teamMemberList[tIndex].isExpand;
      }
    },
    /**
     * 选择继承订单项
     */
    selectInheritOrderItem(tIndex, oIndex) {
      console.log(tIndex);
      console.log(oIndex);
    },
    /**
     * 打开设置团队管理员 modal
     */
    openSetTeamAdminModal() {
      if (this.teamMemberList.every(item => !item.isSelected)) return this.$u.toast('至少选中一位待设置成员');
      this.isShowTransferAdminModal = true;
    },
    /**
     * 打开删除团队成员 modal
     */
    openDelTeamMemberModal() {
      if (this.teamMemberList.every(item => !item.isSelected)) return this.$u.toast('至少选中一位待删除成员');
      this.isShowDelModal = true;
    },
    /**
     * 打开继承订单 modal
     */
    openInheritOrderModal() {
      // if (this.teamMemberList.every(item => !item.isSelected)) return this.$u.toast('至少选中一位待删除成员');
      this.isShowInheritModal = true;
    },
    /**
     * 监听删除销售人员 确定事件
     * @TODO: 转移管理员 api
     */
    onTransferModalConfirmEvt() {
      const { toBeTransferTeamAdmin } = this;
      if (!toBeTransferTeamAdmin) return;
      const newAdminId = toBeTransferTeamAdmin.id;

      console.log(newAdminId);

      this.cancelActionOption();
    },
    /**
     * 监听删除销售人员 确定事件
     * @TODO: 删除成员 api
     */
    onDelModalConfirmEvt() {
      const { toBeDelTeamMemberList } = this;
      if (!toBeDelTeamMemberList.length) return;
      console.log(toBeDelTeamMemberList);
      // 待删除成员 id 列表
      const memberUserIds = toBeDelTeamMemberList.map(item => item.id);
      console.log(memberUserIds);

      this.cancelActionOption();
    },
    /**
     * 监听继承订单 确定事件
     * @TODO: 继承 api
     */
    onInheritModalConfirmEvt() {
      console.log('继承');

      this.cancelActionOption();
    },
    /**
     * 设置继承人
     */
    setInheritor() {
      if (this.selectedInheritorIndex < 0) return this.$u.toast('请选择继承人');
      this.isShowInheritorPopup = false;
    },
    /**
     * 监听添加销售人员 确定事件
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

