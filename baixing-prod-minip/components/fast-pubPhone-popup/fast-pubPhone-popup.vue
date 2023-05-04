<template>
  <view>
    <u-popup v-model="isShowFastPubPhonePopup" mode="center" width="586" border-radius="30" :z-index="zIndex" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }" @close="onFastPubPhonePopupCloseEvt">
      <view class="upopup-pubPhone-box" @click.stop="stopPropagationEvt">
        <u-icon class="icon-close" name="close" size="30" color="#fff" @click.stop="_closeFastPubPhonePopup" />
        <view class="upopup-header">
          <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023319-1679206434463-ihxyBK.png" />
        </view>
        <view class="upopup-body">
          <view class="body-tip-wrap">
            <text style="margin-bottom: 6rpx;">服务时长：24小时</text>
            <text>平均响应时间：55秒</text>
          </view>

          <!-- 问题类型 -->
          <view class="cell-item" @click="isShowCategoryPopup = true">
            <view class="cell-left">问题类型</view>
            <view class="cell-right">
              <view v-if="dynamicForm.caseType.caseTypeId">{{ dynamicForm.caseType.caseTypeName }}</view>
              <view v-else style="color: #999;">请选择问题类型</view>
              <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
            </view>
          </view>
          <!-- 联系号码 -->
          <view class="cell-item">
            <view class="cell-left">联系号码</view>
            <view class="cell-right">
              <view>{{ dynamicForm.contactPhone }}</view>
              <text style="margin: 0 10rpx; color: #666;">|</text>
              <text style="color: #0085FF;" @click="updateContactPopup.isShowUpdateContactPopup = true">修改</text>
            </view>
          </view>
          <!-- 律师地域 -->
          <view class="cell-item" @click="$refs.regionPopupRef._openRegionPopup()">
            <view class="cell-left">律师地域</view>
            <view class="cell-right">
              <view v-if="dynamicForm.lawyerRegion.lawyer_province_id && dynamicForm.lawyerRegion.lawyer_city_id">{{ dynamicForm.lawyerRegion.provinceName === dynamicForm.lawyerRegion.cityName ? '' : (dynamicForm.lawyerRegion.provinceName + '-') }}{{ dynamicForm.lawyerRegion.cityName }}</view>
              <view v-else style="color: #999;">请选择律师地域</view>
              <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
            </view>
          </view>
          
          <view class="submit-btn" @click="confirmPublishPhoneOrder">限时免费咨询</view>
          <view class="pay-protocol">
            <text>发布即表示同意</text>
            <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.post_create_agreement_url)">《律师咨询发布规则》</text>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 二次确认关闭 fast-pubPhone-popup 弹框 -->
    <u-popup v-model="isShowConfirmCloseFastPubPhonePopup" mode="center" width="580" border-radius="30" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-confirm-box" @click.stop="stopPropagationEvt">
        <view class="header-tip">
          <text>咨询服务限时</text>
          <text style="color: #FE5F48;">免费开放</text>
          <text>，确定放弃本次咨询吗？</text>
        </view>
        <view class="bottom-footer">
          <view class="footer-btn" @click="confirmCloseFastPubPhonePopup">放弃</view>
          <view class="footer-btn" @click="cancelCloseFastPubPhonePopup">继续咨询</view>
        </view>
      </view>
    </u-popup>

    <!-- 电话咨询订单发布成功 -->
    <u-popup v-model="isShowPubPhoneSucPopup" mode="center" width="580" border-radius="30" closeable :z-index="999999" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }" @close="onTelConsultSucPopupCloseEvt">
      <view class="phoneOrder-suc-box" @click.stop="$commonUtil.stopPropagation">
        <image class="ok-img" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221129-1669705624776-khfbSX.png" />
        <view style="font-size: 36rpx; margin: 24rpx 0;">免费咨询发布成功</view>
        <view style="font-size: 32rpx; color: #666;">律师接单后将在第一时间给您</view>
        <view style="font-size: 32rpx; color: #666;">回电，请保持电话畅通</view>
        <view class="ok-btn" @click="navToIndexPage">去问答社区逛逛</view>

        <label for="shareBtnId">
          <view class="share-box">
            <image style="width: 32rpx; height: 32rpx; margin-right: 8rpx;" mode="aspectFill" src="@/static/index/icon-popup-share.png" />
            <text>公益分享</text>
          </view>
        </label>
      </view>
    </u-popup>

    <!-- 问题分类 popup -->
    <u-popup v-model="isShowCategoryPopup" mode="bottom" border-radius="24" closeable safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-category-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-category-header">请选择问题分类</view>
        <view class="upopup-category-content">
          <scroll-view class="category-content-scrollYView" scroll-y enhanced :show-scrollbar="false">
            <view v-for="(cGItem, cGIndex) in phoneCategoryDataList" :key="cGIndex" class="category-group">
              <view v-if="cGItem.lawyer_tag_group" class="category-group-name">{{ cGItem.lawyer_tag_group }}</view>
              <view class="category-item-wrap">
                <view v-for="(cItem, cIndex) in cGItem.lawyer_tags" :key="cIndex" :class="{ 'category-item-active': categoryPopupInfo.activePCategoryIndex === cGIndex && categoryPopupInfo.activeSCategoryIndex === cIndex }" @click="selectCategoryItem(cGIndex, cIndex)" style="height: 80rpx; background: #F5F5F5; border-radius: 40rpx; display: flex; justify-content: center; align-items: center; font-size: 28rpx;">{{ cItem.lawyer_tag }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>

    <!-- 更新联系人 popup -->
    <u-popup v-model="updateContactPopup.isShowUpdateContactPopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-contact-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-title">更换手机号</view>
        <!-- 手机号 -->
        <view class="contact-info-item">
          <view>+86</view>
          <text class="divide-ver">|</text>
          <input v-model="updateContactPopup.contactMobile" class="input" style="flex: 1;" maxlength="11" cursor-spacing="30" placeholder="请填写手机号" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>

        <!-- 验证码 -->
        <view class="contact-info-item">
          <input v-model="updateContactPopup.smsCode" class="input" style="flex: 1;" maxlength="6" placeholder="请输入验证码" placeholder-style="color: #bbb; font-size: 30rpx;">
          <view class="code-btn" :class="{ 'code-btn-disable': updateContactPopup.isDisableSMSCodeBtn }" @click="sendContactSMSCode">{{ updateContactPopup.smsCodeText }}</view>
        </view>

        <view class="upopup-btns">
          <view class="upopup-btn" @click="updateContactPopup.isShowUpdateContactPopup = false">取消</view>
          <view class="upopup-btn" @click="confirmUpdateContactPopup">修改</view>
        </view>
      </view>
    </u-popup>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="发送验证码" end-text="发送验证码" @start="onContactSMSCodeStart" @change="onContactSMSCodeChange" @end="onContactSMSCodeEnd" />

    <!-- 地区 popup -->
    <region-popup ref="regionPopupRef" :zIndex="regionPopupZIndex" :isAutoGetCurLoc="true" @confirmCityEvt="onRegionPopupConfirmEvt" />

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'FastPubPhonePopup',
  props: {
    zIndex: { type: Number, default: 998 }
  },
  data() {
    return {
      isShowFastPubPhonePopup: false, // 是否打开 fast-pubPhone-popup popup
      isShowConfirmCloseFastPubPhonePopup: false, // 二次确认关闭 fast-pubPhone-popup popup
      isShowPubPhoneSucPopup: false, // 是否打开电话咨询订单发布成功 popup
      regionPopupZIndex: 999, // 地区 popup z-index

      phoneDemandTypeId: 13, // 电话咨询订单 id
      dynamicForm: {
        contactPhone: '', // 联系电话

        // 律师地区
        lawyerRegion: {
          lawyer_province_id: '', // 律师省份 id
          lawyer_city_id: '', // 律师城市 id
          provinceName: '', // 省名称
          cityName: '', // 市名称
        },
        // 问题类型
        caseType: {
          caseTypeId: '', // 分类 id
          caseTypeName: '', // 分类名称
        },
      },

      phoneCategoryDataList: [], // 电话咨询分类列表
      isShowCategoryPopup: false, // 是否显示问题分类 popup

      // 修改联系人号码 popup
      updateContactPopup: {
        isShowUpdateContactPopup: false, // 是否显示修改电话 popup
        contactMobile: '', // 手机号码
        smsCode: '', // 短信验证码

        smsCodeText: '发送验证码',
        isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮
      }
    };
  },
  computed: {
    ...mapState(['appConfigInfo']),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters('userModule', ['userId']),
  },
  watch: {
    userInfo: {
      immediate: true,
      handler: function(newVal) {
        this.dynamicForm.contactPhone = newVal.call_mobile;
      }
    }
  },
  created() {
    // 地区 popup z-index
    if (this.zIndex >= 998) this.regionPopupZIndex = this.zIndex + 10;
    
    this._getPhoneCategoryList();
  },
  methods: {
    /**
     * 获取 电话咨询 分类列表
     */
    async _getPhoneCategoryList() {
      try {
        const { data: phoneCategoryData } = await this.$api.getCauseSourceOrderTelAskCategoryApi();
        this.phoneCategoryDataList = [{ lawyer_tag_group: '', lawyer_tags: phoneCategoryData.tag_data }];
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },

    /**
     * 打开 fast-pubPhone-popup
     */
    _openFastPubPhonePopup() {
      this.isShowFastPubPhonePopup = true;
    },
    /**
     * 关闭 fast-pubPhone-popup
     */
    _closeFastPubPhonePopup() {
      if (!this.isShowConfirmCloseFastPubPhonePopup) {
        this.isShowConfirmCloseFastPubPhonePopup = true;
      } else {
        this.isShowFastPubPhonePopup = false;
      }
    },
    /**
     * 监听 fast-pubPhone-popup close事件
     */
    onFastPubPhonePopupCloseEvt() {},
    /**
     * 取消关闭 fast-pubPhone-popup
     */
    cancelCloseFastPubPhonePopup() {
      this.isShowConfirmCloseFastPubPhonePopup = false;
    },
    /**
     * 确认关闭 fast-pubPhone-popup
     */
    confirmCloseFastPubPhonePopup() {
      this.isShowFastPubPhonePopup = false;
      this.isShowConfirmCloseFastPubPhonePopup = false;
    },
    /**
     * 选择问题分类
     */
    selectCategoryItem(cGIndex, cIndex) {
      const category = this.phoneCategoryDataList[cGIndex].lawyer_tags[cIndex];
      this.dynamicForm.caseType.caseTypeId = category.lawyer_tag_id;
      this.dynamicForm.caseType.caseTypeName = category.lawyer_tag;

      this.isShowCategoryPopup = false;
    },

    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },

    /**
     * 监听验证码发送开始事件
     */
    onContactSMSCodeStart() {
      this.updateContactPopup.isDisableSMSCodeBtn = false;
    },
    /**
     * 监听验证码发送变化事件
     */
    onContactSMSCodeChange(text) {
      this.updateContactPopup.smsCodeText = text;
    },
    /**
     * 监听验证码发送结束事件
     */
    onContactSMSCodeEnd() {
      this.updateContactPopup.isDisableSMSCodeBtn = false;
    },

    /**
     * 发送修改联系人短信验证码
     */
    async sendContactSMSCode() {
      if (this.updateContactPopup.isDisableSMSCodeBtn) return;
      if (!this.updateContactPopup.contactMobile.trim()) return this.$u.toast('请输入手机号码');
      uni.showLoading({ title: '正在获取验证码', mask: true });

      const param = {
        mobile: this.updateContactPopup.contactMobile.trim()
      }

      try {
        await this.$api.getUpdateContactMobileSMSCodeApi(param);
        this.$refs.uCode.start();
        this.updateContactPopup.isDisableSMSCodeBtn = true;
        this.$u.toast('验证码已发送');
      } catch (error) {
        this.updateContactPopup.isDisableSMSCodeBtn = false;
        this.$refs.uCode.reset();
        console.log(error);
      }
    },

    /**
     * 确定修改联系人信息(电话) popup
     */
    async confirmUpdateContactPopup() {
      if (!this.updateContactPopup.contactMobile.trim()) return this.$u.toast('请输入手机号码');
      if (!this.updateContactPopup.smsCode.trim()) return this.$u.toast('请输入短信验证码');
      uni.showLoading({ title: '', mask: true });
      this.updateContactPopup.isShowUpdateContactPopup = false;

      const param = {
        mobile: this.updateContactPopup.contactMobile.trim(),
        code: this.updateContactPopup.smsCode.trim()
      }
      
      try {
        const data = await this.$api.updateContactMobileApi(param);
        this.$u.toast('已更新');
        loginUtil.fetchUserInfo();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 监听地区 popup 组件 确定城市 evt
     */
    onRegionPopupConfirmEvt(cityData) {
      this.dynamicForm.lawyerRegion.lawyer_province_id = cityData.province_id;
      this.dynamicForm.lawyerRegion.lawyer_city_id = cityData.city_id;
      this.dynamicForm.lawyerRegion.provinceName = cityData.province;
      this.dynamicForm.lawyerRegion.cityName = cityData.city;
    },
    /**
     * 发布电话咨询订单
     */
    async confirmPublishPhoneOrder() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      const { dynamicForm, phoneDemandTypeId } = this;

      if (!dynamicForm.caseType.caseTypeId) return this.$u.toast('请选择问题类型');
      if (!dynamicForm.lawyerRegion.lawyer_city_id && !dynamicForm.lawyerRegion.lawyer_province_id) return this.$u.toast('请选择律师地域');

      const param = {
        demand_type_id: phoneDemandTypeId, // 需求类型 id (电话咨询 id)
        category_id: dynamicForm.caseType.caseTypeId, // 分类 id
        category: dynamicForm.caseType.caseTypeName.trim(), // 分类名称
        lawyer_province_id: dynamicForm.lawyerRegion.lawyer_province_id, // 律师省份 id
        lawyer_city_id: dynamicForm.lawyerRegion.lawyer_city_id, // 律师城市 id
        // 联系人信息
        other_contact: JSON.stringify({
          mobile: dynamicForm.contactPhone.trim()
        }),
      };
      this.isShowFastPubPhonePopup = false;
      this.isShowConfirmCloseFastPubPhonePopup = false;

      uni.showLoading({ title: '发布订单中', mask: true });
      // console.log(param)
      // return;

      try {
        // 创建电话咨询订单
        const { data: resData } = await this.$api.createCauseSourceOrderApi(param);
        this.isShowPubPhoneSucPopup = true;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 导航去首页
     */
    navToIndexPage() {
      this.isShowFastPubPhonePopup = false;
      this.isShowPubPhoneSucPopup = false;
      this.isShowConfirmCloseFastPubPhonePopup = false;
      uni.switchTab({ url: '/pages/tabbar/index/index' });
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
