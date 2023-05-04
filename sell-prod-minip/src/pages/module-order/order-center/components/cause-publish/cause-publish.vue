<template>
  <view class="main" :style="{ paddingBottom: sysSafeAreaHeight + 65 + 10 + 'px' }">
    <!-- 订单类型 -->
    <view class="base-module type-module">
      <!-- 订单类型 父导航 -->
      <view class="type-nav-wrap">
        <view v-for="(pNavItem, pNavIndex) in causeSourceTypeInfo.causeSourceTypeList" :key="pNavIndex" class="type-nav-item" :class="{ 'type-nav-item-active': causeSourceTypeInfo.activePTypeIndex === pNavIndex, 'type-nav-item-prev': causeSourceTypeInfo.activePTypeIndex - 1 === pNavIndex, 'type-nav-item-next': causeSourceTypeInfo.activePTypeIndex + 1 === pNavIndex }" @click="changePTypeNav(pNavIndex)">
          <view class="type-nav-inner">
            <text>{{ pNavItem.demand_type }}</text>
            <view v-if="causeSourceTypeInfo.activePTypeIndex === pNavIndex" class="bottom-line" />
          </view>
        </view>
      </view>
      <!-- 订单类型 子导航 -->
      <view class="type-subNav-wrap" :class="{ 'type-subNav-wrap-left': causeSourceTypeInfo.activePTypeIndex === 0, 'type-subNav-wrap-right': causeSourceTypeInfo.activePTypeIndex === causeSourceTypeInfo.causeSourceTypeList.length - 1 }">
        <view v-for="(sNavItem, sNavIndex) in causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children" :key="sNavIndex" class="type-subNav-item" :class="{ 'type-subNav-item-active': causeSourceTypeInfo.activeSTypeIndex === sNavIndex }" @click="changeSTypeNav(sNavIndex)">{{ sNavItem.demand_type }}</view>
      </view>

      <view class="type-desc">{{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].introduction }}</view>
    </view>

    <!-- 分类类型 -->
    <view class="base-module category-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">问题分类</view>
        </view>
        <view class="base-right" @click="openChooseCategoryPopup">
          <view v-if="causeSourceInfo.category_info.category" class="data-value">{{ causeSourceInfo.category_info.category }}</view>
          <view v-else class="data-value" style="color: #bbb;">请选择问题分类</view>
          <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <view v-if="causeSourceInfo.category_info.isCustom" class="base-item">
        <view class="base-left" style="flex: 1; padding: 0 20rpx; background: #F5F5F5; border-radius: 10rpx;">
          <input v-model="causeSourceInfo.category_info.category" class="input" maxlength="5" cursor-spacing="30" placeholder="请输入自定义分类" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">律师地区</view>
        </view>
        <view class="base-right" @click="regionPopupInfo.isShowRegionPopup = true">
          <view v-if="causeSourceInfo.lawyer_region_info.provinceName && causeSourceInfo.lawyer_region_info.cityName" class="data-value">{{ causeSourceInfo.lawyer_region_info.provinceName === causeSourceInfo.lawyer_region_info.cityName ? '' : (causeSourceInfo.lawyer_region_info.provinceName + '-') }}{{ causeSourceInfo.lawyer_region_info.cityName }}</view>
          <view v-else class="data-value" style="color: #bbb;">请选择律师地区</view>
          <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
      <!-- <view class="base-item">
        <view class="base-left">
          <view class="data-title">服务时长</view>
        </view>
        <view class="base-right">
          24小时
        </view>
      </view> -->

      <!-- 标的额 -->
      <view v-if="[11].includes(causeSourceInfo.demand_type_id)" class="base-item">
        <view class="base-left">
          <view class="data-title">标的额（选填）</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceInfo.case_money" class="input" maxlength="10" cursor-spacing="30" placeholder="请填写标的额" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
    </view>

    <!-- 关押地点 -->
    <view v-if="[7].includes(causeSourceInfo.demand_type_id)" class="base-module guya-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">关押地点</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceInfo.imprisoned_address" class="input" maxlength="10" cursor-spacing="30" placeholder="请输入关押地点" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view class="base-item">
        <view class="base-left" @click="chooseDetentionImage">
          <image class="icon-img-b" mode="aspectFill" src="../../../static/icon-img-b.png" />
          <view class="data-title">上传拘留单（{{ causeSourceInfo.detention_slip_image ? 1 : 0 }}/1）</view>
        </view>
        <view class="base-right">
          <view v-if="causeSourceInfo.detention_slip_image" class="image-wrap" @click="$commonUtil.previewImg([causeSourceInfo.detention_slip_image], causeSourceInfo.detention_slip_image)">
            <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="causeSourceInfo.detention_slip_image" />
            <image class="icon-del" mode="aspectFill" src="../../../static/icon-img-del.png" @click.stop="causeSourceInfo.detention_slip_image = ''" />
          </view>
        </view>
      </view>
    </view>

    <!-- 收件人 -->
    <view v-if="[9].includes(causeSourceInfo.demand_type_id)" class="base-module addressee-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">收件人信息</view>
        </view>
        <view class="base-right">
          <view style="color: #0085FF;" @click="openAddresseePopup">{{ causeSourceInfo.addressee_nickname ? '修改' : '添加' }}</view>
        </view>
      </view>
      <view v-if="causeSourceInfo.addressee_nickname || causeSourceInfo.addressee_address || causeSourceInfo.addressee_mobiles.length" class="addressee-wrap">
        <!-- 收件人姓名 -->
        <view class="addressee-item">
          <view class="addressee-left">收件人姓名</view>
          <view class="addressee-right">{{ causeSourceInfo.addressee_nickname }}</view>
        </view>
        <!-- 收件人号码 -->
        <view v-for="(pItem, pIndex) in causeSourceInfo.addressee_mobiles" :key="pIndex" class="addressee-item">
          <view class="addressee-left">收件人号码</view>
          <view class="addressee-right">{{ pItem }}</view>
        </view>
        <!-- 收件人地址 -->
        <view class="addressee-item">
          <view class="addressee-left">收件人地址</view>
          <view class="addressee-right">{{ causeSourceInfo.addressee_address }}</view>
        </view>
      </view>
    </view>

    <!-- 联系人 -->
    <view class="base-module contact-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">联系人姓名</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceInfo.other_contact_info.name" class="input" maxlength="10" cursor-spacing="30" placeholder="联系人姓名" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">手机号码</view>
        </view>
        <view class="base-right">
          <input v-model="causeSourceInfo.other_contact_info.mobile" class="input" maxlength="11" cursor-spacing="30" placeholder="联系人电话" placeholder-style="color: #bbb; font-size: 30rpx;">
        </view>
      </view>
      <view v-if="[7].includes(causeSourceInfo.demand_type_id)" class="base-item">
        <view class="base-left">
          <view class="data-title">是否允许意向律师回拨</view>
        </view>
        <view class="base-right">
          <u-switch v-model="causeSourceInfo.is_lawyer_call_phone" active-color="#0085FF" />
        </view>
      </view>
    </view>

    <!-- 数量 -->
    <view v-if="![13].includes(causeSourceInfo.demand_type_id)" class="base-module num-module">
      <view class="base-item">
        <view class="base-left">
          <view class="data-title">数量</view>
        </view>
        <view class="base-right">
          <u-number-box v-model="causeSourceInfo.num" :min="1" disabled-input />
        </view>
      </view>
    </view>

    <!-- 描述详情 -->
    <view class="base-module desc-module">
      <view class="title">请描述案件详情（选填）</view>
      <view class="desc-wrap">
        <textarea v-model="causeSourceInfo.content" class="textarea" :cursor-spacing="30" placeholder="请简单描述需求信息，便于律师分析，律师接单后会与您沟通需求细节！" placeholder-style="color: #bbb; font-size: 28rpx;" />
        <view class="image-wrap">
          <view v-for="(iItem, iIndex) in causeSourceInfo.related_images" :key="iIndex" class="image-item" @click="$commonUtil.previewImg(causeSourceInfo.related_images, iItem)">
            <image style="width: 100%; height: 100%; border-radius: 8rpx;" mode="aspectFill" :src="iItem" />
            <image class="icon-del" mode="aspectFill" src="../../../static/icon-img-del.png" @click.stop="causeSourceInfo.related_images.splice(iIndex, 1)" />
          </view>
        </view>
        <view class="image-wrap file-wrap">
          <view v-for="(iItem, iIndex) in causeSourceInfo.related_cloud_file_List" :key="iIndex" class="image-item file-item">
            <image class="file-bg" mode="aspectFill" src="../../../static/file-bg.png" />
            <view class="file-name">{{ iItem.basename }}</view>
            <image class="icon-del" mode="aspectFill" src="../../../static/icon-img-del.png" @click.stop="causeSourceInfo.related_cloud_file_List.splice(iIndex, 1)" />
          </view>
        </view>

        <view class="upload-wrap">
          <view v-if="causeSourceInfo.related_images.length < 9" class="upload-item" @click="chooseCauseSourceImage">
            <image class="icon-upload" mode="aspectFill" src="../../../static/icon-img-upload.png" />
            <text>上传图片</text>
            <text>({{ causeSourceInfo.related_images.length }}/9)</text>
          </view>
          <view class="upload-item" @click="$commonUtil.routeNavTo('causeFileList', { prevedCloudFileList: causeSourceInfo.related_cloud_file_List })">
            <image class="icon-upload" mode="aspectFill" src="../../../static/icon-file-upload.png" />
            <text>上传文件</text>
            <text>({{ causeSourceInfo.related_cloud_file_List.length }}/9)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view v-if="causeSourceTypeInfo.activeSTypeIndex > -1" class="bottom-btn">{{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].demand_type }}：¥ {{ causeSourceTypeInfo.causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].price | priceFilter(causeSourceInfo.num) }}</view>
      <view v-else class="bottom-btn" />
      <view class="bottom-btn" @click="publishCauseSource">立即支付</view>
    </view>

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

    <!-- 地区 popup -->
    <u-popup v-model="regionPopupInfo.isShowRegionPopup" mode="bottom" height="800" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-region-box" @click.stop="$commonUtil.stopPropagation">
        <!-- 左侧城市导航 -->
        <view class="sidenav-wrap">
          <view v-for="(nItem, nIndex) in regionPopupInfo.regionList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': regionPopupInfo.activePRegionIndex === nIndex }" @click="changeRegionPopupSideNav(nIndex)">{{ nItem.name }}</view>
          <!-- 侧边导航条 -->
          <view class="sidenav-line-outer" :style="{ top: (regionPopupInfo.activePRegionIndex * 100) + 'rpx' }">
            <view class="sidenav-line-inner" />
          </view>
        </view>
        <!-- 右侧城市数据 -->
        <view class="region-wrap">
          <view class="city-wrap">
            <view v-for="(cItem, cIndex) in regionPopupInfo.regionList[regionPopupInfo.activePRegionIndex].cities" :key="cIndex" class="city-item" :class="{ 'city-item-active': regionPopupInfo.activeSRegionIndex === cIndex }" :style="cItem.name && cItem.name.length > 5 ? 'font-size: 24rpx;' : ''" @click="changeRegionCityPopupValue(cIndex)">
              <text>{{ cItem.name }}</text>
              <image v-if="regionPopupInfo.activeSRegionIndex === cIndex" class="active-gou-img" mode="aspectFill" src="../../../static/factor-active-gou.png" />
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 分类 select -->
    <u-select v-model="categorySelectInfo.isShowCategorySelect" :list="categorySelectInfo.categorySelectList" label-name="category" value-name="category_id" safe-area-inset-bottom @confirm="confirmCategorySelectEvt" />

    <!-- 分类 popup -->
    <u-popup v-model="categoryPopupInfo.isShowCategoryPopup" mode="center" width="620" height="800" border-radius="24" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-category-box" @click.stop="$commonUtil.stopPropagation">
        <!-- 左侧分类导航 -->
        <view class="sidenav-wrap">
          <view v-for="(nItem, nIndex) in categoryPopupInfo.categoryPopupList" :key="nIndex" class="sidenav-item" :class="{ 'sidenav-item-active': categoryPopupInfo.activePCategoryIndex === nIndex }" @click="changeCategoryPopupSideNav(nIndex)">{{ nItem.lawyer_tag_group }}</view>
          <!-- 侧边导航条 -->
          <view class="sidenav-line-outer" :style="{ top: (categoryPopupInfo.activePCategoryIndex * 100) + 'rpx' }">
            <view class="sidenav-line-inner" />
          </view>
        </view>
        <!-- 右侧分类数据 -->
        <view class="class-wrap">
          <view class="category-wrap">
            <view v-for="(cItem, cIndex) in categoryPopupInfo.categoryPopupList[categoryPopupInfo.activePCategoryIndex].lawyer_tags" :key="cIndex" class="category-item" :class="{ 'category-item-active': categoryPopupInfo.activeSCategoryIndex === cIndex }" :style="cItem.lawyer_tag && cItem.lawyer_tag.length > 5 ? 'font-size: 24rpx;' : ''" @click="changeCategoryPopupValue(cIndex)">
              <text>{{ cItem.lawyer_tag }}</text>
              <image v-if="categoryPopupInfo.activeSCategoryIndex === cIndex" class="active-gou-img" mode="aspectFill" src="../../../static/factor-active-gou.png" />
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fileUtil from '@/common/utils/fileUtil';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'CauseCreate',
  filters: {
    priceFilter(unitPrice, num) {
      return (Number(unitPrice) * num).toFixed(2);
    },
  },
  data() {
    return {
      sellLoadImg400: this.$store.state.sellLoadImg400,
      // 案源信息 (表单)
      causeSourceInfo: {
        demand_type_id: '', // 订单类型
        content: '', // 案件描述
        case_money: '', // 标的额
        is_lawyer_call_phone: false, // 是否允许律师回拨
        related_images: [], // 图片
        related_cloud_file_List: [], // 云盘文件
        imprisoned_address: '', // 关押地点
        detention_slip_image: '', // 拘留单图片
        addressee_nickname: '', // 收件人姓名
        addressee_mobiles: [], // 收件人号码数组
        addressee_address: '', // 收件人地址
        num: 1, // 订单数量
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

      // 案源类型 nav 信息
      causeSourceTypeInfo: {
        causeSourceTypeList: [], // 订单类型列表
        activePTypeIndex: 0, // 激活的父类型导航下标
        activeSTypeIndex: -1, // 激活的子类型导航下标
      },

      // 律师地区 popup 信息
      regionPopupInfo: {
        isShowRegionPopup: false, // 是否显示地区 popup
        regionList: [], // 律师地区列表
        activePRegionIndex: 0, // 激活的父区域 下标
        activeSRegionIndex: -1, // 激活的子区域 下标
      },

      // 分类 popup 信息
      categoryPopupInfo: {
        isShowCategoryPopup: false, // 是否显示分类 popup
        categoryPopupList: [], // 分类 popup 列表
        activePCategoryIndex: 0, // 激活的父分类 下标
        activeSCategoryIndex: -1, // 激活的子分类 下标
      },

      // 分类 select 信息
      categorySelectInfo: {
        isShowCategorySelect: false, // 是否显示分类 select
        categorySelectList: [], // 分类列表
      },

      // 收件人 popup 信息
      addresseePopupInfo: {
        isShowAddresseePopup: false, // 是否显示收件人 popup
        addressee_nickname: '', // 收件人姓名
        addressee_mobiles: [''], // 收件人号码数组
        addressee_address: '', // 收件人地址
      },
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),
    ...mapGetters('userModule', ['userId']),
    ...mapGetters(['sysSafeAreaHeight']),
  },
  created() {
    this._getCauseSourceTypeList();
    this._getLawyerRegionList();
    this._getCategoryList();

    // 监听云盘文件确定事件
    uni.$on('cloudFileConfirmEvt', data => {
      const { cloudFileList } = data;
      this.causeSourceInfo.related_cloud_file_List = cloudFileList;
    });
  },
  methods: {
    /**
     * 获取案源订单类型列表
     */
    async _getCauseSourceTypeList() {
      try {
        const { data: causeSourceTypeData } = await this.$api.getCauseSourceTypeList();
        this.causeSourceTypeInfo.causeSourceTypeList = causeSourceTypeData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取律师地区列表
     */
    async _getLawyerRegionList() {
      try {
        const { data: regionData } = await this.$api.getLawyerRegionList();
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

      this.causeSourceInfo.addressee_nickname = addresseePopupInfo.addressee_nickname.trim();
      this.causeSourceInfo.addressee_mobiles = addresseePopupInfo.addressee_mobiles;
      this.causeSourceInfo.addressee_address = addresseePopupInfo.addressee_address.trim();
      this.addresseePopupInfo.isShowAddresseePopup = false;
    },

    /**
     * 选择案源图片
     */
    async chooseCauseSourceImage() {
      const imageUrlList = await this._chooseImage(9 - this.causeSourceInfo.related_images.length);
      this.causeSourceInfo.related_images.push(...imageUrlList);
    },

    /**
     * 选择拘留单图片
     */
    async chooseDetentionImage() {
      if (this.causeSourceInfo.detention_slip_image) return;
      const imageUrlList = await this._chooseImage(1);
      this.causeSourceInfo.detention_slip_image = imageUrlList[0];
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
     * 切换案源 父类型导航
     */
    changePTypeNav(pTypeIndex) {
      this.causeSourceTypeInfo.activePTypeIndex = pTypeIndex;
      // 重置一些数据
      this.causeSourceTypeInfo.activeSTypeIndex = -1;
      this.causeSourceInfo.demand_type_id = '';
      this.causeSourceInfo.is_lawyer_call_phone = false;
      this.causeSourceInfo.category_info.category_id = '';
      this.causeSourceInfo.category_info.category = '';
      this.causeSourceInfo.category_info.isCustom = false;
    },

    /**
     * 选择案源 子类型
     */
    changeSTypeNav(sTypeIndex) {
      this.causeSourceTypeInfo.activeSTypeIndex = sTypeIndex;
      const causeSourceTypeId = this.causeSourceTypeInfo.causeSourceTypeList[this.causeSourceTypeInfo.activePTypeIndex].children[this.causeSourceTypeInfo.activeSTypeIndex].demand_type_id;
      this.causeSourceInfo.demand_type_id = causeSourceTypeId;

      // 重置分类数据
      this.causeSourceInfo.is_lawyer_call_phone = false;
      this.causeSourceInfo.category_info.category_id = '';
      this.causeSourceInfo.category_info.category = '';
      this.causeSourceInfo.category_info.isCustom = false;
    },
    /**
     * 改变侧边栏地区 导航选项
     */
    changeRegionPopupSideNav(regionPIndex) {
      this.regionPopupInfo.activePRegionIndex = regionPIndex;
      this.regionPopupInfo.activeSRegionIndex = -1;
    },
    /**
     * 选择 地区城市值
     */
    changeRegionCityPopupValue(regionSIndex) {
      this.regionPopupInfo.activeSRegionIndex = regionSIndex;
      const { regionPopupInfo } = this;
      const regionList = regionPopupInfo.regionList;
      // 确定城市
      const city = regionList[regionPopupInfo.activePRegionIndex].cities[regionPopupInfo.activeSRegionIndex];

      this.causeSourceInfo.lawyer_region_info.lawyer_province_id = city.province_id;
      this.causeSourceInfo.lawyer_region_info.lawyer_city_id = city.city_id;
      this.causeSourceInfo.lawyer_region_info.provinceName = city.province;
      this.causeSourceInfo.lawyer_region_info.cityName = city.name;

      this.regionPopupInfo.isShowRegionPopup = false;
    },
    /**
     * 打开选择分类 popup/select
     */
    openChooseCategoryPopup() {
      const { causeSourceTypeInfo, causeSourceInfo } = this;
      if (!causeSourceInfo.demand_type_id) return this.$u.toast('请先选择案源类型');
      const causeSourceTypeList = causeSourceTypeInfo.causeSourceTypeList;
      // 案源类型自带的 category
      const categories = causeSourceTypeList[causeSourceTypeInfo.activePTypeIndex].children[causeSourceTypeInfo.activeSTypeIndex].categories;

      if (categories.length) {
        this.categorySelectInfo.categorySelectList = categories;
        this.categorySelectInfo.isShowCategorySelect = true;
      } else {
        this.categoryPopupInfo.isShowCategoryPopup = true;
      }
    },
    /**
     * 确认服务订单类型
     */
    confirmCategorySelectEvt(event) {
      this.causeSourceInfo.category_info.category_id = event[0].value;
      // 自定义分类
      if (event[0].label === '自定义') {
        this.causeSourceInfo.category_info.category = '';
        this.causeSourceInfo.category_info.isCustom = true;
      } else {
        // 先重置自定义内容
        this.causeSourceInfo.category_info.isCustom = false;
        this.causeSourceInfo.category_info.category = '';

        this.causeSourceInfo.category_info.category = event[0].label;
      }
    },
    /**
     * 改变侧边栏分类 导航选项
     */
    changeCategoryPopupSideNav(categoryPIndex) {
      this.categoryPopupInfo.activePCategoryIndex = categoryPIndex;
      this.categoryPopupInfo.activeSCategoryIndex = -1;
    },
    /**
     * 选择 分类选项值
     */
    changeCategoryPopupValue(categorySIndex) {
      this.categoryPopupInfo.activeSCategoryIndex = categorySIndex;
      const { categoryPopupInfo } = this;
      const categoryPopupList = categoryPopupInfo.categoryPopupList;
      // 确定分类
      const category = categoryPopupList[categoryPopupInfo.activePCategoryIndex].lawyer_tags[categoryPopupInfo.activeSCategoryIndex];
      this.causeSourceInfo.category_info.category_id = category.lawyer_tag_id;
      this.causeSourceInfo.category_info.category = category.lawyer_tag;

      this.categoryPopupInfo.isShowCategoryPopup = false;
    },
    /**
     * 发布案源
     */
    async publishCauseSource() {
      if (!this.userId) return;
      const { causeSourceInfo } = this;

      if (!causeSourceInfo.demand_type_id) return this.$u.toast('请先选择订单类型');
      if (!causeSourceInfo.category_info.category_id) return this.$u.toast('请先选择涉及分类');
      if (!causeSourceInfo.category_info.category.trim()) return this.$u.toast('请输入自定义分类');
      if (!causeSourceInfo.lawyer_region_info.lawyer_city_id && !causeSourceInfo.lawyer_region_info.lawyer_province_id) return this.$u.toast('请选择律师地区');
      if (!causeSourceInfo.other_contact_info.name.trim()) return this.$u.toast('请输入联系人姓名');
      if (!causeSourceInfo.other_contact_info.mobile.trim()) return this.$u.toast('请输入联系人电话');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(causeSourceInfo.other_contact_info.mobile.trim()))) return this.$u.toast('请输入正确的手机号');

      const param = {
        demand_type_id: causeSourceInfo.demand_type_id, // 需求类型 id
        category_id: causeSourceInfo.category_info.category_id, // 分类 id
        category: causeSourceInfo.category_info.category, // 分类名称
        content: causeSourceInfo.content.trim(), // 案件描述
        lawyer_province_id: causeSourceInfo.lawyer_region_info.lawyer_province_id, // 律师省份 id
        lawyer_city_id: causeSourceInfo.lawyer_region_info.lawyer_city_id, // 律师城市 id
        case_money: causeSourceInfo.case_money.trim(), // 标的额
        addressee_nickname: causeSourceInfo.addressee_nickname.trim(), // 收件人姓名
        addressee_mobiles: JSON.stringify(causeSourceInfo.addressee_mobiles), // 收件人号码数组
        addressee_address: causeSourceInfo.addressee_address.trim(), // 收件人地址
        related_images: JSON.stringify(causeSourceInfo.related_images), // 图片
        related_cloud_file_ids: JSON.stringify(causeSourceInfo.related_cloud_file_List.map(itm => itm.cloud_file_id)), // 云盘文件 ids
        imprisoned_address: causeSourceInfo.imprisoned_address.trim(), // 关押地点
        detention_slip_image: causeSourceInfo.detention_slip_image, // 拘留单图片
        is_lawyer_call_phone: causeSourceInfo.is_lawyer_call_phone ? 1 : 0, // 是否允许律师回拨
        // 联系人信息
        other_contact: JSON.stringify({
          name: causeSourceInfo.other_contact_info.name.trim(),
          mobile: causeSourceInfo.other_contact_info.mobile.trim()
        }),
        num: causeSourceInfo.num, // 订单数量
      };
      // console.log(param);

      uni.showLoading({ title: '发布中', mask: true });

      try {
        // 若用户没有 openId 则获取一下 code 让后端解析保存
        if (!this.userInfo.is_set_wechat_openid) {
          const wxMpCode = await loginUtil.getWxMpCode();
          const data = await this.$api.getUserOpenId({ code: wxMpCode });
          loginUtil.fetchUserInfo();
        }

        // 创建支付订单
        const { data: resData } = await this.$api.createCauseSource(param);
        const { order_no, money_real } = resData;

        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrder({ type: 1, order_no: order_no });
        console.log(payParamData);

        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });

        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        if (payResult) {
          this.$Router.back();
          uni.$emit('toastEvt', { msg: '发布成功' }); // 触发全局的 toast 事件
        }
      } catch (error) {
        console.log(error);
      }
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
