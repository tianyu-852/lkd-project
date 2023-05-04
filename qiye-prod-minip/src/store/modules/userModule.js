import { tokenStorage, userInfoStorage, kefuGuideStorage } from '@/common/utils/storageUtil';

const mutationTypes = {
  SET_USER_TOKEN: 'set_user_token', // 设置用户token
  SET_USER_INFO: 'set_user_info', // 设置用户信息
  SET_READ_KE_FU_GUIDE: 'set_read_ke_fu_guide', // 设置用户已读客服指南
  SET_USER_LOC_INFO: 'set_user_loc_info', // 设置用户位置信息
};

const state = {
  userToken: tokenStorage.getStorage(), // 用户 token
  userInfo: userInfoStorage.getStorage(), // 用户信息
  readKeFuGuide: kefuGuideStorage.getStorage(), // 首页用户是否已读客服联系指南
  userLocInfo: null, // 用户当前位置信息（真实获取经纬度）
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
  // 设置 用户已读客服联系指南
  [mutationTypes.SET_READ_KE_FU_GUIDE](state, readKeFuGuide) {
    state.readKeFuGuide = readKeFuGuide;
  },
  // 设置 用户位置信息
  [mutationTypes.SET_USER_LOC_INFO](state, userLocInfo) {
    state.userLocInfo = userLocInfo;
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
    commit(mutationTypes.SET_READ_KE_FU_GUIDE, kefuGuideStorage.removeStorage());
  },
  // 设置 用户位置信息
  setUserLocInfoAction({ commit }, userLocInfo) {
    commit(mutationTypes.SET_USER_LOC_INFO, userLocInfo);
  },
  // 设置 首页已读客服指南
  setReadKeFuGuideAction({ commit }, readKeFuGuide) {
    commit(mutationTypes.SET_READ_KE_FU_GUIDE, kefuGuideStorage.setStorage(readKeFuGuide));
  }
};

export default { namespaced: true, state, getters, mutations, actions };
