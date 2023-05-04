import api from '@/common/api';
import store from '@/store';

/**
 * 拉取用户信息
 */
export const fetchUserInfo = async () => {
  try {
    const { data: userInfoData } = await api.fetchUserInfoApi();
    userInfoData && store.dispatch('userModule/setUserInfoAction', userInfoData);
    return userInfoData;
  } catch (error) {
    console.log(error);
  }
};
