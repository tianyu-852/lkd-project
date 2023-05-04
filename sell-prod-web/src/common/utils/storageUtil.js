const USER_TOKEN = 'user_token'; // 用户登录 token
const USER_INFO = 'user_info'; // 用户信息

/**
 * 用户 token 缓存
 */
export const tokenStorage = {
  setStorage(userToken = '') {
    window.localStorage.setItem(USER_TOKEN, JSON.stringify(userToken));
    return userToken;
  },
  getStorage() {
    return window.localStorage.getItem(USER_TOKEN) ? JSON.parse(window.localStorage.getItem(USER_TOKEN)) : '';
  },
  removeStorage() {
    window.localStorage.removeItem(USER_TOKEN);
    return '';
  }
};

/**
 * 用户信息缓存 注：暂未使用
 */
export const userInfoStorage = {
  setStorage(userInfo = {}) {
    window.localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    return userInfo;
  },
  getStorage() {
    return window.localStorage.getItem(USER_INFO) ? JSON.parse(window.localStorage.getItem(USER_INFO)) : {};
  },
  removeStorage() {
    window.localStorage.removeItem(USER_INFO);
    return {};
  }
};
