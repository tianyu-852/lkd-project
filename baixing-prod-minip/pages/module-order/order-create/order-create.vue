<template>
  <view class="main" :style="{ paddingBottom: sysSafeAreaHeight + 65 + 25 + 10  + 'px' }">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="发布订单" :title-size="36" title-color="#333" title-bold :background="{ backgroundColor: '#F5F5F5' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

    <!-- 订单类型 -->
    <view class="base-module type-module">
      <!-- 订单 父类型 -->
      <view class="type-nav-wrap">
        <view v-for="(pNavItem, pNavIndex) in causeSourceTypeInfo.causeSourceTypeList" :key="pNavIndex" class="type-nav-item" :class="{ 'type-nav-item-active': causeSourceTypeInfo.activePTypeIndex === pNavIndex, 'type-nav-item-prev': causeSourceTypeInfo.activePTypeIndex - 1 === pNavIndex, 'type-nav-item-next': causeSourceTypeInfo.activePTypeIndex + 1 === pNavIndex }" @click="changeParTypeNav(pNavIndex)">
          <view class="type-nav-inner">
            <text>{{ pNavItem.demand_type }}</text>
            <view v-if="causeSourceTypeInfo.activePTypeIndex === pNavIndex" class="bottom-line" />
          </view>
        </view>
      </view>
      <!-- 父类型 = 电话咨询 -->
      <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="type-telNav-wrap">
        <view class="tel-desc-box">
          <text style="margin-right: 20rpx;">多位律师</text>
          <text style="margin-right: 20rpx;">专业解答</text>
          <text>隐私保障</text>
        </view>
        <!-- <view class="tel-item-box">
          <view class="tel-item" style="margin-right: 60rpx;">
            <image class="icon-gou" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022927-1664259517423-dhNA2z.png" />
            <text>服务时长：24小时</text>
          </view>
          <view class="tel-item">
            <image class="icon-gou" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022927-1664259517423-dhNA2z.png" />
            <text>平均响应时间：55秒</text>
          </view>
        </view> -->
      </view>
      <!-- 订单 子类型 -->
      <view v-else class="type-subNav-wrap" :class="{ 'type-subNav-wrap-left': causeSourceTypeInfo.activePTypeIndex === 0, 'type-subNav-wrap-right': causeSourceTypeInfo.activePTypeIndex === causeSourceTypeInfo.causeSourceTypeList.length - 1 }">
        <view v-for="(sNavItem, sNavIndex) in causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children" :key="sNavIndex" class="type-subNav-item" :class="{ 'type-subNav-item-active': (causeSourceTypeInfo.activeSTypeIndex === sNavIndex) && causeSourceOrderForm.demand_type_id }" @click="changeSubTypeNav(sNavIndex)">{{ sNavItem.demand_type }}</view>
      </view>

      <!-- 类型描述 -->
      <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="type-tel-desc">
        <text style="margin-right: 20rpx;">服务流程:</text>
        <text>支付订单</text>
        <u-icon name="arrow-right" color="#999" size="28" :custom-style="{ margin: '0 10rpx' }" />
        <text>律师回电</text>
        <u-icon name="arrow-right" color="#999" size="28" :custom-style="{ margin: '0 10rpx' }" />
        <text>服务评价</text>
      </view>
      <view v-else-if="causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].introduction" class="type-desc">{{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].introduction }}</view>
    </view>

    <!-- 服务过的律师 -->
    <!-- <view class="base-module served-module">
      服务过
    </view> -->

    <view class="base-module category-module">
      <!-- 屏蔽指定律师 -->
      <view class="base-item" @click="navToExcludeLawyerPage">
        <view class="base-left">
          <view class="data-title">屏蔽指定律师</view>
        </view>
        <view class="base-right">
          <view v-if="causeSourceOrderForm.excludeLawyerList.length">已屏蔽<text style="color: #0085FF; margin: 0 10rpx;">{{ causeSourceOrderForm.excludeLawyerList.length }}</text>位律师</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>

      <!-- 涉及分类 -->
      <view class="base-item" @click="openCategoryPopup">
        <view class="base-left">
          <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="data-title">问题类型</view>
          <view v-else class="data-title">涉及分类</view>
        </view>
        <view class="base-right">
          <view v-if="causeSourceOrderForm.category_info.category" class="data-value">{{ causeSourceOrderForm.category_info.category }}</view>
          <view v-else class="data-value" style="color: #bbb;">{{ causeSourceOrderForm.demand_type_id === telAskDemandTypeId ? '请选择问题类型' : '请选择涉及分类' }}</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>
      <view v-if="causeSourceOrderForm.category_info.isCustom" class="base-item">
        <view class="base-left" style="flex: 1; padding: 0 20rpx; background: #F5F5F5; border-radius: 10rpx;">
          <input v-model="causeSourceOrderForm.category_info.category" class="input" maxlength="5" cursor-spacing="30" placeholder="请输入自定义分类" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>

      <!-- 律师地域 -->
      <view class="base-item" @click="$refs.regionPopupRef._openRegionPopup()">
        <view class="base-left">
          <view class="data-title">律师地域</view>
        </view>
        <view class="base-right">
          <view v-if="causeSourceOrderForm.lawyer_region_info.provinceName && causeSourceOrderForm.lawyer_region_info.cityName" class="data-value">{{ causeSourceOrderForm.lawyer_region_info.provinceName === causeSourceOrderForm.lawyer_region_info.cityName ? '' : (causeSourceOrderForm.lawyer_region_info.provinceName + '-') }}{{ causeSourceOrderForm.lawyer_region_info.cityName }}</view>
          <view v-else class="data-value" style="color: #bbb;">请选择律师地域</view>
          <u-icon name="arrow-right" color="#999" size="22" :custom-style="{ marginLeft: '10rpx' }" />
        </view>
      </view>

      <!-- 服务时长 电话咨询显示 -->
      <!-- <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="base-item">
        <view class="base-left">
          <view class="data-title">服务时长</view>
        </view>
        <view class="base-right">24小时</view>
      </view> -->

      <!-- 标的额 -->
      <view v-if="[11].includes(causeSourceOrderForm.demand_type_id)" class="base-item">
        <view class="base-left">
          <view class="data-title">标的额（选填）</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceOrderForm.case_money" class="input" maxlength="10" cursor-spacing="30" placeholder="请填写标的额" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>

      <!-- 律师费预算 -->
      <view v-if="[7, 11].includes(causeSourceOrderForm.demand_type_id)" class="base-item">
        <view class="base-left">
          <view class="data-title">律师费预算</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceOrderForm.budget" class="input" maxlength="10" cursor-spacing="30" placeholder="请填写律师费预算" placeholder-style="color: #bbb; font-size: 30rpx;">
          <text style="margin-left: 10rpx;">元</text>
        </view>
      </view>
    </view>

    <!-- 关押地点 -->
    <view v-if="[7].includes(causeSourceOrderForm.demand_type_id)" class="base-module guya-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">关押地点</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceOrderForm.imprisoned_address" class="input" maxlength="10" cursor-spacing="30" placeholder="请输入关押地点" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view class="base-item">
        <view class="base-left" @click="chooseDetentionImage">
          <image class="icon-img-b" mode="aspectFill" src="../static/icon-img-b.png" />
          <view class="data-title">上传拘留单（{{ causeSourceOrderForm.detention_slip_image ? 1 : 0 }}/1）</view>
        </view>
        <view class="base-right">
          <view v-if="causeSourceOrderForm.detention_slip_image" class="image-wrap" @click="$commonUtil.previewImg([causeSourceOrderForm.detention_slip_image], causeSourceOrderForm.detention_slip_image)">
            <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="causeSourceOrderForm.detention_slip_image" />
            <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="causeSourceOrderForm.detention_slip_image = ''" />
          </view>
        </view>
      </view>
    </view>

    <!-- 收件人 -->
    <view v-if="[9].includes(causeSourceOrderForm.demand_type_id)" class="base-module addressee-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">收件人信息</view>
        </view>
        <view class="base-right">
          <view style="color: #0085FF;" @click="openAddresseePopup">{{ causeSourceOrderForm.addressee_nickname ? '修改' : '添加' }}</view>
        </view>
      </view>
      <view v-if="causeSourceOrderForm.addressee_nickname || causeSourceOrderForm.addressee_address || causeSourceOrderForm.addressee_mobiles.length" class="addressee-wrap">
        <!-- 收件人姓名 -->
        <view class="addressee-item">
          <view class="addressee-left">收件人姓名</view>
          <view class="addressee-right">{{ causeSourceOrderForm.addressee_nickname }}</view>
        </view>
        <!-- 收件人号码 -->
        <view v-for="(pItem, pIndex) in causeSourceOrderForm.addressee_mobiles" :key="pIndex" class="addressee-item">
          <view class="addressee-left">收件人号码</view>
          <view class="addressee-right">{{ pItem }}</view>
        </view>
        <!-- 收件人地址 -->
        <view class="addressee-item">
          <view class="addressee-left">收件人地址</view>
          <view class="addressee-right">{{ causeSourceOrderForm.addressee_address }}</view>
        </view>
      </view>
    </view>

    <!-- 联系人 -->
    <view class="base-module contact-module">
      <view v-if="causeSourceOrderForm.demand_type_id !== telAskDemandTypeId" class="base-item">
        <view class="base-left">
          <view class="data-title">联系人姓名</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceOrderForm.other_contact_info.name" class="input" maxlength="10" cursor-spacing="30" placeholder="请填写联系人姓名" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view class="base-item contract-phone">
        <view class="base-left">
          <view class="data-title">联系号码</view>
        </view>
        <view class="base-right">
          <view>{{ causeSourceOrderForm.other_contact_info.mobile }}</view>
          <text class="divide-ver">|</text>
          <text class="text-btn" @click="updateContactPopup.isShowUpdateContactPopup = true">修改</text>
        </view>
      </view>
      <!-- <view v-if="[7, 11].includes(causeSourceOrderForm.demand_type_id)" class="base-item">
        <view class="base-left">
          <view class="data-title">是否允许意向律师回拨</view>
        </view>
        <view class="base-right">
          <u-switch v-model="causeSourceOrderForm.is_lawyer_call_phone" active-color="#0085FF" />
        </view>
      </view> -->
    </view>

    <!-- 数量 -->
    <view v-if="causeSourceTypeInfo.causeSourceTypeList.length && ![1, 17].includes(causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].demand_type_id)" class="base-module num-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">数量</view>
        </view>
        <view class="base-right">
          <u-number-box v-model="causeSourceOrderForm.num" :min="1" disabled-input />
        </view>
      </view>
    </view>

    <!-- 描述详情 -->
    <view v-if="causeSourceOrderForm.demand_type_id !== telAskDemandTypeId" class="base-module desc-module">
      <view class="title">请描述案件详情（选填）</view>
      <view class="desc-wrap">
        <textarea v-model="causeSourceOrderForm.content" class="textarea" :cursor-spacing="30" placeholder="请简单描述需求信息，便于律师分析，律师接单后会与您沟通需求细节！" placeholder-style="color: #bbb; font-size: 28rpx;" />
        <!-- 图片 -->
        <view class="image-wrap">
          <view v-for="(iItem, iIndex) in causeSourceOrderForm.related_images" :key="iIndex" class="image-item" @click="$commonUtil.previewImg(causeSourceOrderForm.related_images, iItem)">
            <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="iItem" />
            <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="causeSourceOrderForm.related_images.splice(iIndex, 1)" />
          </view>
        </view>
        <!-- 文件 -->
        <view class="image-wrap file-wrap">
          <view v-for="(iItem, iIndex) in causeSourceOrderForm.related_cloud_file_List" :key="iIndex" class="image-item file-item">
            <image class="file-bg" mode="aspectFill" src="../static/file-bg.png" />
            <view class="file-name">{{ iItem.basename }}</view>
            <image class="icon-del" mode="aspectFill" src="../static/icon-img-del.png" @click.stop="causeSourceOrderForm.related_cloud_file_List.splice(iIndex, 1)" />
          </view>
        </view>

        <view class="upload-wrap">
          <view v-if="causeSourceOrderForm.related_images.length < 9" class="upload-item" @click="chooseCauseSourceImage">
            <image class="icon-upload" mode="aspectFill" src="../static/icon-img-upload.png" />
            <text>上传图片</text>
            <text>({{ causeSourceOrderForm.related_images.length }}/9)</text>
          </view>
          <view class="upload-item" @click="navToSelectFilePage">
            <image class="icon-upload" mode="aspectFill" src="../static/icon-file-upload.png" />
            <text>上传文件</text>
            <text>({{ causeSourceOrderForm.related_cloud_file_List.length }}/9)</text>
          </view>
        </view>
      </view>
      <view class="desc-tips">请放心填写，仅接单律师可见</view>
    </view>

    <!-- 底部按钮组 -->
    <view v-if="userInfo.type !== 1" class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="btn-wrap">
        <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="btn-item">限时免费咨询</view>
        <view v-else-if="causeSourceTypeInfo.causeSourceTypeList.length && causeSourceTypeInfo.activeSTypeIndex > -1" class="btn-item">{{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].demand_type }}：¥ {{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].price | priceFilter(causeSourceOrderForm.num) }}</view>
        <view v-else class="btn-item" />

        <view class="btn-item" @click="publishCaseSourceOrder">{{ causeSourceOrderForm.demand_type_id === telAskDemandTypeId ? '立即发布' : '立即支付' }}</view>
      </view>
      <!-- 电话咨询显示协议 -->
      <view v-if="causeSourceOrderForm.demand_type_id === telAskDemandTypeId" class="bottom-protocol">
        <text>发布即表示同意</text>
        <text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.post_create_agreement_url)">《律师咨询发布规则》</text>
      </view>
      <!-- 委托打官司就显示协议 -->
      <view v-if="causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].demand_type_id === 17" class="bottom-protocol">
        <text>发布即表示同意</text>
        <text style="color: #0085FF" @click="routerToWebView(appConfigInfo.source_case_create_agreement_url)">《百姓律师发布规则》</text>
      </view>
    </view>

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
          <view class="upopup-btn" @click="confirmUpdateContactPopup">确认</view>
        </view>
      </view>
    </u-popup>

    <!-- 收件人信息 popup -->
    <u-popup v-model="addresseePopupInfo.isShowAddresseePopup" mode="center" width="600" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-receive-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-title">收件人信息</view>
        <!-- 收件人姓名 -->
        <view class="receive-info-item">
          <view class="receive-info-left">收件人姓名</view>
          <view class="receive-info-right">
            <input v-model="addresseePopupInfo.addressee_nickname" class="input" maxlength="10" cursor-spacing="30" placeholder="请填写姓名" placeholder-style="color: #bbb; font-size: 30rpx;">
          </view>
        </view>

        <!-- 收件人号码 -->
        <view v-for="(pItem, nIndex) in addresseePopupInfo.addressee_mobiles" :key="nIndex" class="receive-info-item">
          <view class="receive-info-left">收件人号码</view>
          <view class="receive-info-right">
            <input v-model="addresseePopupInfo.addressee_mobiles[nIndex]" class="input" maxlength="11" cursor-spacing="30" placeholder="请填写手机号码" placeholder-style="color: #bbb; font-size: 30rpx;">
            <text class="divide-ver">|</text>
            <text v-if="nIndex === 0" class="text-btn" @click="addReceiveMobile">添加</text>
            <text v-else class="text-btn" style="color: #FE5F48;" @click="addresseePopupInfo.addressee_mobiles.splice(nIndex, 1)">删除</text>
          </view>
        </view>

        <!-- 收件人地址 -->
        <view class="receive-info-item">
          <view class="receive-info-left">收件人地址</view>
          <view class="receive-info-right">
            <input v-model="addresseePopupInfo.addressee_address" class="input" cursor-spacing="30" placeholder="收件人地址" placeholder-style="color: #bbb; font-size: 30rpx;">
          </view>
        </view>
        <view class="upopup-btns">
          <view class="upopup-btn" @click="addresseePopupInfo.isShowAddresseePopup = false">取消</view>
          <view class="upopup-btn" @click="confirmAddresseePopup">确认</view>
        </view>
      </view>
    </u-popup>

    <!-- 涉及分类 popup -->
    <u-popup v-model="categoryPopupInfo.isShowCategoryPopup" mode="bottom" border-radius="24" closeable safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-category-box" @click.stop="$commonUtil.stopPropagation">
        <view class="upopup-category-header">请选择{{ causeSourceOrderForm.demand_type_id === telAskDemandTypeId ? '问题' : '涉及' }}分类</view>
        <view class="upopup-category-content">
          <scroll-view class="category-content-scrollYView" scroll-y enhanced :show-scrollbar="false">
            <view v-for="(cGItem, cGIndex) in categoryPopupInfo.categoryPopupList" :key="cGIndex" class="category-group">
              <view v-if="cGItem.lawyer_tag_group" class="category-group-name">{{ cGItem.lawyer_tag_group }}</view>
              <view class="category-item-wrap">
                <view v-for="(cItem, cIndex) in cGItem.lawyer_tags" :key="cIndex" class="category-item" :class="{ 'category-item-active': categoryPopupInfo.activePCategoryIndex === cGIndex && categoryPopupInfo.activeSCategoryIndex === cIndex }" @click="selectCategoryItem(cGIndex, cIndex)">{{ cItem.lawyer_tag }}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>

    <!-- uView 验证码倒计时数据 -->
    <u-verification-code ref="uCode" :seconds="60" start-text="发送验证码" end-text="发送验证码" @start="onContactSMSCodeStart" @change="onContactSMSCodeChange" @end="onContactSMSCodeEnd" />

    <!-- 地区 popup -->
    <region-popup ref="regionPopupRef" @confirmCityEvt="onRegionPopupConfirmEvt" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fileUtil from '@/common/utils/fileUtil';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'OrderCreate',
  filters: {
    priceFilter(unitPrice, num) {
      return (Number(unitPrice) * num).toFixed(2);
    },
  },
  data() {
    return {
      telAskDemandTypeId: 13, // 电话咨询 id
      
      // 案源订单信息 (表单)
      causeSourceOrderForm: {
        demand_type_id: '', // 订单类型 13: 电话咨询
        content: '', // 案件描述
        case_money: '', // 标的额
        budget: '', // 律师费预算
        is_lawyer_call_phone: true, // 是否允许律师回拨
        related_images: [], // 图片
        related_cloud_file_List: [], // 云盘文件
        imprisoned_address: '', // 关押地点
        detention_slip_image: '', // 拘留单图片
        addressee_nickname: '', // 收件人姓名
        addressee_mobiles: [], // 收件人号码数组
        addressee_address: '', // 收件人地址
        num: 1, // 订单数量
        excludeLawyerList: [], // 屏蔽律师 列表
        category_info: {
          category_id: '', // 分类 id
          category: '', // 分类名称
          isCustom: '', // 是否自定义
        },
        lawyer_region_info: {
          lawyer_province_id: '', // 律师省份 id
          lawyer_city_id: '', // 律师城市 id
          provinceName: '', // 省名称
          cityName: '', // 市名称
        },
        other_contact_info: {
          name: '', // 联系人姓名
          mobile: '', // 联系人电话
        },
      },

      // 案源类型 信息
      causeSourceTypeInfo: {
        causeSourceTypeList: [], // 订单类型列表
        activePTypeIndex: 0, // 激活的父类型导航下标
        activeSTypeIndex: 0, // 激活的子类型导航下标
      },

      // 律师地区 popup 信息
      regionPopupInfo: {
        isShowRegionPopup: false, // 是否显示地区 popup
        regionList: [], // 律师地区列表
        activePRegionIndex: 0, // 激活的父区域 下标
        activeSRegionIndex: -1, // 激活的子区域 下标
      },

      telAskCategoryDataList: [], // 电话咨询分类列表
      entrustCategoryDataList: [], // 委托打官司分类列表

      // 分类 popup 信息
      categoryPopupInfo: {
        isShowCategoryPopup: false, // 是否显示分类 popup
        categoryPopupList: [], // 分类 popup 列表
        activePCategoryIndex: 0, // 激活的父分类 下标
        activeSCategoryIndex: -1, // 激活的子分类 下标
      },

      // 收件人 popup 信息
      addresseePopupInfo: {
        isShowAddresseePopup: false, // 是否显示收件人 popup
        addressee_nickname: '', // 收件人姓名
        addressee_mobiles: [''], // 收件人号码数组
        addressee_address: '', // 收件人地址
      },

      // 修改联系人 popup 信息
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
    ...mapState('userModule', ['userInfo']),
    ...mapState(['appConfigInfo']),

    ...mapGetters('userModule', ['userId']),
    ...mapGetters(['sysSafeAreaHeight']),
  },
  watch: {
    userInfo: {
      immediate: true,
      handler: function(newVal) {
        this.causeSourceOrderForm.other_contact_info.mobile = newVal.call_mobile;
      }
    }
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.activePTypeIndex) this.causeSourceTypeInfo.activePTypeIndex = Number(routeParam.activePTypeIndex)

    this._getCauseSourceTypeList();
    this._getLawyerRegionList();
    this._getCauseSourceOrderTelAskCategoryList();
    this._getCauseSourceOrderEntrustCategoryList();
    // this._getCategoryList();

    // 监听屏蔽律师确定事件
    uni.$on('excludeLawyerConfirmEvt', data => {
      const { confirmExcludeLawyerList } = data;
      this.causeSourceOrderForm.excludeLawyerList = confirmExcludeLawyerList;
    });

    // 监听云盘文件确定事件
    uni.$on('cloudFileConfirmEvt', data => {
      const { cloudFileList } = data;
      this.causeSourceOrderForm.related_cloud_file_List = cloudFileList;
    });
  },
  methods: {
    /**
     * 获取案源订单类型列表
     */
    async _getCauseSourceTypeList() {
      try {
        const { data: causeSourceTypeData } = await this.$api.getCauseSourceOrderTypeTreeApi();
        this.causeSourceTypeInfo.causeSourceTypeList = causeSourceTypeData;
        // 默认取第一个子类型 id
        this.causeSourceOrderForm.demand_type_id = this.causeSourceTypeInfo.causeSourceTypeList[this.causeSourceTypeInfo.activePTypeIndex].children[0].demand_type_id;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取案源订单 电话咨询 分类列表
     */
    async _getCauseSourceOrderTelAskCategoryList() {
      try {
        const { data: telAskCategoryData } = await this.$api.getCauseSourceOrderTelAskCategoryApi();
        this.telAskCategoryDataList = [{
          lawyer_tag_group: '',
          lawyer_tags: telAskCategoryData.tag_data
        }]
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取案源订单 委托打官司 分类列表
     */
    async _getCauseSourceOrderEntrustCategoryList() {
      try {
        const { data: entrustCategoryData } = await this.$api.getCauseSourceOrderEntrustCategoryApi();
        this.entrustCategoryDataList = entrustCategoryData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取律师地区列表
     */
    async _getLawyerRegionList() {
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
     * 获取分类列表
     */
    async _getCategoryList() {
      try {
        const { data: categoryData } = await this.$api.getCategoryList({ is_have_hot: 1 });
        this.categoryPopupInfo.categoryPopupList = categoryData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开收件人 popup
     */
    openAddresseePopup() {
      this.addresseePopupInfo.isShowAddresseePopup = true;
    },
    /**
     * 添加收件人手机号
     */
    addReceiveMobile() {
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.addresseePopupInfo.addressee_mobiles[this.addresseePopupInfo.addressee_mobiles.length - 1].trim()))) return this.$u.toast('请输入正确的手机号码');
      this.addresseePopupInfo.addressee_mobiles.push('');
    },
    /**
     * 确定收件人信息 popup
     */
    confirmAddresseePopup() {
      const { addresseePopupInfo } = this;
      if (!addresseePopupInfo.addressee_nickname.trim()) return this.$u.toast('请输入收件人姓名');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(addresseePopupInfo.addressee_mobiles[addresseePopupInfo.addressee_mobiles.length - 1].trim()))) return this.$u.toast('请输入正确的手机号码');
      if (!addresseePopupInfo.addressee_address.trim()) return this.$u.toast('请输入收件人地址');

      this.causeSourceOrderForm.addressee_nickname = addresseePopupInfo.addressee_nickname.trim();
      this.causeSourceOrderForm.addressee_mobiles = addresseePopupInfo.addressee_mobiles;
      this.causeSourceOrderForm.addressee_address = addresseePopupInfo.addressee_address.trim();
      this.addresseePopupInfo.isShowAddresseePopup = false;
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
     * 选择案源图片
     */
    async chooseCauseSourceImage() {
      const imageUrlList = await this._chooseImage(9 - this.causeSourceOrderForm.related_images.length);
      this.causeSourceOrderForm.related_images.push(...imageUrlList);
    },

    /**
     * 选择拘留单图片
     */
    async chooseDetentionImage() {
      if (this.causeSourceOrderForm.detention_slip_image) return;
      const imageUrlList = await this._chooseImage(1);
      this.causeSourceOrderForm.detention_slip_image = imageUrlList[0];
    },

    /**
     * 选择图片 api 上传图片
     */
    async _chooseImage(imgCount) {
      const [error, imgRes] = await uni.chooseMedia({ count: imgCount, mediaType: ['image'] });
      if (error) return;

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
     * 进入屏蔽律师页面
     */
    navToExcludeLawyerPage() {
      uni.navigateTo({
        url: '/pages/module-order/exclude-lawyer/exclude-lawyer',
        success: res => {
          const { causeSourceOrderForm } = this;
          res.eventChannel.emit('excludeLawyerEvt', { lastExcludeLawyerList: causeSourceOrderForm.excludeLawyerList });
        }
      });
    },
    /**
     * 进入选择文件页面
     */
    navToSelectFilePage() {
      uni.navigateTo({
        url: '/pages/module-order/order-file-list/order-file-list',
        success: res => {
          const { causeSourceOrderForm } = this;
          res.eventChannel.emit('cloudFileEvt', { prevedCloudFileList: causeSourceOrderForm.related_cloud_file_List });
        }
      });
    },
    /**
     * 重置案源订单表单信息
     */
    _resetCauseSourceOrderForm() {
      this.causeSourceOrderForm.category_info.category_id = '';
      this.causeSourceOrderForm.category_info.category = '';
      this.causeSourceOrderForm.category_info.isCustom = false;
      this.causeSourceOrderForm.num = 1;

      this.categoryPopupInfo.activePCategoryIndex = 0;
      this.categoryPopupInfo.activeSCategoryIndex = -1;
    },

    /**
     * 改变案源 父类型导航
     */
    changeParTypeNav(pTypeIndex) {
      // 切换父类型 下标
      this.causeSourceTypeInfo.activePTypeIndex = pTypeIndex;
      // 默认取第一个子类型 id
      this.causeSourceTypeInfo.activeSTypeIndex = 0;
      this.causeSourceOrderForm.demand_type_id = this.causeSourceTypeInfo.causeSourceTypeList[this.causeSourceTypeInfo.activePTypeIndex].children[0].demand_type_id;

      this._resetCauseSourceOrderForm();
    },

    /**
     * 改变案源子类型
     */
    changeSubTypeNav(sTypeIndex) {
      // 选中的子类型 下标
      this.causeSourceTypeInfo.activeSTypeIndex = sTypeIndex;
      // 案源类型 id
      const causeSourceTypeId = this.causeSourceTypeInfo.causeSourceTypeList[this.causeSourceTypeInfo.activePTypeIndex].children[this.causeSourceTypeInfo.activeSTypeIndex].demand_type_id;
      this.causeSourceOrderForm.demand_type_id = causeSourceTypeId;

      this._resetCauseSourceOrderForm();
    },
    /**
     * 监听地区 popup 组件 确定城市 evt
     */
    onRegionPopupConfirmEvt(cityData) {
      this.causeSourceOrderForm.lawyer_region_info.lawyer_province_id = cityData.province_id;
      this.causeSourceOrderForm.lawyer_region_info.lawyer_city_id = cityData.city_id;
      this.causeSourceOrderForm.lawyer_region_info.provinceName = cityData.province;
      this.causeSourceOrderForm.lawyer_region_info.cityName = cityData.city;
    },

    /**
     * 打开选择分类 popup & 设置分类 popup 数据
     */
    openCategoryPopup() {
      const { causeSourceTypeInfo } = this;
      const activeCauseSourceTypeParTypeId = causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].demand_type_id;

      // 订单父分类 = 电话咨询
      if (activeCauseSourceTypeParTypeId === 1) {
        this.categoryPopupInfo.categoryPopupList = this.telAskCategoryDataList;
      // 订单父分类 = 委托打官司
      } else if (activeCauseSourceTypeParTypeId === 17) {
        this.categoryPopupInfo.categoryPopupList = this.entrustCategoryDataList;
      // 订单父分类 == 合同文书
      } else if (activeCauseSourceTypeParTypeId === 2) {
        const categories = causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].categories;
        const _categoryList = categories.map(item => {
          return { lawyer_tag: item.category, lawyer_tag_id: item.category_id };
        });

        this.categoryPopupInfo.categoryPopupList = [{ lawyer_tag_group: '', lawyer_tags: _categoryList }];
      }

      this.categoryPopupInfo.isShowCategoryPopup = true;
    },
    /**
     * 选择涉及分类
     */
    selectCategoryItem(cGIndex, cIndex) {
      const { categoryPopupInfo } = this;
      this.categoryPopupInfo.activePCategoryIndex = cGIndex;
      this.categoryPopupInfo.activeSCategoryIndex = cIndex;
      // 确定分类项
      const category = categoryPopupInfo.categoryPopupList[cGIndex].lawyer_tags[cIndex];
      this.causeSourceOrderForm.category_info.category_id = category.lawyer_tag_id;
      this.causeSourceOrderForm.category_info.category = category.lawyer_tag;
      // 分类等于自定义情况
      if (this.causeSourceOrderForm.category_info.category === '自定义') {
        this.causeSourceOrderForm.category_info.category = '';
        this.causeSourceOrderForm.category_info.isCustom = true;
      }

      this.categoryPopupInfo.isShowCategoryPopup = false;
    },
    /**
     * 发布案源订单
     */
    async publishCaseSourceOrder() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

      const { causeSourceOrderForm } = this;

      if (!causeSourceOrderForm.demand_type_id) return this.$u.toast('请先选择订单类型');
      // 电话咨询判断
      if (causeSourceOrderForm.demand_type_id === this.telAskDemandTypeId) {
        if (!causeSourceOrderForm.category_info.category_id) return this.$u.toast('请选择问题分类');
        if (!causeSourceOrderForm.lawyer_region_info.lawyer_city_id && !causeSourceOrderForm.lawyer_region_info.lawyer_province_id) return this.$u.toast('请选择律师地域');
      }
      // 非电话咨询判断
      if (![13].includes(causeSourceOrderForm.demand_type_id)) {
        if (!causeSourceOrderForm.category_info.category_id) return this.$u.toast('请先选择涉及分类');
        if (!causeSourceOrderForm.category_info.category.trim()) return this.$u.toast('请输入自定义分类');
        if (!causeSourceOrderForm.lawyer_region_info.lawyer_city_id && !causeSourceOrderForm.lawyer_region_info.lawyer_province_id) return this.$u.toast('请选择律师地域');
      }

      if (!causeSourceOrderForm.other_contact_info.mobile.trim()) return this.$u.toast('请输入联系人电话');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(causeSourceOrderForm.other_contact_info.mobile.trim()))) return this.$u.toast('请输入正确的手机号');

      const param = {
        demand_type_id: causeSourceOrderForm.demand_type_id, // 需求类型 id
        category_id: causeSourceOrderForm.category_info.category_id, // 分类 id
        category: causeSourceOrderForm.category_info.category.trim(), // 分类名称
        content: causeSourceOrderForm.content.trim(), // 案件描述
        lawyer_province_id: causeSourceOrderForm.lawyer_region_info.lawyer_province_id, // 律师省份 id
        lawyer_city_id: causeSourceOrderForm.lawyer_region_info.lawyer_city_id, // 律师城市 id
        case_money: causeSourceOrderForm.case_money.trim(), // 标的额
        addressee_nickname: causeSourceOrderForm.addressee_nickname.trim(), // 收件人姓名
        addressee_mobiles: JSON.stringify(causeSourceOrderForm.addressee_mobiles), // 收件人号码数组
        addressee_address: causeSourceOrderForm.addressee_address.trim(), // 收件人地址
        related_images: JSON.stringify(causeSourceOrderForm.related_images), // 图片
        related_cloud_file_ids: JSON.stringify(causeSourceOrderForm.related_cloud_file_List.map(itm => itm.cloud_file_id)), // 云盘文件 ids
        imprisoned_address: causeSourceOrderForm.imprisoned_address.trim(), // 关押地点
        detention_slip_image: causeSourceOrderForm.detention_slip_image, // 拘留单图片
        // is_lawyer_call_phone: causeSourceOrderForm.is_lawyer_call_phone ? 1 : 0, // 是否允许律师回拨
        is_talk_detail: [7, 11].includes(causeSourceOrderForm.demand_type_id) ? 1 : 0, // 是否详谈
        lawyer_ids: JSON.stringify(causeSourceOrderForm.excludeLawyerList.map(itm => itm.user_id)), // 屏蔽律师 ids
        // 联系人信息
        other_contact: JSON.stringify({
          name: causeSourceOrderForm.other_contact_info.name.trim(),
          mobile: causeSourceOrderForm.other_contact_info.mobile.trim()
        }),
        num: causeSourceOrderForm.num, // 订单数量
      };
      console.log(param);
      // 律师费预算
      causeSourceOrderForm.budget.trim() && (param.budget = Number(causeSourceOrderForm.budget.trim()))
      // return;

      uni.showLoading({ title: '发布中', mask: true });

      try {
        // 创建支付订单
        const { data: resData } = await this.$api.createCauseSourceOrderApi(param);
        const { order_no, money_real } = resData;

        if (Number(money_real) > 0) {
          // 获取微信支付参数 type = 1: 微信支付
          const { data: payParamData } = await this.$api.payOrderApi({ type: 1, order_no: order_no });

          const [payError, payResult] = await uni.requestPayment({
            timeStamp: payParamData.timeStamp,
            nonceStr: payParamData.nonceStr,
            package: payParamData.package,
            paySign: payParamData.paySign,
            signType: payParamData.signType,
          });
          if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        }
        this.$commonUtil.backPage();
        uni.$emit('toastEvt', { msg: '发布成功' }); // 触发全局的 toast 事件
      } catch (error) {
        console.log(error);
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

<style>
 page {
  background: #F5F5F5;
 }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
