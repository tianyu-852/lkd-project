<template>
  <el-menu class="app-header" mode="horizontal">
    <section class="header-left">
      <!-- 折叠按钮 -->
      <div class="collapse-icon" @click="changeCollapseSlide">
        <i v-if="!isCollapseSide" class="el-icon-s-fold" />
        <i v-else class="el-icon-s-unfold" />
      </div>
    </section>

    <section class="header-right">
      <!-- 全屏 icon -->
      <div class="fullscreen-btn" @click="handleFullScreen">
        <el-tooltip :content="fullscreen ? '取消全屏': '全屏'" placement="bottom">
          <i class="el-icon-rank" style="font-size: 24px;" />
        </el-tooltip>
      </div>
      <!-- 用户信息 -->
      <div v-show="Object.keys(userInfo).length" class="account-wrap">
        <el-dropdown @command="handleCommand">
          <div class="el-dropdown-link">
            <el-avatar shape="square" :size="30" style="margin-right: 6px;" :src="userInfo.avatar || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" />
            <span>{{ userInfo.name }}</span>
            <i class="el-icon-arrow-down" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </section>
  </el-menu>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      fullscreen: false
    };
  },
  computed: {
    ...mapState([ 'isCollapseSide' ]), // 是否折叠侧边栏
    ...mapState('userModule', ['userInfo']),
    // breadcrumbs() {
    //   let matched = this.$route.matched.map(item => {
    //     const { name, path, meta } = item;
    //     return { name, path, meta };
    //   }).filter(value => value.path);

    //   if (matched[0].name !== 'Home') {
    //     matched = [{ name: 'Home', path: '/home', meta: { title: '首页' } }, ...matched];
    //   }
    //   return matched;
    // }
  },
  methods: {
    ...mapActions([ 'setSideMenuCollapseAction', ]),
    /**
     * 改变展开、关闭侧边菜单栏
     */
    changeCollapseSlide() {
      this.setSideMenuCollapseAction(!this.isCollapseSide);
    },
    /**
     * 进入/退出 全屏
     */
    handleFullScreen() {
      const element = document.documentElement;

      if (this.fullscreen) {
        // 退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        // 进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen(); // IE 11
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    /**
     * 账号操作
     */
    handleCommand(command) {
      console.log(command);
      // switch (command) {
      //   case 'logout':
      //     if (this.accessToken) {
      //       this.delAccessToken();
      //       this.delAdminInfo();
      //       this.$router.push({ name: 'Login' });
      //     }
      //     break;
      //   case 'profile':
      //     console.log(command);
      //     break;
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
