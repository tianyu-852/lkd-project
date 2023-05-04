import Vue from 'vue';
import Vuex from 'vuex';
import userModule from './modules/userModule';
import api from '@/common/api';

Vue.use(Vuex);

const mutationTypes = {
  SET_SAFEAREA_HEIGHT: 'set_safearea_height', // 设置安全条高度
  SET_APP_EXPLAIN_INFO: 'set_app_explain_info', // 设置应用说明信息
  SET_OFFIC_KEFU_INFO: 'set_offic_Kefu_Info', // 官方客服信息
};

const store = new Vuex.Store({
  state: {
    qiyeLoadImg296: '/static/common/qiye-loadImg-296.png',
    qiyeLoadImg400: '/static/common/qiye-loadImg-400.png',
    safeAreaHeight: 0, // 系统底部小黑条高度 px
    appExplainInfo: {}, // 应用说明信息
    officKefuInfo: null, // 官方客服信息
  },
  mutations: {
    // 设置 系统底部小黑条高度 px
    [mutationTypes.SET_SAFEAREA_HEIGHT](state, safeAreaHeight) {
      state.safeAreaHeight = safeAreaHeight;
    },
    // 设置 应用说明信息
    [mutationTypes.SET_APP_EXPLAIN_INFO](state, appExplainInfo) {
      state.appExplainInfo = appExplainInfo;
    },
    // 设置 官方客服信息
    [mutationTypes.SET_OFFIC_KEFU_INFO](state, officKefuInfo) {
      state.officKefuInfo = officKefuInfo;
    },
  },
  actions: {
    // 获取系统底部小黑条高度 px
    async getSafeAreaHeightAction({ commit }) {
      const [err, systemInfo] = await uni.getSystemInfo();
      if (!systemInfo) return;
      const safeAreaHeight = systemInfo.screenHeight - systemInfo.safeArea.bottom;

      commit(mutationTypes.SET_SAFEAREA_HEIGHT, safeAreaHeight);
    },
    // 获取应用说明信息
    async getAppExplainInfoAction({ commit }) {
      try {
        const { data: appExplainData } = await api.getAppExplainInfo();
        commit(mutationTypes.SET_APP_EXPLAIN_INFO, appExplainData);
      } catch (error) {
        console.log(error);
      }
    },
    // 获取 官方客服信息
    async getOfficKefuInfoAction({ commit, getters }) {
      const userId = getters['userModule/userId'];
      if (!userId) return;

      try {
        const { data: officKefuData } = await api.getOfficKefuInfo();
        commit(mutationTypes.SET_OFFIC_KEFU_INFO, officKefuData);
      } catch (error) {
        console.log(error);
      }
    }
  },
  modules: {
    userModule,
  }
});

export default store;
