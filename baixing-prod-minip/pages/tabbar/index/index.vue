<template>
  <view>
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false">
      <view class="navbar-slot" style="padding: 0 20rpx;" :style="{ 'paddingRight': menuButtonRect ? menuButtonRect.width + 20 + 'px' : '10px' }">
        <template v-if="tabModuleIsSticky">
          <view class="search-module">
            <!-- <image style="width: 20rpx; height: 24rpx;" mode="aspectFill" src="@/static/index/icon-home-loc.png" @click="$refs.regionPopupRef._openRegionPopup()" />
            <text class="loc-city" @click="$refs.regionPopupRef._openRegionPopup()">{{ lo;cRegion.cityName }}</text>
            <text class="divide-line">|</text> -->
            <view class="search-box" @click="navToMenuPage('/pagesV1/common/search?search_placeholder=搜索')">
              <image style="width: 28rpx; height: 28rpx;" mode="aspectFill" src="@/static/index/icon-home-search.png" />
              <text class="search-text">搜律师、搜问答</text>
            </view>
          </view>
          <view class="free-btn" @click="openFastPubPhonePopup">免费咨询</view>
        </template>

        <image v-else style="width: 476rpx; height: 36rpx;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221226-1672043350355-Y9N3Xe.png" />
      </view>
    </u-navbar>
    <!-- #endif -->
    
    <view class="header-module">
      <view class="header-main">
        <!-- 图文咨询 -->
        <view class="main-item" @click="navToMenuPage('/pages/module-dynamic/dynamic-create/dynamic-create')">
          <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/dynamic-zixun.png" />
          <view class="main-title">图文咨询</view>
          <text class="main-subtitle">免费法律服务</text>
        </view>

        <!-- 企业法务 -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="userInfo.sales_affair && userInfo.sales_affair.user_id" class="main-item" @click="navToMenuPage('/pages/module-common/vip-enterprise-serve-sell/vip-enterprise-serve-sell')">
          <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/enterprise-fawu.png" />
          <view class="main-title">企业法务</view>
          <text class="main-subtitle">规范企业经营</text>
        </view>
        <view v-else class="main-item" @click="navToMenuPage('/pages/module-common/vip-enterprise-serve/vip-enterprise-serve')">
          <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/enterprise-fawu.png" />
          <view class="main-title">企业法务</view>
          <text class="main-subtitle">规范企业经营</text>
        </view>
        <!-- #endif -->

        <!-- #ifndef MP-WEIXIN -->
        <view class="main-item" @click="navToMenuPage('/pages/module-common/vip-enterprise-serve/vip-enterprise-serve')">
          <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/enterprise-fawu.png" />
          <view class="main-title">企业法务</view>
          <text class="main-subtitle">规范企业经营</text>
        </view>
        <!-- #endif -->

        <!-- 电话咨询 -->
        <view class="main-item" @click="openFastPubPhonePopup">
          <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/phone-zixun.png" />
          <view class="main-title">电话咨询</view>
          <text class="main-subtitle">律师回电解答</text>
          <view class="free-tag">免费</view>
        </view>
      </view>

      <!-- 头部 banner 广告位 -->
       <view v-if="headerAdvertSeat.length" class="advert-banner-wrap">
        <swiper autoplay interval="5000" style="width: 100%; height: 100%;">
          <swiper-item v-for="(aItem, aIndex) in [headerAdvertSeat[0]]" :key="aIndex" @click="navToLawyerDetail(aItem.user_info.user_id)">
            <image style="width: 100%; height: 100%; border-radius: 20rpx;" mode="aspectFill" :src="aItem.banner" />
          </swiper-item>
        </swiper>
      </view>
      
      <!-- <view class="header-menu">
        <view class="menu-item" @click="navToMenuPage('/pagesV1/common/webview?color=#4a75ff&url=' + encodeURIComponent('https://h5.lawkd.com/register?type=1'))">
          <image style="width: 48rpx; height: 48rpx; margin-bottom: 12rpx;" mode="aspectFill" src="@/static/index/icon-lawyer-auth.png" />
          <text>律师认证</text>
        </view>
        <view class="menu-item" @click="navToOfficialCustomer">
          <image style="width: 48rpx; height: 48rpx; margin-bottom: 12rpx;" mode="aspectFill" src="@/static/index/icon-rengong-kefu.png" />
          <text>人工客服</text>
        </view>
        <view class="menu-item" @click="navToMenuPage('/pages/module-common/entrust-lawsuit/entrust-lawsuit')">
          <image style="width: 48rpx; height: 48rpx; margin-bottom: 12rpx;" mode="aspectFill" src="@/static/index/icon-weituo-lawsuit.png" />
          <text>委托打官司</text>
        </view>
        <label for="shareBtnId">
          <view class="menu-item">
            <image style="width: 48rpx; height: 48rpx; margin-bottom: 12rpx;" mode="aspectFill" src="@/static/index/icon-public-share.png" />
            <text>公益分享</text>
          </view>
        </label>
      </view> -->
    </view>

    <view class="dynamic-tab-module" :style="{ top: uNavbarHeight + 'px' }">
      <!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
      <view v-if="tabNavInfo.tabNavList.length" class="tab-wrap">
        <u-tabs style="flex: 1;" :list="tabNavInfo.tabNavList" :current="tabNavInfo.tabNavActiveIndex" name="lawyer_tag" inactive-color="#999" active-color="#333" font-size="32" height="50" gutter="16" :active-item-style="{ fontSize: '40rpx', fontWeight: 500 }" :bar-style="{ backgroundColor: '#333', marginBottom: '-8rpx' }" @change="onDynTabNavChangeEvt" />
      </view>
      <!-- #endif -->
      <!-- #ifdef MP-KUAISHOU -->
      <view class="tab-wrap">
        <u-tabs style="flex: 1;" :list="tabNavInfo.tabNavList" :current="tabNavInfo.tabNavActiveIndex" name="lawyer_tag" inactive-color="#999" active-color="#333" font-size="32" height="50" gutter="16" :active-item-style="{ fontSize: '40rpx', fontWeight: 500 }" :bar-style="{ backgroundColor: '#333', marginBottom: '-8rpx' }" @change="onDynTabNavChangeEvt" />
      </view>
      <!-- #endif -->
      <view class="menu-btn" @click="openEditNavTabTagPopup" >
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="@/static/index/dynamic-tab-menu.png" />
      </view>
    </view>

    <view class="dynamic-swiper-module" :style="{ height: (sysScreenHeight - uNavbarHeight - 22) + 'px' }">
      <swiper class="dynamic-swiper" :current="tabNavInfo.tabNavActiveIndex" @change="onDynamicSwiperChangeEvt">
        <swiper-item class="dynamic-swiper-item" v-for="(sItem, sIndex) in tabNavInfo.tabNavList" :key="sIndex">
          <scroll-view class="dynamic-scroll-view" :scroll-y="tabModuleIsSticky" upper-threshold="0" @scrolltoupper="onDynamicScrollToTopEvt" @scrolltolower="onDynamicScrollToBottomEvt">
            <view class="dynamic-item" v-for="(dItem, dIndex) in tabDataInfo['data'+ sIndex]" :key="dIndex">
              <view class="dynamic-item-wrap">
                <!-- 动态头部 -->
                <view class="dynamic-header" @click.stop="navToUserDetail(dItem.user_id, dItem.type)">
                  <view class="user-avatar">
                    <u-lazy-load img-mode="aspectFill" height="72" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="dItem.avatar" />
                  </view>
                  <view class="user-info">
                    <view class="user-name">
                      <text>{{ dItem.nickname }}</text>
                    </view>
                    <view class="dynamic-loc">
                      <text>{{ dItem.created_at }}</text>
                      <text v-if="dItem.city">·{{ dItem.city }}</text>
                    </view>
                  </view>
                </view>
                <!-- 动态内容 -->
                <view class="dynamic-body" @click="navToDynamicDetail(dItem.question_id)">
                  <text class="dynamic-tag" style="color: #457DB3; margin-right: 8rpx;">#{{ dItem.lawyer_tag }}</text>
                  <text v-if="dItem.shortContent && !dItem.isShowMoreContent">{{ dItem.shortContent }}</text>
                  <text v-else>{{ dItem.title }}</text>
                  <text v-if="dItem.shortContent" class="more-btn" @click.stop="changeDynamicMoreContent(dIndex)">{{ dItem.isShowMoreContent ? '收起' : '全文' }}</text>
                </view>
                <view class="dynamic-images">
                  <view class="dynamic-image" v-for="(iItem, iIndex) in dItem.question_images_thumbnail.slice(0, 3)" :key="iIndex" @click.stop="$commonUtil.previewImg(dItem.question_images_thumbnail, iItem)">
                    <u-lazy-load img-mode="aspectFill" height="208" border-radius="10" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="iItem" />
                    <view v-if="dItem.question_images_thumbnail.length > 3 && iIndex === 2" class="image-tag">+{{ dItem.question_images_thumbnail.length }}</view>
                  </view>
                </view>
                <!-- 动态脚部 -->
                <view class="dynamic-footer">
                  <label for="shareBtnId">
                    <view class="footer-item">
                      <image style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-share.png" />
                      <text>分享</text>
                    </view>
                  </label>
                  <view class="footer-item" @click="navToDynamicDetail(dItem.question_id)">
                    <image style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-comment.png" />
                    <text>{{ dItem.comment_number || '评论' }}</text>
                  </view>
                  <view class="footer-item" style="margin-right: 0;" @click.stop="postDynamicLike(dItem, dIndex)">
                    <image v-if="dItem.is_like" style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-like.png" />
                    <image v-else style="width: 36rpx; height: 36rpx; margin-right: 12rpx;" mode="aspectFill" src="@/static/common/icon-unlike.png" />
                    <text :style="{ color: dItem.is_like ? '#0085FF' : '#999' }">{{ dItem.like_number || '点赞' }}</text>
                  </view>
                </view>
              </view>

              <!-- 律师广告位 -->
              <!-- <template v-if="dIndex === 4 && lawyerAdvertDataInfo['data'+ sIndex].length"> -->
              <template v-if="dIndex !== 0 && dIndex % 5 === 0 && lawyerAdvertDataInfo['data'+ sIndex].length">
                <view class="advert-module">
                  <view class="advert-header">
                    <image class="advert-header-icon" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023328-1679992708152-666Cj8.png" />
                    <view>律师推荐</view>
                  </view>
                  <scroll-view class="scroll-x recommend-scroll-x" scroll-x enhanced :show-scrollbar="false" :scroll-into-view="scrollXIntoViewId" lower-threshold="10">
                    <view v-for="(rItem, rIndex) in lawyerAdvertDataInfo['data'+ sIndex]" :key="rIndex" class="scroll-x-item">
                      <view class="recommend-item-wrap" @click="navToLawyerDetail(rItem.user_info.user_id)">
                        <view class="lawyer-avatar">
                          <u-lazy-load img-mode="aspectFill" height="120" border-radius="20" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="rItem.user_info.avatar" />
                        </view>
                        <view class="lawyer-nickname">
                          <span>{{ rItem.user_info.nickname }}</span>
                          <view v-if="rItem.user_info.is_guarantee" class="youxuan-tag">优</view>
                        </view>
                        <view v-if="userId" class="lawyer-loc">距您{{ rItem.user_info.location_distance }}km</view>
                      </view>
                    </view>
                  </scroll-view>
                </view>
                <view class="division-line" />
              </template>
            </view>

            <!-- 底部占位块 -->
            <view v-if="tabDataInfo['data'+ sIndex].length" :style="{ height: (sysSafeAreaHeight + 50) + 'px' }" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 我的频道 -->
		<u-popup v-model="menuConfigPop" mode="bottom" border-radius="30" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
			<view class="menuConfig">
				<u-icon class="menuTitleClose" name="close" color="#333" size="30" @click="menuConfigPop = false" />

				<view class="menuTitle flex hcenter between">
					<view class="">
						我的频道
						<text style="color: #999">{{ menuEdit ? '长按拖拽可以排序':'点击进入频道'}}</text>
					</view>
					<text style="color: #0085FF" @click="clickMenuEdit">{{ menuEdit ? '完成' : '编辑' }}</text>
				</view>
				<drag-sorts :isEdit="menuEdit" :list="questionTag.default" :props="{ label: 'lawyer_tag'}" @delete="onRemoveTabTagEvt" />

				<view class="menuTitle" style="padding-top: 30rpx;">
					推荐频道
          <text style="color: #999">点击编辑添加频道</text>
				</view>

				<drag-sorts :onlyClose="true" :isEdit="menuEdit" :list="questionTag.not_selected" :props="{ label:'lawyer_tag'}" @delete="onSelectTabTagEvt" />
			</view>
		</u-popup>

    <!-- 分享使用 -->
    <button id="shareBtnId" open-type="share" style="display: none;" />
    <!-- 快速发布电话咨询 popup -->
    <fast-pubPhone-popup ref="fastPubPhonePopupRef" />
    <!-- 地区 popup -->
    <region-popup ref="regionPopupRef" :isAutoGetCurLoc="false" @confirmCityEvt="onRegionPopupConfirmEvt" />

    <!-- 电话咨询指南 module -->
    <view v-if="isShowPostDynGuidePopup" class="phoneOrder-guide-module">
      <view class="phoneOrder-guide-wrap" :style="{ marginTop: uNavbarHeight + 'px' }">
        <view class="header-main">
          <view class="main-item" style="background: transparent;" />
          <view class="main-item" style="background: transparent;" />
          <view class="main-item">
            <image style="width: 72rpx; height: 72rpx;" mode="aspectFill" src="@/static/index/phone-zixun.png" />
            <view class="main-title">电话咨询</view>
            <text class="main-subtitle">律师回电解答</text>
            <view class="free-tag">免费</view>
          </view>
        </view>
        <view class="tip-main">
          <image style="width: 589rpx; height: 316rpx;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023220-1676877928944-G0KENP.png" />
          <view class="tip-btn" @click="closePhoneOrderGuidePopup">知道了</view>
        </view>
      </view>
    </view>

    <!-- 电话咨询导航按钮 -->
    <view v-if="tabModuleIsSticky" class="pubNav-btn" :style="{ bottom: sysSafeAreaHeight + 50 + 100 + 'px' }" @click="openFastPubPhonePopup">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202336-1678066888494-7n2RfM.png" />
    </view>

    <!-- 刷新按钮 -->
    <view class="refresh-btn" :style="{ bottom: sysSafeAreaHeight + 50 + 30 + 'px' }" @click="refreshDynamicDataList">
      <image style="width: 100%; height: 100%;" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202334-1677916226548-thWZi1.png" />
    </view>

    <tab-bar :selected="0" />
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import dragSorts from '@/components/drag-sorts/index.vue'
import * as $api from '@/api/apis.js'

let initTabIndex = 0;
// #ifdef MP-WEIXIN || MP-TOUTIAO
initTabIndex = 1
// #endif

export default {
  name: 'IndexPage',
  components: { dragSorts },
  data() {
    return {
      isShowPostDynGuidePopup: false, // 是否显示发帖指南 popup
      menuButtonRect: null, // 右上角胶囊按钮信息

      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px
      tabModuleTop: 0, // tab module 距离顶部 px
      tabModuleIsSticky: false, // tab module 是否吸顶
      officialCustomer: {}, // 官方客服信息

      // 定位地区
      locRegion: {
        loc_province_id: 0, // 省份 id
        loc_city_id: 0, // 城市 id
        provinceName: '全国', // 省名称
        cityName: '全国', // 市名称
      },

      tabNavInfo: {
				tabNavList: [], // tab 导航数据列表
				tabNavActiveIndex: initTabIndex,
				tabDataPagList: [], // tab data 页码数据
			},

      tabDataInfo: {},
      lawyerAdvertDataInfo: {}, // 律师广告信息
      isNextLoading: false, // 是否正在加载下一页数据

      menuEdit: false,
      menuConfigPop: false,
      questionTag: null,

      headerAdvertSeat: [], // 头部广告位
    }
  },
  computed: {
    ...mapState('userModule', ['userInfo', 'readPostDynGuide']),

    ...mapGetters([ 'sysScreenHeight', 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
    this._getOfficialCustomer();
    this._getDynamicTabTagList();
    this._getIndexHeaderAdvertData();
    // this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();

    // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
    // #ifndef MP-WEIXIN
    const menuButtonRect = uni.getMenuButtonBoundingClientRect();
    this.menuButtonRect = menuButtonRect;
    // #endif
  },
  onShow() {
		// #ifndef MP-WEIXIN
		uni.hideTabBar()
		// #endif
	},
  onPullDownRefresh() {
    const _tabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
    this._getDynamicDataList(_tabTagId);
  },
  mounted() {
    this.$commonUtil.calcNodeHeight().then(res => {
      this.uNavbarHeight = res;

      // 第一次打开应用 未展示过发帖指南 则显示指南 popup
      // #ifndef MP-KUAISHOU
      (!this.readPostDynGuide) && (this.isShowPostDynGuidePopup = true);
      // #endif
    });

    // tab module 节点距离顶部距离 (px)
    const tabModuleNodeRef = uni.createSelectorQuery().select('.dynamic-tab-module');
    tabModuleNodeRef.boundingClientRect(rect => {
      this.tabModuleTop = rect.top;
    }).exec();

    // #ifdef MP-KUAISHOU
    setTimeout(() => {
      const headerModuleNodeRef = uni.createSelectorQuery().in(this).select('.u-navbar');
      headerModuleNodeRef.boundingClientRect(rect => {
        this.uNavbarHeight = rect.bottom;

        // 第一次打开应用 未展示过发帖指南 则显示指南 popup
        (!this.readPostDynGuide) && (this.isShowPostDynGuidePopup = true);
      }).exec();
    }, 1000);
    // #endif
  },
  onPageScroll(event) {
    // 判断 tab 导航是否吸顶
    this.tabModuleIsSticky = this.tabModuleTop - event.scrollTop <= this.uNavbarHeight ? true : false;
	},
  onShareAppMessage() {
		let shareTitle = '公益法律咨询';
    const currentRoute = this.$commonUtil.getCurrentRoute();

		return {
			title: shareTitle,
			path: `${ currentRoute }`,
			imageUrl: 'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png'
		}
	},
  methods: {
    ...mapActions('userModule', ['setReadPostDynGuideAction']),
    /**
     * 刷新 tab data list
     */
    refreshDynamicDataList() {
      // 先清空数组
      this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`] = [];
      uni.pageScrollTo({ scrollTop: 0, duration: 500 });
      const _tabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
      this._getDynamicDataList(_tabTagId);
    },
    /**
     * 获取官方客服信息
     */
    async _getOfficialCustomer() {
      try {
        const { data: officialCustomerData } = await this.$api.getOfficialCustomerApi();
        this.officialCustomer = officialCustomerData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取查找律师头部 广告
     */
    async _getIndexHeaderAdvertData() {
      const param = { user_id: this.userId, lawyer_tag_id: 0 };
      try {
        const { data: lawyerAdvertSeatData } = await this.$api.getLawyerAdvertSeatData(param);
        const advertSeatId = 1; // 首页头部位置 id
        const lawyerAdvertSeat = lawyerAdvertSeatData.find(item => item.advertisement_position_id == advertSeatId);
        if (lawyerAdvertSeat && lawyerAdvertSeat.advertisement.length) {
          this.headerAdvertSeat = lawyerAdvertSeat.advertisement;
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取动态 tab 标签导航列表
     */
    async _getDynamicTabTagList() {
      const param = { is_have_hot: 1 };
      try {
        const { data: tabTagData } = await this.$api.getDynamicTabTagListApi(param);
        this.tabNavInfo.tabNavList = [ { lawyer_tag_id: 0, lawyer_tag: '最新' }, ...tabTagData];
        // #ifdef MP-KUAISHOU
        this.tabNavInfo.tabNavList.shift();
        this.tabNavInfo.tabNavList.splice(1, 0, { lawyer_tag_id: 0, lawyer_tag: '最新' });
        // #endif
        this.tabNavInfo.tabNavList.forEach((item, index) => {
          this.tabNavInfo.tabDataPagList.push(0); // 初始化 tab data 页码数据
          this.$set(this.tabDataInfo, `data${ index }`, []); // 初始化 tab data 数据
          // 初始化 tab广告 data 数据
          this.$set(this.lawyerAdvertDataInfo, `data${ index }`, []);
        });

        // 第一个 tab 标签 id
        const _firstTabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
        this._getDynamicDataList(_firstTabTagId)
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 获取动态列表
     */
    async _getDynamicDataList(tagId, page = 1) {
      const param = { type: 0, lawyer_tag_id: tagId, city_id: this.locRegion.loc_city_id, page };
      // 最新tabnav 下标
      let newTabNavIndex = 0;
      // #ifdef MP-KUAISHOU
      newTabNavIndex = 1;
      // #endif

      // 获取最新动态 需添加如下参数
      if (this.tabNavInfo.tabNavActiveIndex === newTabNavIndex) {
        param.type = 1;
        param.question_id = 0;
        param.latest_timestamp = 0;
        if (page > 1) {
          // 最新发帖则需要传上一页数据的最后一个 question_id
          param.question_id = this.tabDataInfo[`data${ newTabNavIndex }`][this.tabDataInfo[`data${ newTabNavIndex }`].length - 1].question_id;
          // 最新发帖则需要传上一页数据的最后一个 latest_timestamp
          param.latest_timestamp = this.tabDataInfo[`data${ newTabNavIndex }`][this.tabDataInfo[`data${ newTabNavIndex }`].length - 1].latest_timestamp;
        }
      }

      if (this.isNextLoading) return;
      this.isNextLoading = true;

      page === 1 && uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: dynamicData } = await this.$api.getDynamicDataListApi(param);
        if (dynamicData.length) {
          // 若请求到数据 page + 1
          this.tabNavInfo.tabDataPagList[this.tabNavInfo.tabNavActiveIndex] += 1;

          const dynamicItems = dynamicData.map(item => {
            item.isShowMoreContent = false; // 是否展示更多内容
            item.shortContent = ''; // 概要内容
            if (item.title.length > 80) {
              item.shortContent = item.title.substr(0, 80) + '...';
            }
            return item;
          });
          // 首页先清空数组
          page === 1 && (this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`] = []);
          this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`].push(...dynamicItems);
          uni.stopPullDownRefresh();
          // 获取帖子列表 广告
          this._getDynamicListAdvertData(tagId)
        } else {
          this.$u.toast('没有更多数据了');
        }
        
        this.isNextLoading = false;
      } catch (error) {
        this.isNextLoading = false;
        console.log(error);
      }
    },
    /**
     * 获取帖子列表 广告
     */
    async _getDynamicListAdvertData(lawyerTagId) {
      const param = { user_id: this.userId, lawyer_tag_id: lawyerTagId === 0 ? 19 : lawyerTagId };
      try {
        const { data: lawyerAdvertSeatData } = await this.$api.getLawyerAdvertSeatData(param);
        const advertSeatId = 2; // 首页帖子位置 id
        const lawyerAdvertSeat = lawyerAdvertSeatData.find(item => item.advertisement_position_id == advertSeatId);
        if (lawyerAdvertSeat && lawyerAdvertSeat.advertisement.length) {
          this.lawyerAdvertDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`] = lawyerAdvertSeat.advertisement;
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * 监听动态 tab change事件
     */
    onDynTabNavChangeEvt(tabIndex) {
      this.tabNavInfo.tabNavActiveIndex = tabIndex;
    },

    /**
     * 监听动态 tab change事件
     */
    onDynamicSwiperChangeEvt(event) {
      this.tabNavInfo.tabNavActiveIndex = event.detail.current;
      if (this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`].length)return;

      // 激活的 tab标签 id
      const _curTabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
      this._getDynamicDataList(_curTabTagId);
    },

    /**
     * 监听动态 scrollView 滚动到顶部事件
     */
    onDynamicScrollToTopEvt() {
      // #ifdef MP-KUAISHOU
      this.tabModuleIsSticky = false;
      // #endif
    },

    /**
     * 监听动态 scrollView 滚动到底部事件
     */
    onDynamicScrollToBottomEvt() {
      const _curTabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
      // 当前 tab 页码
      let _page = this.tabNavInfo.tabDataPagList[this.tabNavInfo.tabNavActiveIndex];
      this._getDynamicDataList(_curTabTagId, ++_page);
    },

    /**
     * 展开/收起 动态更多内容
     */
    changeDynamicMoreContent(dIndex) {
      this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dIndex].isShowMoreContent = !this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dIndex].isShowMoreContent;
    },

    /**
     * 导航进入动态详情
     */
    navToDynamicDetail(dynamicId) {
			// uni.navigateTo({ url: `/pagesV1/index/askDetails?id=${ dynamicId }` });
			uni.navigateTo({ url: `/pages/module-dynamic/dynamic-detail/dynamic-detail?dynamicId=${ dynamicId }` });
		},

    /**
     * 前往用户主页
     */
    navToUserDetail(userId, type) {
			uni.navigateTo({ url: type == 0 ? `/my/client/heLookPage?id=${ userId }` : `/pagesV1/index/lawyerPage?id=${ userId }` });
		},

    /**
     * 动态点赞/取消点赞
     */
    async postDynamicLike(dynamicItem, dynamicIndex) {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      
      const dynamicId = dynamicItem.question_id;
      const dynamicIsLiked = dynamicItem.is_like;
      const param = { type: 3, source_id: dynamicId };
      uni.showLoading({ title: '', mask: true });
      
      try {
        // 取消点赞
        if (dynamicIsLiked) {
          const { data: unLikeData } = await this.$api.postDynamicUnLikeApi(param);
          this.$u.toast('取消成功');
          this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dynamicIndex].is_like = 0;
          this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dynamicIndex].like_number -= 1;
        // 点赞
        } else {
          const { data: likeData } = await this.$api.postDynamicLikeApi(param);
          this.$u.toast('点赞成功');
          this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dynamicIndex].is_like = 1;
          this.tabDataInfo[`data${ this.tabNavInfo.tabNavActiveIndex }`][dynamicIndex].like_number += 1;
        }
      } catch(error) {
        console.log(error);
      }
    },

    /**
		 * 导航进入菜单页面
		 */
		navToMenuPage(pagePath) {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
			uni.navigateTo({ url: pagePath });
		},

    /**
		 * 导航进入人工客服
		 */
		navToOfficialCustomer() {
			if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });

      // #ifndef MP-WEIXIN
        uni.makePhoneCall({ phoneNumber: '400-600-5030' });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({ url: `/pagesV1/info/infoDetails?id=${ this.officialCustomer.user_id }&name=${ this.officialCustomer.nickname }` })
      // #endif
		},

    /**
     * 打开快速发布电话咨询弹框
     */
    openFastPubPhonePopup() {
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();
    },

    /**
     * 监听地区 popup 组件 确定城市 evt
     */
    onRegionPopupConfirmEvt(cityData) {
      this.locRegion.loc_province_id = cityData.province_id;
      this.locRegion.loc_city_id = cityData.city_id;
      this.locRegion.provinceName = cityData.province;
      this.locRegion.cityName = cityData.city;

      // 重新拉取数据
      const _curTabTagId = this.tabNavInfo.tabNavList[this.tabNavInfo.tabNavActiveIndex].lawyer_tag_id;
      this._getDynamicDataList(_curTabTagId);
    },

    /**
     * 打开编辑导航 tab标签
     */
    openEditNavTabTagPopup() {
			console.log(this.questionTag)
			if (!this.questionTag) {
				$api.getQuestionTagSet().then(res=>{
					this.questionTag = res.data.data
					this.questionTag.default = this.questionTag.default.concat(this.questionTag.selected)
					this.menuConfigPop = true
				})
			} else {
				this.menuConfigPop = true
			}
		},

    /**
     * 监听移除导航 tab标签 事件
     */
    onRemoveTabTagEvt(tagItem, tagIndex) {
			console.log(tagItem,tagIndex)
			this.questionTag.default.splice(tagIndex, 1);
			this.questionTag.not_selected.push(tagItem);
		},
    /**
     * 监听选择导航 tab标签 事件
     */
		onSelectTabTagEvt(tagItem,tagIndex){
			console.log(tagItem,tagIndex);
			this.questionTag.default.push(tagItem);
			this.questionTag.not_selected.splice(tagIndex, 1);
		},

    /**
     * 更新/编辑 导航 tab标签
     */
    clickMenuEdit() {
			this.menuEdit = !this.menuEdit
			if(!this.menuEdit) {
				this.confirmUpdateNavTabTag()
			}
		},
    /**
     * 确定更新导航 tab标签
     */
    confirmUpdateNavTabTag() {
      uni.showLoading({ title: '更新中', mask: true });
      
			let list = JSON.parse(JSON.stringify(this.questionTag.default))
      // 标签排序
			list.sort((a, b) => (a.SortNumber - b.SortNumber));

			for (let i in list) {
				list[i] = list[i].lawyer_tag_id
			}

			$api.putQuestionTagSet({ lawyer_tag_ids: JSON.stringify(list) }).then(res => {
        this.menuConfigPop = false;
        uni.hideLoading();

				this.tabNavInfo.tabNavActiveIndex = 0;
        this._getDynamicTabTagList();
			});
		},

    /**
		 * 关闭电话咨询订单 popup
		 */
		closePhoneOrderGuidePopup() {
			this.isShowPostDynGuidePopup = false;
			this.setReadPostDynGuideAction(1); // 存入 storage
      this.$refs.fastPubPhonePopupRef._openFastPubPhonePopup();
		},

    /**
     * 前往用户主页
     */
    navToLawyerDetail(userId) {
			uni.navigateTo({ url: `/pagesV1/index/lawyerPage?id=${ userId }` });
		},
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
