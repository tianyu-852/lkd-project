const USER_TOKEN = 'user_token'; // 用户登录 token
const USER_INFO = 'user_info'; // 用户信息
const READ_KE_FU_GUIDE = 'read_ke_fu_guide'; // 是否已读客服指南

/**
 * token 缓存
 */
export const tokenStorage = {
  setStorage(userToken = '') {
    uni.setStorageSync(USER_TOKEN, JSON.stringify(userToken));
    return userToken;
  },
  getStorage() {
    return uni.getStorageSync(USER_TOKEN) ? JSON.parse(uni.getStorageSync(USER_TOKEN)) : '';
  },
  removeStorage() {
    uni.removeStorageSync(USER_TOKEN);
    return '';
  }
};

/**
 * 用户信息缓存
 */
export const userInfoStorage = {
  setStorage(userInfo = {}) {
    uni.setStorageSync(USER_INFO, JSON.stringify(userInfo));
    return userInfo;
  },
  getStorage() {
    return uni.getStorageSync(USER_INFO) ? JSON.parse(uni.getStorageSync(USER_INFO)) : {};
  },
  removeStorage() {
    uni.removeStorageSync(USER_INFO);
    return {};
  }
};

/**
 * 是否已读客服联系指南
 */
export const kefuGuideStorage = {
  setStorage(isReadKefuGuide = true) {
    uni.setStorageSync(READ_KE_FU_GUIDE, JSON.stringify(isReadKefuGuide));
    return isReadKefuGuide;
  },
  getStorage() {
    return uni.getStorageSync(READ_KE_FU_GUIDE) ? JSON.parse(uni.getStorageSync(READ_KE_FU_GUIDE)) : false;
  },
  removeStorage() {
    uni.removeStorageSync(READ_KE_FU_GUIDE);
    return false;
  }
};
