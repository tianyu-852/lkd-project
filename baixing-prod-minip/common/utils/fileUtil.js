import store from '@/store';
import commonConfig from '@/common/config';
import Request from '@/common/lib/luch-request';

const http = new Request();
const serverBaseUrl = `${ commonConfig[commonConfig.env].serverBaseUrl }/api`;
const uploadFileUrl = `${ serverBaseUrl }/common/file`;

/**
 * 上传文件
 */
const uploadFile = async (filePath, fileKey = 'file') => {
  const userToken = store.state.userModule.userToken; // 用户 token
  const deviceType = 'wechat-mini-program'; // 设备类型

  try {
    const uploadRes = await http.upload(uploadFileUrl, {
      filePath,
      name: fileKey,
      header: { Authorization: userToken, 'X-Device-Type': deviceType, 'X-Source-App': '0' }
    });
    // console.log(uploadRes);

    if (uploadRes.statusCode === 200) {
      const uploadResData = uploadRes.data;
      uni.hideLoading();

      // 业务状态码不等于 0 轻提示
      if (uploadResData.code !== 0) {
        uni.showToast({ icon: 'none', title: uploadResData.message || 'Error', duration: 3000 });
        // code: 1009 token 过期
        if (uploadResData.code === 1009) {
          store.dispatch('userModule/removeUserTokenAndUserInfoAction');
          // uni.navigateTo({ url: '/pagesV1/common/login' });
        }

        return Promise.reject(uploadResData);
      }

      return uploadResData.data.url;
    } else {
      // http 请求错误
      console.log(uploadRes);
      return Promise.reject(uploadRes.data);
    }
  } catch (error) {
    console.log(error);
    uni.hideLoading();
    return Promise.reject(error);
  }
};

export default {
  uploadFile
};
