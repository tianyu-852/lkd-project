<template>
  <view :style="{ paddingBottom: sysSafeAreaHeight + 100 + 'px' }">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="委托打官司" title-color="#333" :background="{ backgroundColor: '#F5F5F5' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <div class="lawsuit-header">
      <div class="header-left">案件信息</div>
      <!-- <div class="header-right">
        <view class="user-avatar">
          <u-lazy-load img-mode="aspectFill" height="50" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="''" />
        </view>
        <text>张律师</text>
      </div> -->
    </div>

    <div class="base-module lawsuit-module">
      <!-- 手机号码 -->
      <view class="cell-item">
        <view class="cell-left">手机号码</view>
        <view class="cell-right">
          <view>{{ lawsuitForm.contactPhone }}</view>
          <text style="margin: 0 10rpx; color: #666;">|</text>
          <text style="color: #0085FF;" @click="updateContactPopup.isShowUpdateContactPopup = true">修改</text>
        </view>
      </view>

      <!-- 律师地域 -->
      <view class="cell-item" @click="$refs.regionPopupRef._openRegionPopup()">
        <view class="cell-left">律师地域</view>
        <view class="cell-right">
          <view v-if="lawsuitForm.lawyerRegion.provinceName && lawsuitForm.lawyerRegion.cityName">{{ lawsuitForm.lawyerRegion.provinceName === lawsuitForm.lawyerRegion.cityName ? '' : (lawsuitForm.lawyerRegion.provinceName + '-') }}{{ lawsuitForm.lawyerRegion.cityName }}</view>
          <view v-else style="color: #999;">请选择律师地域</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>

      <!-- 案件类型 -->
      <view class="cell-item" @click="isShowCategoryPopup = true">
        <view class="cell-left">案件类型</view>
        <view class="cell-right">
          <view v-if="lawsuitForm.caseType.caseTypeId">{{ lawsuitForm.caseType.caseTypeName }}</view>
          <view v-else style="color: #999;">请选择案件类型</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>

      <!-- 律师费预算 -->
      <view class="cell-item">
        <view class="cell-left">律师费预算</view>
        <view class="cell-right">
          <input v-model="lawsuitForm.budget" style="text-align: right;" type="number" maxlength="10" cursor-spacing="30" placeholder="请填律师费预算" placeholder-style="color: #bbb; font-size: 30rpx;">
          <text style="margin-left: 16rpx;">元</text>
        </view>
      </view>

      <!-- 标的额 -->
      <view class="cell-item">
        <view class="cell-left">标的额（选填）</view>
        <view class="cell-right">
          <input v-model="lawsuitForm.case_money" style="text-align: right;" type="number" maxlength="10" cursor-spacing="30" placeholder="请填写标的额" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>

      <!-- 描述详情 -->
      <view class="desc-module">
        <view class="desc-wrap">
          <!-- #ifndef MP-WEIXIN -->
          <textarea v-model="lawsuitForm.content" class="textarea" :maxlength="-1" :cursor-spacing="30" placeholder="请描述案件详情。1.事情发生时间？2.事情经过大概？3.您有没有相关证据？" placeholder-style="color: #bbb; font-size: 28rpx;" />
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN -->
          <textarea v-model="lawsuitForm.content" class="textarea" :maxlength="-1" :cursor-spacing="30" placeholder="请描述案件详情\n \n 1.事情发生时间？\n 2.事情经过大概？\n 3.您有没有相关证据？" placeholder-style="color: #bbb; font-size: 28rpx;" />
          <!-- #endif -->

          <!-- 图片 -->
          <view v-if="lawsuitForm.related_images.length" class="image-wrap">
            <view v-for="(iItem, iIndex) in lawsuitForm.related_images" :key="iIndex" class="image-item" @click="$commonUtil.previewImg(lawsuitForm.related_images, iItem)">
              <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="iItem" />
              <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="lawsuitForm.related_images.splice(iIndex, 1)" />
            </view>
          </view>
          <!-- 文件 -->
          <view v-if="lawsuitForm.related_cloud_file_List.length" class="image-wrap file-wrap">
            <view v-for="(iItem, iIndex) in lawsuitForm.related_cloud_file_List" :key="iIndex" class="image-item file-item">
              <image class="file-bg" mode="aspectFill" src="../static/file-bg.png" />
              <view class="file-name">{{ iItem.basename }}</view>
              <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="lawsuitForm.related_cloud_file_List.splice(iIndex, 1)" />
            </view>
          </view>

          <view class="upload-wrap">
            <view v-if="lawsuitForm.related_images.length < 9" class="upload-item" @click="chooseCauseSourceImage">
              <image class="icon-upload" mode="aspectFill" src="../static/icon-img-upload.png" />
              <text>上传图片</text>
              <text>({{ lawsuitForm.related_images.length }}/9)</text>
            </view>
            <view class="upload-item" @click="navToSelectFilePage">
              <image class="icon-upload" mode="aspectFill" src="../static/icon-file-upload.png" />
              <text>上传文件</text>
              <text>({{ lawsuitForm.related_cloud_file_List.length }}/9)</text>
            </view>
          </view>
        </view>
        <view class="desc-tips">请放心填写，仅接单律师可见</view>
      </view>
    </div>

    <!-- <div class="base-module sync-module">
      <div class="sync-left">是否同步匹配其他律师</div>
      <div class="sync-riht">
        <u-switch v-model="lawsuitForm.isSyncMatch" size="38" />
      </div>
    </div> -->

    <!-- 底部发布按钮 -->
    <view class="btn-bottom" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="btn-wrap">
        <view class="btn-item" @click="publishLawsuitOrder">提交资料</view>
      </view>
      <view class="pay-protocol">
        <text>开通即表示同意</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.source_case_create_agreement_url)">《百姓律师发布规则》</text>
      </view>
    </view>

    <!-- 问题分类 popup -->
    <u-popup v-model="isShowCategoryPopup" mode="bottom" border-radius="24" closeable safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-category-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-category-header">请选择问题分类</view>
        <view class="upopup-category-content">
          <scroll-view class="category-content-scrollYView" scroll-y enhanced :show-scrollbar="false">
            <view v-for="(cGItem, cGIndex) in lawsuitCategoryDataList" :key="cGIndex" class="category-group">
              <view v-if="cGItem.lawyer_tag_group" class="category-group-name">{{ cGItem.lawyer_tag_group }}</view>
              <view class="category-item-wrap">
                <view v-for="(cItem, cIndex) in cGItem.lawyer_tags" :key="cIndex" class="category-item" :class="{ 'category-item-active': categoryPopupInfo.activePCategoryIndex === cGIndex && categoryPopupInfo.activeSCategoryIndex === cIndex }" @click="selectCategoryItem(cGIndex, cIndex)">{{ cItem.lawyer_tag }}</view>
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

    <region-popup ref="regionPopupRef" @confirmCityEvt="onConfirmCityEvt" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fileUtil from '@/common/utils/fileUtil';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'EntrustLawsuit',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      lawsuitDemandTypeId: 11, // 委托打官司 id
      lawyerUser: {}, // 律师用户信息（指定律师订单）

      lawsuitForm: {
        content: '', // 详情
        contactPhone: '', // 联系电话
        case_money: '', // 标的额
        budget: '', // 律师费用预算

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

        related_images: [], // 图片
        related_cloud_file_List: [], // 云盘文件

        isSyncMatch: false, // 是否同步匹配
      },

      lawsuitCategoryDataList: [], // 委托打官司分类列表
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

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  watch: {
    userInfo: {
      immediate: true,
      handler: function(newVal) {
        this.lawsuitForm.contactPhone = newVal.call_mobile;
      }
    }
  },
  onLoad() {
    this._getLawsuitCategoryList();

    // 监听云盘文件确定事件
    uni.$on('cloudFileConfirmEvt', data => {
      const { cloudFileList } = data;
      this.lawsuitForm.related_cloud_file_List = cloudFileList;
    });
  },
  methods: {
    /**
     * 获取案源订单 委托打官司 分类列表
     */
    async _getLawsuitCategoryList() {
      try {
        const { data: lawsuitCategoryData } = await this.$api.getCauseSourceOrderEntrustCategoryApi();
        this.lawsuitCategoryDataList = lawsuitCategoryData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择问题分类
     */
    selectCategoryItem(cGIndex, cIndex) {
      const category = this.lawsuitCategoryDataList[cGIndex].lawyer_tags[cIndex];
      this.lawsuitForm.caseType.caseTypeId = category.lawyer_tag_id;
      this.lawsuitForm.caseType.caseTypeName = category.lawyer_tag;

      this.isShowCategoryPopup = false;
    },

    /**
     * 监听地区 popup 组件 确定城市 evt
     */
    onConfirmCityEvt(cityData) {
      this.lawsuitForm.lawyerRegion.lawyer_province_id = cityData.province_id;
      this.lawsuitForm.lawyerRegion.lawyer_city_id = cityData.city_id;
      this.lawsuitForm.lawyerRegion.provinceName = cityData.province;
      this.lawsuitForm.lawyerRegion.cityName = cityData.city;
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
     * 选择图片
     */
    async chooseCauseSourceImage() {
      const imageUrlList = await this._chooseImage(9 - this.lawsuitForm.related_images.length);
      this.lawsuitForm.related_images.push(...imageUrlList);
    },
    /**
     * 选择图片 api 上传图片
     */
    async _chooseImage(imgCount) {
      const [error, imgRes] = await uni.chooseMedia({ count: imgCount, mediaType: ['image'] });
      if (error) return;
      uni.showLoading({ title: '', mask: true });

      const imageUrlList = [];
      try {
        for (const imgItem of imgRes.tempFiles) {
          const imageUrl = await fileUtil.uploadFile(imgItem.tempFilePath);
          imageUrlList.push(imageUrl);
        }
        return imageUrlList;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 进入选择文件页面
     */
    navToSelectFilePage() {
      uni.navigateTo({
        url: '/pages/module-order/order-file-list/order-file-list',
        success: res => {
          const { lawsuitForm } = this;
          res.eventChannel.emit('cloudFileEvt', { prevedCloudFileList: lawsuitForm.related_cloud_file_List });
        }
      });
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
    /**
     * 发布委托打官司订单
     */
    async publishLawsuitOrder() {
      const { lawsuitForm, lawsuitDemandTypeId } = this;

      if (!lawsuitForm.lawyerRegion.lawyer_city_id && !lawsuitForm.lawyerRegion.lawyer_province_id) return this.$u.toast('请选择律师地域');
      if (!lawsuitForm.caseType.caseTypeId) return this.$u.toast('请选择案件类型');
      if (!lawsuitForm.budget.trim()) return this.$u.toast('请填写律师费预算');
      if (!lawsuitForm.content.trim()) return this.$u.toast('请填写案件详情');

      const param = {
        demand_type_id: lawsuitDemandTypeId, // 需求类型 id (委托打官司 id)
        category_id: lawsuitForm.caseType.caseTypeId, // 分类 id
        category: lawsuitForm.caseType.caseTypeName.trim(), // 分类名称
        lawyer_province_id: lawsuitForm.lawyerRegion.lawyer_province_id, // 律师省份 id
        lawyer_city_id: lawsuitForm.lawyerRegion.lawyer_city_id, // 律师城市 id
        // 联系人信息
        other_contact: JSON.stringify({
          mobile: lawsuitForm.contactPhone.trim()
        }),
        case_money: lawsuitForm.case_money.trim(), // 标的额
        budget: lawsuitForm.budget.trim(), // 律师预算
        related_images: JSON.stringify(lawsuitForm.related_images), // 图片
        related_cloud_file_ids: JSON.stringify(lawsuitForm.related_cloud_file_List.map(itm => itm.cloud_file_id)), // 云盘文件 ids
        is_talk_detail: '1', // 详谈
      };

      // 律师主页进入 判断是否同步其他律师（同步则不传 律师id）
      // !lawsuitForm.isSyncMatch && (param.lawyer_user_id = this.lawyerUser.user_id);
      uni.showLoading({ title: '发布订单中', mask: true });

      try {
        // 创建支付订单
        const { data: resData } = await this.$api.createCauseSourceOrderApi(param);
        this.$commonUtil.backPage();
        uni.$emit('toastEvt', { msg: '发布成功' }); // 触发全局的 toast 事件
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style>
  page {
    background: #F5F5F5;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
