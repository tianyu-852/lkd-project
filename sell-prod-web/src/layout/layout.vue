<template>
  <el-container class="layout">
    <sidebar-menu />

    <el-main class="main-module">
      <app-header />
      <app-main />
    </el-main>
  </el-container>
</template>

<script>
import sidebarMenu from './components/sidebar-menu/sidebar-menu';
import appHeader from './components/app-header/app-header';
import appMain from './components/app-main/app-main';

export default {
  name: 'Layout',
  components: { sidebarMenu, appHeader, appMain },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  width: 100%;
  .main-module {
    padding: 0;
    // background: #f0f2f5;
  }
}
</style>
