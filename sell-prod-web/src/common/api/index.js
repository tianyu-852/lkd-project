import httpRequest from './httpRequest';

export default {
  // 用户登录
  userLogin: param => httpRequest(`/web/login/password`, param, 'post'),
  // 拉取用户信息
  // fetchUserInfo: () => httpRequest(`${ serverBaseUrl }/v2/get/customer/user/info`),
  fetchUserInfo: (() => {
    return new Promise((resolve, reject) => {
      const userInfo = {
        // name: '律快答',
        name: '浙江律快答网络科技有限公司',
        age: 25,
        avatar: '',
        role: {
          permissions: [
            { permissionId: 'home' },
            { permissionId: 'user' },
            { permissionId: 'user_list' },
            // { permissionId: 'user_detail' },
            { permissionId: 'contract' },
            { permissionId: 'contract_list' },
          ]
        }
      };

      resolve(userInfo);
    });
  }),
};

