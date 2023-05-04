<template>
  <view>
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :border-bottom="false" title="屏蔽指定律师" :title-size="36" title-color="#333" title-bold />
    <!-- #endif -->

    <view class="header-module" :style="{ top: uNavbarHeight + 'px' }">
      <view class="search-input-wrap">
        <image class="icon-search" mode="aspectFill" src="../static/search.png" />
        <input v-model="searchKey" class="input"  cursor-spacing="30" placeholder="搜索" placeholder-style="color: #bbb; font-size: 30rpx;" @confirm="_getServedLawyerList()">
      </view>
      <view class="radio-title-wrap">
        <view class="radio-title">已服务过的律师</view>
        <view v-if="servedLawyerList.length" class="radio-wrap" @click="changeLawyerAllCheckedStatus">
          <image v-if="isCheckedAllLawyer" class="icon-radio" mode="aspectFill" src="@/static/common/radio-active.png" />
          <image v-else class="icon-radio" mode="aspectFill" src="@/static/common/radio-inactive.png" />
          <text style="color: #666;">全选</text>
        </view>
      </view>
    </view>

    <view class="served-lawyer-module">
      <view v-for="(lItem, lIndex) in servedLawyerList" :key="lIndex" class="served-lawyer-item" @click="changeLawyerItemCheckedStatus(lIndex)">
        <view class="lawyer-avatar">
          <u-lazy-load img-mode="aspectFill" height="140rpx" border-radius="20" :loading-img="bxLoadImg300" :error-img="bxLoadImg300" :image="lItem.avatar" />
        </view>
        <view class="lawyer-info">
          <view class="lawyer-name">
            <text>{{ lItem.nickname }}</text>
          </view>
          <view class="lawyer-work">
            <text>执业{{ lItem.work_year }}年</text>
            <text style="margin: 0 12rpx;">|</text>
            <text>{{ lItem.city }}</text>
          </view>
          <view class="lawyer-office">
            <text>{{ lItem.lawyer_office }}</text>
          </view>
        </view>
        <view class="lawyer-radio">
          <image v-if="lItem.isChecked" class="icon-radio" mode="aspectFill" src="@/static/common/radio-active.png" />
          <image v-else class="icon-radio" mode="aspectFill" src="@/static/common/radio-inactive.png" />
        </view>
      </view>
      <!-- 空数据 -->
      <view v-if="!isLoadingNextPage && !servedLawyerList.length" class="empty-wrap">
        <image style="width: 400rpx; height: 400rpx;" mode="aspectFill" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/kym_qsy_image.png" />
        <view class="empty-text">暂无服务过的律师</view>
      </view>
    </view>

    <view v-if="servedLawyerList.length" class="confirm-btn" @click="confirmCheckedLawyer">完成</view>
  </view>
</template>

<script>

export default {
  name: 'ExcludeLawyer',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      uNavbarHeight: 0, // 顶部导航栏高度 px
      lastExcludeLawyerList: [], // 上一次选中的律师列表

      servedLawyerList: [], // 服务过的律师列表
      servedLayerPage: 1, // 服务过律师 page
      servedLayerTotal: 0, // 服务过律师总数
      isLoadingNextPage: false, // 是否真正加载下一页

      isCheckedAllLawyer: false, // 是否全选

      searchKey: '', // 搜索关键字
    };
  },
  watch: {
    servedLawyerList: {
      deep: true,
      handler: function(newVal) {
        this.isCheckedAllLawyer = newVal.every(item => item.isChecked);
      }
    }
  },
  onLoad() {
    // 上次已选中的文件
    const eventChannel = this.getOpenerEventChannel();
    Object.keys(eventChannel).length && eventChannel.on('excludeLawyerEvt', data => {
      this.lastExcludeLawyerList = data.lastExcludeLawyerList;
      this._getServedLawyerList()
    });
  },
  onReachBottom() {
    const { servedLawyerList, servedLayerTotal } = this;
    if (servedLawyerList.length >= servedLayerTotal) return;
    // 加载下一页
    this._getServedLawyerList(++this.servedLayerPage);
  },
  async mounted() {
    this.uNavbarHeight = await this.$commonUtil.calcNodeHeight();
  },
  methods: {
    /**
     * 获取服务过的律师列表
     */
    async _getServedLawyerList(page = 1) {
      if (this.isLoadingNextPage === true) return;
      this.isLoadingNextPage = true;

      if (page === 1) {
        uni.showLoading({ title: '加载中', mask: true });
        this.servedLayerPage = 1;
        this.servedLawyerList = [];
      }
      const param = { page };
      // 添加搜索关键字
      this.searchKey.trim() && (param.search = this.searchKey.trim());

      try {
        const { data: servedLawyerData } = await this.$api.getServedLawyerApi(param);
        const servedLawyerItems = servedLawyerData.data.map(item => {
          item.isChecked = false;
          item.isChecked = this.lastExcludeLawyerList.map(itm => itm.user_id).includes(item.user_id);
          return item;
        });
        
        this.servedLawyerList.push(...servedLawyerItems);
        this.servedLayerTotal = servedLawyerData.total
        this.isLoadingNextPage = false;
      } catch (error) {
        this.isLoadingNextPage = false;
        console.log(error);
      }
    },
    /**
     * 改变律师单项选中状态
     */
    changeLawyerItemCheckedStatus(lIndex) {
      this.servedLawyerList[lIndex].isChecked = !this.servedLawyerList[lIndex].isChecked;
    },
    /**
     * 改变律师全部选中状态
     */
    changeLawyerAllCheckedStatus() {
      const { servedLawyerList } = this;
      // 取消全选
      if (servedLawyerList.every(item => item.isChecked)) {
        this.servedLawyerList.forEach((value, index) => {
          this.servedLawyerList[index].isChecked = false;
        });
      // 全选
      } else {
        this.servedLawyerList.forEach((value, index) => {
          this.servedLawyerList[index].isChecked = true;
        });
      }
    },
    /**
     * 确认选中的律师
     */
    confirmCheckedLawyer() {
      const { servedLawyerList } = this;
      const filterLawyerList = servedLawyerList.filter(item => item.isChecked);
      
      this.$commonUtil.backPage();
      // 触发 屏蔽律师确定 事件
      uni.$emit('excludeLawyerConfirmEvt', { confirmExcludeLawyerList: filterLawyerList });
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
