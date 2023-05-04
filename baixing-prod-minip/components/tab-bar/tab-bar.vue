<template>
	<view class="tab-bar" :style="{ paddingBottom: sysSafeAreaHeight + 'px' }">
    <view class="tab-bar-wrap">
      <template v-for="(tItem, tIndex) in tabbarList">
        <view v-if="tItem.isSpecial" :key="tIndex" class="tab-bar-item" @click="switchTab(tItem, tIndex)">
          <image class="special-image" mode="aspectFit" :src="selected === tIndex ? tItem.selectedIconPath : tItem.iconPath"></image>
        </view>

        <view wx:else :key="tIndex" class="tab-bar-item" @click="switchTab(tItem, tIndex)">
          <image class="tab-bar-icon" mode="aspectFit" :src="selected === tIndex ? tItem.selectedIconPath : tItem.iconPath"></image>
          <view class="tab-text" :style="{ color: selected === tIndex ? selectedColor : color }">{{ tItem.text }}</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'tabBar',
  props:{
    selected: { type: Number, default: 0 }
  },
  data() {
    return {
      color: '#666',
      selectedColor: '#0085FF',
      tabbarList: [
        {
          pagePath: '/pages/tabbar/index/index',
          text: '首页',
          iconPath: '/static/tabbar/home.png',
          selectedIconPath: '/static/tabbar/home-active.png'
        },
        {
          pagePath: '/pages/tabbar/find/find',
          text: '找律师',
          iconPath: '/static/tabbar/find.png',
          selectedIconPath: '/static/tabbar/find-active.png'
        },
        {
          pagePath: '/pages/tabbar/center/center',
          text: '',
          iconPath: '/static/tabbar/law-center.png',
          selectedIconPath: '/static/tabbar/law-center.png',
          isSpecial: true,
        },
        {
          pagePath: '/pages/tabbar/msg/msg',
          text: '消息',
          iconPath: '/static/tabbar/msg.png',
          selectedIconPath: '/static/tabbar/msg-active.png'
        },
        {
          pagePath: '/pages/tabbar/profile/profile',
          text: '我的',
          iconPath: '/static/tabbar/profile.png',
          selectedIconPath: '/static/tabbar/profile-active.png'
        }
      ],
    }
  },
  computed: {
    ...mapGetters([ 'sysSafeAreaHeight' ]),
  },
  methods: {
    /**
     * 切换 tabbar
     */
    switchTab(tabItem, tabIndex) {
      if(tabIndex == this.selected) {
        uni.$emit("topstatus",false);
        uni.pageScrollTo({ scrollTop: 0, duration: 0 });
        return;
      };

      uni.switchTab({ url: tabItem.pagePath });
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
