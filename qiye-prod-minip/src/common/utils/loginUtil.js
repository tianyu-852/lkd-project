import api from '@/common/api';
import store from '@/store';

/**
 * 获取微信小程序 code，备选方案 2
 */
export const getwxMpCode = async () => {
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
 * 用户登录，备选方案 2
 */
export const userLogin = async (wxMpCode, phoneEncryptInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: loginData } = await api.userLogin({ code: wxMpCode, ...phoneEncryptInfo });
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
 * 用户登录
 */
// export const userLogin = async phoneEncryptInfo => {
//   return new Promise((resolve, reject) => {
//     uni.login({
//       success: async res => {
//         if (res.code) {
//           try {
//             const { data: loginData } = await api.userLogin({ code: res.code, ...phoneEncryptInfo });
//             // 登录后的用户token 存入 vuex & storage
//             store.dispatch('userModule/setUserToken', loginData.access_token);
//             // 拉取用户信息
//             const userInfo = await fetchUserInfo();
//             resolve(userInfo);
//           } catch (error) {
//             reject(error);
//           }
//         }
//       },
//       fail: error => {
//         console.log(error);
//       }
//     });
//   });
// };

/**
 * 拉取用户信息
 */
export const fetchUserInfo = async () => {
  try {
    const { data: userInfoData } = await api.fetchUserInfo();
    userInfoData && store.dispatch('userModule/setUserInfoAction', userInfoData);
    // 拉取官方客服信息
    store.dispatch('getOfficKefuInfoAction');
    return userInfoData;
  } catch (error) {
    console.log(error);
  }
};
