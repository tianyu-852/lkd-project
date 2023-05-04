<template>
  <view :style="{ paddingBottom: sysSafeAreaHeight + 45 + 30 + 10 + 'px' }">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="免费法律咨询" title-color="#333">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <view class="divider-ver" />

    <view class="cell-module">
      <!-- 问题类型 -->
      <view class="cell-item" @click="caseTypePopupInfo.isShowCaseTypePopup = true">
        <view class="cell-left">问题类型</view>
        <view class="cell-right">
          <view v-if="dynamicForm.caseType.caseTypeId">{{ dynamicForm.caseType.caseTypeName }}</view>
          <view v-else style="color: #999;">合适的标签获取更优质的解答</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>
      <!-- 律师地域 -->
      <!-- <view class="cell-item" @click="regionPopupInfo.isShowRegionPopup = true"> -->
      <view class="cell-item" @click="$refs.regionPopupRef._openRegionPopup()">
        <view class="cell-left">律师地域</view>
        <view class="cell-right">
          <view v-if="dynamicForm.lawyerRegion.provinceName && dynamicForm.lawyerRegion.cityName">{{ dynamicForm.lawyerRegion.provinceName === dynamicForm.lawyerRegion.cityName ? '' : (dynamicForm.lawyerRegion.provinceName + '-') }}{{ dynamicForm.lawyerRegion.cityName }}</view>
          <view v-else style="color: #999;">请选择律师地域</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>
    </view>

    <view class="divider-ver" />

    <view class="cell-module">
      <!-- 问题类型 -->
      <view class="cell-item" :style="{ height: '130rpx', borderBottom: dynamicForm.isReleaseTelConsultOrder ? '2rpx solid #EDEDED' : 'none' }">
        <view class="cell-left">
          <view>同步发起免费电话咨询</view>
          <view style="color: #0085FF; font-size: 28rpx; font-weight: 400;">多位律师 主动回电 专业解答</view>
        </view>
        <view class="cell-right">
          <u-switch v-model="dynamicForm.isReleaseTelConsultOrder" size="38" />
        </view>
      </view>
      <!-- 律师地区 -->
      <view class="cell-item" :style="{ height: (dynamicForm.isReleaseTelConsultOrder ? 90 : 0) + 'rpx' }">
        <view class="cell-left">联系号码</view>
        <view class="cell-right">
          <view>{{ dynamicForm.contactPhone }}</view>
          <text style="margin: 0 10rpx; color: #666;">|</text>
          <text style="color: #0085FF;" @click="updateContactPopup.isShowUpdateContactPopup = true">修改</text>
        </view>
      </view>
    </view>

    <view class="divider-ver" />

    <!-- 描述详情 -->
    <view class="base-module desc-module">
      <view class="desc-title">
        <text>请描述案件信息</text>
        <view class="edit-eg" @click="isShowDynamicEgPopup = true">
          <image class="icon-eg" mode="aspectFill" src="../static/icon-!-b.png" />
          <text>描述示例</text>
        </view>
      </view>
      
      <view class="desc-wrap">
        <!-- #ifndef MP-WEIXIN -->
          <textarea v-show="!caseTypePopupInfo.isShowCaseTypePopup" v-model="dynamicForm.content" class="textarea" :maxlength="-1" :cursor-spacing="30" placeholder="1.事情发生时间？2.事情经过大概？3.您有没有相关证据？" placeholder-style="color: #bbb; font-size: 26rpx; font-weight: 400;" />
        <!-- #endif -->

        <!-- #ifdef MP-WEIXIN -->
        <textarea v-model="dynamicForm.content" class="textarea" :maxlength="-1" :cursor-spacing="30" placeholder="1.事情发生时间？\n2.事情经过大概？\n3.您有没有相关证据？" placeholder-style="color: #bbb; font-size: 26rpx; font-weight: 400;" />
        <!-- #endif -->

        <!-- 图片 -->
        <view class="image-wrap">
          <view v-for="(iItem, iIndex) in dynamicForm.imageList" :key="iIndex" class="image-item" @click="$commonUtil.previewImg(dynamicForm.imageList, iItem)">
            <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="iItem" />
            <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="dynamicForm.imageList.splice(iIndex, 1)" />
          </view>
          <!-- 上传 -->
          <view v-if="dynamicForm.imageList.length < dynamicImageLimit" class="image-item upload-item" @click="chooseDynamicImage">
            <image class="icon-upload" mode="aspectFill" src="../static/icon-img-upload.png" />
            <text>上传图片</text>
            <text>({{ dynamicForm.imageList.length }}/{{ dynamicImageLimit }})</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部发布按钮 -->
    <view class="btn-bottom" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="btn-wrap">
        <view v-if="dynamicForm.isReleaseTelConsultOrder" class="btn-item" @click="confirmPostDynamic">立即发起免费咨询</view>
        <view v-else class="btn-item" @click="confirmPostDynamic">立即发布</view>
      </view>
      <view class="pay-protocol">
        <text>开通即表示同意</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.post_create_agreement_url)">《律师咨询发布规则》</text>
      </view>
    </view>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="发送验证码" end-text="发送验证码" @start="onContactSMSCodeStart" @change="onContactSMSCodeChange" @end="onContactSMSCodeEnd" />

    <!-- 地区 popup -->
    <region-popup ref="regionPopupRef" :isAutoGetCurLoc="true" @confirmCityEvt="onRegionPopupConfirmEvt" />

    <!-- 律师地区 select popup -->
    <u-popup v-model="regionPopupInfo.isShowRegionPopup" mode="bottom" height="800" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-region-box" @click.stop="$commonUtil.stopPropagation">
        <!-- 左侧城市导航 -->
        <scroll-view class="sidenav-wrap" scroll-y scroll-with-animation enhanced :show-scrollbar="false">
          <view v-for="(nItem, nIndex) in regionPopupInfo.regionList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': regionPopupInfo.activePRegionIndex === nIndex }" @click="changeRegionPopupSideNav(nIndex)">{{ nItem.name }}</view>
          <!-- 侧边导航条 -->
          <view class="sidenav-line-outer" :style="{ top: (regionPopupInfo.activePRegionIndex * 100) + 'rpx' }">
            <view class="sidenav-line-inner" />
          </view>
        </scroll-view>
        <!-- 右侧城市数据 -->
        <view class="region-wrap">
          <view class="city-wrap">
            <view v-for="(cItem, cIndex) in regionPopupInfo.regionList[regionPopupInfo.activePRegionIndex].cities" :key="cIndex" class="city-item" :class="{ 'city-item-active': regionPopupInfo.activeSRegionIndex === cIndex }" :style="cItem.name && cItem.name.length > 5 ? 'font-size: 24rpx;' : ''" @click="changeRegionPopupValue(cIndex)">
              <text>{{ cItem.name }}</text>
              <image v-if="regionPopupInfo.activeSRegionIndex === cIndex" class="active-gou-img" mode="aspectFill" src="../static/factor-active-gou.png" />
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 案件类型 select popup -->
    <u-popup v-model="caseTypePopupInfo.isShowCaseTypePopup" mode="bottom" height="800" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-region-box" @click.stop="$commonUtil.stopPropagation">
        <!-- 左侧父类型导航 -->
        <scroll-view class="sidenav-wrap" scroll-y scroll-with-animation enhanced :show-scrollbar="false">
          <view v-for="(nItem, nIndex) in caseTypePopupInfo.caseTypeList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': caseTypePopupInfo.activePCaseTypeIndex === nIndex }" @click="changeCaseTypeSideNav(nIndex)">{{ nItem.lawyer_tag_group }}</view>
          <!-- 侧边导航条 -->
          <view class="sidenav-line-outer" :style="{ top: (caseTypePopupInfo.activePCaseTypeIndex * 100) + 'rpx' }">
            <view class="sidenav-line-inner" />
          </view>
        </scroll-view>
        <!-- 右侧子类型数据 -->
        <view class="region-wrap">
          <view class="city-wrap">
            <view v-for="(cItem, cIndex) in caseTypePopupInfo.caseTypeList[caseTypePopupInfo.activePCaseTypeIndex].lawyer_tags" :key="cIndex" class="city-item" :class="{ 'city-item-active': caseTypePopupInfo.activeSCaseTypeIndex === cIndex }" @click="changeCaseTypeValue(cIndex)">
              <text>{{ cItem.lawyer_tag }}</text>
              <image v-if="caseTypePopupInfo.activeSCaseTypeIndex === cIndex" class="active-gou-img" mode="aspectFill" src="../static/factor-active-gou.png" />
            </view>
          </view>
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

    <!-- 动态示例弹框 -->
    <u-popup v-model="isShowDynamicEgPopup" mode="center" width="580" border-radius="30" :z-index="999999" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-eg-box" @click.stop="$commonUtil.stopPropagation">
        <view class="eg-title">描述示例</view>
        <view class="eg-subtitle">描述越全面，越有助于你获得更准确</view>
        <view class="eg-subtitle">专业的回复</view>
        <view class="eg-wrap">
          <view class="eg-item">
            <text class="eg-key">事发时间：</text>
            <text>2022年3月23日</text>
          </view>
          <view class="eg-item">
            <text class="eg-key">事件说明：</text>
            <text>一个朋友在3月23日向我借了10万元周转，承诺一个月内还，没有欠条，现在朋友人找不到了</text>
          </view>
          <view class="eg-item">
            <text class="eg-key">我的疑问：</text>
            <text>请问我有什么办法可以追回这笔钱</text>
          </view>
        </view>
        <view class="eg-btn" @click="isShowDynamicEgPopup = false">我已了解，去提问</view>
      </view>
    </u-popup>

    <!-- 电话咨询订单发布成功 -->
    <u-popup v-model="isShowTelConsultSucPopup" mode="center" width="580" border-radius="30" closeable :z-index="999999" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }" @close="onTelConsultSucPopupCloseEvt">
      <view class="telConsult-suc-box" @click.stop="$commonUtil.stopPropagation">
        <image class="ok-img" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221129-1669705624776-khfbSX.png" />
        <view style="font-size: 36rpx; margin: 24rpx 0;">免费咨询发布成功</view>
        <view style="font-size: 32rpx; color: #666;">律师接单后将在第一时间给您</view>
        <view style="font-size: 32rpx; color: #666;">回电，请保持电话畅通</view>
        <view class="ok-btn" @click="backPrevPage">去问答社区逛逛</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fileUtil from '@/common/utils/fileUtil';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'dynamicCreatePage',
  data() {
    return {
      telConsultDemandTypeId: 13, // 电话咨询订单 id

      dynamicImageLimit: 9,
      isShowDynamicEgPopup: false, // 是否显示动态示例 popup
      isShowTelConsultSucPopup: false, // 是否电话咨询订单发布成功 popup

      dynamicForm: {
        content: '', // 详情
        imageList: [], // 图片

        isReleaseTelConsultOrder: true, // 是否同时发布电话咨询订单
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

      // 律师地区 popup
      regionPopupInfo: {
        isShowRegionPopup: false,
        regionList: [], // 律师地区列表
        activePRegionIndex: 0, // 激活的父区域 下标
        activeSRegionIndex: -1, // 激活的子区域 下标
      },

      // 案件类型 popup 
      caseTypePopupInfo: {
        isShowCaseTypePopup: false,
        caseTypeList: [], // 案件类型列表
        activePCaseTypeIndex: 0, // 激活的父区域 下标
        activeSCaseTypeIndex: -1, // 激活的子区域 下标
      },

      // 修改联系人号码 popup
      updateContactPopup: {
        isShowUpdateContactPopup: false, // 是否显示修改电话 popup
        contactMobile: '', // 手机号码
        smsCode: '', // 短信验证码

        smsCodeText: '发送验证码',
        isDisableSMSCodeBtn: false, // 是否禁用发送验证码按钮
      }
    }
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
        this.dynamicForm.contactPhone = newVal.call_mobile;
      }
    }
  },
  onLoad() {
    // loginUtil.fetchUserInfo()
    this._getRegionList()
    this._getCaseTypeList()
  },
  methods: {
    /**
     * 获取律师地区列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await this.$api.getRegionListApi();
        // 重组数据结构
        regionData.cities.forEach(item => {
          item.cities.forEach(itm => {
            itm.province_id = item.district_id;
            itm.province = item.name;
            itm.city_id = itm.district_id;
          });
        });

        regionData.cities.unshift({ name: '热门', cities: regionData.hots.map(item => { item.name = item.city; return item; }) });
        this.regionPopupInfo.regionList = regionData.cities;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 改变地区 侧边栏 导航选项
     */
    // changeRegionPopupSideNav(regionPIndex) {
    //   this.regionPopupInfo.activePRegionIndex = regionPIndex;
    //   this.regionPopupInfo.activeSRegionIndex = -1;
    // },
    /**
     * 选择 地区城市值
     */
    changeRegionPopupValue(regionSIndex) {
      this.regionPopupInfo.activeSRegionIndex = regionSIndex;
      const { regionPopupInfo } = this;
      const regionList = regionPopupInfo.regionList;
      // 确定律师地区
      const city = regionList[regionPopupInfo.activePRegionIndex].cities[regionPopupInfo.activeSRegionIndex];
      this.dynamicForm.lawyerRegion.lawyer_province_id = city.province_id;
      this.dynamicForm.lawyerRegion.lawyer_city_id = city.city_id;
      this.dynamicForm.lawyerRegion.provinceName = city.province;
      this.dynamicForm.lawyerRegion.cityName = city.name;

      this.regionPopupInfo.isShowRegionPopup = false;
    },
    /**
     * 获取案件类型列表
     */
    async _getCaseTypeList() {
      try {
        const { data: caseTypeData } = await this.$api.getCaseTypeListApi({ is_have_hot: 1 });
        this.caseTypePopupInfo.caseTypeList = caseTypeData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 改变侧边栏 案件类型导航选项
     */
    changeCaseTypeSideNav(caseTypePIndex) {
      this.caseTypePopupInfo.activePCaseTypeIndex = caseTypePIndex;
      this.caseTypePopupInfo.activeSCaseTypeIndex = -1;
    },
    /**
     * 选择 案件类型 值
     */
    changeCaseTypeValue(caseTypeSIndex) {
      this.caseTypePopupInfo.activeSCaseTypeIndex = caseTypeSIndex;
      const { caseTypePopupInfo } = this;
      const caseTypeList = caseTypePopupInfo.caseTypeList;
      // 确定问题分类
      const caseType = caseTypeList[caseTypePopupInfo.activePCaseTypeIndex].lawyer_tags[caseTypePopupInfo.activeSCaseTypeIndex];
      this.dynamicForm.caseType.caseTypeId = caseType.lawyer_tag_id
      this.dynamicForm.caseType.caseTypeName = caseType.lawyer_tag

      this.caseTypePopupInfo.isShowCaseTypePopup = false;
    },
    /**
     * 选择动态图片
     */
    async chooseDynamicImage() {
      const imageUrlList = await this._chooseImage(9 - this.dynamicForm.imageList.length);
      this.dynamicForm.imageList.push(...imageUrlList);
    },
    /**
     * 选择图片 api 上传图片
     */
    async _chooseImage(imgCount) {
      let tempImgFiles = [];
      // #ifdef MP-KUAISHOU
      const [error, imgRes] = await uni.chooseImage({ count: imgCount, sizeType: [ 'original', 'compressed' ], sourceType: [ 'album', 'camera' ] });
      if (error) return;
      tempImgFiles = imgRes.tempFilePaths;
      // #endif

      // #ifndef MP-KUAISHOU
      const [err, imageRes] = await uni.chooseMedia({ mediaType: ['image'], count: imgCount });
      if (err) return;
      tempImgFiles = imageRes.tempFiles.map(item => item.tempFilePath);
      // #endif

      uni.showLoading({ title: '上传中', mask: true });

      const imageUrlList = [];
      try {
        for (const imgItem of tempImgFiles) {
          const imageUrl = await fileUtil.uploadFile(imgItem);
          imageUrlList.push(imageUrl);
        }
        return imageUrlList;
      } catch (error) {
        console.log(error);
      }
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
        const data = await this.$api.getUpdateContactMobileSMSCodeApi(param);
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
     * 发布动态
     */
    async confirmPostDynamic() {
      const { dynamicForm } = this
      // 同时发布电话咨询
      if (dynamicForm.isReleaseTelConsultOrder) {
        if (!dynamicForm.caseType.caseTypeId) return this.$u.toast('请选择问题类型');
        if (!dynamicForm.lawyerRegion.lawyer_city_id && !dynamicForm.lawyerRegion.lawyer_province_id) return this.$u.toast('请选择律师地域');
      }
      
      if (!dynamicForm.content.trim()) return this.$u.toast('请输入正文内容');
      const param = {
        content: dynamicForm.content.trim(),
        images: JSON.stringify(dynamicForm.imageList)
      }
      // 问题类型 id
      dynamicForm.caseType.caseTypeId && (param.lawyer_tag_id = dynamicForm.caseType.caseTypeId)
      // 省id & 市id
      if (dynamicForm.lawyerRegion.lawyer_province_id && dynamicForm.lawyerRegion.lawyer_city_id) {
        param.province_id = dynamicForm.lawyerRegion.lawyer_province_id
        param.city_id = dynamicForm.lawyerRegion.lawyer_city_id
      }

      uni.showLoading({ title: '发布中', mask: true });
      try {
        await this.$api.postDynamicApi(param);
        // 同时发布电话咨询
        if (dynamicForm.isReleaseTelConsultOrder) {
          this._publishTelConsultOrder();
        } else {
          // this.backPrevPage()
          this.$commonUtil.backPage();
          uni.$emit('toastEvt', { msg: '发布成功' }); // 触发全局的 toast 事件
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 发布电话咨询订单
     */
    async _publishTelConsultOrder() {
      const { dynamicForm, telConsultDemandTypeId } = this;

      const param = {
        demand_type_id: telConsultDemandTypeId, // 需求类型 id (电话咨询 id)
        category_id: dynamicForm.caseType.caseTypeId, // 分类 id
        category: dynamicForm.caseType.caseTypeName.trim(), // 分类名称
        lawyer_province_id: dynamicForm.lawyerRegion.lawyer_province_id, // 律师省份 id
        lawyer_city_id: dynamicForm.lawyerRegion.lawyer_city_id, // 律师城市 id
        // 联系人信息
        other_contact: JSON.stringify({
          mobile: dynamicForm.contactPhone.trim()
        }),
      };
      uni.showLoading({ title: '发布订单中', mask: true });

      try {
        // 创建支付订单
        const { data: resData } = await this.$api.createCauseSourceOrderApi(param);
        const { order_no, money_real } = resData;
        this.isShowTelConsultSucPopup = true;

        if (Number(money_real) > 0) {
          // 获取微信支付参数 type = 1: 微信支付
          // const { data: payParamData } = await this.$api.payOrderApi({ type: 1, order_no: order_no });

          // const [payError, payResult] = await uni.requestPayment({
          //   timeStamp: payParamData.timeStamp,
          //   nonceStr: payParamData.nonceStr,
          //   package: payParamData.package,
          //   paySign: payParamData.paySign,
          //   signType: payParamData.signType,
          // });
          // if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 回退上一页
     */
    backPrevPage() {
      this.$commonUtil.backPage();
      // uni.$emit('toastEvt', { msg: '发布成功' }); // 触发全局的 toast 事件
    },
    onTelConsultSucPopupCloseEvt() {
      this.backPrevPage()
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
  }
}
</script>

<style>
  page {
    background: #fff;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
