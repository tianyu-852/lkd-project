
/**
 * 回退上个页面
 */
export const backPage = () => {
  const pageStack = getCurrentPages();
  (pageStack.length === 1) ? uni.switchTab({ url: '/pages/tabbar/index/index' }) : uni.navigateBack();
};

/**
 * 阻止冒泡
 */
export const stopPropagation = () => { return; };

/**
 * 拨打电话
 */
 export const callPhone = phoneNum => {
  if (!phoneNum) return;
  uni.makePhoneCall({ phoneNumber: phoneNum });
};

/**
 * 获取当前页面路径
 */
export const getCurrentRoute = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    return `/${ currentPage.route }`;
  }
  return '/pages/tabbar/index/index'; // 首页路径
};

/**
 * 图片预览
 * @param {Array} imgList 图片列表
 * @param {String} imgUrl 当前显示图片链接
 * @param {String} imgUrlkey 图片资源链接名
 */
export const previewImg = (imgList, curImgUrl, imgUrlKey = '') => {
  const imgUrls = imgUrlKey ? imgList.map(item => item[imgUrlKey]) : imgList;
  uni.previewImage({ urls: imgUrls, current: curImgUrl });
};

/**
 * 路由导航 加 传递参数（路径传参）
 * @param {String} pagePath 页面路径 pathName/pathName/...
 * @param {Object} paramObj 页面参数对象
 */
export const routeNavTo = (pagePath, paramObj = {}) => {
  // 页面跳转
  let pageUrl = `/pages/${ pagePath }`;
  const paramStr = Object.keys(paramObj).map(key => key + '=' + encodeURIComponent(paramObj[key])).join('&');
  paramStr && (pageUrl = pageUrl + '?' + paramStr);
  uni.navigateTo({ url: pageUrl });
};

/**
 * 路由参数解析
 * @description 可用于页面跳转携带多个参数，携带中文参数的情况
 * @param {Object} query 参数对象
 * @returns {Object}
 */
export const routeParamParse = (query = {}) => {
  let routeParam = {};
  Object.keys(query).forEach(key => {
    routeParam[key] = decodeURIComponent(query[key]);
  });
  return routeParam;
};

/**
 * 导航进入 webview 页面
 */
export const routeNavToWebView = webUrl => {
  // #ifdef MP-KUAISHOU
  routeNavTo('module-common/web-view/web-view', { webUrl })
  // #endif

  // #ifndef MP-KUAISHOU
  uni.navigateTo({
    url: '/pages/module-common/web-view/web-view',
    success: res => {
      res.eventChannel.emit('webViewEvt', { navTitle: '', webUrl });
    }
  });
  // #endif
};

/**
 * 随机字符串
 * @param {Number} randomLen 随机数长度
 */
 export const randomStr = (randomLen = 5) => {
  const numStrs = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];
  let _str = '';

  for (let i = 0; i < randomLen; i++) {
    const randIdx = Math.floor(Math.random() * numStrs.length);
    _str += numStrs[randIdx];
  }

  return _str;
};

/**
 * 计算节点高度 px
 * @param {String} selector 导航栏节点选择器
 */
 export const calcNodeHeight = (selector = '.u-navbar') => {
  return new Promise((resolve, reject) => {
    // 取节点信息
    const uNavbarNodeRef = uni.createSelectorQuery().select(selector);
    uNavbarNodeRef.boundingClientRect(rect => {
      resolve(rect.height);
    }).exec();
  });
};
