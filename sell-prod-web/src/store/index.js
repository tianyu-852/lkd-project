import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/userModule';
import permissionModule from './modules/permissionModule';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isCollapseSide: false, // 是否折叠侧边栏
  },
  getters: {
  },
  mutations: {
    // 改变展开/关闭侧边栏
    'SET_SLIDE_COLLAPSE_MENU'(state, isCollapseSide) {
      state.isCollapseSide = isCollapseSide;
    },
  },
  actions: {
    // 设置 展开/关闭侧边栏
    setSideMenuCollapseAction({ commit }, isCollapseSide) {
      commit('SET_SLIDE_COLLAPSE_MENU', isCollapseSide);
    },
  },
  modules: {
    userModule,
    permissionModule
  }
});

export default store;
