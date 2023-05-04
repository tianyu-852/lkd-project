import api from '@/common/api';
import store from '@/store';

/**
 * 获取微信小程序 code
 */
export const getWxMpCode = async () => {
  return new Promise((resolve, reject) => {
    uni.login({
      success: async res => {
        if (res.code) {
          resolve(res.code);
        }
      },
      fail: error => {
        reject(error);
      }
    });
  });
};

/**
 * 获取用户登录验证码
 */
export const getUserLoginSMSCode = async userMobile => {
  try {
    const data = await api.getLoginSMSCode({ mobile: userMobile.trim() });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/**
 * 用户登录
 */
export const userLogin = async (userMobile, smsCode, wxCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: loginData } = await api.userLogin({ mobile: userMobile.trim(), code: smsCode.trim(), wechat_code: wxCode.trim() });
      // 登录后的用户token 存入 vuex & storage
      store.dispatch('userModule/setUserToken', loginData.access_token);
      // 拉取用户信息
      const userInfo = await fetchUserInfo();
      resolve(userInfo);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 拉取用户信息
 */
export const fetchUserInfo = async () => {
  try {
    const { data: userInfoData } = await api.fetchUserInfo();
    userInfoData && store.dispatch('userModule/setUserInfoAction', userInfoData);
    return userInfoData;
  } catch (error) {
    console.log(error);
    throw new Error('获取信息失败');
  }
};
