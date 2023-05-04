import { tokenStorage, userInfoStorage } from '@/common/utils/storageUtil';
import api from '@/common/api';

const state = {
  // userToken: tokenStorage.getStorage(), // 用户 token
  userToken: 'user-token-abackdkddeg', // 用户 token
  // userToken: '', // 用户 token
  userInfo: {}, // 用户信息
  userPermissionList: [], // 用户路由权限列表
};

const getters = {
  userId: state => state.userInfo?.user_id || 0, // 用户 id
};

const mutations = {
  // 设置 用户 Token
  'SET_USER_TOKEN': (state, userToken) => {
    state.userToken = userToken;
  },
  // 设置 用户信息列表
  'SET_USER_INFO': (state, userInfo) => {
    state.userInfo = userInfo;
  },
  // 设置 用户权限列表
  'SET_USER_PERMISSION_LIST': (state, permissionList) => {
    state.userPermissionList = permissionList;
  }
};

const actions = {
  /**
   *  移除用户 token & 用户信息 & 首页已读客服指南
   */
  removeUserTokenAndUserInfoAction({ commit }) {
    commit('SET_USER_TOKEN', tokenStorage.removeStorage());
  },
  /**
   * 用户登录
   */
  userLoginAction({ commit }, userAccountInfo) {
    return new Promise((resolve, reject) => {
      api.userLogin(userAccountInfo).then(res => {
        const { data: loginedData } = res;
        const userToken = loginedData.access_token;
        commit('SET_USER_TOKEN', tokenStorage.setStorage(userToken));
        resolve();
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  },
  /**
   * 用户登出
   */
  userLogoutAction({ commit }) {
    return new Promise(resolve => {
      commit('SET_USER_TOKEN', tokenStorage.removeStorage());
      commit('SET_USER_INFO', {});
      commit('SET_USER_PERMISSION_LIST', []);
      resolve();
    });
  },
  /**
   * 拉取用户信息
   */
  fetchUserInfoAction({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.fetchUserInfo()
        .then(res => {
          commit('SET_USER_PERMISSION_LIST', res.role.permissions);
          commit('SET_USER_INFO', res);
          resolve(res.role.permissions);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default { namespaced: true, state, getters, mutations, actions };
