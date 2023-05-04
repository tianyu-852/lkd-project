import { router } from '@/router';
import store from '@/store';

/**
 * 回退上个页面
 */
export const backPage = () => {
  const pageStack = getCurrentPages();
  (pageStack.length === 1) ? router.replaceAll({ name: 'tabIndex' }) : router.back();
};

/**
 * 阻止冒泡
 */
export const stopPropagation = () => { return; };

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
 * 路由导航 加 传递参数（路径传参）
 * @param {String} pagePath 页面名称
 * @param {Object} paramObj 页面参数对象
 */
export const routeNavTo = (pageName, paramObj = {}) => {
  const userId = store.getters['userModule/userId'];
  // console.log(userId);
  // console.log(paramObj);
  router.push({ name: pageName, params: paramObj });
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
 * @param {String} selector 导航栏节点选择器 默认顶部 navbar
 */
export const calcNodeHeight = (selector = '.u-navbar') => {
  return new Promise((resolve, reject) => {
    // 取节点信息
    const uNavbarNodeRef = uni.createSelectorQuery().select(selector);
    uNavbarNodeRef.boundingClientRect(rect => {
      resolve(rect.height); // node 高度
    }).exec();
  });
};
