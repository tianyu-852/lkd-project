import Vue from 'vue';
import Vuex from 'vuex';
import score from './modules/score';
import notice from './modules/notice';
import userModule from './modules/userModule';
import api from '@/common/api';

Vue.use(Vuex);

const mutationTypes = {
  SET_SYSTEM_INFO: 'set_system_info', // 设置系统信息
  SET_APP_CONFIG_INFO: 'set_app_config_info', // 设置应用说明信息
  SET_LEAGUESELLER_INFO: 'set_leagueseller_info', // 设置加盟商销售信息
};

const store = new Vuex.Store({
	state: {
    bxLoadImg300: '/static/common/bx-loadImg-300.png',
    systemInfo: {}, // 系统信息
    leagueSellerInfo: {}, // 加盟商销售信息, 做新用户注册提成用
    appConfigInfo: {}, // app 说明信息
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
    // 设置 应用说明信息
    [mutationTypes.SET_APP_CONFIG_INFO](state, appConfigInfo) {
      state.appConfigInfo = appConfigInfo;
    },
    // 设置 加盟商销售信息
    [mutationTypes.SET_LEAGUESELLER_INFO](state, leagueSellerInfo) {
      state.leagueSellerInfo = leagueSellerInfo;
    },
  },
	actions: {
		/**
		 * 获取系统信息
		 */
    async getSystemInfoAction({ commit }) {
      const [error, systemRes] = await uni.getSystemInfo();
      if (!systemRes) return;
      commit(mutationTypes.SET_SYSTEM_INFO, systemRes);
    },
    /**
     * 获取应用说明信息
     */
    async getAppConfigInfoAction({ commit }) {
      try {
        const { data: appConfigData } = await api.getAppConfigInfoApi();
        commit(mutationTypes.SET_APP_CONFIG_INFO, appConfigData);
      } catch (error) {
        console.log(error);
      }
    },
		/**
		 * 设置 加盟商销售信息
		 */
    async setLeagueSellerInfoAction({ commit }, leagueSellerInfo) {
      commit(mutationTypes.SET_LEAGUESELLER_INFO, leagueSellerInfo);
    },
  },
	modules: {
		score,
		notice,
		userModule
	},
});

export default store;
