const USER_TOKEN = 'user_token'; // 用户登录 token
const USER_INFO = 'user_info'; // 用户信息
const READ_POSTDYN_GUIDE = 'read_phoneOrder_guide'; // 用户第一次登录 app 是否已读发电话咨询指南

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
 * 是否已读发帖指南
 */
export const postDynGuideStorage = {
  setStorage(isReadGuide = 1) {
    uni.setStorageSync(READ_POSTDYN_GUIDE, JSON.stringify(isReadGuide));
    return isReadGuide;
  },
  getStorage() {
    return uni.getStorageSync(READ_POSTDYN_GUIDE) ? JSON.parse(uni.getStorageSync(READ_POSTDYN_GUIDE)) : 0;
  },
  removeStorage() {
    uni.removeStorageSync(READ_POSTDYN_GUIDE);
    return false;
  }
};
