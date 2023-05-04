<template>
  <div class="sidebar-menu">
    <section class="logo-section">
      <img class="img" :src="require('@/assets/image/logo.png')">
      <!-- <span v-if="!isCollapseSide" class="name">律快答-服务商</span> -->
      <!-- <div class="logo">
      </div> -->
      <!-- <div v-else class="logo">
        <img class="img" :src="require('@/assets/image/logo.png')">
      </div> -->
    </section>
    <!-- 菜单导航栏 -->
    <el-menu
      class="el-menu-vertical"
      background-color="#304156"
      text-color="rgba(255, 255, 255, .7)"
      active-text-color="#fff"
      unique-opened
      router
      :default-active="$route.path"
      :collapse="isCollapseSide"
    >
      <template v-for="item of slidebarMenuList">
        <!-- 含有二级菜单 -->
        <template v-if="item.children && !item.hidden">
          <el-submenu :key="item.name" :index="item.path">
            <template slot="title">
              <i :class="item.meta.icon" />
              <span slot="title">{{ item.meta.title }}</span>
            </template>

            <!-- 遍历二级菜单 -->
            <template v-for="twoItem of item.children">
              <!-- 含有三级菜单 -->
              <el-submenu v-if="twoItem.children && !twoItem.hidden" :key="twoItem.name" :index="`${ item.path }/${ twoItem.path }`">
                <template slot="title">
                  <i :class="twoItem.meta.icon" />
                  <span>{{ twoItem.meta.title }}</span>
                </template>
                <!-- 遍历三级菜单 -->
                <template v-for="threeItem of twoItem.children">
                  <el-menu-item v-if="!threeItem.hidden" :key="threeItem.name" :index="`${ item.path }/${ twoItem.path }/${ threeItem.path }`">
                    <i :class="threeItem.meta.icon" />
                    <span slot="title">{{ threeItem.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-submenu>

              <!-- 二级菜单项 -->
              <el-menu-item v-else-if="!twoItem.hidden" :key="twoItem.name" :index="`${ item.path }/${ twoItem.path }`">
                <i :class="twoItem.meta.icon" />
                <span slot="title">{{ twoItem.meta.title }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <!-- 一级菜单 | 不含二级菜单 -->
        <template v-else-if="!item.hidden">
          <el-menu-item :key="item.name" :index="item.path">
            <i :class="item.meta.icon" />
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'SlidebarMenu',
  data() {
    return {};
  },
  computed: {
    ...mapState([ 'isCollapseSide' ]), // 是否折叠侧边栏
    ...mapGetters('permissionModule', ['slidebarMenuList']),
  },
  created() {
    // console.log(this.$route);
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
