<template>
  <view>
    中心
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'Center',
  data() {
    return {
    };
  },
  computed: {
    ...mapState([ 'systemInfo' ]),
    ...mapState('userModule', ['userInfo']),

    ...mapGetters([ 'sysSafeAreaHeight' ]),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad() {
  },
  onShow() {
    // 更新 tabbar 选中状态 1
    if (typeof this.$mp.page.getTabBar === 'function' && this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({ selected: 1 });
    }
  },
  methods: {
    ...mapActions('userModule', ['removeUserTokenAndUserInfoAction']),
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
