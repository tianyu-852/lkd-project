import { tokenStorage, userInfoStorage } from '@/common/utils/storageUtil';

const mutationTypes = {
  SET_USER_TOKEN: 'set_user_token', // 设置用户token
  SET_USER_INFO: 'set_user_info', // 设置用户信息
};

const state = {
  userToken: tokenStorage.getStorage(), // 用户 token
  userInfo: userInfoStorage.getStorage(), // 用户信息
};

const getters = {
  userId: state => state.userInfo?.user_id || 0, // 用户 id
};

const mutations = {
  // 设置 用户token
  [mutationTypes.SET_USER_TOKEN](state, userToken) {
    state.userToken = userToken;
  },
  // 设置 用户信息
  [mutationTypes.SET_USER_INFO](state, userInfo) {
    state.userInfo = userInfo;
  },
};

const actions = {
  // 设置 用户token
  setUserToken({ commit }, userToken) {
    commit(mutationTypes.SET_USER_TOKEN, tokenStorage.setStorage(userToken));
  },
  // 设置 用户信息
  setUserInfoAction({ commit }, userInfo) {
    commit(mutationTypes.SET_USER_INFO, userInfoStorage.setStorage(userInfo));
  },
  // 移除用户 token & 用户信息 & 首页已读客服指南
  removeUserTokenAndUserInfoAction({ commit }) {
    commit(mutationTypes.SET_USER_TOKEN, tokenStorage.removeStorage());
    commit(mutationTypes.SET_USER_INFO, userInfoStorage.removeStorage());
  },
};

export default { namespaced: true, state, getters, mutations, actions };
