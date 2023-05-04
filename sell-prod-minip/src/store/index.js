import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/userModule';
import api from '@/common/api';

Vue.use(Vuex);

const mutationTypes = {
  SET_SYSTEM_INFO: 'set_system_info', // 设置系统信息
};

const store = new Vuex.Store({
  state: {
    sellLoadImg400: '/static/common/sell-loadImg-400.png',
    systemInfo: {}, // 系统信息
  },
  getters: {
    // 系统屏幕高度
    sysScreenHeight(state) {
      return state.systemInfo?.screenHeight || 0;
    },
    // 系统底部小黑条高度 px
    sysSafeAreaHeight(state) {
      let _sysSafeAreaHeight = 0;
      if (state.systemInfo.screenHeight) _sysSafeAreaHeight = state.systemInfo.screenHeight - state.systemInfo.safeArea.bottom;
      return _sysSafeAreaHeight;
    }
  },
  mutations: {
    // 设置 系统信息
    [mutationTypes.SET_SYSTEM_INFO](state, systemInfo) {
      state.systemInfo = systemInfo;
    },
  },
  actions: {
    // 获取系统信息
    async getSystemInfoAction({ commit }) {
      const [error, systemRes] = await uni.getSystemInfo();
      if (!systemRes) return;
      commit(mutationTypes.SET_SYSTEM_INFO, systemRes);
    },
  },
  modules: {
    userModule,
  }
});

export default store;
